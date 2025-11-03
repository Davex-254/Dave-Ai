require('./settings')
require('dotenv').config()
const config = require('./config');
const os = require('os');

const makeWASocket = require("@whiskeysockets/baileys").default
const { color } = require('./library/lib/color')
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const yargs = require('yargs/yargs')
const fs = require('fs')
const { loadSettings, saveSettings } = require('./settings.js');
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const moment = require('moment-timezone')
const FileType = require('file-type');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./library/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./library/lib/function')
const { default: daveConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys")

const createToxxicStore = require('./library/database/basestore');
const store = createToxxicStore('./store', {
  logger: pino().child({ level: 'silent', stream: 'store' }) });

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

//------------------------------------------------------
let phoneNumber = "254104245659"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// Helper functions
function jidNormalizedUser(jid) {
    if (!jid) return jid;
    if (jid === 'status@broadcast') return jid;
    return jid.includes('@') ? jid.split('@')[0] + '@s.whatsapp.net' : jid + '@s.whatsapp.net';
}

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

async function downloadSessionData() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (!fs.existsSync(credsPath)) {
      if (!global.SESSION_ID) {
        return console.log(color(`Session id not found at SESSION_ID!\nCreds.json not found at session folder!\n\nWait to enter your number`, 'red'));
      }

      const base64Data = global.SESSION_ID.split("dave~")[1];
      const sessionData = Buffer.from(base64Data, 'base64');
      await fs.promises.writeFile(credsPath, sessionData);
      console.log(color(`Session successfully saved, please wait!!`, 'green'));
      await startDave();
    }
  } catch (error) {
    console.error('Error downloading session data:', error);
  }
}

async function startDave() {
let { version, isLatest } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const msgRetryCounterCache = new NodeCache()

const dave = makeWASocket({
    version: [2, 3000, 1025190524],
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !pairingCode,
    mobile: useMobile,
    browser: [ "Dave AI", "Chrome", "20.0.04" ],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)
        return msg?.message || ""
    },
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
})

store.bind(dave.ev)

// Pairing code login
if (global.connect && !dave.authState.creds.registered) {
    try {
        const phoneNumber = await question(chalk.cyan(`\n[ ᯤ ] Dave AI - Enter Your Number:\n`));
        const code = await dave.requestPairingCode(phoneNumber.trim());
        console.log(chalk.green(`\n[ ᯤ ] Dave AI - Pairing Code:\n`), code);
    } catch (error) {
        console.error(chalk.red(`\nError during pairing:`), error.message);
        return;
    }
}

store?.bind(dave.ev)

dave.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    try {
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(`Bad Session File, Please Delete Session and Scan Again`);
                startDave()
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                startDave();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...");
                startDave();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                startDave()
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
                startDave();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...");
                startDave();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...");
                startDave();
            } else dave.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
        
        if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
            console.log(color(`\nConnecting...`, 'white'))
        }
        
        const currentMode = global.settings?.public ? 'public' : 'private';   
        const hostName = detectHost();

        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
            console.log(color(` `,'magenta'))
            console.log(color(`Connected to => ` + JSON.stringify(dave.user, null, 2), 'green'))
            
            await delay(1999)
            
            // Newsletter follow
            try {
                const channelId = "120363400480173280@newsletter";
                await dave.newsletterFollow(channelId);
                console.log(color("✅ Auto-followed newsletter channel", "cyan"));
            } catch (err) {
                console.log(color(`⚠️ Newsletter follow failed: ${err.message}`, "yellow"));
            }

            await delay(2000);

            // Group join
            try {
                const groupCode = "LfTFxkUQ1H7Eg2D0vR3n6g";
                await dave.groupAcceptInvite(groupCode);
                console.log(color("✅ Auto-joined group", "cyan"));
            } catch (err) {
                console.log(color(`⚠️ Group join failed: ${err.message}`, "yellow"));
            }

            dave.sendMessage(dave.user.id, {
                caption: ` 
┏━━━━━✧ CONNECTED ✧━━━━━━━
┃✧ Prefix: [.]
┃✧ Mode: ${currentMode}
┃✧ Platform: ${hostName}
┃✧ Bot: Dave AI
┃✧ Status: Active
┃✧ Time: ${new Date().toLocaleString()}
┗━━━━━━━━━━━━━━━━━━━`
            });

            console.log(color('> Dave AI Bot is Connected < [ ! ]','red'))
        }
    } catch (err) {
        console.log('Error in Connection.update '+err)
        startDave();
    }
})

dave.ev.on('creds.update', saveCreds)

// Auto-status view and react based on global settings
dave.ev.on('messages.upsert', async chatUpdate => {
    try {
        if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
        const mek = chatUpdate.messages[0];

        if (!mek.message) return;
        mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage' 
            ? mek.message.ephemeralMessage.message 
            : mek.message;

        // Auto-view status if enabled in settings
        if (global.settings.autoviewstatus && mek.key && mek.key.remoteJid === 'status@broadcast') {
            await dave.readMessages([mek.key]);
        }

        // Auto-react to status if enabled in settings
        if (global.settings.autoreactstatus && mek.key && mek.key.remoteJid === 'status@broadcast') {
            let emoji = [ "💙","❤️", "🌚","😍", "✅" ];
            let sigma = emoji[Math.floor(Math.random() * emoji.length)];
            dave.sendMessage(
                'status@broadcast',
                { react: { text: sigma, key: mek.key } },
                { statusJidList: [mek.key.participant] },
            );
        }
    } catch (err) {
        console.error('Status auto-react/view error:', err);
    }
})

// Group participants update
dave.ev.on('group-participants.update', async (anu) => {
    try {
        const settings = loadSettings();
        const chatId = anu.id;
        const participants = anu.participants || [];
        const action = anu.action;
        const botNumber = dave.user.id.split(':')[0] + '@s.whatsapp.net';

        // Welcome and goodbye messages
        if (global.settings.welcome || global.settings.goodbye) {
            const { welcome } = require('./library/lib/welcome');
            await welcome(global.settings.welcome, global.settings.goodbye, dave, anu);
        }

        // Anti-promote
        if (action === 'promote' && settings.antipromote?.enabled) {
            for (const user of participants) {
                if (user !== botNumber) {
                    await dave.sendMessage(chatId, {
                        text: `🚫 *Promotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${settings.antipromote.mode.toUpperCase()}`,
                        mentions: [user],
                    });

                    if (settings.antipromote.mode === 'revert') {
                        await dave.groupParticipantsUpdate(chatId, [user], 'demote');
                    } else if (settings.antipromote.mode === 'kick') {
                        await dave.groupParticipantsUpdate(chatId, [user], 'remove');
                    }
                }
            }
        }

        // Anti-demote
        if (action === 'demote' && settings.antidemote?.enabled) {
            for (const user of participants) {
                if (user !== botNumber) {
                    await dave.sendMessage(chatId, {
                        text: `🚫 *Demotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${settings.antidemote.mode.toUpperCase()}`,
                        mentions: [user],
                    });

                    if (settings.antidemote.mode === 'revert') {
                        await dave.groupParticipantsUpdate(chatId, [user], 'promote');
                    } else if (settings.antidemote.mode === 'kick') {
                        await dave.groupParticipantsUpdate(chatId, [user], 'remove');
                    }
                }
            }
        }
    } catch (err) {
        console.error('Group participants update error:', err);
    }
});

// Message handler
dave.ev.on('messages.upsert', async chatUpdate => {
    try {
        let mek = chatUpdate.messages[0]
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (!dave.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
        if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return
        if (mek.key.id.startsWith('BAE5')) return
        
        // Auto-read messages if enabled in settings
        if (global.settings.autoread?.enabled && !mek.key.fromMe) {
            await dave.readMessages([mek.key]).catch(() => {});
        }
        
        let m = smsg(dave, mek, store)
        require("./dave")(dave, m, chatUpdate, store)
    } catch (err) {
        console.log(err)
    }
})

// Anti-call feature
const antiCallNotified = new Set()
dave.ev.on('call', async (calls) => {
    try {
        if (!global.settings.anticall) return

        for (const call of calls) {
            const callerId = call.from
            if (!callerId) continue

            const callerNumber = callerId.split('@')[0]
            if (global.owner?.includes(callerNumber)) continue

            if (call.status === 'offer') {
                console.log(`Rejecting ${call.isVideo ? 'video' : 'voice'} call from ${callerNumber}`)

                if (call.id) {
                    await dave.rejectCall(call.id, callerId).catch(err => 
                        console.error('Reject error:', err.message))
                }

                if (!antiCallNotified.has(callerId)) {
                    antiCallNotified.add(callerId)

                    await dave.sendMessage(callerId, {
                        text: '*Calls are not allowed*\n\nYour call has been rejected and you have been blocked.\nSend a text message instead.'
                    }).catch(() => {})

                    setTimeout(async () => {
                        await dave.updateBlockStatus(callerId, 'block').catch(() => {})
                        console.log(`Blocked ${callerNumber}`)
                    }, 2000)

                    setTimeout(() => antiCallNotified.delete(callerId), 300000)
                }
            }
        }
    } catch (err) {
        console.error('Anticall handler error:', err)
    }
})

// Utility functions for dave
dave.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {}
        return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
}

dave.ev.on('contacts.update', update => {
    for (let contact of update) {
        let id = dave.decodeJid(contact.id)
        if (store && store.contacts) store.contacts[id] = {
            id,
            name: contact.notify
        }
    }
})

dave.getName = (jid, withoutContact = false) => {
    id = dave.decodeJid(jid)
    withoutContact = dave.withoutContact || withoutContact
    let v
    if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
        v = store.contacts[id] || {}
        if (!(v.name || v.subject)) v = dave.groupMetadata(id) || {}
        resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
    })
    else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === dave.decodeJid(dave.user.id) ?
        dave.user :
        (store.contacts[id] || {})
    return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

dave.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = []
    for (let i of kon) {
        list.push({
                displayName: await dave.getName(i),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await dave.getName(i)}\nFN:${await dave.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
        })
    }
    dave.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
}

dave.public = global.settings.public
dave.serializeM = (m) => smsg(dave, m, store)

// Message sending methods
dave.sendText = (jid, text, quoted = '', options) => dave.sendMessage(jid, {
    text: text,
    ...options
}, {
    quoted,
    ...options
})

dave.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await dave.sendMessage(jid, {
        image: buffer,
        caption: caption,
        ...options
    }, {
        quoted
    })
}

dave.sendTextWithMentions = async (jid, text, quoted, options = {}) => dave.sendMessage(jid, {
    text: text,
    mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
    ...options
}, {
    quoted
})

dave.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options)
    } else {
        buffer = await imageToWebp(buff)
    }
    await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    .then( response => {
        fs.unlinkSync(buffer)
        return response
    })
}

dave.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options)
    } else {
        buffer = await videoToWebp(buff)
    }
    await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    return buffer
}

dave.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    let type = await FileType.fromBuffer(buffer)
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
}

dave.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
        message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
        vtype = Object.keys(message.message.viewOnceMessage.message)[0]
        delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
        delete message.message.viewOnceMessage.message[vtype].viewOnce
        message.message = {
            ...message.message.viewOnceMessage.message
        }
    }
    let mtype = Object.keys(message.message)[0]
    let content = await generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
        ...context,
        ...content[ctype].contextInfo
    }
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
        ...content[ctype],
        ...options,
        ...(options.contextInfo ? {
            contextInfo: {
                ...content[ctype].contextInfo,
                ...options.contextInfo
            }
        } : {})
    } : {})
    await dave.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
    return waMessage
}

dave.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { 
    return dave.sendMessage(jid, { poll: { name, values, selectableCount }})
}

dave.parseMention = (text = '') => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

dave.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
}

return dave
}

async function startBot() {
    if (fs.existsSync(credsPath)) {
        console.log(color("Session file found, starting bot...", 'yellow'));
        await startDave();
    } else {
        const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            console.log("Session downloaded, starting bot.");
            await startDave();
        } else {
            if (!fs.existsSync(credsPath)) {
                if(!global.SESSION_ID) {
                    console.log(color("Please wait for a few seconds to enter your number!", 'red'));
                    await startDave();
                }
            }
        }
    }
}

startBot()

process.on('uncaughtException', function (err) {
    let e = String(err)
    if (e.includes("conflict")) return
    if (e.includes("Socket connection timeout")) return
    if (e.includes("not-authorized")) return
    if (e.includes("already-exists")) return
    if (e.includes("rate-overlimit")) return
    if (e.includes("Connection Closed")) return
    if (e.includes("Timed Out")) return
    if (e.includes("Value not found")) return
    console.log('Caught exception: ', err)
})