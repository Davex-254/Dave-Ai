const fs = require('fs');
const path = require('path');

let daveplug = async (m, { dave, daveshown, reply, text }) => {
    try {
        if (!daveshown) return reply("Owner only command!");
        if (!text) return reply("Usage: cat <filename>\n\nExample: cat package.json");

        const filePath = path.resolve(text.trim());

        // Add processing reaction
        await dave.sendMessage(m.chat, {
            react: { text: '...', key: m.key }
        });

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return reply(`File not found: ${text}`);
        }

        // Read file contents
        const data = fs.readFileSync(filePath, 'utf8');

        // Prevent sending overly large files
        if (data.length > 4096) {
            // If too large, send as a document
            await dave.sendMessage(m.chat, {
                document: fs.readFileSync(filePath),
                fileName: path.basename(filePath),
                mimetype: 'text/plain'
            });
        } else {
            // Otherwise send as text
            await reply(`${path.basename(filePath)}:\n\n${data}`);
        }

        // Add success reaction
        await dave.sendMessage(m.chat, {
            react: { text: '✓', key: m.key }
        });

    } catch (err) {
        console.error('Cat Command Error:', err);
        
        // Add error reaction
        await dave.sendMessage(m.chat, {
            react: { text: '✗', key: m.key }
        });
        
        await reply(`Error reading file: ${err.message}`);
    }
};

daveplug.help = ['cat'];
daveplug.tags = ['system'];
daveplug.command = ['cat', 'read'];

module.exports = daveplug;