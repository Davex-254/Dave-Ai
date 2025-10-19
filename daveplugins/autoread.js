let daveplug = async (m, { dave, daveshown, args, reply }) => {
    try {
        if (!daveshown) {
            return reply('This command is only available for the owner!');
        }

        const mode = args[0]?.toLowerCase();

        if (!mode) {
            return reply('Usage: .autoread <on|off>');
        }

        if (!['on', 'off'].includes(mode)) {
            return reply('Invalid mode. Use: on or off');
        }

        global.AUTO_READ = mode === 'on';

        try {
            const settings = { AUTO_READ: global.AUTO_READ };
            require('fs').writeFileSync('./settings.js', `module.exports = ${JSON.stringify(settings, null, 2)};`);
        } catch (error) {
            console.error('Error saving settings:', error.message);
            return reply('Failed to save settings!');
        }

        reply(`Auto-read has been turned ${mode}`);
    } catch (error) {
        console.error('Autoread error:', error.message);
        reply('An error occurred while processing the command');
    }
};

daveplug.help = ['autoread <on|off>'];
daveplug.tags = ['owner'];
daveplug.command = ['autoread'];

module.exports = daveplug;