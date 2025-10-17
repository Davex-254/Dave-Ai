const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');


let daveplug = async (m, { dave, reply, text }) => {
    if (!text) return reply('Usage: *.song <song name or YouTube link>*');

    try {
        let video;

        // 🎯 If link provided, skip search
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
            video = { url: text };
        } else {
            const search = await yts(text);
            if (!search || !search.videos.length) return reply('❌ No results found.');
            video = search.videos[0];
        }

        // 📸 Send thumbnail + info
        await dave.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption: `🎧 *Title:* ${video.title}\n⏱ *Duration:* ${video.timestamp}\n📡 *Source:* YouTube`
        }, { quoted: m });

        // 🎶 Fetch download URL from Izumi API
        const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(video.url)}&format=mp3`;

        const res = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const result = res?.data?.result;
        if (!result || !result.download) throw new Error('No download link from Izumi API.');

        // 🎵 Send audio to chat
        await dave.sendMessage(m.chat, {
            audio: { url: result.download },
            mimetype: 'audio/mpeg',
            fileName: `${result.title || video.title}.mp3`,
            ptt: false
        }, { quoted: m });

    } catch (err) {
        console.error('❌ Song command error:', err);
        reply('Failed to download song. Try again later.');
    }
};

daveplug.help = ['song'];
daveplug.tags = ['downloader'];
daveplug.command = ['song', 'music'];

module.exports = daveplug;