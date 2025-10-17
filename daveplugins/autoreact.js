const daveplug = async (m, { dave, daveshown, reply, text }) => {
    if (!daveshown) return reply('Only the owner can use this command.');

    const args = text.trim().split(' ')[0];
    if (!args || !["on", "off"].includes(args)) {
        return reply('USE: *areact on* OR *areact off*');
    }

    // Use the same variable name as your auto-react handler
    if (!global.areact) global.areact = {};

    // Toggle per chat
    if (args === "on") {
        global.areact[m.chat] = true;
        return reply('Auto React enabled in this chat.');
    } else {
        global.areact[m.chat] = false;
        return reply('Auto React disabled in this chat.');
    }
};

daveplug.command = ['areact'];
daveplug.tags = ['fun', 'automation'];
daveplug.help = ['areact on/off'];

module.exports = daveplug;