const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Path for prefix storage
const prefixSettingsPath = path.join(__dirname, '../../library/database/prefixSettings.json');

// ====== Helper Functions ====== //
function saveXPrefix(newPrefix) {
  try {
    const dir = path.dirname(prefixSettingsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(prefixSettingsPath, JSON.stringify({ xprefix: newPrefix }, null, 2));
    global.xprefix = newPrefix;
    console.log(chalk.green(`✅ Prefix saved as: '${newPrefix || 'none'}'`));
  } catch (err) {
    console.error('❌ Error saving prefix:', err);
  }
}

function loadXPrefix() {
  try {
    if (fs.existsSync(prefixSettingsPath)) {
      const data = JSON.parse(fs.readFileSync(prefixSettingsPath, 'utf8'));
      global.xprefix = data.xprefix ?? '.';
      console.log(chalk.blue(`🔹 Prefix loaded: '${global.xprefix || 'none'}'`));
    } else {
      saveXPrefix('.');
    }
  } catch (err) {
    console.error('❌ Error loading prefix:', err);
    global.xprefix = '.';
  }
}

// Auto-load prefix at startup
loadXPrefix();

// ====== Plugin Command ====== //
let daveplug = async (m, { dave, daveshown, reply, text }) => {
  try {
    if (!daveshown) return reply('Owner only command!');
    if (!text) return reply(`Provide a prefix!\nExample: ${global.xprefix}setprefix .\nUse 'none' to remove prefix.`);

    await dave.sendMessage(m.chat, { react: { text: '...', key: m.key } });

    let newPrefix = text.trim().toLowerCase();
    if (newPrefix === 'none') newPrefix = '';

    saveXPrefix(newPrefix);

    await dave.sendMessage(m.chat, { react: { text: '✓', key: m.key } });
    await reply(`Prefix successfully set to: ${newPrefix === '' ? 'none (no prefix required)' : newPrefix}`);
  } catch (err) {
    console.error('Set Prefix Error:', err);
    await dave.sendMessage(m.chat, { react: { text: '✗', key: m.key } });
    await reply('Failed to change prefix.');
  }
};

daveplug.help = ['setprefix'];
daveplug.tags = ['system'];
daveplug.command = ['setprefix'];

module.exports = daveplug;