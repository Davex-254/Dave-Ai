
const emojis = [
  '💜','💝','💖','💗','💓','💞','💕','💟','❣️','💔',
  '❤️','🧡','💛','💚','💙','🤎','🖤','🤍','❤️‍🔥','🩹',
  '💯','🔰','⭕️','✅','❌','〽️','💐'
];

/**
 * Send a reaction to a message
 * @param {import('@whiskeysockets/baileys').WAMessage} mek - The message to react to
 * @param {import('@whiskeysockets/baileys').MakeWASocket} dave - Your bot instance
 * @param {string} emoji - Emoji to react with
 */
async function doReact(emoji, mek, dave) {
  try {
    const react = {
      react: {
        text: emoji,
        key: mek.key,
      },
    };
    await dave.sendMessage(mek.key.remoteJid, react);
  } catch (error) {
    console.error('Error sending auto reaction:', error);
  }
}

module.exports = { emojis, doReact };
