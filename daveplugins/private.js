const axios = require("axios");

let daveplug = async (m, { daveshown, reply, dave }) => {
    if (!daveshown) return reply(mess.owner);

    const settings = global.settings;
    settings.public = false;
    global.saveSettings(settings);
    global.settings = settings;

    reply('Successfully changed to Self Usage mode.');
};

daveplug.help = ['self'];
daveplug.tags = ['private'];
daveplug.command = ['private'];

module.exports = daveplug;