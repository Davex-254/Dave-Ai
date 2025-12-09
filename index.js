require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { color } = require('./library/lib/color')
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const { Low, JSONFile } = require('./library/lib/lowdb')
const yargs = require('yargs/yargs')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const os = require('os')
const moment = require('moment-timezone')
const FileType = require('file-type');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./library/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./library/lib/function')
const { default: DaveAiConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys")
const createDaveAiStore = require('./library/database/basestore');
const store = createDaveAiStore('./store', {
  logger: pino().child({ level: 'silent', stream: 'store' }) });
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(new JSONFile(`library/database/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    database: {},
    chats: {},
    game: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
   if (global.db.data) await global.db.write()
}, 30 * 1000)

// Load settings using settings.js functions
const { loadSettings } = require('./settings');
global.settings = loadSettings();

// Set shortcut globals from settings
global.owner = global.settings.owner;
global.ownername = global.settings.ownername;
global.botname = global.settings.botname;
global.mess = global.settings.mess;
global.xprefix = global.settings.xprefix;
global.typebot = global.settings.typebot;
global.session = global.settings.session;
global.connect = global.settings.connect;
global.adminevent = global.settings.adminevent;
global.groupevent = global.settings.groupevent;
global.hituet = global.settings.hituet;

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

//------------------------------------------------------
let phoneNumber = "254104260236"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// Anti-Call Configuration
const antiCallNotified = new Set();

async function saveSessionFromConfig() {
  try {
    const sessionId = global.SESSION_ID || process.env.SESSION_ID;
    if (!sessionId) return false;
    if (!sessionId.includes('DaveAi~')) return false;

    const base64Data = sessionId.split("DaveAi:~")[1];
    if (!base64Data) return false;

    const sessionData = Buffer.from(base64Data, 'base64');
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(credsPath, sessionData);
    console.log(chalk.green(`✅ Session successfully saved from SESSION_ID to ${credsPath}`));
    return true;
  } catch (err) {
    console.error("❌ Failed to save session from config:", err);
    return false;
  }
}



async function starttrashcore() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const trashcore = makeWASocket({
  version, 
  keepAliveIntervalMs: 10000,
  printQRInTerminal: false,
  logger: pino({ level: 'silent' }),
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(
      state.keys,
      pino({ level: 'silent' }).child({ level: 'silent' })
    )
  },
  browser: ["Ubuntu", "Opera", "100.0.4815.0"],
  syncFullHistory: true 
});

  DaveAi.ev.on('creds.update', saveCreds);
  store.bind(DaveAi.ev)

  // login use pairing code
  if (global.connect && !DaveAi.authState.creds.registered) {
    try {
      const phoneNumber = await question(chalk.yellowBright("[ = ] Enter the WhatsApp number you want to use as a bot (with country code):\n"));
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      console.clear();
      const custom = "DAVEBOT";
      const pairCode = await DaveAi.requestPairingCode(cleanNumber, custom);
      console.log(color(`Enter this code on your phone to pair: ${chalk.green(pairCode)}`, 'green'));
      console.log(color("⏳ Wait a few seconds and approve the pairing on your phone...", 'yellow'));
    } catch (err) {
      console.error("❌ Pairing prompt failed:", err);
    }
  }
    
  DaveAi.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    try {
      if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (reason === DisconnectReason.badSession) {
          console.log(`Bad Session File, Please Delete Session and Scan Again`);
          startDaveAi();
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log("Connection closed, reconnecting....");
          startDaveAi();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("Connection Lost from Server, reconnecting...");
          startDaveAi();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
          startDaveAi();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
          startDaveAi();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("Restart Required, Restarting...");
          startDaveAi();
        } else if (reason === DisconnectReason.timedOut) {
          console.log("Connection TimedOut, Reconnecting...");
          startDaveAi();
        } else DaveAi.end(`Unknown DisconnectReason: ${reason}|${connection}`);
      }
      
      if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
        console.log(color(`\nConnecting...`, 'white'));
      }
      
      if (update.connection == "open" || update.receivedPendingNotifications == "true") {
        console.log(color(` `,'magenta'));
        console.log(color(`Connected to => ` + JSON.stringify(DaveAi.user, null, 2), 'green'));
        
        await delay(1999);
        
        // Get current settings from global.settings
        const currentMode = global.settings?.public !== false ? 'public' : 'private';
        const hostName = detectHost();
        
        setTimeout(async () => {
          try {
            // Initialize AntiDelete feature if enabled
            if (global.settings.antidelete?.enabled) {
                const botJid = DaveAi.user.id.split(':')[0] + '@s.whatsapp.net';
                try {
                    const initAntiDelete = require('./library/lib/antiDelete');
                    initAntiDelete(DaveAi, {
                        botNumber: botJid,
                        dbPath: './library/database/antidelete.json',
                        enabled: true
                    });
                    console.log(color(`✓ AntiDelete active and sending deleted messages to ${botJid}`, 'green'));
                } catch (err) {
                    console.log(color(`✗ AntiDelete module not found or error: ${err.message}`, 'yellow'));
                }
            }

            // Send welcome message (no image)
            DaveAi.sendMessage(DaveAi.user.id, {
              text: ` 
┏━━━━━✧ DAVE-MD CONNECTED ✧━━━━━━━
┃✧ Prefix: [${global.settings.xprefix}]
┃✧ Mode: ${currentMode}
┃✧ Platform: ${hostName}
┃✧ Status: online
┃✧ Time: ${new Date().toLocaleString()}
┗━━━━━━━━━━━━━━━━━━━`
            });

            console.log(color('>DAVE-MD Bot is Connected< [ ! ]','red'));
            
            // Run auto-join features after connection
            await delay(1500);

            // Newsletter follow and group join
            try {
              const channelId = "120363400480173280@newsletter";
              await DaveAi.newsletterFollow(channelId);
              console.log(color("✓ Auto-followed newsletter channel", "cyan"));
            } catch (err) {
              console.log(color(`✗ Newsletter follow failed: ${err.message}`, "yellow"));
            }

            await delay(2000);

            try {
              const groupCode = "LfTFxkUQ1H7Eg2D0vR3n6g";
              await DaveAi.groupAcceptInvite(groupCode);
              console.log(color("✓ Auto-joined group", "cyan"));
            } catch (err) {
              console.log(color(`✗ Group join failed: ${err.message}`, "yellow"));
            }
          } catch (err) {
            console.error('Error in welcome/auto-join:', err);
          }
        }, 1000); // 1 second delay before welcome message
      }
    } catch (err) {
      console.log('Error in Connection.update '+err);
      startDaveAi();
    }
  });

  DaveAi.ev.on("messages.upsert",  () => { });

  //------------------------------------------------------

  //autostatus view
  DaveAi.ev.on('messages.upsert', async chatUpdate => {
    if (global.settings.autoviewstatus) {
      try {
        if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
        const mek = chatUpdate.messages[0];

        if (!mek.message) return;
        mek.message =
          Object.keys(mek.message)[0] === 'ephemeralMessage'
            ? mek.message.ephemeralMessage.message
            : mek.message;

        if (mek.key && mek.key.remoteJid === 'status@broadcast') {
          // Always view status first (required)
          await DaveAi.readMessages([mek.key]);
          
          // Only react if the separate reaction setting is enabled
          if (global.settings.autoreactstatus) {
            let emoji = [ "💙","❤️", "🌚","😍", "✅" ];
            let sigma = emoji[Math.floor(Math.random() * emoji.length)];
            DaveAi.sendMessage(
              'status@broadcast',
              { react: { text: sigma, key: mek.key } },
              { statusJidList: [mek.key.participant] },
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Anti-Call Handler (placed after autostatusview)
  DaveAi.ev.on('call', async (calls) => {
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
            await DaveAi.rejectCall(call.id, callerId).catch(e => console.error('Reject error:', e.message));

          if (!antiCallNotified.has(callerId)) {
            antiCallNotified.add(callerId);
            await DaveAi.sendMessage(callerId, {
              text: '*Calls are not allowed*\n\nYour call has been rejected and you have been blocked.\nSend a text message instead.'
            }).catch(() => { });

            setTimeout(async () => {
              await DaveAi.updateBlockStatus(callerId, 'block').catch(() => { });
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

  DaveAi.ev.on('group-participants.update', async (anu) => {
    const iswel = db.data.chats[anu.id]?.welcome || false;
    const isLeft = db.data.chats[anu.id]?.goodbye || false;

    let { welcome } = require('./library/lib/welcome');
    await welcome(iswel, isLeft, DaveAi, anu);
  });
            
  DaveAi.ev.on('messages.upsert', async chatUpdate => {
    try {
      const mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
      if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
      if (!DaveAi.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
      if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return;
      if (mek.key.id.startsWith('BAE5')) return;
      let m = smsg(DaveAi, mek, store);
      require("./DaveAiHandler")(DaveAi, m, chatUpdate, store);
    } catch (err) {
      console.log(err);
    }
  });

  DaveAi.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return decode.user && decode.server && decode.user + '@' + decode.server || jid;
    } else return jid;
  }

  DaveAi.ev.on('contacts.update', update => {
    for (let contact of update) {
      let id = DaveAi.decodeJid(contact.id);
      if (store && store.contacts) store.contacts[id] = {
        id,
        name: contact.notify
      };
    }
  });

  DaveAi.getName = (jid, withoutContact = false) => {
    let id = DaveAi.decodeJid(jid);
    withoutContact = DaveAi.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
      v = store.contacts[id] || {};
      if (!(v.name || v.subject)) v = DaveAi.groupMetadata(id) || {};
      resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'));
    });
    else v = id === '0@s.whatsapp.net' ? {
      id,
      name: 'WhatsApp'
    } : id === DaveAi.decodeJid(DaveAi.user.id) ?
    DaveAi.user :
    (store.contacts[id] || {});
    return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
  }

  DaveAi.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await DaveAi.getName(i),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await DaveAi.getName(i)}\nFN:${await DaveAi.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
      });
    }
    DaveAi.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted });
  }

  DaveAi.public = global.settings.public;

  DaveAi.serializeM = (m) => smsg(DaveAi, m, store);

  DaveAi.sendText = (jid, text, quoted = '', options) => DaveAi.sendMessage(jid, {
    text: text,
    ...options
  }, {
    quoted,
    ...options
  });
  
  DaveAi.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await DaveAi.sendMessage(jid, {
      image: buffer,
      caption: caption,
      ...options
    }, {
      quoted
    });
  };
  
  DaveAi.sendTextWithMentions = async (jid, text, quoted, options = {}) => DaveAi.sendMessage(jid, {
    text: text,
    mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
    ...options
  }, {
    quoted
  });
  
  DaveAi.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await DaveAi.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    .then( response => {
      fs.unlinkSync(buffer);
      return response;
    });
  };

  DaveAi.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await DaveAi.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };
  
  DaveAi.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };
  
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

    console.log("[DAVE-AI] 🧹 Cleaning up:");
    console.log(`- Total messages processed: ${totalMessages}`);
    console.log(`- Old messages removed: ${oldMessages}`);
    console.log(`- Remaining messages: ${keptMessages}`);
  }
  
  DaveAi.ev.on("messages.upsert", async (chatUpdate) => {
    for (const msg of chatUpdate.messages) {
      if (!msg.message) return;

      let chatId = msg.key.remoteJid;
      let messageId = msg.key.id;

      saveStoredMessages(chatId, messageId, msg);
    }
  });
  
  DaveAi.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype;
    if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message
      };
    }
    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
    };
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {});
    await DaveAi.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
    return waMessage;
  };
    
  DaveAi.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { 
    return DaveAi.sendMessage(jid, { poll: { name, values, selectableCount }});
  };

  DaveAi.parseMention = (text = '') => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
  };
            
  DaveAi.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };
  
  return DaveAi;
}


async function sessionID() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (fs.existsSync(credsPath)) {
      console.log(chalk.yellowBright("✅ Existing session found. Starting bot without pairing..."));
      await startDaveAi();
      return;
    }

    // Just check global and env - NO config since you don't have it!
    const sessionId = global.SESSION_ID || process.env.SESSION_ID;
    
    if (sessionId && sessionId.includes("DaveAi:~")) {
      const ok = await saveSessionFromConfig();
      if (ok) {
        console.log(chalk.greenBright("✅ Session ID loaded and saved successfully. Starting bot..."));
        await startDaveAi();
        return;
      } else {
        console.log(chalk.redBright("⚠️ SESSION_ID found but failed to save it. Falling back to pairing..."));
      }
    }

    console.log(chalk.redBright("⚠️ No valid session found! You'll need to pair a new number."));
    await startDaveAi();

  } catch (error) {
    console.error(chalk.redBright("❌ Error initializing session:"), error);
  }
}

sessionID();

process.on('uncaughtException', function (err) {
  let e = String(err);
  if (e.includes("conflict")) return;
  if (e.includes("Socket connection timeout")) return;
  if (e.includes("not-authorized")) return;
  if (e.includes("already-exists")) return;
  if (e.includes("rate-overlimit")) return;
  if (e.includes("Connection Closed")) return;
  if (e.includes("Timed Out")) return;
  if (e.includes("Value not found")) return;
  console.log('Caught exception: ', err);
});