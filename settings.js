// ==================== MODULES ==================== //
const fs = require('fs');
const chalk = require('chalk');
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname + '/.env' });

// ==================== BOT INFO ==================== //
global.SESSION_ID = process.env.SESSION_ID || '.';
global.botname = process.env.BOT_NAME || '𝘿𝙖𝙫𝙚𝘼𝙄';
global.ownername = process.env.OWNER_NAME || 'GIFTED DAVE';
global.owner = process.env.OWNER_NUMBER || '254104260236';
global.creator = `${global.owner}@s.whatsapp.net`;
global.error = ['6666'];

// ==================== LINKS & SOCIALS ==================== //
global.websitex = 'https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k';
global.wagc = 'https://chat.whatsapp.com/LfTFxkUQ1H7Eg2D0vR3n6g?mode=ac_t';
global.socialm = 'IG: @gifted_dave';
global.location = 'Kenya';
global.themeemoji = '🪀';
global.wm = '𝘿𝙖𝙫𝙚𝘼𝙄';
global.botscript = global.websitex;

// ==================== STICKER INFO ==================== //
global.packname = process.env.PACK_NAME || '𝘿𝙖𝙫𝙚𝘼𝙄';
global.author = process.env.AUTHOR || '𝘿𝙖𝙫𝙚𝘼𝙄';
global.caption = '𝘿𝙖𝙫𝙚𝘼𝙄';
global.footer = '𝘿𝙖𝙫𝙚𝘼𝙄';

// ==================== AUTO STATUS FEATURES ==================== //
global.AUTOVIEWSTATUS = process.env.AUTOVIEWSTATUS !== 'false';  // Default: true
global.AUTOREACTSTATUS = process.env.AUTOREACTSTATUS === 'true'; // Default: false

// ==================== AUTO READ FEATURE ==================== //
global.AUTO_READ = process.env.AUTO_READ === 'true' || false;

// ==================== BOT SETTINGS ==================== //
global.xprefix = process.env.PREFIX || '.';
global.premium = [global.owner];
global.hituet = 0;

global.welcome = process.env.WELCOME === 'true';
global.anticall = process.env.ANTI_CALL === 'true';
global.adminevent = true;
global.groupevent = true;
global.antidelete = process.env.ANTI_DELETE !== 'false';
global.connect = true;

// ==================== AUTO REACTIONS ==================== //
global.AREACT = false;     // Global toggle for chat auto-react
global.areact = {};        // Per-chat auto-react storage

// ==================== BOT CONFIG ==================== //
global.botversion = '1.0.0';
global.typebot = 'Plugin × Case';
global.session = 'davesession';
global.updateZipUrl = 'https://github.com/gifteddevsmd/Dave-Ai/archive/refs/heads/main.zip';

// ==================== THUMBNAIL / MENU ==================== //
global.thumb = 'https://files.catbox.moe/cp8oat.jpg';
global.menuImage = global.thumb;

// ==================== LEGACY / OTHER TOGGLES ==================== //
global.statusview = global.AUTOVIEWSTATUS;
global.antilinkgc = false;
global.autoTyping = false;
global.autoRecord = false;
global.autoai = false;
global.autoreact = false;
global.autostatusview = true;

// ==================== MESSAGES ==================== //
global.mess = {
  success: '✅ Done.',
  admin: 'Admin only.',
  premium: 'Premium user only.',
  botAdmin: 'Make me admin first.',
  owner: 'Owner only.',
  OnlyGrup: 'Group only.',
  private: 'Private chat only.',
  wait: 'Processing...',
  error: 'Error occurred.'
};

// ==================== FILE WATCHER ==================== //
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update detected: '${__filename}'`));
  delete require.cache[file];
  require(file);
});