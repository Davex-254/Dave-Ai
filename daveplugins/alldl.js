let daveplug = async (m, { dave, reply, text, fetchJson }) => {
    try {
        if (!text) {
            return reply('Provide any link for download\nExample: FB, X, TikTok, CapCut etc');
        }

        const data = await fetchJson(`https://api.dreaded.site/api/alldl?url=${text}`);

        if (!data || data.status !== 200 || !data.data || !data.data.videoUrl) {
            return reply('API endpoint did not respond correctly. Try again later.');
        }

        const allvid = data.data.videoUrl;

        await dave.sendMessage(m.chat, {
            video: { url: allvid },
            caption: 'Downloaded by DaveAI',
            gifPlayback: false
        }, { quoted: m });

    } catch (error) {
        console.error('Alldl error:', error.message);
        reply('An error occurred. API might be down\n' + error.message);
    }
};

daveplug.help = ['alldl'];
daveplug.tags = ['downloader'];
daveplug.command = ['alldl', 'download video', 'getvideo', 'videodl', 'linkdl'];

module.exports = daveplug;