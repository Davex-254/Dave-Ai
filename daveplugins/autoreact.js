const fs = require('fs');
const path = require('path');

let daveplug = async (m, { dave, daveshown, args, reply }) => {
    try {
        if (!daveshown) {
            return reply('This command is only available for the owner!');
        }

        const mode = args[0]?.toLowerCase();

        if (!mode) {
            return reply('Usage: .autoreact <on|off>');
        }

        if (!['on', 'off'].includes(mode)) {
            return reply('Invalid mode. Use: on or off');
        }

        global.AREACT = mode === 'on';

        try {
            const settingsPath = path.join(process.cwd(), 'settings.js');
            const settings = { AREACT: global.AREACT };
            fs.writeFileSync(settingsPath, `module.exports = ${JSON.stringify(settings, null, 2)};`);
        } catch (error) {
            console.error('Error saving settings:', error.message);
            return reply('Failed to save settings!');
        }

        reply(`Auto-react has been turned ${mode}`);
    } catch (error) {
        console.error('Autoreact error:', error.message);
        reply('An error occurred while processing the command');
    }
};

daveplug.help = ['autoreact <on|off>'];
daveplug.tags = ['owner'];
daveplug.command = ['autoreact'];

module.exports = daveplug;