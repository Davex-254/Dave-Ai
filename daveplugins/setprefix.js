const fs = require('fs');
const path = require('path');

let daveplug = async (m, { dave, daveshown, reply, text }) => {
    try {
        if (!daveshown) return reply("Owner only command!");
        if (!text) return reply("Please provide a prefix!\nExample: setprefix .\nOr use 'none' to remove the prefix");

        // Add processing reaction
        await dave.sendMessage(m.chat, {
            react: { text: '...', key: m.key }
        });

        let newPrefix = text.toLowerCase().trim();
        if (newPrefix === 'none') newPrefix = '';

        // Correct path to prefix settings
        const prefixSettingsPath = path.join(__dirname, '../library/database/prefixSettings.json');

        // Create database directory if it doesn't exist
        const databaseDir = path.dirname(prefixSettingsPath);
        if (!fs.existsSync(databaseDir)) {
            fs.mkdirSync(databaseDir, { recursive: true });
        }

        // Save the new prefix
        const prefixSettings = { prefix: newPrefix };
        fs.writeFileSync(prefixSettingsPath, JSON.stringify(prefixSettings, null, 2));

        // Update global variable immediately
        global.xprefix = newPrefix;

        // Add success reaction
        await dave.sendMessage(m.chat, {
            react: { text: '✓', key: m.key }
        });

        await reply(`Prefix successfully set to: ${newPrefix === '' ? 'none (no prefix required)' : newPrefix}`);

    } catch (err) {
        console.error('Set Prefix Command Error:', err);

        // Add error reaction
        await dave.sendMessage(m.chat, {
            react: { text: '✗', key: m.key }
        });

        await reply('Failed to set prefix!');
    }
};

daveplug.help = ['setprefix'];
daveplug.tags = ['system'];
daveplug.command = ['setprefix'];

module.exports = daveplug;