const axios = require('axios');

let daveplug = async (m, { command, xprefix, q, daveshown, reply, text, args }) => {
    if (!daveshown) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${xprefix + command} on/off`);

    let option = q.toLowerCase();
    const settings = global.settings

    if (option === 'on') {
        if (settings.autotyping.enabled) return reply('Autotyping is already enabled')
        settings.autotyping.enabled = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Autotyping has been turned on')
    } else if (option === 'off') {
        if (!settings.autotyping.enabled) return reply('Autotyping is already disabled')
        settings.autotyping.enabled = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Autotyping has been turned off')
    } else {
        reply(`Invalid option. Use ${xprefix + command} on/off`)
    }
};

daveplug.help = ['autotypes'];
daveplug.tags = ['autotyping'];
daveplug.command = ['autotype'];

module.exports = daveplug;