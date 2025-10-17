const fetch = require('node-fetch');

let daveplug = async (m, { dave, reply, text }) => {
    if (!text) {
        return reply('Please enter the song name to get the lyrics! Usage: lyrics <song name>');
    }

    try {
        const apiUrl = `https://api.giftedtech.web.id/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(text)}`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
            const errText = await res.text();
            throw errText;
        }

        const data = await res.json();

        const lyrics = data && data.result && data.result.lyrics ? data.result.lyrics : null;
        if (!lyrics) {
            return reply(`Sorry, I couldn't find any lyrics for "${text}".`);
        }

        const maxChars = 4096;
        const output = lyrics.length > maxChars ? lyrics.slice(0, maxChars - 3) + '...' : lyrics;

        await reply(output);

    } catch (error) {
        console.error('Error in lyrics command:', error);
        reply(`An error occurred while fetching the lyrics for "${text}".`);
    }
};

daveplug.help = ['lyrics'];
daveplug.tags = ['search'];
daveplug.command = ['lyrics', 'lyric'];

module.exports = daveplug;