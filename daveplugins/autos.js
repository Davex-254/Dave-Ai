const fs = require('fs');
const path = './settings.js';

let daveplug = async (m, { dave, daveshown, args, reply }) => {
  try {
    if (!daveshown) return reply('Owner only command.');

    const feature = args[0]?.toLowerCase();
    const mode = args[1]?.toLowerCase();

    if (!feature || !mode)
      return reply('Usage:\n.autostatus <view|react> <on|off>');

    if (!['view', 'react'].includes(feature))
      return reply('Invalid feature. Use: view or react');

    if (!['on', 'off'].includes(mode))
      return reply('Invalid mode. Use: on or off');

    const state = mode === 'on';

    // Load current settings
    let currentSettings = {};
    if (fs.existsSync(path)) {
      currentSettings = require(path);
    }

    // Initialize globals if missing
    if (typeof global.AUTOVIEWSTATUS === 'undefined') global.AUTOVIEWSTATUS = true;
    if (typeof global.AUTOREACTSTATUS === 'undefined') global.AUTOREACTSTATUS = false;

    if (feature === 'view') global.AUTOVIEWSTATUS = state;
    if (feature === 'react') global.AUTOREACTSTATUS = state;

    // Update settings object
    currentSettings.AUTOVIEWSTATUS = global.AUTOVIEWSTATUS;
    currentSettings.AUTOREACTSTATUS = global.AUTOREACTSTATUS;

    // Write updated settings
    fs.writeFileSync(path, `module.exports = ${JSON.stringify(currentSettings, null, 2)};`, 'utf8');

    reply(`✅ Auto-status updated:\n👀 View: ${global.AUTOVIEWSTATUS ? 'ON' : 'OFF'}\n❤️ React: ${global.AUTOREACTSTATUS ? 'ON' : 'OFF'}`);
    
  } catch (err) {
    console.error('Autostatus error:', err.message);
    reply('An error occurred while processing the command.');
  }
};

daveplug.help = ['autostatus <view|react> <on|off>'];
daveplug.tags = ['owner'];
daveplug.command = ['autostatus', 'autosview', 'autostatusreact'];

module.exports = daveplug;