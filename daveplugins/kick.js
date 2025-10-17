const axios = require('axios');

let daveplug = async (m, { daveshown, text, dave, reply, isBotAdmins, isAdmins, prefix, command, args }) => {
  if (!m.isGroup) return reply("This command only works in groups.");
  if (!isBotAdmins) return reply("I need admin rights to remove someone.");
  if (!daveshown && !isAdmins) return reply("Only group admins can use this command.");

  // Identify target user
  if (!m.quoted && !m.mentionedJid[0] && !args[0]) {
    return reply(`Example: ${prefix + command} @user or reply to a message.`);
  }

  let target = m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.quoted
    ? m.quoted.sender
    : `${text.replace(/[^0-9]/g, '')}@s.whatsapp.net`;

  // Prevent kicking owner
  if (global.owner && global.owner.includes(target.replace('@s.whatsapp.net', ''))) {
    return reply("You can't remove the bot owner.");
  }

  try {
    await dave.groupParticipantsUpdate(m.chat, [target], 'remove');
    reply(`User removed successfully.`);
  } catch (err) {
    console.error(err);
    reply("Failed to remove user. Check bot permissions.");
  }
};

daveplug.help = ['kick', 'remove'];
daveplug.tags = ['group'];
daveplug.command = ['kick', 'remove'];

module.exports = daveplug;