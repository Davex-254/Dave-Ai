require('./settings')
require('dotenv').config()
const config = require('./config');
const os = require('os');

// ================== STORE INITIALIZATION ==================
const { color } = require('./library/lib/color')
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const yargs = require('yargs/yargs')
const fs = require('fs')
const { loadSettings, saveSettings } = require('./settings');
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const { join } = require('path')
const moment = require('moment-timezone')
const FileType = require('file-type')
const { rmSync, existsSync } = require('fs')
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./library/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await: awaitHelper, sleep, reSize } = require('./library/lib/function')
const {
    makeWASocket
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    Browsers,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")

//hhhh whue 
const store = require('./library/database/basestore')
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

setInterval(() => {
    if (global.gc) {
        global.gc()
        const stats = store.getStats()
        console.log(color(`🧹 GC done | Store: ${stats.messages} msgs, ${stats.chats} chats, ${stats.contacts} contacts`, 'cyan'));
    }
}, 60_000)

// Memory monitoring - Restart if RAM gets too high
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log(color('⚠️ RAM too high (>400MB), restarting bot...', 'red'));
        process.exit(1)
    }
}, 30_000)

const log = {
    info: (msg) => console.log(color(`[INFO] ${msg}`, 'cyan')),
    success: (msg) => console.log(color(`[SUCCESS] ${msg}`, 'green')),
    error: (msg) => console.log(color(`[ERROR] ${msg}`, 'red')),
    warn: (msg) => console.log(color(`[WARN] ${msg}`, 'yellow'))
};

//------------------------------------------------------
let phoneNumber = "254104245659"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// 🧠 Readline setup
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// Helper functions
function detectHost() {
    const env = process.env;
    if (env.RENDER || env.RENDER_EXTERNAL_URL) return 'Render';
    if (env.DYNO || env.HEROKU_APP_DIR || env.HEROKU_SLUG_COMMIT) return 'Heroku';
    if (env.PORTS || env.CYPHERX_HOST_ID) return "CypherXHost";
    if (env.VERCEL || env.VERCEL_ENV || env.VERCEL_URL) return 'Vercel';
    if (env.RAILWAY_ENVIRONMENT || env.RAILWAY_PROJECT_ID) return 'Railway';
    if (env.REPL_ID || env.REPL_SLUG) return 'Replit';
    const hostname = os.hostname().toLowerCase();
    if (!env.CLOUD_PROVIDER && !env.DYNO && !env.VERCEL && !env.RENDER) {
        if (hostname.includes('vps') || hostname.includes('server')) return 'VPS';
        return 'Panel';
    }
    return 'Dave Host';
}

async function saveSessionFromConfig() {
    try {
        if (!config.SESSION_ID) return false;
        if (!config.SESSION_ID.includes('dave~')) return false;

        const base64Data = config.SESSION_ID.split("dave~")[1];
        if (!base64Data) return false;

        const sessionData = Buffer.from(base64Data, 'base64');
        await fs.promises.mkdir(sessionDir, { recursive: true });
        await fs.promises.writeFile(credsPath, sessionData);
        console.log(color(`Session successfully saved from SESSION_ID to ${credsPath}`, 'green'));
        return true;
    } catch (err) {
        console.error("Failed to save session from config:", err);
        return false;
    }
}

async function startDave() {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const dave = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    })

    store.bind(dave.ev)
    // Always set to public mode by default
    dave.isPublic = true;

        // Handle pairing code
    if (pairingCode && !dave.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 254104260236 (without + or spaces) : `)))
        }

        // Clean the phone number - remove any non-digit characters
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        // Validate the phone number using awesome-phonenumber
        const pn = require('awesome-phonenumber');
        if (!pn('+' + phoneNumber).isValid()) {
            console.log(chalk.red('Invalid phone number. Please enter your full international number (e.g., 15551234567 for US, 447911123456 for UK, etc.) without + or spaces.'));
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let code = await dave.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
                console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`))
            } catch (error) {
                console.error('Error requesting pairing code:', error)
                console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'))
            }
        }, 3000)
    }

    // ================== Connection update handler ==================
    dave.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        try {
            if (connection === 'close') {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                console.log(`\nConnection closed with reason: ${reason}`);

                switch (reason) {
                    case DisconnectReason.badSession:
                        console.log(`Bad Session File, Please Delete Session and Scan Again`);
                        await delay(8000);
                        startDave();
                        break;

                    case DisconnectReason.connectionClosed:
                        console.log("Connection closed, reconnecting....");
                        await delay(5000);
                        startDave();
                        break;

                    case DisconnectReason.connectionLost:
                        console.log("Connection Lost from Server, reconnecting...");
                        await delay(7000);
                        startDave();
                        break;

                    case DisconnectReason.connectionReplaced:
                        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                        await delay(8000);
                        startDave();
                        break;

                    case DisconnectReason.loggedOut:
                        console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
                        await delay(10000);
                        startDave();
                        break;

                    case DisconnectReason.restartRequired:
                        console.log("Restart Required, Restarting...");
                        await delay(4000);
                        startDave();
                        break;

                    case DisconnectReason.timedOut:
                        console.log("Connection TimedOut, Reconnecting...");
                        await delay(6000);
                        startDave();
                        break;

                    default:
                        console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
                        dave.end(`Unknown DisconnectReason: ${reason}|${connection}`);
                        break;
                }
            }

            if (update.connection === "connecting" || update.receivedPendingNotifications === "false") {
                console.log(color(`\nConnecting...`, 'white'));
            }

            // Determine mode (public or private)
            const currentMode = global.settings?.public !== false ? 'public' : 'private';
            const hostName = detectHost();

            if (update.connection === "open" || update.receivedPendingNotifications === "true") {
                console.log(color(`Connected to => ` + JSON.stringify(dave.user, null, 2), 'green'));

                await delay(2000);

                // Initialize AntiDelete feature
                if (global.settings.antidelete?.enabled) {
                    const botJid = dave.user.id.split(':')[0] + '@s.whatsapp.net';
                    try {
                        const initAntiDelete = require('./library/lib/antiDelete');
                        initAntiDelete(dave, {
                            botNumber: botJid,
                            dbPath: './library/database/antidelete.json',
                            enabled: true
                        });
                        console.log(color(`AntiDelete active and sending deleted messages to ${botJid}`, 'green'));
                    } catch (err) {
                        console.log(color(`AntiDelete module not found or error: ${err.message}`, 'yellow'));
                    }
                }

                await delay(1500);

                // Auto follow newsletter
                try {
                    const channelId = "120363400480173280@newsletter";
                    await dave.newsletterFollow(channelId);
                    console.log(color("Auto-followed newsletter channel", "cyan"));
                } catch (err) {
                    console.log(color(`Newsletter follow failed: ${err.message}`, "yellow"));
                }

                await delay(2000);

                // Auto join group
                try {
                    const groupCode = "LfTFxkUQ1H7Eg2D0vR3n6g";
                    await dave.groupAcceptInvite(groupCode);
                    console.log(color("Auto-joined group", "cyan"));
                } catch (err) {
                    console.log(color(`Group join failed: ${err.message}`, "yellow"));
                }

                // Welcome message (once)
                setTimeout(async () => {
                    try {
                        const botJid = dave.user.id;
                        if (global.settings.showConnectMsg && !global.hasSentWelcome) {
                            await dave.sendMessage(botJid, {
                                text: ` 
┏━━━━━✧ CONNECTED ✧━━━━━━━
┃✧ Prefix: [.]
┃✧ Mode: ${currentMode}
┃✧ Platform: ${hostName}
┃✧ Bot: Dave AI
┃✧ Status: Active
┃✧ Time: ${new Date().toLocaleString()}
┗━━━━━━━━━━━━━━━━━━━`
                            });
                            global.hasSentWelcome = true;
                        }

                        console.log(color('> Dave AI Bot is Connected < [ ! ]', 'red'));
                    } catch (err) {
                        console.error('Welcome message error:', err);
                    }
                }, 4000);
            }

        } catch (err) {
            console.log('Error in Connection.update ' + err);
            await delay(5000);
            startDave();
        }
    });

    // ================== Auto-status view and react ==================
    dave.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            if (!chatUpdate.messages || !chatUpdate.messages.length) return;
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;

            // Handle ephemeral messages
            mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage'
                ? mek.message.ephemeralMessage.message
                : mek.message;

            const wait = (ms) => new Promise((r) => setTimeout(r, ms));
            const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

            // ===== STATUS AUTO-VIEW & REACT =====
            if (mek.key?.remoteJid === 'status@broadcast') {
                // Auto-view status
                if (global.settings?.autoviewstatus) {
                    await wait(random(1000, 3000));
                    await dave.readMessages([mek.key]).catch(() => { });
                }

                // Auto-react to status
                if (global.settings?.autoreactstatus) {
                    await wait(random(2000, 4000));
                    const emojis = ["💙", "❤️", "🌚", "😍", "✅"];
                    const pick = emojis[Math.floor(Math.random() * emojis.length)];
                    await dave.sendMessage(
                        'status@broadcast',
                        { react: { text: pick, key: mek.key } },
                        { statusJidList: [mek.key.participant] }
                    ).catch(() => { });
                }
                return; // skip further processing for status
            }

            // ===== SKIP BOT/SYSTEM MESSAGES =====
            if (!dave.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return;
            if (mek.key.id.startsWith('BAE5')) return;

            // ===== AUTO-READ =====
            if (global.settings?.autoread?.enabled && !mek.key.fromMe) {
                await dave.readMessages([mek.key]).catch(() => { });
            }

            // ===== INBOX/GROUP AUTO-REACT =====
            if (global.settings?.autoreactmessages?.enabled && !mek.key.fromMe) {
                const emojis = ["💙", "❤️", "🌚", "😍", "✅"];
                const pick = emojis[Math.floor(Math.random() * emojis.length)];
                await dave.sendMessage(
                    mek.key.remoteJid,
                    { react: { text: pick, key: mek.key } }
                ).catch(() => { });
            }

            // ===== PASS MESSAGE TO MAIN HANDLER =====
            const m = smsg(dave, mek, store);
            require("./dave")(dave, m, chatUpdate, store);

        } catch (err) {
            console.error('Messages.upsert error:', err);
        }
    });

    // ================== Group participants update ==================
    dave.ev.on('group-participants.update', async (anu) => {
        try {
            const settings = loadSettings();
            const chatId = anu.id;
            const participants = anu.participants || [];
            const action = anu.action;
            const botNumber = dave.user.id.split(':')[0] + '@s.whatsapp.net';
            const wait = (ms) => new Promise((r) => setTimeout(r, ms));

            // Welcome / Goodbye
            if (global.settings?.welcome || global.settings?.goodbye) {
                const { welcome } = require('./library/lib/welcome');
                await wait(1200);
                await welcome(global.settings.welcome, global.settings.goodbye, dave, anu);
            }

            // Anti-promote
            if (action === 'promote' && settings.antipromote?.enabled) {
                for (const user of participants) {
                    if (user === botNumber) continue;
                    await wait(1500);
                    await dave.sendMessage(chatId, {
                        text: `🚫 *Promotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${settings.antipromote.mode.toUpperCase()}`,
                        mentions: [user],
                    });

                    await wait(2000);
                    if (settings.antipromote.mode === 'revert')
                        await dave.groupParticipantsUpdate(chatId, [user], 'demote');
                    else if (settings.antipromote.mode === 'kick')
                        await dave.groupParticipantsUpdate(chatId, [user], 'remove');
                }
            }

            // Anti-demote
            if (action === 'demote' && settings.antidemote?.enabled) {
                for (const user of participants) {
                    if (user === botNumber) continue;
                    await wait(1500);
                    await dave.sendMessage(chatId, {
                        text: `🚫 *Demotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${settings.antidemote.mode.toUpperCase()}`,
                        mentions: [user],
                    });

                    await wait(2000);
                    if (settings.antidemote.mode === 'revert')
                        await dave.groupParticipantsUpdate(chatId, [user], 'promote');
                    else if (settings.antidemote.mode === 'kick')
                        await dave.groupParticipantsUpdate(chatId, [user], 'remove');
                }
            }
        } catch (err) {
            console.error('Group participants update error:', err);
        }
    });

    // ================== Anti-call feature ==================
    const antiCallNotified = new Set();
    dave.ev.on('call', async (calls) => {
        try {
            if (!global.settings?.anticall) return;
            for (const call of calls) {
                const callerId = call.from;
                if (!callerId) continue;
                const callerNumber = callerId.split('@')[0];
                if (global.owner?.includes(callerNumber)) continue;

                if (call.status === 'offer') {
                    console.log(`Rejecting ${call.isVideo ? 'video' : 'voice'} call from ${callerNumber}`);
                    if (call.id)
                        await dave.rejectCall(call.id, callerId).catch(e => console.error('Reject error:', e.message));

                    if (!antiCallNotified.has(callerId)) {
                        antiCallNotified.add(callerId);
                        await dave.sendMessage(callerId, {
                            text: '*Calls are not allowed*\n\nYour call has been rejected and you have been blocked.\nSend a text message instead.'
                        }).catch(() => { });

                        setTimeout(async () => {
                            await dave.updateBlockStatus(callerId, 'block').catch(() => { });
                            console.log(`Blocked ${callerNumber}`);
                        }, 4000);

                        setTimeout(() => antiCallNotified.delete(callerId), 300000);
                    }
                }
            }
        } catch (err) {
            console.error('Anticall handler error:', err);
        }
    });

    // ================== Core events ==================
    dave.ev.on('creds.update', saveCreds);

    // ================== Utility & send functions ==================
    dave.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return decode.user && decode.server ? decode.user + '@' + decode.server : jid;
        } else return jid;
    };

    dave.ev.on('contacts.update', (update) => {
        for (const contact of update) {
            const id = dave.decodeJid(contact.id);
            if (store && store.contacts) {
                store.contacts[id] = { id, name: contact.notify };
            }
        }
    });

    dave.getName = (jid, withoutContact = false) => {
        id = dave.decodeJid(jid);
        withoutContact = dave.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {};
            if (!(v.name || v.subject)) v = await dave.groupMetadata(id).catch(() => ({}));
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'));
        });
        else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } :
            id === dave.decodeJid(dave.user.id) ? dave.user : (store.contacts[id] || {});
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
    };

    dave.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        const list = [];
        for (const i of kon) {
            const name = await dave.getName(i);
            list.push({
                displayName: name,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
            });
        }
        await dave.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted });
    };

    dave.public = global.settings?.public !== false;
    dave.serializeM = (m) => smsg(dave, m, store);

    // ===== Sending helpers =====
    dave.sendText = (jid, text, quoted = '', options) =>
        dave.sendMessage(jid, { text, ...options }, { quoted, ...options });

    dave.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        const buffer = Buffer.isBuffer(path)
            ? path
            : /^data:.*?\/.*?;base64,/i.test(path)
                ? Buffer.from(path.split`,`[1], 'base64')
                : /^https?:\/\//.test(path)
                    ? await (await getBuffer(path))
                    : fs.existsSync(path)
                        ? fs.readFileSync(path)
                        : Buffer.alloc(0);
        return await dave.sendMessage(jid, { image: buffer, caption, ...options }, { quoted });
    };

    dave.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
        dave.sendMessage(jid, { text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted });

    // ================== Media / stickers / forward helpers ==================
    dave.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        const buff = Buffer.isBuffer(path)
            ? path
            : /^data:.*?\/.*?;base64,/i.test(path)
                ? Buffer.from(path.split`,`[1], 'base64')
                : /^https?:\/\//.test(path)
                    ? await (await getBuffer(path))
                    : fs.existsSync(path)
                        ? fs.readFileSync(path)
                        : Buffer.alloc(0);

        const buffer = (options.packname || options.author)
            ? await writeExifImg(buff, options)
            : await imageToWebp(buff);

        await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
        fs.unlinkSync(buffer);
    };

    dave.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        const buff = Buffer.isBuffer(path)
            ? path
            : /^data:.*?\/.*?;base64,/i.test(path)
                ? Buffer.from(path.split`,`[1], 'base64')
                : /^https?:\/\//.test(path)
                    ? await (await getBuffer(path))
                    : fs.existsSync(path)
                        ? fs.readFileSync(path)
                        : Buffer.alloc(0);

        const buffer = (options.packname || options.author)
            ? await writeExifVid(buff, options)
            : await videoToWebp(buff);

        await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
        return buffer;
    };

    dave.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        const quoted = message.msg || message;
        const mime = (message.msg || message).mimetype || '';
        const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        const type = await FileType.fromBuffer(buffer);
        const trueFileName = attachExtension ? `${filename}.${type.ext}` : filename;
        fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };

    dave.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        if (options.readViewOnce) {
            message.message = message.message?.ephemeralMessage?.message || message.message;
            const vtype = Object.keys(message.message.viewOnceMessage.message)[0];
            delete message.message.viewOnceMessage.message[vtype].viewOnce;
            message.message = { ...message.message.viewOnceMessage.message };
        }
        const content = await generateForwardMessageContent(message, forceForward);
        const ctype = Object.keys(content)[0];
        const context = message.message[Object.keys(message.message)[0]]?.contextInfo || {};
        content[ctype].contextInfo = { ...context, ...content[ctype].contextInfo };
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype], ...options,
            contextInfo: { ...content[ctype].contextInfo, ...options.contextInfo }
        } : {});
        await dave.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
        return waMessage;
    };

    dave.sendPoll = (jid, name = '', values = [], selectableCount = 1) =>
        dave.sendMessage(jid, { poll: { name, values, selectableCount } });

    dave.parseMention = (text = '') =>
        [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');

    dave.downloadMediaMessage = async (message) => {
        const mime = (message.msg || message).mimetype || '';
        const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        return buffer;
    };

    return dave;
}

// ================== Startup orchestration ===============
async function tylor() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (fs.existsSync(credsPath)) {
      console.log(chalk.yellowBright("✅ Existing session found. Starting bot without pairing..."));
      await startDave();
      return;
    }

    if (config.SESSION_ID && config.SESSION_ID.includes("dave~")) {
      const ok = await saveSessionFromConfig();
      if (ok) {
        console.log(chalk.greenBright("✅ Session ID loaded and saved successfully. Starting bot..."));
        await startDave();
        return;
      } else {
        console.log(chalk.redBright("⚠️ SESSION_ID found but failed to save it. Falling back to pairing..."));
      }
    }

    console.log(chalk.redBright("⚠️ No valid session found! You’ll need to pair a new number."));
    await startDave();

  } catch (error) {
    console.error(chalk.redBright("❌ Error initializing session:"), error);
  }
}

tylor();