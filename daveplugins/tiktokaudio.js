const fetch = require("node-fetch");

let daveplug = async (m, { dave, reply, text, fetchJson }) => {
    try {
        if (!text) {
            return reply('Provide a TikTok link for the audio');
        }
        
        if (!text.includes("tiktok.com")) {
            return reply('That is not a valid TikTok link');
        }

        const fetchTikTokData = async (url, retries = 3) => {
            for (let attempt = 0; attempt < retries; attempt++) {
                const data = await fetchJson(url);
                if (data && data.status === 200 && data.tiktok && data.tiktok.music) {
                    return data;
                }
            }
            throw new Error("Failed to fetch valid TikTok data after multiple attempts");
        };

        const url = `https://api.dreaded.site/api/tiktok?url=${text}`;
        const data = await fetchTikTokData(url);

        const tikAudioUrl = data.tiktok.music;

        await reply('TikTok audio data fetched successfully! Sending...');

        const response = await fetch(tikAudioUrl);

        if (!response.ok) {
            throw new Error(`Failed to download audio: HTTP ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        await dave.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: "tiktok_audio.mp3"
        }, { quoted: m });

    } catch (error) {
        console.error('TikTok audio error:', error.message);
        reply(`Error: ${error.message}`);
    }
};

daveplug.help = ['tiktokaudio <tiktok url>'];
daveplug.tags = ['downloader'];
daveplug.command = ['tiktokaudio', 'tta', 'tiktokmp3', 'tiktokmusic'];

module.exports = daveplug;