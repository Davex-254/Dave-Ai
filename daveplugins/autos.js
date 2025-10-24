let daveplug = async (m, { dave, daveshown, args, command, reply }) => {
  try {
    if (!daveshown) return reply('Only the owner can use this command.');

    let feature, mode;

    // Determine feature & mode based on command & args
    if (command === 'autostatusreact' || command === 'autoreactstatus') {
      feature = 'react';
      mode = args[0]?.toLowerCase();
    } else if (command === 'autostatusview' || command === 'autosview') {
      feature = 'view';
      mode = args[0]?.toLowerCase();
    } else if (command === 'autostatus') {
      feature = args[0]?.toLowerCase();
      mode = args[1]?.toLowerCase();
    } else {
      return reply('Unknown command');
    }

    if (!feature || !mode)
      return reply('Usage:\n.autostatus <view|react> <on|off>\n.autoreactstatus <on|off>\n.autostatusreact <on|off>\n.autostatusview <on|off>');

    if (!['view', 'react'].includes(feature))
      return reply('Invalid feature. Use: view or react');

    if (!['on', 'off'].includes(mode))
      return reply('Invalid mode. Use: on or off');

    const state = mode === 'on';

    // Initialize globals if not defined
    if (typeof global.AUTOVIEWSTATUS === 'undefined') global.AUTOVIEWSTATUS = false;
    if (typeof global.AUTOREACTSTATUS === 'undefined') global.AUTOREACTSTATUS = false;

    // Apply changes
    if (feature === 'view') global.AUTOVIEWSTATUS = state;
    if (feature === 'react') global.AUTOREACTSTATUS = state;

    reply(
      `Auto-status updated:\n` +
      `View status: ${global.AUTOVIEWSTATUS ? 'ON' : 'OFF'}\n` +
      `React status: ${global.AUTOREACTSTATUS ? 'ON' : 'OFF'}`
    );

    console.log(`AUTOVIEWSTATUS: ${global.AUTOVIEWSTATUS}, AUTOREACTSTATUS: ${global.AUTOREACTSTATUS}`);
  } catch (err) {
    console.error('Autostatus error:', err);
    reply('An error occurred while processing the command.');
  }
};

daveplug.help = [
  'autostatus <view|react> <on|off>',
  'autostatusreact <on|off>',
  'autoreactstatus <on|off>',
  'autostatusview <on|off>'
];
daveplug.tags = ['owner'];
daveplug.command = [
  'autostatus',
  'autostatusreact',
  'autoreactstatus',
  'autostatusview',
  'autosview'
];

module.exports = daveplug;