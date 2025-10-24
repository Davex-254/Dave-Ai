require('./settings')
require('dotenv').config()
const config = require('./config');
// Core Baileys imports
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay,
    downloadContentFromMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    jidDecode
} = require("@whiskeysockets/baileys")

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
const { emojis: areactEmojis, doReact } = require('./library/autoreact.js')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./library/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./library/lib/function')

// Load store and settings - CORRECTED PATH
const store = require('./library/database/basestore')
const settings = require('./settings')

// Global state
global.isBotConnected = false
global.connectDebounceTimeout = null
global.errorRetryCount = 0
global.messageBackup = {}

// File paths - CORRECTED TO MATCH YOUR STRUCTURE
const MESSAGE_STORE_FILE = path.join(__dirname, 'library/database/message_backup.json')
const SESSION_ERROR_FILE = path.join(__dirname, 'library/database/sessionErrorCount.json')
const MESSAGE_COUNT_FILE = path.join(__dirname, 'library/database/messageCount.json')
// --- 🔒 MESSAGE/ERROR STORAGE

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

    // Split message by newline to ensure prefix is on every line, 
    // but only for multi-line messages without custom chalk background/line art.
    if (message.includes('\n') || message.includes('════')) {
        logFunc(xprefix, coloredMessage);
    } else {
         logFunc(`${xprefix} ${coloredMessage}`);
    }
}
// -------------------------------------------

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
        // Ensure directory exists
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
function cleanupOldMessages() {
    let storedMessages = loadStoredMessages()
    let now = Math.floor(Date.now() / 1000)
    const maxMessageAge = 24 * 60 * 60
    let cleanedMessages = {}

    for (let chatId in storedMessages) {
        let newChatMessages = {}
        for (let messageId in storedMessages[chatId]) {
            let message = storedMessages[chatId][messageId]
            if (now - message.timestamp <= maxMessageAge) {
                newChatMessages[messageId] = message
            }
        }
        if (Object.keys(newChatMessages).length > 0) {
            cleanedMessages[chatId] = newChatMessages
        }
    }
    saveStoredMessages(cleanedMessages)
    log("🧹 Old messages cleaned", 'yellow')
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
        // Only check if it's set and non-empty
        if (!sessionId.trim().startsWith('dave')) {
            log(chalk.red.bgBlack('================================================='), 'white');
            log(chalk.white.bgRed('❌ ERROR: Invalid SESSION_ID in .env'), 'white');
            log(chalk.white.bgRed('The session ID MUST start with "dave".'), 'white');
            log(chalk.white.bgRed('Cleaning .env and creating new one...'), 'white');
            log(chalk.red.bgBlack('================================================='), 'white');

            try {
                let envContent = fs.readFileSync(envPath, 'utf8');

                // Use regex to replace only the SESSION_ID line while preserving other variables
                envContent = envContent.replace(/^SESSION_ID=.*$/m, 'SESSION_ID=');

                fs.writeFileSync(envPath, envContent);
                log('✅ Cleaned SESSION_ID entry in .env file.', 'green');
                log('Please add a proper session ID and restart the bot.', 'yellow');
            } catch (e) {
                log(`Failed to modify .env file. Please check permissions: ${e.message}`, 'red', true);
            }

            // Delay before exiting to allow user to read the message before automatic restart
            log('Bot will wait 30 seconds then restart', 'blue');
            await delay(30000);

            // Exit with code 1 to ensure the hosting environment restarts the process
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

    // Interactive prompt for Pterodactyl/local
    if (!process.stdin.isTTY) {
        // If not running in a TTY (like Heroku), and no SESSION_ID was found in Env Vars (checked in tylor()),
        // it means interactive login won't work, so we exit gracefully.
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
        // Pre-check the format during interactive entry as well
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
            // Check for the prefix and handle the split logic
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

// --- Dedicated function to handle post-connection initialization and welcome message
async function sendWelcomeMessage(dave) {
    // Safety check: Only proceed if the welcome message hasn't been sent yet in this session.
    if (global.isBotConnected) return; 

    // CRITICAL: Wait 10 seconds for the connection to fully stabilize
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
    if (!dave.user || global.isBotConnected) return;

    global.isBotConnected = true;
    const pNumber = dave.user.id.split(':')[0] + '@s.whatsapp.net';

    // FIXED PATH - using the correct database location
    let data = JSON.parse(fs.readFileSync('./library/database/messageCount.json'));
    const currentMode = data.isPublic ? 'public' : 'private';    
    const hostName = detectHost();

    await dave.sendMessage(dave.user.id, {
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
        log('✅ Bot successfully connected to Whatsapp.', 'green');

        try {
            const channelId = "120363400480173280@newsletter"
            await dave.newsletterFollow(channelId)
            log("📢 Auto-followed channel", "cyan")
        } catch (err) {
            log("⚠️ Channel follow failed", "yellow")
        }

        try {
            const groupCode = "LfTFxkUQ1H7Eg2D0vR3n6g"
            await dave.groupAcceptInvite(groupCode)
            log("👥 Auto-joined group", "cyan")
        } catch (err) {
            log("⚠️ Group join failed", "yellow")
        }

        // NEW: Reset the error counter on successful connection
        deleteErrorCountFile();
        global.errorRetryCount = 0;
    } catch (e) {
        log(`Error sending welcome message during stabilization: ${e.message}`, 'red', true);
        global.isBotConnected = false;
    }
}

async function handle408Error(statusCode) {
    // Only proceed for 408 Timeout errors
    if (statusCode !== DisconnectReason.connectionTimeout) return false;

    global.errorRetryCount++;
    let errorState = loadErrorCount();
    const MAX_RETRIES = 3;

    // Update persistent and in-memory counters
    errorState.count = global.errorRetryCount;
    errorState.last_error_timestamp = Date.now();
    saveErrorCount(errorState);

    log(`Connection Timeout (408) detected. Retry count: ${global.errorRetryCount}/${MAX_RETRIES}`, 'yellow');

    if (global.errorRetryCount >= MAX_RETRIES) {
        log(chalk.red.bgBlack('================================================='), 'white');
        log(chalk.white.bgRed(`🚨 MAX CONNECTION TIMEOUTS (${MAX_RETRIES}) REACHED IN ACTIVE STATE. `), 'white');
        log(chalk.white.bgRed('This indicates a persistent network or session issue.'), 'white');
        log(chalk.white.bgRed('Exiting process to stop infinite restart loop.'), 'white');
        log(chalk.red.bgBlack('================================================='), 'white');

        deleteErrorCountFile();
        global.errorRetryCount = 0; // Reset in-memory counter

        // Force exit to prevent a restart loop, user must intervene (Pterodactyl/Heroku)
        await delay(5000); // Give time for logs to print
        process.exit(1);
    }
    return true;
}

async function startDave() {
    log('Connecting to WhatsApp...', 'cyan');
    const { version } = await fetchLatestBaileysVersion();

    // Ensure session directory exists before Baileys attempts to use it
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
            // This now uses the globally available 'store' which is loaded inside tylor()
            let msg = await store.loadMessage(jid, key.id); 
            return msg?.message || "";
        },
        msgRetryCounterCache
    });

    store.bind(dave.ev);

// ============ DEFAULT REACTION EMOJIS ============
const defaultEmojis = ['👍', '😂', '❤️', '🔥', '🥳', '👏']; // default react emojis
global.areactEmojis = defaultEmojis;

// ============ MESSAGE UPSERT HANDLER ============
dave.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;

        // Unwrap ephemeral messages
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? 
            mek.message.ephemeralMessage.message : mek.message;

        // Anti-delete: save incoming message or handle deletion
        if (global.antiDelSettings?.enabled) {
            if (mek.message?.protocolMessage?.type === 0) {
                await handleMessageRevocation(dave, mek);
            } else {
                handleIncomingMessage(mek);
            }
        }

        // Backup text messages
        let chatId = mek.key.remoteJid;
        let messageId = mek.key.id;
        if (!global.messageBackup[chatId]) global.messageBackup[chatId] = {};

        const textMessage = mek.message?.conversation || mek.message?.extendedTextMessage?.text;
        if (textMessage && !global.messageBackup[chatId][messageId]) {
            global.messageBackup[chatId][messageId] = {
                sender: mek.key.participant || mek.key.remoteJid,
                text: textMessage,
                timestamp: mek.messageTimestamp
            };
            saveStoredMessages(global.messageBackup);
        }

        const fromMe = mek.key.fromMe;

        // Auto-read
        if (global.AUTO_READ && !fromMe) {
            await dave.readMessages([mek.key]);
        }

        // Status broadcasts
        if (mek.key.remoteJid === 'status@broadcast') {
            if (global.AUTOVIEWSTATUS) await dave.readMessages([mek.key]);
            if (global.AUTOREACTSTATUS) {
                const emoji = defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
                await doReact(emoji, mek, dave);
            }
            return;
        }

        // Auto react to messages
        if (!fromMe && (global.AREACT || (global.areact && global.areact[chatId]))) {
            const emoji = defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
            await doReact(emoji, mek, dave);
        }

        // Skip bot commands if bot is private
        if (!dave.public && !fromMe && chatUpdate.type === 'notify') return;
        if (mek.key.id.startsWith('dave') && mek.key.id.length === 16) return;
        if (mek.key.id.startsWith('BAE5')) return;

        // Pass to main handler
        const m = smsg(dave, mek, store);
        require("./dave")(dave, m, chatUpdate, store);

    } catch (err) {
        console.log(`Message handler error: ${err.message}`);
    }
});

// ============ MESSAGES.UPDATE HANDLER (ANTI-DELETE) ============
dave.ev.on('messages.update', async (updates) => {
    try {
        if (!global.antiDelSettings?.enabled) return;

        for (const update of updates) {
            const msg = update.update?.message || update.message;
            if (msg?.protocolMessage?.type === 0) {
                await handleMessageRevocation(dave, { key: update.key, message: msg });
            }
        }
    } catch (err) {
        console.log(`Anti-delete update handler error: ${err.message}`);
    }
});



    // Anti-call handler
    const antiCallNotified = new Set()

    dave.ev.on('call', async (calls) => {
        try {
            if (!global.anticall) return

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

    dave.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = dave.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    // --- ⚠️ CONNECTION UPDATE LISTENER (Enhanced Logic with 401/408 handler)
    dave.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === 'close') {
            global.isBotConnected = false; 

            const statusCode = lastDisconnect?.error?.output?.statusCode;
            // Capture both DisconnectReason.loggedOut (sometimes 401) and explicit 401 error
            const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401;

            // Log and handle permanent errors (logged out, invalid session)
            if (permanentLogout) {
                log(chalk.bgRed.black(`\n\n🚨 WhatsApp Disconnected! Status Code: ${statusCode} (LOGGED OUT / INVALID SESSION).`), 'white');
                log('🗑️ Deleting session folder and forcing a clean restart...', 'red');

                // AUTOMATICALLY DELETE SESSION (using the new helper)
                clearSessionFiles();

                log('✅ Session, login preference, and error count cleaned. Initiating full process restart in 5 seconds...', 'red');
                await delay(5000);

                // CRITICAL FIX: Use process.exit(1) to trigger a clean restart by the Daemon
                process.exit(1); 

            } else {
                // NEW: Handle the 408 Timeout Logic FIRST
                const is408Handled = await handle408Error(statusCode);
                if (is408Handled) {
                    // If handle408Error decides to exit, it will already have called process.exit(1)
                    return;
                }

                // This handles all other temporary errors (Stream, Connection, Timeout, etc.)
                log(`Connection closed due to temporary issue (Status: ${statusCode}). Attempting reconnect...`, 'yellow');
                // Re-start the whole bot process (this handles temporary errors/reconnects)
                startDave(); 
            }
        } else if (connection === 'open') { 
            console.log(chalk.yellow(`💅Connected to => ` + JSON.stringify(dave.user, null, 2)))
            log('Dave AI connected', 'blue');      
            log(`GITHUB: gifteddevsmd`, 'magenta');

            // Send the welcome message (which includes the 10s stability delay and error reset)
            await sendWelcomeMessage(dave);
        }
    });

    dave.ev.on('creds.update', saveCreds);
    dave.public = true;
    // This relies on smsg being loaded
    dave.serializeM = (m) => smsg(dave, m, store); 

    // Helper methods - FIXED: Added proper jidDecode function
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

    // 1. Session File Cleanup 
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

    // 2. Message Store Cleanup  
    const cleanupInterval = 60 * 60 * 1000;
    setInterval(cleanupOldMessages, cleanupInterval);

    // 3. Junk File Cleanup  
    const junkInterval = 30_000;
    setInterval(() => cleanupJunkFiles(dave), junkInterval); 

    return dave;
}

// --- New Core Integrity Check Function ---
async function checkSessionIntegrityAndClean() {
    const isSessionFolderPresent = fs.existsSync(sessionDir);
    const isValidSession = sessionExists(); 

    // Scenario: Folder exists, but 'creds.json' is missing (incomplete/junk session)
    if (isSessionFolderPresent && !isValidSession) {

        log('⚠️ Detected incomplete/junk session files on startup. Cleaning up before proceeding...', 'red');

        // 1. Delete the entire session folder (junk files, partial state, etc.)
        clearSessionFiles(); // Use the helper function

        // 2. Add the requested 3-second delay after cleanup
        log('Cleanup complete. Waiting 3 seconds for stability...', 'yellow');
        await delay(3000);
    }
}

// --- 🌟 NEW: .env File Watcher for Automated Restart ---
function checkEnvStatus() {
    try {
        log("╔══════════════════════════", 'green');
        log(`║ .env file watcher `, 'green');
        log("╚══════════════════════════", 'green');

        // Use persistent: false for better behavior in some hosting environments
        // Always set the watcher regardless of the environment
        fs.watch(envPath, { persistent: false }, (eventType, filename) => {
            if (filename && eventType === 'change') {
                log(chalk.bgRed.black('================================================='), 'white');
                log(chalk.white.bgRed('🚨 .env file change detected!'), 'white');
                log(chalk.white.bgRed('Forcing a clean restart to apply new configuration (e.g., SESSION_ID).'), 'white');
                log(chalk.red.bgBlack('================================================='), 'white');

                // Use process.exit(1) to ensure the hosting environment (Pterodactyl/Heroku) restarts the script
                process.exit(1);
            }
        });
    } catch (e) {
        log(`❌ Failed to set up .env file watcher (fs.watch error): ${e.message}`, 'red', true);
        // Do not exit, as the bot can still run, but notify the user
    }
}

async function tylor() {
    try {
        // Initialize store
        store.readFromFile()
        setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)
        log("✨ Core files loaded", 'green')
    } catch (e) {
        log(`Failed to load core files: ${e.message}`, 'red', true)
        process.exit(1)
    }

    // 2. NEW: Check the SESSION_ID format *before* connecting
    await checkAndHandleSessionFormat();

    // 3. Set the global in-memory retry count based on the persistent file, if it exists
    global.errorRetryCount = loadErrorCount().count;
    log(`Retrieved initial 408 retry count: ${global.errorRetryCount}`, 'yellow');

    // 4. *** IMPLEMENT USER'S PRIORITY LOGIC: Check .env SESSION_ID FIRST ***
    const envSessionID = process.env.SESSION_ID?.trim();

    if (envSessionID && envSessionID.startsWith('dave')) { 
        log("🔥 PRIORITY MODE: Found new/updated SESSION_ID in .env/environment variables.", 'magenta');

        // 4a. Force the use of the new session by cleaning any old persistent files.
        clearSessionFiles(); 

        // 4b. Set global and download the new session file (creds.json) from the .env value.
        global.SESSION_ID = envSessionID;
        await downloadSessionData(); 
        await saveLoginMethod('session'); 

        // 4c. Start bot with the newly created session files
        log("Valid session found (from .env), starting bot directly...", 'green');
        log('Waiting 3 seconds for stable connection...', 'yellow'); 
        await delay(3000);
        await startDave();

        // 4d. Start the file watcher
        checkEnvStatus(); // <--- START .env FILE WATCHER (Mandatory)

        return;
    }
    // If environment session is NOT set, or not valid, continue with fallback logic:
    log("ℹ️ No new SESSION_ID found in .env. Falling back to stored session or interactive login.", 'yellow');

    // 5. Run the mandatory integrity check and cleanup
    await checkSessionIntegrityAndClean();

    // 6. Check for a valid *stored* session after cleanup
    if (sessionExists()) {
        log("Valid session found, starting bot directly...", 'green'); 
        log('Waiting 3 seconds for stable connection...', 'yellow');
        await delay(3000);
        await startDave();

        // 6a. Start the file watcher
        checkEnvStatus(); // <--- START .env FILE WATCHER (Mandatory)

        return;
    }

    // 7. New Login Flow (If no valid session exists)
    const loginMethod = await getLoginMethod();
    let dave;

    if (loginMethod === 'session') {
        await downloadSessionData();
        // Socket is only created AFTER session data is saved
        dave = await startDave(); 
    } else if (loginMethod === 'number') {
        // Socket is created BEFORE pairing code is requested
        dave = await startDave();
        await requestPairingCode(dave); 
    } else {
        log("Failed to get valid login method. Exiting.", 'red');
        return;
    }

    // 8. Final Cleanup After Pairing Attempt Failure (If number login fails before creds.json is written)
    if (loginMethod === 'number' && !sessionExists() && fs.existsSync(sessionDir)) {
        log('Login interrupted/failed. Clearing temporary session files and restarting...', 'red');

        clearSessionFiles(); // Use the helper function

        // Force an exit to restart the entire login flow cleanly
        process.exit(1);
    }

    // 9. Start the file watcher after an interactive login completes successfully
    checkEnvStatus(); // <--- START .env FILE WATCHER (Mandatory)
}

// --- Start bot (Dave AI) ---
tylor().catch(err => log(`Fatal error starting bot: ${err.message}`, 'red', true));
process.on('uncaughtException', (err) => log(`Uncaught Exception: ${err.message}`, 'red', true));
process.on('unhandledRejection', (err) => log(`Unhandled Rejection: ${err.message}`, 'red', true));