const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

let daveplug = async (m, { dave, daveshown, reply, text }) => {
  try {
    if (!daveshown) return reply('owner only command');
    if (!text) return reply(`provide a prefix\nExample: ${global.xprefix}setprefix .\nuse 'none' to remove prefix`);

    let newPrefix = text.trim().toLowerCase();
    if (newPrefix === 'none') newPrefix = '';

    const settings = global.settings
    settings.xprefix = newPrefix
    global.saveSettings(settings)
    global.settings = settings
    global.xprefix = newPrefix

    reply(`prefix successfully set to: ${newPrefix === '' ? 'none (no prefix required)' : newPrefix}`)
  } catch (err) {
    console.error('set prefix error:', err)
    reply('failed to change prefix')
  }
};

daveplug.help = ['setprefix'];
daveplug.tags = ['system'];
daveplug.command = ['setprefix'];

module.exports = daveplug;