const fs = require('fs')
const chalk = require('chalk')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname + '/.env' })

// ==================== BOT INFO ==================== //
global.SESSION_ID = process.env.SESSION_ID || '.'
global.botname = process.env.BOT_NAME || '𝘿𝙖𝙫𝙚𝘼𝙄'
global.ownername = 'GIFTED DAVE'
global.error = ["6666"]
global.owner = ["254104260236"]
global.owner       = process.env.OWNER_NUMBER || "254104260236";     // Owner number (for multiple, use comma-separated in your logic)
// ==================== LINKS & SOCIALS ==================== //
global.websitex = "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k"
global.wagc = "https://chat.whatsapp.com/LfTFxkUQ1H7Eg2D0vR3n6g?mode=ac_t"
global.socialm = "IG: @gifted_dave"
global.location = "Kenya"
global.themeemoji = '🪀'
global.wm = "𝘿𝙖𝙫𝙚𝘼𝙄"
global.botscript = "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k"
global.creator = "254104260236@s.whatsapp.net"


// ==================== AUTO STATUS FEATURES ==================== //
// These can also be controlled by .env variables
global.autoviewstatus = process.env.AUTOVIEWSTATUS !== 'false'   // Default: true
global.autoreactstatus = process.env.AUTOREACTSTATUS === 'true'  // Default: false

// ==================== STICKER INFO ==================== //
global.caption = "𝘿𝙖𝙫𝙚𝘼𝙄"
global.updateZipUrl = "https://github.com/gifteddevsmd/Dave-Ai/archive/refs/heads/main.zip";

//━━━━━━━━━━━━━━━━━━━━━━━━//
// Sticker Marker
global.packname = process.env.PACK_NAME || '𝘿𝙖𝙫𝙚𝘼𝙄'
global.author = process.env.AUTHOR || '𝘿𝙖𝙫𝙚𝘼𝙄'
//━━━━━━━━━━━━━━━━━━━━━━━━//

// ==================== BOT SETTINGS ==================== //
global.xprefix = process.env.PREFIX || '.'
global.premium = ["254104260236"]
global.hituet = 0

global.welcome = process.env.WELCOME || 'false'
global.anticall = process.env.ANTI_CALL || 'false'
global.adminevent = true
global.groupevent = true
global.antidelete = process.env.ANTI_DELETE !== 'false'
global.footer = '𝘿𝙖𝙫𝙚𝘼𝙄'

// ==================== AUTO REACTIONS ==================== //
// 👀 For status updates
global.autoviewstatus = true      // Auto-view ON by default
global.autoreactstatus = false    // Auto-react OFF by default
// 💬 For normal chats & groups
global.areact = {}                // Auto-react (areact) OFF by default — toggleable later

// ==================== MESSAGES ==================== //
global.mess = {
    success: '✅ Done.',
    admin: '🚨 Admin only.',
    premium: '🆘 Must be a premium user.',
    botAdmin: '🤖 Make me admin first.',
    owner: '👑 Owner only.',
    OnlyGrup: '👥 Group only.',
    private: '📩 Private chat only.',
    wait: '⏳ Processing...',
    error: '⚠️ Error occurred.',
}

// ==================== THUMBNAIL ==================== //
global.thumb = "https://files.catbox.moe/cp8oat.jpg"
global.menuImage = global.menuImage || 'https://files.catbox.moe/cp8oat.jpg'

// ==================== AUTO FEATURES / PANELS ==================== //
global.botversion = "1.0.0"
global.typebot = "Plugin × case"
global.session = "davesession"
global.connect = true

// Legacy/Optional Toggles
global.statusview = true
global.antilinkgc = false
global.autoTyping = false
global.autoRecord = false
global.autoai = false
global.autoreact = false

// ==================== WATCH CONFIG FILE ==================== //
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update '${__filename}'`))
    delete require.cache[file]
    require(file)
})