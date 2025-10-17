const axios = require('axios');
const cheerio = require('cheerio');

let daveplug = async (m, { daveshown, text, reply, prefix, command }) => {
    if (!text) return reply(`⚠️ Format invalid!\nExample: ${prefix + command} Giddy Tennor`);

    try {
        const res = await axios.get(`https://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(text)}`);
        const $ = cheerio.load(res.data);
        const hasil = [];

        $('table > tbody > tr').each((i, el) => {
            const style = $(el).find('td').eq(0).text().trim();
            const txt = $(el).find('td').eq(1).text().trim();
            if (style && txt) hasil.push(`*${style}:*\n${txt}`);
        });

        if (hasil.length === 0) return reply('❌ No results found for that text.');

        const teks = `✨ *Here is your fancy text:* ${text}\n\n` + hasil.join('\n\n');
        reply(teks);
    } catch (err) {
        console.error(err);
        reply('❌ An error occurred while fetching fancy text.');
    }
};

daveplug.help = ['fancy <text>'];
daveplug.tags = ['ctext'];
daveplug.command = ['fancy', 'fancytext'];

module.exports = daveplug;