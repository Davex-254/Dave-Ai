const fs = require("fs");
const path = require("path");
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

let daveplug = async (m, { dave, daveshown, reply }) => {
  if (!daveshown) return reply('You are not authorized to use this command!');

  try {
    const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
                            m.message?.imageMessage ||
                            m.message?.videoMessage;

    if (!m.quoted) return reply('Please reply to a view once message!');

    const isViewOnceImage = quotedMessage.imageMessage?.viewOnce === true || quotedMessage.viewOnceMessage?.message?.imageMessage;
    const isViewOnceVideo = quotedMessage.videoMessage?.viewOnce === true || quotedMessage.viewOnceMessage?.message?.videoMessage;

    let mediaMessage;
    if (isViewOnceImage) {
      mediaMessage = quotedMessage.imageMessage || quotedMessage.viewOnceMessage?.message?.imageMessage;
    } else if (isViewOnceVideo) {
      mediaMessage = quotedMessage.videoMessage || quotedMessage.viewOnceMessage?.message?.videoMessage;
    }

    if (!mediaMessage) return reply('Could not detect view once message!');

    if (isViewOnceImage) {
      const stream = await downloadContentFromMessage(mediaMessage, 'image');
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      const caption = mediaMessage.caption || '';
      await dave.sendMessage(m.chat, { 
        image: buffer, 
        caption: `Retrieved by DaveAI\n\nViewOnce: Image${caption ? `\nCaption: ${caption}` : ''}` 
      }, { quoted: m });
      return;
    }

    if (isViewOnceVideo) {
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

      const tempFile = path.join(tempDir, `temp_${Date.now()}.mp4`);
      const stream = await downloadContentFromMessage(mediaMessage, 'video');
      const writeStream = fs.createWriteStream(tempFile);
      for await (const chunk of stream) writeStream.write(chunk);
      writeStream.end();
      await new Promise((resolve) => writeStream.on('finish', resolve));

      const caption = mediaMessage.caption || '';
      await dave.sendMessage(m.chat, { 
        video: fs.readFileSync(tempFile), 
        caption: `Retrieved by DaveAI\n\nViewOnce: Video${caption ? `\nCaption: ${caption}` : ''}` 
      }, { quoted: m });

      fs.unlinkSync(tempFile);
      return;
    }
  } catch (e) {
    reply('Failed to process view once message: ' + (e?.message || e.toString()));
  }
};

daveplug.help = ['vv'];
daveplug.tags = ['tools'];
daveplug.command = ['vv'];

module.exports = daveplug;