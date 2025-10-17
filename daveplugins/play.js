const yts = require('yt-search');
const axios = require('axios');

let daveplug = async (m, { dave, reply, text }) => {
    if (!text) {
        return reply('Specify the song you want to download!');
    }

    try {
        // Search for the song
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return reply('No songs found!');
        }

        // Send loading message
        await reply('Please wait your download is in progress');

        // Get the first video result
        const video = videos[0];
        const urlYt = video.url;

        // Fetch audio data from API
        const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
        const data = response.data;

        if (!data || !data.status || !data.result || !data.result.downloadUrl) {
            return reply('Failed to fetch audio from the API. Please try again later.');
        }

        const audioUrl = data.result.downloadUrl;
        const title = data.result.title;

        // Send as document instead of voice note
        await dave.sendMessage(m.chat, {
            document: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            caption: title
        }, { quoted: m });

    } catch (error) {
        console.error('Error in play command:', error);
        reply('Download failed. Please try again later.');
    }
};

daveplug.help = ['play'];
daveplug.tags = ['download'];
daveplug.command = ['play', 'ytmusic'];

module.exports = daveplug;