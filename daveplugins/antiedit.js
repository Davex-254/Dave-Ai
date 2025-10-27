
const fs = require('fs');
const path = './library/database/antiedit.json';

// Load saved state or default to "off"
let antieditState = 'off';
if (fs.existsSync(path)) {
  try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    antieditState = data.antiedit || 'off';
  } catch (err) {
    console.error('Failed to parse antiedit.json:', err.message);
  }
}
global.antiedit = antieditState;

let daveplug = async (m, { daveshown, args, reply }) => {
  // Only owner can toggle
  if (!daveshown) return reply('❌ *Owner only command.*');

  const mode = args[0]?.toLowerCase();
  if (!mode || !['on', 'off', 'private'].includes(mode)) {
    return reply(
      '*📝 𝘿𝙖𝙫𝙚𝘼𝙄 ANTIEDIT USAGE*\n\n' +
      '`.antiedit on` — Enable in all chats\n' +
      '`.antiedit private` — Send edit alerts only to bot owner\n' +
      '`.antiedit off` — Disable the feature'
    );
  }

  // Update global and save to file
  global.antiedit = mode;
  try {
    fs.writeFileSync(path, JSON.stringify({ antiedit: mode }, null, 2));
  } catch (err) {
    console.error('Error saving antiedit state:', err.message);
  }

  // Feedback message
  if (mode === 'on')
    return reply('✅ *𝘿𝙖𝙫𝙚𝘼𝙄 Antiedit enabled in all chats.*');
  if (mode === 'private')
    return reply('✅ *𝘿𝙖𝙫𝙚𝘼𝙄 Antiedit enabled — alerts will be sent privately.*');
  return reply('❌ *𝘿𝙖𝙫𝙚𝘼𝙄 Antiedit disabled.*');
};

daveplug.help = ['antiedit'];
daveplug.tags = ['owner', 'security'];
daveplug.command = ['antiedit'];

module.exports = daveplug;