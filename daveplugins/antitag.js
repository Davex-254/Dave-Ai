const { setAntitag, getAntitag, removeAntitag } = require('../lib/index');

let daveplug = async (m, { dave, daveshown, isAdmins, reply, text, xprefix }) => {
    try {
        if (!m.isGroup) return reply("This command only works in groups.");
        if (!daveshown && !isAdmins) return reply("Only group admins can use this command.");

        const args = text ? text.trim().split(' ') : [];
        const action = args[0];

        if (!action) {
            return await reply(
`🛡️ ANTITAG SETUP

${xprefix}antitag on
${xprefix}antitag off
${xprefix}antitag set delete | kick
${xprefix}antitag get`
            );
        }

        await dave.sendMessage(m.chat, { react: { text: '.', key: m.key } });

        switch (action) {
            case 'on':
                const existingConfig = await getAntitag(m.chat, 'on');
                if (existingConfig?.enabled) return reply("Antitag is already ON.");
                const result = await setAntitag(m.chat, 'on', 'delete');
                await reply(result ? "Antitag has been turned ON." : "Failed to enable Antitag.");
                break;

            case 'off':
                await removeAntitag(m.chat, 'on');
                await reply("Antitag has been turned OFF.");
                break;

            case 'set':
                if (args.length < 2) return reply(`Usage: ${xprefix}antitag set delete | kick`);
                const setAction = args[1].toLowerCase();
                if (!['delete', 'kick'].includes(setAction)) return reply("Invalid action. Choose delete or kick.");
                const setResult = await setAntitag(m.chat, 'on', setAction);
                await reply(setResult ? `Antitag action set to "${setAction}".` : "Failed to set Antitag action.");
                break;

            case 'get':
                const status = await getAntitag(m.chat, 'on');
                if (!status) return reply("Antitag is OFF.");
                await reply(`Antitag Configuration:\nStatus: ON\nAction: ${status.action || 'delete'}`);
                break;

            default:
                await reply(`Usage: ${xprefix}antitag on | off | set | get`);
        }

        await dave.sendMessage(m.chat, { react: { text: '✓', key: m.key } });

    } catch (error) {
        console.error('Antitag Command Error:', error);
        await dave.sendMessage(m.chat, { react: { text: '✗', key: m.key } });
        await reply("Error processing Antitag command.");
    }
};

daveplug.help = ['antitag'];
daveplug.tags = ['group'];
daveplug.command = ['antitag'];

module.exports = daveplug;