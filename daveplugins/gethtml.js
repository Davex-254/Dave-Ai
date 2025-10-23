const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

let daveplug = async (m, { xprefix, dave, reply, command, text }) => {
    if (!text) return reply(`Example: ${xprefix + command} https://example.com`);

    try {
        const res = await fetch(text);
        if (!res.ok) return reply('Invalid URL or failed to fetch page.');

        const html = await res.text();
        const filePath = path.join(__dirname, '../library/lib/html_dump.html');
        fs.writeFileSync(filePath, html);

        await dave.sendMessage(m.chat, {
            document: fs.readFileSync(filePath),
            mimetype: 'text/html',
            fileName: 'results.html'
        }, { quoted: m });

        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(err);
        reply('An error occurred: ' + err.message);
    }
};

daveplug.help = ['getweb'];
daveplug.tags = ['web'];
daveplug.command = ['gethtml'];

module.exports = daveplug;