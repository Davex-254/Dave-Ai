// ==================== MODULES ==================== //
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname + '/.env' });

// ==================== SETTINGS FILES ==================== //
const settingsPath = path.join(__dirname, 'library/database/settings.json');
const prefixSettingsPath = path.join(__dirname, 'library/database/prefixSettings.json');

// ==================== LOAD SETTINGS ==================== //
function loadSettings() {
  try {
    let settings = {};

    if (!fs.existsSync(settingsPath)) {
      const defaultSettings = {
        // Bot Info
        botname: process.env.BOT_NAME || '𝘿𝙖𝙫𝙚𝘼𝙄',
        ownername: process.env.OWNER_NAME || 'GIFTED DAVE',
        owner: process.env.OWNER_NUMBER || '254104260236',

        // Features
        autoread: { enabled: false },
        autorecord: { enabled: false },
        autotyping: { enabled: false },
        autoviewstatus: process.env.AUTOVIEWSTATUS !== 'false',
        autoreactstatus: process.env.AUTOREACTSTATUS === 'true',
        welcome: process.env.WELCOME === 'true',
        anticall: process.env.ANTI_CALL === 'true',
        antidelete: { enabled: true },

        // Sticker Info
        packname: process.env.PACK_NAME || '𝘿𝙖𝙫𝙚𝘼𝙄',
        author: process.env.AUTHOR || '𝘿𝙖𝙫𝙚𝘼𝙄',

        // Auto Reactions
        areact: {
          enabled: false,
          chats: {},
          emojis: ['💜', '💖', '💗', '💞', '💕', '❤️', '🔥', '😎', '💯', '🤖'],
          mode: 'random'
        },

        // Group Settings
        antilinkgc: { enabled: false },

        // Security Features
        antilink: {},
        antitag: {},
        antibadword: {},
        antipromote: { enabled: false, mode: 'revert' },
        antidemote: { enabled: false, mode: 'revert' },
        antibot: {},

        // Auto Like
        autolike: { enabled: false }
      };

      const dir = path.dirname(settingsPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
      settings = defaultSettings;
    } else {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

      // Ensure required structures exist
      settings.areact = settings.areact || { enabled: false, chats: {}, emojis: [], mode: 'random' };
      settings.antipromote = settings.antipromote || { enabled: false, mode: 'revert' };
      settings.antidemote = settings.antidemote || { enabled: false, mode: 'revert' };
      settings.antidelete = settings.antidelete || { enabled: true };
      settings.autolike = settings.autolike || { enabled: false };
    }

    return settings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return {};
  }
}

// ==================== PREFIX SYSTEM ==================== //
function loadXPrefix() {
  try {
    if (fs.existsSync(prefixSettingsPath)) {
      const prefixData = JSON.parse(fs.readFileSync(prefixSettingsPath, 'utf8'));
      return prefixData.xprefix ?? '.';
    } else {
      const defaultPrefix = { xprefix: '.' };
      const dir = path.dirname(prefixSettingsPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(prefixSettingsPath, JSON.stringify(defaultPrefix, null, 2));
      return defaultPrefix.xprefix;
    }
  } catch (error) {
    console.error('Error loading prefix settings:', error);
    return '.';
  }
}

function saveXPrefix(newPrefix) {
  try {
    const prefixData = { xprefix: newPrefix };
    const dir = path.dirname(prefixSettingsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(prefixSettingsPath, JSON.stringify(prefixData, null, 2));
    global.xprefix = newPrefix;
    console.log(chalk.green(`✅ Prefix changed to '${newPrefix || '.'}'`));
  } catch (error) {
    console.error('Error saving prefix:', error);
  }
}

// ==================== SAVE SETTINGS ==================== //
function saveSettings(settings) {
  try {
    const dir = path.dirname(settingsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// ==================== LOAD SETTINGS INIT ==================== //
const settings = loadSettings();

// ==================== BOT INFO ==================== //
global.SESSION_ID = process.env.SESSION_ID || '.';
global.botname = settings.botname;
global.ownername = settings.ownername;
global.owner = settings.owner;
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
global.packname = settings.packname;
global.author = settings.author;
global.caption = '𝘿𝙖𝙫𝙚𝘼𝙄';
global.footer = '𝘿𝙖𝙫𝙚𝘼𝙄';

// ==================== FEATURES ==================== //
global.AUTOVIEWSTATUS = settings.autoviewstatus;
global.AUTOREACTSTATUS = settings.autoreactstatus;
global.AUTO_READ = settings.autoread.enabled;
global.antidelete = settings.antidelete.enabled;
global.AREACT = settings.areact.enabled;
global.areact = settings.areact.chats;
global.welcome = settings.welcome;
global.anticall = settings.anticall;

// ==================== BOT CONFIG ==================== //
global.xprefix = loadXPrefix(); // ✅ consistent lowercase key
global.premium = [global.owner];
global.botversion = '1.0.0';
global.typebot = 'Plugin × Case';
global.session = 'davesession';
global.updateZipUrl = 'https://github.com/gifteddevsmd/Dave-Ai/archive/refs/heads/main.zip';

// ==================== IMAGES ==================== //
global.thumb = 'https://files.catbox.moe/cp8oat.jpg';
global.menuImage = global.thumb;

// ==================== STATUS FLAGS ==================== //
global.statusview = global.AUTOVIEWSTATUS;
global.antilinkgc = settings.antilinkgc.enabled;
global.autoTyping = settings.autotyping.enabled;
global.autoRecord = settings.autorecord.enabled;
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

// ==================== GLOBAL EXPORTS ==================== //
global.settings = settings;
global.loadSettings = loadSettings;
global.saveSettings = saveSettings;
global.loadXPrefix = loadXPrefix;
global.saveXPrefix = saveXPrefix;

// ==================== FILE WATCHER ==================== //
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.yellowBright(`♻️ Reloaded: '${path.basename(__filename)}'`));
  delete require.cache[file];
  require(file);
});

// ==================== EXPORT FUNCTIONS ==================== //
module.exports = {
  loadSettings,
  saveSettings,
  loadXPrefix,
  saveXPrefix
};