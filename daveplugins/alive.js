let daveplug = async (m, { dave, reply }) => {
    try {
        const uptimeSeconds = process.uptime();
        const days = Math.floor(uptimeSeconds / (3600 * 24));
        const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const message = `DaveAI Status\n\nUptime: ${timeString}\nStatus: Online`;

        await dave.sendMessage(m.chat, {
            text: message,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    showAdAttribution: true,
                    title: `DaveAI Status`,
                    body: `Check DaveAI's uptime`,
                    sourceUrl: "https://github.com/gifteddevsmd/Dave-Ai",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailUrl: "https://files.catbox.moe/zaqn1j.jpg",
                },
            },
        }, { quoted: m });

    } catch (error) {
        console.error('Alive error:', error.message);
        reply('Failed to check status');
    }
};

daveplug.help = ['alive', 'uptime', 'runtime'];
daveplug.tags = ['info'];
daveplug.command = ['alive', 'uptime', 'runtime'];

module.exports = daveplug;