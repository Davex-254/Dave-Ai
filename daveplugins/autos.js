const fs = require('fs');

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

    if (feature === 'view') global.AUTOVIEWSTATUS = state;
    else if (feature === 'react') global.AUTOREACTSTATUS = state;

    try {
      // read current settings file
      let current = fs.readFileSync('./settings.js', 'utf8');

      // Update AUTOVIEWSTATUS and AUTOREACTSTATUS
      if (/global\.AUTOVIEWSTATUS\s*=/.test(current)) {
        current = current.replace(/global\.AUTOVIEWSTATUS\s*=.*;/, `global.AUTOVIEWSTATUS = ${global.AUTOVIEWSTATUS};`);
      }
      if (/global\.AUTOREACTSTATUS\s*=/.test(current)) {
        current = current.replace(/global\.AUTOREACTSTATUS\s*=.*;/, `global.AUTOREACTSTATUS = ${global.AUTOREACTSTATUS};`);
      }

      fs.writeFileSync('./settings.js', current);
    } catch (err) {
      console.error('Error saving settings:', err.message);
      return reply('Failed to save settings.');
    }

    // Send confirmation with both current states
    reply(`✅ Auto-status settings updated:\n\nView: ${global.AUTOVIEWSTATUS ? 'ON' : 'OFF'}\nReact: ${global.AUTOREACTSTATUS ? 'ON' : 'OFF'}`);

  } catch (err) {
    console.error('Autostatus error:', err.message);
    reply('An error occurred while processing the command.');
  }
};

daveplug.help = ['autostatus <view|react> <on|off>'];
daveplug.tags = ['owner'];
daveplug.command = ['autostatus', 'autosview', 'autostatusreact'];

module.exports = daveplug;