const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs').promises;
const path = require('path');
const { queue } = require('async');

const commandQueue = queue(async (task, callback) => {
    try {
        await task.run(task.context);
    } catch (error) {
        console.error(`WatermarkSticker error: ${error.message}`);
    }
    callback();
}, 1);

let daveplug = async (m, { dave, daveshown, reply }) => {
    if (!daveshown) return reply(mess.owner);

    commandQueue.push({
        context: { dave, m, reply },
        run: async ({ dave, m, reply }) => {
            try {
                if (!m.quoted) {
                    return reply("Quote an image, a short video, or a sticker to change watermark.");
                }

                const mime = m.quoted.mimetype || '';
                if (!/image|video|image\/webp/.test(mime)) {
                    return reply("This is neither a sticker, image, nor a short video!");
                }

                if (m.quoted.videoMessage && m.quoted.videoMessage.seconds > 30) {
                    return reply("Videos must be 30 seconds or shorter.");
                }

                const tempFile = path.join(__dirname, `temp-watermark-${Date.now()}.${/image\/webp/.test(mime) ? 'webp' : /image/.test(mime) ? 'jpg' : 'mp4'}`);
                await reply("A moment, creating the sticker...");

                const media = await m.quoted.download();
                await fs.writeFile(tempFile, media);

                const stickerResult = new Sticker(media, {
                    pack: '𝘿𝙖𝙫𝙚𝘼𝙄',
                    author: 'dave',
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    id: '12345',
                    quality: 50,
                    background: 'transparent'
                });

                const buffer = await stickerResult.toBuffer();
                await dave.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

                await fs.unlink(tempFile).catch(() => console.warn('Failed to delete temp file'));
            } catch (error) {
                console.error(`WatermarkSticker error: ${error.message}`);
                reply("An error occurred while creating the sticker. Please try again.");
            }
        }
    });
};

daveplug.help = ['take'];
daveplug.tags = ['sticker'];
daveplug.command = ['take,wm'];

module.exports = daveplug;