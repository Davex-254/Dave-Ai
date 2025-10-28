require('./settings')
require('dotenv').config()
const config = require('./config');
// Core Baileys imports
const { default: makeWASocket, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys")
// Utilities
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const os = require('os')
const PhoneNumber = require('awesome-phonenumber')
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { rmSync } = require('fs')
const FileType = require('file-type')

// Custom modules
const { color } = require('./library/lib/color')
const { loadSettings, saveSettings } = require('./settings.js');
const { emojis: areactEmojis, doReact } = require('./library/autoreact.js');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./library/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./library/lib/function')

// Load store and settings
const store = require('./library/database/basestore')
const settings = require('./settings')

// Global state
global.isBotConnected = false
global.connectDebounceTimeout = null
global.errorRetryCount = 0
global.messageBackup = {}

// File paths
const MESSAGE_STORE_FILE = path.join(__dirname, 'library/database/message_backup.json')
const SESSION_ERROR_FILE = path.join(__dirname, 'library/database/sessionErrorCount.json')
const MESSAGE_COUNT_FILE = path.join(__dirname, 'library/database/messageCount.json')

global.messageBackup = {};
const sessionDir = path.join(__dirname, 'session')
const credsPath = path.join(sessionDir, 'creds.json')
const loginFile = path.join(sessionDir, 'login.json')
const envPath = path.join(__dirname, '.env')

// Logging function
function log(message, color = 'white', isError = false) {
    const xprefix = chalk.magenta.bold('[ Dave-Ai ]');
    const logFunc = isError ? console.error : console.log;
    const coloredMessage = chalk[color](message);

    if (message.includes('\n') || message.includes('════')) {
        logFunc(xprefix, coloredMessage);
    } else {
         logFunc(`${xprefix} ${coloredMessage}`);
    }
}

// Message backup functions
function loadStoredMessages() {
    try {
        if (fs.existsSync(MESSAGE_STORE_FILE)) {
            const data = fs.readFileSync(MESSAGE_STORE_FILE, 'utf-8')
            return JSON.parse(data)
        }
    } catch (error) {
        log(`Error loading message backup: ${error.message}`, 'red', true)
    }
    return {}
}

function saveStoredMessages(data) {
    try {
        const dir = path.dirname(MESSAGE_STORE_FILE)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(MESSAGE_STORE_FILE, JSON.stringify(data, null, 2))
    } catch (error) {
        log(`Error saving message backup: ${error.message}`, 'red', true)
    }
}

global.messageBackup = loadStoredMessages()

// Error count functions
function loadErrorCount() {
    try {
        if (fs.existsSync(SESSION_ERROR_FILE)) {
            const data = fs.readFileSync(SESSION_ERROR_FILE, 'utf-8')
            return JSON.parse(data)
        }
    } catch (error) {
        log(`Error loading error count: ${error.message}`, 'red', true)
    }
    return { count: 0, last_error_timestamp: 0 }
}

function saveErrorCount(data) {
    try {
        const dir = path.dirname(SESSION_ERROR_FILE)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(SESSION_ERROR_FILE, JSON.stringify(data, null, 2))
    } catch (error) {
        log(`Error saving error count: ${error.message}`, 'red', true)
    }
}

function deleteErrorCountFile() {
    try {
        if (fs.existsSync(SESSION_ERROR_FILE)) {
            fs.unlinkSync(SESSION_ERROR_FILE)
            log('Deleted sessionErrorCount.json', 'red')
        }
    } catch (e) {
        log(`Failed to delete error count: ${e.message}`, 'red', true)
    }
}

// Session management
function clearSessionFiles() {
    try {
        log('🗑️ Clearing session folder...', 'blue')
        rmSync(sessionDir, { recursive: true, force: true })
        if (fs.existsSync(loginFile)) fs.unlinkSync(loginFile)
        deleteErrorCountFile()
        global.errorRetryCount = 0
        log('✅ Session files cleaned', 'green')
    } catch (e) {
        log(`Failed to clear session: ${e.message}`, 'red', true)
    }
}

function sessionExists() {
    return fs.existsSync(credsPath)
}

// Cleanup functions
function cleanupOldMessages(maxMessageAge = 24 * 60 * 60) { // default 1 day
    const now = Math.floor(Date.now() / 1000)
    let totalMessages = 0, removedMessages = 0, keptMessages = 0

    Object.keys(store.messages).forEach(jid => {
        const messages = store.messages[jid]
        totalMessages += messages.length

        // Filter out old messages
        let filtered = messages.filter(msg => {
            let ts = msg.messageTimestamp || msg.message?.timestamp || 0

            // Handle Baileys Long object
            if (typeof ts === 'object' && ts.low !== undefined) ts = ts.low

            // Convert milliseconds to seconds if needed
            if (ts > 1e12) ts = Math.floor(ts / 1000)

            if (now - ts <= maxMessageAge) {
                keptMessages++
                return true
            } else {
                removedMessages++
                return false
            }
        })

        // Enforce MAX_MESSAGES per chat
        if (filtered.length > store.MAX_MESSAGES) {
            filtered = filtered.slice(-store.MAX_MESSAGES)
        }

        if (filtered.length > 0) {
            store.messages[jid] = filtered
        } else {
            delete store.messages[jid]
        }
    })

    // Persist changes
    store.writeToFile()

    // Log cleanup summary
    log(`[Dave-Ai] 🧹 Message cleanup completed:`, 'yellow')
    log(`- Total messages processed: ${totalMessages}`, 'yellow')
    log(`- Messages removed: ${removedMessages}`, 'yellow')
    log(`- Messages kept: ${keptMessages}`, 'yellow')
    log(`- Chats remaining: ${Object.keys(store.messages).length}`, 'yellow')
}

function cleanupJunkFiles(botSocket) {
    let directoryPath = path.join(__dirname)
    fs.readdir(directoryPath, async function (err, files) {
        if (err) return log(`Junk cleanup error: ${err}`, 'red', true)

        const filteredArray = files.filter(item =>
            item.endsWith(".gif") || item.endsWith(".png") || item.endsWith(".mp3") ||
            item.endsWith(".mp4") || item.endsWith(".opus") || item.endsWith(".jpg") ||
            item.endsWith(".webp") || item.endsWith(".webm") || item.endsWith(".zip")
        )

        if (filteredArray.length > 0) {
            filteredArray.forEach(file => {
                try {
                    const filePath = path.join(directoryPath, file)
                    if(fs.existsSync(filePath)) fs.unlinkSync(filePath)
                } catch(e) {
                    log(`Delete failed ${file}: ${e.message}`, 'red', true)
                }
            })
            log(`🗑️ ${filteredArray.length} junk files deleted`, 'yellow')
        }
    })
}

// Login helpers
const pairingCode = !!global.phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = process.stdin.isTTY ? readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
}) : null

const question = (text) => rl ? 
    new Promise(resolve => rl.question(text, resolve)) : 
    Promise.resolve(settings?.ownerNumber || global.phoneNumber)

async function saveLoginMethod(method) {
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(loginFile, JSON.stringify({ method }, null, 2));
}

async function getLastLoginMethod() {
    if (fs.existsSync(loginFile)) {
        const data = JSON.parse(fs.readFileSync(loginFile, 'utf-8'));
        return data.method;
    }
    return null;
}

async function checkEnvSession() {
    const envSessionID = process.env.SESSION_ID;
    if (envSessionID) {
        if (!envSessionID.includes("dave~")) { 
            log("🚨 WARNING: Environment SESSION_ID is missing the required prefix 'dave~'. Assuming BASE64 format.", 'red'); 
        }
        global.SESSION_ID = envSessionID.trim();
        return true;
    }
    return false;
}

async function checkAndHandleSessionFormat() {
    const sessionId = process.env.SESSION_ID;

    if (sessionId && sessionId.trim() !== '') {
        if (!sessionId.trim().startsWith('dave')) {
            log(chalk.red.bgBlack('================================================='), 'white');
            log(chalk.white.bgRed('❌ ERROR: Invalid SESSION_ID in .env'), 'white');
            log(chalk.white.bgRed('The session ID MUST start with "dave".'), 'white');
            log(chalk.white.bgRed('Cleaning .env and creating new one...'), 'white');
            log(chalk.red.bgBlack('================================================='), 'white');

            try {
                let envContent = fs.readFileSync(envPath, 'utf8');
                envContent = envContent.replace(/^SESSION_ID=.*$/m, 'SESSION_ID=');
                fs.writeFileSync(envPath, envContent);
                log('✅ Cleaned SESSION_ID entry in .env file.', 'green');
                log('Please add a proper session ID and restart the bot.', 'yellow');
            } catch (e) {
                log(`Failed to modify .env file. Please check permissions: ${e.message}`, 'red', true);
            }

            log('Bot will wait 30 seconds then restart', 'blue');
            await delay(30000);
            process.exit(1);
        }
    }
}

async function getLoginMethod() {
    const lastMethod = await getLastLoginMethod();
    if (lastMethod && sessionExists()) {
        log(`Last login method detected: ${lastMethod}. Using it automatically.`, 'yellow');
        return lastMethod;
    }

    if (!sessionExists() && fs.existsSync(loginFile)) {
        log(`Session files missing. Removing old login preference for clean re-login.`, 'yellow');
        fs.unlinkSync(loginFile);
    }

    if (!process.stdin.isTTY) {
        log("❌ No Session ID found in environment variables.", 'red');
        process.exit(1);
    }

    log("Choose login method:", 'yellow');
    log("1) Enter WhatsApp Number (Pairing Code)", 'blue');
    log("2) Paste Session ID", 'blue');

    let choice = await question("Enter option number (1 or 2): ");
    choice = choice.trim();

    if (choice === '1') {
        let phone = await question(chalk.bgBlack(chalk.greenBright(`Enter your WhatsApp number (e.g., 254104260236): `)));
        phone = phone.replace(/[^0-9]/g, '');
        const pn = require('awesome-phonenumber');
        if (!pn('+' + phone).isValid()) { log('Invalid phone number.', 'red'); return getLoginMethod(); }
        global.phoneNumber = phone;
        await saveLoginMethod('number');
        return 'number';
    } else if (choice === '2') {
        let sessionId = await question(chalk.bgBlack(chalk.greenBright(`Paste your Session ID here: `)));
        sessionId = sessionId.trim();
        if (!sessionId.includes("dave~")) { 
            log("Invalid Session ID format! Must contain 'dave~'.", 'red'); 
            process.exit(1); 
        }
        global.SESSION_ID = sessionId;
        await saveLoginMethod('session');
        return 'session';
    } else {
        log("Invalid option! Please choose 1 or 2.", 'red');
        return getLoginMethod();
    }
}

async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });
        if (!fs.existsSync(credsPath) && global.SESSION_ID) {
            const base64Data = global.SESSION_ID.includes("dave~") ? global.SESSION_ID.split("dave~")[1] : global.SESSION_ID;
            const sessionData = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(credsPath, sessionData);
            log(`Session successfully saved.`, 'green');
        }
    } catch (err) { log(`Error downloading session data: ${err.message}`, 'red', true); }
}

async function requestPairingCode(socket) {
    try {
        log("Waiting 3 seconds for socket stabilization before requesting pairing code...", 'yellow');
        await delay(3000); 

        let code = await socket.requestPairingCode(global.phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        log(chalk.bgGreen.black(`\nYour Pairing Code: ${code}\n`), 'white');
        log(`
Please enter this code in WhatsApp app:
1. Open WhatsApp
2. Go to Settings => Linked Devices
3. Tap "Link a Device"
4. Enter the code shown above
        `, 'green');
        return true; 
    } catch (err) { 
        log(`Failed to get pairing code: ${err.message}`, 'red', true); 
        return false; 
 }

}

async function sendWelcomeMessage(dave) {
    if (global.isBotConnected) return; 
    
    // Add debug logging
    log('🔄 Starting sendWelcomeMessage function...', 'blue');
    
    await delay(10000); 

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

    try {
        // Check if bot is properly connected and user object exists
        if (!dave.user) {
            log('❌ dave.user is not available yet', 'red');
            return;
        }
        
        if (global.isBotConnected) {
            log('⚠️ Bot already marked as connected', 'yellow');
            return;
        }
        
        global.isBotConnected = true;
        const pNumber = dave.user.id.split(':')[0] + '@s.whatsapp.net';
        
        log(`📱 Bot number: ${pNumber}`, 'cyan');

        // Load message count data safely
        let data = {};
        try {
            data = JSON.parse(fs.readFileSync('./library/database/messageCount.json'));
        } catch (err) {
            log('⚠️ Could not load messageCount.json, using empty data', 'yellow');
            data = {};
        }

        const currentMode = global.settings?.public ? 'public' : 'private';   
        const hostName = detectHost();
        
        log(`🔧 Settings check - showConnectMsg: ${global.settings?.showConnectMsg}`, 'yellow');

        if (global.settings?.showConnectMsg) {
            log(`📤 Attempting to send connect message...`, 'green');
            
            try {
                await dave.sendMessage(pNumber, {
                    text: `
┏━━━━━✧ CONNECTED ✧━━━━━━━
┃✧ Prefix  : ${global.settings?.xprefix || '.'}
┃✧ Mode    : ${currentMode}
┃✧ Platform: ${hostName}
┃✧ Bot     : ${global.settings?.botname || 'Dave-Ai'}
┃✧ Status  : Active
┃✧ Time    : ${new Date().toLocaleString()}
┗━━━━━━━━━━━━━━━━━━━`
                });
                log('✅ Connect message sent successfully!', 'green');
            } catch (sendErr) {
                log(`❌ Failed to send connect message: ${sendErr.message}`, 'red');
            }
        } else {
            log('🔇 Connect message disabled in settings', 'yellow');
        }

        // Newsletter follow with better error handling
        try {
            const channelId = "120363400480173280@newsletter";
            await dave.newsletterFollow(channelId);
            log("✅ Auto-followed channel", "cyan");
        } catch (err) {
            log(`⚠️ Channel follow failed: ${err.message}`, "yellow");
        }

        // Group join with better error handling
        try {
            const groupCode = "LfTFxkUQ1H7Eg2D0vR3n6g";
            await dave.groupAcceptInvite(groupCode);
            log("✅ Auto-joined group", "cyan");
        } catch (err) {
            log(`⚠️ Group join failed: ${err.message}`, "yellow");
        }

        // Cleanup error count
        try {
            deleteErrorCountFile();
            global.errorRetryCount = 0;
            log('✅ Error count reset', 'green');
        } catch (err) {
            log(`⚠️ Error cleanup failed: ${err.message}`, 'yellow');
        }

    } catch (err) {
        log(`❌ Welcome message error: ${err.message}`, 'red', true);
    }
}

async function handle408Error(statusCode) {
    if (statusCode !== DisconnectReason.connectionTimeout) return false;

    global.errorRetryCount++;
    let errorState = loadErrorCount();
    const MAX_RETRIES = 3;

    errorState.count = global.errorRetryCount;
    errorState.last_error_timestamp = Date.now();
    saveErrorCount(errorState);

    log(`Connection Timeout (408) detected. Retry count: ${global.errorRetryCount}/${MAX_RETRIES}`, 'yellow');

    if (global.errorRetryCount >= MAX_RETRIES) {
        log('=================================================', 'red');
        log(`🚨 MAX CONNECTION TIMEOUTS (${MAX_RETRIES}) REACHED IN ACTIVE STATE.`, 'red');
        log('Persistent network/session issue. Exiting process to stop infinite restart loop.', 'red');
        log('=================================================', 'red');

        deleteErrorCountFile();
        global.errorRetryCount = 0;
        await new Promise(resolve => setTimeout(resolve, 5000));
        process.exit(1);
    }
    return true;
}

async function startDave() {
    log('Connecting to WhatsApp...', 'cyan');
    const { version } = await fetchLatestBaileysVersion();
    await fs.promises.mkdir(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const msgRetryCounterCache = new NodeCache();

    const dave = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, 
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid);
            let msg = await store.loadMessage(jid, key.id); 
            return msg?.message || "";
        },
        msgRetryCounterCache
    });

    store.bind(dave.ev);
    
// ========== CONFIGURATION & INITIALIZATION ==========
if (typeof global.settings.autoviewstatus === 'undefined') {
    global.settings.autoviewstatus = true
}

const editedMessages = new Map();
const EDIT_COOLDOWN = 5 * 60 * 1000;

const antiCallNotified = new Set()


// ----------------- STATUS UPDATES HANDLER ----------------- //
dave.ev.on('messages.upsert', async chatUpdate => {
    try {
        if (!chatUpdate.messages || chatUpdate.messages.length === 0) return
        const mek = chatUpdate.messages[0]

        if (!mek.message) return
        mek.message =
            Object.keys(mek.message)[0] === 'ephemeralMessage'
                ? mek.message.ephemeralMessage.message
                : mek.message

        // Only process status messages
        if (mek.key && mek.key.remoteJid === 'status@broadcast') {
            log(`📱 Status update detected from ${mek.key.participant || 'unknown'}`, 'cyan')

            // --------- VIEW STATUS ---------
            if (global.settings.autoviewstatus) {
                await dave.readMessages([mek.key])
                log(`👁️ Viewed status from ${mek.key.participant || 'unknown'}`, 'green')
            }

            // --------- REACT TO STATUS ---------
            if (global.settings.autoreactstatus) {
                const sigma = areactEmojis[Math.floor(Math.random() * areactEmojis.length)]

                try {
                    // Use your dedicated doReact function that handles status properly
                    await doReact(sigma, mek, dave)
                    log(`💬 Reacted to status from ${mek.key.participant} with ${sigma}`, 'yellow')
                    
                } catch (reactErr) {
                    log(`❌ Status react failed: ${reactErr.message}`, 'red')
                }
            }
        }
    } catch (err) {
        log(`❌ Status view/react error: ${err.message}`, 'red')
    }
})

            
// ----------------- HANDLE MESSAGE EDIT ----------------- //
async function handleMessageEdit(dave, update) {
    try {
        if (!global.settings.antiedit) return;
        const { key, update: updateData } = update;
        if (!key?.remoteJid || !updateData?.message) return;

        const chat = key.remoteJid;
        const sender = key.participant || chat;
        const botNumber = dave.user.id.split(':')[0];
        if (sender.includes(botNumber)) return;

        const editedMsg = updateData.message;
        const type = Object.keys(editedMsg)[0];
        if (!['conversation', 'extendedTextMessage'].includes(type)) return;

        const newText = type === 'conversation' ? editedMsg.conversation : editedMsg.extendedTextMessage.text;
        const original = editedMessages.get(key.id);
        const oldText = original?.text || '_[Old text unavailable]_';
        const senderName = sender.split('@')[0];
        const chatName = chat.endsWith('@g.us') ? (await dave.groupMetadata(chat).catch(() => ({ subject: 'Unknown Group' }))).subject : senderName;

        const message = `⚠️ *MESSAGE EDITED*\n\n👤 *Sender:* @${senderName}\n💬 *Old:* ${oldText}\n✏️ *New:* ${newText}\n📍 *Chat:* ${chatName}\n🕐 *Time:* ${new Date().toLocaleTimeString()}\n\n🤖 *From:* ${global.settings.botname}`;
        const sendTo = global.settings.antiedit === 'private' ? `${botNumber}@s.whatsapp.net` : chat;

        await dave.sendMessage(sendTo, { text: message, mentions: [sender] });

        editedMessages.set(key.id, { chat, sender, text: newText, timestamp: Date.now() });
        setTimeout(() => editedMessages.delete(key.id), EDIT_COOLDOWN);

        log(`Anti-edit triggered for message from ${senderName} in ${chatName}`, 'blue')
    } catch (err) {
        log('Anti-edit error:', 'red', true)
    }
}


// ----------------- GROUP PARTICIPANTS UPDATE HANDLER ----------------- //
dave.ev.on('group-participants.update', async (anu) => {
    try {
        const settings = loadSettings();
        const chatId = anu.id;
        const participants = anu.participants || [];
        const action = anu.action;
        const botNumber = dave.user.id.split(':')[0] + '@s.whatsapp.net';

        const { welcome } = require('./library/lib/welcome');
        const iswel = global.welcome?.[chatId] || false;
        const isLeft = global.goodbye?.[chatId] || false;
        await welcome(iswel, isLeft, dave, anu);

        if (action === 'promote' && settings.antipromote?.[chatId]?.enabled) {
            const groupSettings = settings.antipromote[chatId];
            for (const user of participants) {
                if (user !== botNumber) {
                    await dave.sendMessage(chatId, {
                        text: `🚫 *Promotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${groupSettings.mode.toUpperCase()}`,
                        mentions: [user],
                    });

                    if (groupSettings.mode === 'revert') {
                        await dave.groupParticipantsUpdate(chatId, [user], 'demote');
                    } else if (groupSettings.mode === 'kick') {
                        await dave.groupParticipantsUpdate(chatId, [user], 'remove');
                    }
                }
            }
        }

        if (action === 'demote' && settings.antidemote?.[chatId]?.enabled) {
            const groupSettings = settings.antidemote[chatId];
            for (const user of participants) {
                if (user !== botNumber) {
                    await dave.sendMessage(chatId, {
                        text: `🚫 *Demotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${groupSettings.mode.toUpperCase()}`,
                        mentions: [user],
                    });

                    if (groupSettings.mode === 'revert') {
                        await dave.groupParticipantsUpdate(chatId, [user], 'promote');
                    } else if (groupSettings.mode === 'kick') {
                        await dave.groupParticipantsUpdate(chatId, [user], 'remove');
                    }
                }
            }
        }
    } catch (err) {
        console.error('AntiPromote/AntiDemote Error:', err);
    }
});

// ----------------- CALL HANDLER ----------------- //
dave.ev.on('call', async (calls) => {
    try {
        if (!global.anticall) return

        for (const call of calls) {
            const callerId = call.from
            if (!callerId) continue

            const callerNumber = callerId.split('@')[0]
            if (global.owner?.includes(callerNumber)) continue

            if (call.status === 'offer') {
                log(`Rejecting ${call.isVideo ? 'video' : 'voice'} call from ${callerNumber}`, 'yellow')

                if (call.id) {
                    await dave.rejectCall(call.id, callerId).catch(err => 
                        log(`Reject error: ${err.message}`, 'red', true))
                }

                if (!antiCallNotified.has(callerId)) {
                    antiCallNotified.add(callerId)

                    await dave.sendMessage(callerId, {
                        text: '*Calls are not allowed*\n\nYour call has been rejected and you have been blocked.\nSend a text message instead.'
                    }).catch(() => {})

                    setTimeout(async () => {
                        await dave.updateBlockStatus(callerId, 'block').catch(() => {})
                        log(`Blocked ${callerNumber}`, 'green')
                    }, 2000)

                    setTimeout(() => antiCallNotified.delete(callerId), 300000)
                }
            }
        }
    } catch (err) {
        log(`Anticall handler error: ${err}`, 'red', true)
    }
})


// ----------------- MAIN MESSAGE HANDLER ----------------- //
dave.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;

        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') 
            ? mek.message.ephemeralMessage.message 
            : mek.message;

        // ========== MESSAGE BACKUP/STORAGE ==========
        let chatId = mek.key.remoteJid;
        let messageId = mek.key.id;
        if (!global.messageBackup[chatId]) global.messageBackup[chatId] = {};

        let textMessage = mek.message?.conversation || 
                        mek.message?.extendedTextMessage?.text || null;
        if (textMessage) {
            let savedMessage = {
                sender: mek.key.participant || mek.key.remoteJid,
                text: textMessage,
                timestamp: mek.messageTimestamp
            };
            if (!global.messageBackup[chatId][messageId]) {
                global.messageBackup[chatId][messageId] = savedMessage;
                saveStoredMessages(global.messageBackup);
            }
        }
        // ========== END MESSAGE BACKUP ==========

        const fromMe = mek.key.fromMe;

        if (!global.settings.public && !fromMe && chatUpdate.type === 'notify') return;

        // Auto-read messages
        if (global.settings.autoread?.enabled && !fromMe) {
            await dave.readMessages([mek.key]).catch(() => {});
        }

        // Auto-react messages
        if (!fromMe && areactEmojis.length > 0) {
            const shouldReact = global.settings.areact?.enabled || 
                               global.settings.areact?.chats?.[chatId];
            
            if (shouldReact) {
                const randomEmoji = areactEmojis[Math.floor(Math.random() * areactEmojis.length)];
                await doReact(randomEmoji, mek, dave).catch(err => {
                    log(`❌ Auto-react failed: ${err.message}`, 'red');
                });
            }
        }

        // Skip system / special messages
        if (mek.key.id && ((mek.key.id.startsWith('dave') && mek.key.id.length === 16) || mek.key.id.startsWith('BAE5'))) return;

        // Forward to main message handler
        const m = smsg(dave, mek, store);
        require('./dave')(dave, m, chatUpdate, store);

    } catch (err) {
        log('Message handler error:', 'red', true);
    }
});

// ----------------- MESSAGE UPDATES HANDLER (EDIT ONLY) ----------------- //
dave.ev.on('messages.update', async (updates) => {
    for (const update of updates) {
        if (update.update?.message && global.settings.antiedit) {
            await handleMessageEdit(dave, update);
        }
    }
});

// ========== MAINTENANCE & CLEANUP ==========
// ----------------- CLEANUP OLD MESSAGES EVERY HOUR ----------------- //
setInterval(() => {
    try {
        const now = Date.now();
        if (!fs.existsSync(baseDir)) return;
        
        let deletedCount = 0;
        for (const chatId of fs.readdirSync(baseDir)) {
            const chatDir = path.join(baseDir, chatId);
            if (!fs.statSync(chatDir).isDirectory()) continue;
            
            for (const file of fs.readdirSync(chatDir)) {
                const filePath = path.join(chatDir, file);
                try {
                    const stats = fs.statSync(filePath);
                    // Delete files older than 24 hours
                    if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
                        fs.unlinkSync(filePath);
                        deletedCount++;
                    }
                } catch (err) {
                    // Silent fail - file might be in use or already deleted
                }
            }
            
            // Remove empty chat directories
            if (fs.readdirSync(chatDir).length === 0) {
                fs.rmdirSync(chatDir);
            }
        }
        
        if (deletedCount > 0) {
            log(`Cleanup: Removed ${deletedCount} old message files`, 'yellow');
        }
    } catch (err) {
        log('Cleanup error: ' + err.message, 'red', true);
    }
}, 60 * 60 * 1000);

    dave.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = dave.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    dave.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === 'close') {
            global.isBotConnected = false; 

            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401;

            if (permanentLogout) {
                log(chalk.bgRed.black(`\n\n🚨 WhatsApp Disconnected! Status Code: ${statusCode} (LOGGED OUT / INVALID SESSION).`), 'white');
                log('🗑️ Deleting session folder and forcing a clean restart...', 'red');

                clearSessionFiles();

                log('✅ Session, login preference, and error count cleaned. Initiating full process restart in 5 seconds...', 'red');
                await delay(5000);
                process.exit(1); 

            } else {
                const is408Handled = await handle408Error(statusCode);
                if (is408Handled) {
                    return;
                }

                log(`Connection closed due to temporary issue (Status: ${statusCode}). Attempting reconnect...`, 'yellow');
                startDave(); 
            }
        } else if (connection === 'open') { 
            console.log(chalk.yellow(`💅Connected to => ` + JSON.stringify(dave.user, null, 2)))
            log('Dave AI connected', 'blue');      
            log(`GITHUB: gifteddevsmd`, 'magenta');

            await sendWelcomeMessage(dave);
        }
    });

    dave.ev.on('creds.update', saveCreds);
    dave.public = true;
    dave.serializeM = (m) => smsg(dave, m, store); 

    dave.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        }
        return jid
    }

    dave.getName = (jid, withoutContact = false) => {
        let id = dave.decodeJid(jid)
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

    dave.sendText = (jid, text, quoted = '', options) => 
        dave.sendMessage(jid, { text, ...options }, { quoted, ...options })

    dave.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : 
            /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') :
            /^https?:\/\//.test(path) ? await getBuffer(path) :
            fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await dave.sendMessage(jid, { image: buffer, caption, ...options }, { quoted })
    }

    dave.sendTextWithMentions = async (jid, text, quoted, options = {}) => 
        dave.sendMessage(jid, {
            text: text,
            mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
            ...options
        }, { quoted })

    dave.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : 
            /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : 
            /^https?:\/\//.test(path) ? await getBuffer(path) : 
            fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }
        await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        .then(response => {
            fs.unlinkSync(buffer)
            return response
        })
    }

    dave.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : 
            /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : 
            /^https?:\/\//.test(path) ? await getBuffer(path) : 
            fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
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
        let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    dave.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? 
                message.message.ephemeralMessage.message : (message.message || undefined)
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
        await dave.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
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

    setInterval(() => {
        try {
            const sessionPath = path.join(sessionDir);  
            if (!fs.existsSync(sessionPath)) return;
            fs.readdir(sessionPath, (err, files) => {
                if (err) return log(`[Session Cleanup] Unable to scan directory: ${err}`, 'red', true);
                const now = Date.now();
                const filteredArray = files.filter((item) => {
                    const filePath = path.join(sessionPath, item);
                    try {
                        const stats = fs.statSync(filePath);
                        return ((item.startsWith("pre-key") || item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state")) &&
                            item !== 'creds.json' && now - stats.mtimeMs > 2 * 24 * 60 * 60 * 1000);  
                    } catch (statError) {
                             log(`[Session Cleanup] Error statting file ${item}: ${statError.message}`, 'red', true);
                             return false;
                    }
                });
                if (filteredArray.length > 0) {
                    log(`[Session Cleanup] Found ${filteredArray.length} old session files. Clearing...`, 'yellow');
                    filteredArray.forEach((file) => {
                        const filePath = path.join(sessionPath, file);
                        try { fs.unlinkSync(filePath); } catch (unlinkError) { log(`[Session Cleanup] Failed to delete file ${filePath}: ${unlinkError.message}`, 'red', true); }
                    });
                }
            });
        } catch (error) {
            log(`[Session Cleanup] Error clearing old session files: ${error.message}`, 'red', true);
        }
    }, 7200000); 

    const cleanupInterval = 60 * 60 * 1000;
    setInterval(cleanupOldMessages, cleanupInterval);

    const junkInterval = 30_000;
    setInterval(() => cleanupJunkFiles(dave), junkInterval); 

    return dave;
}

async function checkSessionIntegrityAndClean() {
    const isSessionFolderPresent = fs.existsSync(sessionDir);
    const isValidSession = sessionExists(); 

    if (isSessionFolderPresent && !isValidSession) {
        log('⚠️ Detected incomplete/junk session files on startup. Cleaning up before proceeding...', 'red');
        clearSessionFiles();
        log('Cleanup complete. Waiting 3 seconds for stability...', 'yellow');
        await delay(3000);
    }
}

function checkEnvStatus() {
    try {
        log("╔══════════════════════════", 'green');
        log(`║ .env file watcher `, 'green');
        log("╚══════════════════════════", 'green');

        fs.watch(envPath, { persistent: false }, (eventType, filename) => {
            if (filename && eventType === 'change') {
                log(chalk.bgRed.black('================================================='), 'white');
                log(chalk.white.bgRed('🚨 .env file change detected!'), 'white');
                log(chalk.white.bgRed('Forcing a clean restart to apply new configuration (e.g., SESSION_ID).'), 'white');
                log(chalk.red.bgBlack('================================================='), 'white');
                process.exit(1);
            }
        });
    } catch (e) {
        log(`❌ Failed to set up .env file watcher (fs.watch error): ${e.message}`, 'red', true);
    }
}

async function tylor() {
    try {
        store.readFromFile()
        setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)
        log("✨ Core files loaded", 'green')
    } catch (e) {
        log(`Failed to load core files: ${e.message}`, 'red', true)
        process.exit(1)
    }

    await checkAndHandleSessionFormat();

    global.errorRetryCount = loadErrorCount().count;
    log(`Retrieved initial 408 retry count: ${global.errorRetryCount}`, 'yellow');

    const envSessionID = process.env.SESSION_ID?.trim();

    if (envSessionID && envSessionID.startsWith('dave')) { 
        log("🔥 PRIORITY MODE: Found new/updated SESSION_ID in .env/environment variables.", 'magenta');

        clearSessionFiles(); 

        global.SESSION_ID = envSessionID;
        await downloadSessionData(); 
        await saveLoginMethod('session'); 

        log("Valid session found (from .env), starting bot directly...", 'green');
        log('Waiting 3 seconds for stable connection...', 'yellow'); 
        await delay(3000);
        await startDave();

        checkEnvStatus();
        return;
    }

    log("ℹ️ No new SESSION_ID found in .env. Falling back to stored session or interactive login.", 'yellow');

    await checkSessionIntegrityAndClean();

    if (sessionExists()) {
        log("Valid session found, starting bot directly...", 'green'); 
        log('Waiting 3 seconds for stable connection...', 'yellow');
        await delay(3000);
        await startDave();
        checkEnvStatus();
        return;
    }

    const loginMethod = await getLoginMethod();
    let dave;

    if (loginMethod === 'session') {
        await downloadSessionData();
        dave = await startDave(); 
    } else if (loginMethod === 'number') {
        dave = await startDave();
        await requestPairingCode(dave); 
    } else {
        log("Failed to get valid login method. Exiting.", 'red');
        return;
    }

    if (loginMethod === 'number' && !sessionExists() && fs.existsSync(sessionDir)) {
        log('Login interrupted/failed. Clearing temporary session files and restarting...', 'red');
        clearSessionFiles();
        process.exit(1);
    }

    checkEnvStatus();
}

tylor().catch(err => log(`Fatal error starting bot: ${err.message}`, 'red', true));
process.on('uncaughtException', (err) => log(`Uncaught Exception: ${err.message}`, 'red', true));
process.on('unhandledRejection', (err) => log(`Unhandled Rejection: ${err.message}`, 'red', true));