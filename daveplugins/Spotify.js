const axios = require('axios');

let daveplug = async (m, { dave, reply, text }) => {
    if (!text) {
        return reply('Usage: .spotify <song/artist/keywords>\n\nExample: .spotify con calma');
    }

    try {
        // Fetch from API
        const apiUrl = `https://okatsu-rolezapiiz.vercel.app/search/spotify?q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, {
            timeout: 20000,
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });

        // Check response
        if (!data?.status || !data?.result) {
            throw new Error('No valid result from Spotify API');
        }

        const r = data.result;
        const audioUrl = r.audio;
        if (!audioUrl) {
            return reply('No downloadable audio found for this query.');
        }

        // Format message caption
        const caption = [
            `Title: ${r.title || r.name || 'Unknown'}`,
            `Artist: ${r.artist || 'Unknown'}`,
            `Duration: ${r.duration || 'N/A'}`,
            `Link: ${r.url || 'N/A'}`
        ].join('\n');

        // Send cover art & info (if available)
        if (r.thumbnails) {
            await dave.sendMessage(m.chat, {
                image: { url: r.thumbnails },
                caption
            }, { quoted: m });
        } else {
            await dave.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        // Send audio
        await dave.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${(r.title || r.name || 'track').replace(/[\\/:*?"<>|]/g, '')}.mp3`
        }, { quoted: m });

    } catch (error) {
        console.error('Spotify error:', error?.message || error);
        reply('Failed to fetch Spotify audio. Please try again later or use a shorter query.');
    }
};

daveplug.help = ['spotify'];
daveplug.tags = ['download'];
daveplug.command = ['spotify', 'sp'];

module.exports = daveplug;