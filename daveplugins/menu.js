const axios = require('axios');

let daveplug = async (m, { dave, replymenu, menu }) => {
    try {
        // Send image with menu as caption
        await dave.sendMessage(
            m.chat,
            {
                image: { url: global.menuImage || 'https://files.catbox.moe/cp8oat.jpg' },
                caption: ` ${menu}\n`,
                footer: `🎮 ${global.botname || '𝘿𝙖𝙫𝙚𝘼𝙄'} Menu`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error('Menu image error:', error);
        // Fallback to text-only menu if image fails
        replymenu(` ${menu}\n`);
    }
};

daveplug.help = ['menu'];
daveplug.tags = ['menu'];
daveplug.command = ['menu'];

module.exports = daveplug;