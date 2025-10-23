const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function downloadMediaMessage(message, mediaType) {
    const stream = await downloadContentFromMessage(message, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const filePath = path.join(process.cwd(), 'temp', `${Date.now()}.${mediaType}`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

let daveplug = async (m, { dave, daveshown, isBotAdmins, isAdmins, reply, quoted, text, prefix, command }) => {
  if (!m.isGroup) return reply("This command only works in groups.");
  if (!isBotAdmins) return reply("I need admin rights to tag members.");
  if (!daveshown && !isAdmins) return reply("Only group admins can use this command.");

  try {
    // Add processing reaction
    await dave.sendMessage(m.chat, {
      react: { text: '...', key: m.key }
    });

    const groupMetadata = await dave.groupMetadata(m.chat);
    const participants = groupMetadata.participants;
    
    // Get only admin participants
    const adminParticipants = participants.filter(p => p.admin).map(p => p.id);

    if (adminParticipants.length === 0) {
      await reply("No admins found in this group.");
      return;
    }

    if (quoted) {
      let messageContent = {};

      // Handle image messages
      if (quoted.message?.imageMessage) {
        const filePath = await downloadMediaMessage(quoted.message.imageMessage, 'image');
        messageContent = {
          image: { url: filePath },
          caption: text || quoted.message.imageMessage.caption || '',
          mentions: adminParticipants
        };
      }
      // Handle video messages
      else if (quoted.message?.videoMessage) {
        const filePath = await downloadMediaMessage(quoted.message.videoMessage, 'video');
        messageContent = {
          video: { url: filePath },
          caption: text || quoted.message.videoMessage.caption || '',
          mentions: adminParticipants
        };
      }
      // Handle text messages
      else if (quoted.message?.conversation || quoted.message?.extendedTextMessage) {
        messageContent = {
          text: quoted.message.conversation || quoted.message.extendedTextMessage.text,
          mentions: adminParticipants
        };
      }
      // Handle document messages
      else if (quoted.message?.documentMessage) {
        const filePath = await downloadMediaMessage(quoted.message.documentMessage, 'document');
        messageContent = {
          document: { url: filePath },
          fileName: quoted.message.documentMessage.fileName,
          caption: text || '',
          mentions: adminParticipants
        };
      }

      if (Object.keys(messageContent).length > 0) {
        await dave.sendMessage(m.chat, messageContent);
      } else {
        await reply("Unsupported message type for tagging.");
        return;
      }
    } else {
      // Tag admins only with custom text
      await dave.sendMessage(m.chat, {
        text: text || "Hey admins!",
        mentions: adminParticipants
      });
    }

    // Add success reaction
    await dave.sendMessage(m.chat, {
      react: { text: '✓', key: m.key }
    });

  } catch (err) {
    console.error('Tag Command Error:', err);
    
    // Add error reaction
    await dave.sendMessage(m.chat, {
      react: { text: '✗', key: m.key }
    });
    
    await reply("Failed to tag admins. Please try again.");
  }
};

daveplug.help = ['tag', 'tagadmin', 'hey'];
daveplug.tags = ['group'];
daveplug.command = ['tag', 'tagadmin', 'hey'];

module.exports = daveplug;