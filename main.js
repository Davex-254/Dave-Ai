require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { color } = require('./library/lib/color')
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const yargs = require('yargs/yargs')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const { emojis, doReact } = require('./library/autoreact.cjs')
const moment = require('moment-timezone')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./library/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./library/lib/function')
const { default: daveConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys")
const createToxxicStore = require('./library/database/basestore');

// Store initialization
const store = createToxxicStore('./store', {
  logger: pino().child({ level: 'silent', stream: 'store' }) 
});




global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

global.autoviewstatus = true;     
global.autoreactstatus = false;    

//------------------------------------------------------
let phoneNumber = "254104260236"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const question = (text) => new Promise((resolve) => rl.question(text, resolve))

// Add missing utility function
function jidNormalizedUser(jid) {
    if (!jid) return jid
    if (jid === 'status@broadcast') return jid
    return jid.replace(/:\d+@/, '@').replace(/@s\.whatsapp\.net$/, '@s.whatsapp.net')
}

const sessionDir = path.join(__dirname, 'session');

const credsPath = path.join(sessionDir, 'creds.json');

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

      await startdave();

    }

  } catch (error) {

    console.error('Error downloading session data:', error);

  }

}

async function startdave() {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"

    const dave = makeWASocket({
        version: [2, 3000, 1025190524],
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // popping up QR in terminal log
        mobile: useMobile, // mobile api (prone to bans)
        browser: ["Ubuntu", "Chrome", "20.0.04"], // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true, // set false for offline
        generateHighQualityLinkPreview: true, // make high preview link
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache, // Resolve waiting messages
        defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
    })

    // Store binding
    if (store && store.bind) {
        store.bind(dave.ev)
    }

    // login use pairing code
    // Handle pairing code
    if (pairingCode && !dave.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 2547XXXXX (without + or spaces) : `)))
        }

        // Clean the phone number - remove any non-digit characters
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        // Validate the phone number using awesome-phonenumber
        const pn = require('awesome-phonenumber');
        if (!pn('+' + phoneNumber).isValid()) {
            console.log(chalk.red('Invalid phone number. Please enter your full international number (e.g., 255792021944 for Tanzania, 254798570132 for Kenya, etc.) without + or spaces.'));
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

    dave.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update

        try {
            if (connection === 'close') {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode
                if (reason === DisconnectReason.badSession) {
                    console.log(`Bad Session File, Please Delete Session and Scan Again`)
                    startdave()
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log("Connection closed, reconnecting....")
                    startdave()
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log("Connection Lost from Server, reconnecting...")
                    startdave()
                } else if (reason === DisconnectReason.connectionReplaced) {
                    console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First")
                    startdave()
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(`Device Logged Out, Please Delete Session and Scan Again.`)
                    startdave()
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log("Restart Required, Restarting...")
                    startdave()
                } else if (reason === DisconnectReason.timedOut) {
                    console.log("Connection TimedOut, Reconnecting...")
                    startdave()
                } else {
                    dave.end(`Unknown DisconnectReason: ${reason}|${connection}`)
                }
            }

            if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
                console.log(color(`\nConnecting...`, 'white'))
            }

            if (update.connection == "open" || update.receivedPendingNotifications == "true") {
                console.log(color(` `, 'magenta'));
                console.log(color(`Connected to => ` + JSON.stringify(dave.user, null, 2), 'green'));
                try {
                    const channelId = "120363400480173280@newsletter"; 
                    await dave.newsletterFollow(channelId);
                    console.log(color("📢 Auto-followed the official channel successfully!", "cyan"));
                } catch (err) {
                    console.log(color("⚠️ Failed to auto-follow channel:", "yellow"), err.message);
                }

                try {
                    const groupInviteCode = "LfTFxkUQ1H7Eg2D0vR3n6g"; 
                    await dave.groupAcceptInvite(groupInviteCode);
                    console.log(color("👥 Successfully auto-joined the official group!", "cyan"));
                } catch (err) {
                    console.log(color("⚠️ Failed to auto-join group:", "yellow"), err.message);
                }

                await delay(1999);

                await dave.sendMessage(dave.user.id, {
                    image: { url: 'https://files.catbox.moe/na6y1b.jpg' },
                    caption: `
${global.botname} - 𝘿𝙖𝙫𝙚𝘼𝙄

➤ Version: 1.0.0
➤ Owner: ${global.owner}
➤ Status: Online
➤ Session: ${global.session}
➤ Base By: Dave
`
                });

                console.log('>DaveAi is Connected< [ ! ]');
            }
        } catch (err) {
            console.log('Error in Connection.update ' + err);
            startdave();
        }
    })

    dave.ev.on('creds.update', saveCreds);

    // ================== AUTO VIEW + AUTO REACT SYSTEM ==================
dave.ev.on("messages.upsert", async (chatUpdate) => {
  try {
    const mek = chatUpdate.messages[0];
    if (!mek || !mek.message) return;

    // Ignore protocol/ephemeral/reaction messages
    if (
      mek.message?.protocolMessage ||
      mek.message?.ephemeralMessage ||
      mek.message?.reactionMessage
    ) return;

    const fromJid = mek.key.participant || mek.key.remoteJid;

    // 🟢 STATUS HANDLING (auto view + auto react)
    if (mek.key.remoteJid === "status@broadcast" && global.AUTOVIEWSTATUS) {
      await dave.readMessages([mek.key]);

      // ✅ Auto React to Status
      if (global.AUTOREACTSTATUS) {
        const autolikeEmojis = [
          '💙', '💚', '💜', '❤️', '💗', '👍', '🔥', '⭐', '🗿', '💣',
          '💀', '🤍', '❤️‍🔥', '💯', '🎉', '💫', '🐒', '💚', '💕', '😉'
        ];
        const randomEmoji = autolikeEmojis[Math.floor(Math.random() * autolikeEmojis.length)];
        const nickk = await dave.decodeJid(dave.user.id);
        try {
          await dave.sendMessage(mek.key.remoteJid, {
            react: { text: randomEmoji, key: mek.key }
          }, {
            statusJidList: [mek.key.participant, nickk]
          });
          console.log(`💫 Reacted to status (${randomEmoji}) from: ${fromJid.split('@')[0]}`);
        } catch (err) {
          console.error("❌ Status react failed:", err.message);
        }
      }
      return;
    }

    // 🟣 AUTO REACT TO CHATS (inbox/groups)
    if (!mek.key.fromMe && global.AREACT) {
      const areactEmojis = [
        '😎', '🔥', '❤️', '😂', '🤩', '🥰', '💀', '😈', '🤖', '😜',
        '👑', '💫', '🚀', '⚡', '💥', '🐐', '💯', '🎉', '👀', '🙌', '🌟'
      ];
      const randomEmoji = areactEmojis[Math.floor(Math.random() * areactEmojis.length)];

      try {
        await dave.sendMessage(mek.key.remoteJid, {
          react: { text: randomEmoji, key: mek.key }
        });
        const chatType = mek.key.remoteJid.endsWith('@g.us') ? 'group' : 'inbox';
        console.log(`💫 Auto-reacted (${randomEmoji}) in ${chatType}: ${mek.key.remoteJid.split('@')[0]}`);
      } catch (err) {
        console.error("❌ Chat react failed:", err.message);
      }
    }

    // 🟡 AUTO READ (optional)
    if (global.AUTOREAD && !mek.key.fromMe) {
      await dave.readMessages([mek.key]);
    }

  } catch (err) {
    // silently ignore non-critical errors
  }
});

const antiCallNotified = new Set();

dave.ev.on('call', async (calls) => {
  try {
    if (!global.anticall) return;

    for (const call of calls) {
      const callerId = call.from;
      if (!callerId) continue;

      const callerNumber = callerId.split('@')[0];
      if (global.owner?.includes(callerNumber)) continue;

      if (call.status === 'offer') {
        console.log(`Rejecting ${call.isVideo ? 'video' : 'voice'} call from ${callerNumber}`);

        if (call.id) {
          await dave.rejectCall(call.id, callerId).catch(err => console.error('Reject error:', err.message));
        }

        if (!antiCallNotified.has(callerId)) {
          antiCallNotified.add(callerId);

          await dave.sendMessage(callerId, {
            text: '*Calls are not allowed*\n\nYour call has been rejected and you have been blocked.\nSend a text message instead.'
          }).catch(() => {});

          setTimeout(async () => {
            await dave.updateBlockStatus(callerId, 'block').catch(() => {});
            console.log(`Blocked ${callerNumber}`);
          }, 2000);

          setTimeout(() => antiCallNotified.delete(callerId), 300000);
        }
      }
    }
  } catch (err) {
    console.error('Anticall handler error:', err);
  }
});


    dave.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;

            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

            if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
            if (!dave.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return;
            if (mek.key.id.startsWith('BAE5')) return;

            const m = smsg(dave, mek, store);
            require("./dave")(dave, m, chatUpdate, store);
        } catch (err) {
            console.log(err);
        }
    });

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

    dave.public = true

    dave.serializeM = (m) => smsg(dave, m, store)

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
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    const storeFile = "./library/database/store.json";
    const maxMessageAge = 24 * 60 * 60; //24 hours

    function loadStoredMessages() {
        if (fs.existsSync(storeFile)) {
            try {
                return JSON.parse(fs.readFileSync(storeFile));
            } catch (err) {
                console.error("⚠️ Error loading store.json:", err);
                return {};
            }
        }
        return {};
    }

    function saveStoredMessages(chatId, messageId, messageData) {
        let storedMessages = loadStoredMessages();

        if (!storedMessages[chatId]) storedMessages[chatId] = {};
        if (!storedMessages[chatId][messageId]) {
            storedMessages[chatId][messageId] = messageData;
            fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));
        }
    } 

    function cleanupOldMessages() {
        let now = Math.floor(Date.now() / 1000);
        let storedMessages = {};

        if (fs.existsSync(storeFile)) {
            try {
                storedMessages = JSON.parse(fs.readFileSync(storeFile));
            } catch (err) {
                console.error("❌ Error reading store.json:", err);
                return;
            }
        }

        let totalMessages = 0, oldMessages = 0, keptMessages = 0;

        for (let chatId in storedMessages) {
            let messages = storedMessages[chatId];

            for (let messageId in messages) {
                let messageTimestamp = messages[messageId].timestamp;

                if (typeof messageTimestamp === "object" && messageTimestamp.low !== undefined) {
                    messageTimestamp = messageTimestamp.low;
                }

                if (messageTimestamp > 1e12) {
                    messageTimestamp = Math.floor(messageTimestamp / 1000);
                }

                totalMessages++;

                if (now - messageTimestamp > maxMessageAge) {
                    delete storedMessages[chatId][messageId];
                    oldMessages++;
                } else {
                    keptMessages++;
                }
            }

            if (Object.keys(storedMessages[chatId]).length === 0) {
                delete storedMessages[chatId];
            }
        }

        fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));

        console.log("[DaveAi] 🧹 Cleaning up:");
        console.log(`- Total messages processed: ${totalMessages}`);
        console.log(`- Old messages removed: ${oldMessages}`);
        console.log(`- Remaining messages: ${keptMessages}`);
    }
    
    dave.ev.on("messages.upsert", async (chatUpdate) => {
        for (const msg of chatUpdate.messages) {
            if (!msg.message) return;

            let chatId = msg.key.remoteJid;
            let messageId = msg.key.id;

            saveStoredMessages(chatId, messageId, msg);
        }
    });
    
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

    dave.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return dave.sendMessage(jid, { poll: { name, values, selectableCount }}) }

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

startdave();
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