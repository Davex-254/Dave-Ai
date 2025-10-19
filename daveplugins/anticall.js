const fs = require('fs');

let daveplug = async (m, { dave, daveshown, args, reply }) => {
    try {
        if (!daveshown) return reply('Only the owner can use this command!');

        const mode = args[0]?.toLowerCase();
        if (!mode || !['on', 'off'].includes(mode)) {
            return reply('Usage: .anticall <on|off>');
        }

        global.anticall = mode === 'on';

        // Persist to .env file for next restart
        try {
            let envData = fs.readFileSync('.env', 'utf8');
            if (/ANTI_CALL=.*/.test(envData)) {
                envData = envData.replace(/ANTI_CALL=.*/, `ANTI_CALL=${global.anticall}`);
            } else {
                envData += `\nANTI_CALL=${global.anticall}`;
            }
            fs.writeFileSync('.env', envData);
        } catch (err) {
            console.error('Failed to write .env:', err.message);
        }

        reply(`Anti-call feature has been turned *${mode.toUpperCase()}*`);
    } catch (error) {
        console.error('anticall error:', error.message);
        reply('An error occurred while updating anticall mode.');
    }
};

daveplug.help = ['anticall <on|off>'];
daveplug.tags = ['owner'];
daveplug.command = ['anticall'];

module.exports = daveplug;