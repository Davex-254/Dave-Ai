const canvacord = require("canvacord");

let daveplug = async (m, { dave, q, reply }) => {
    let cap = `Converted By 𝘿𝙖𝙫𝙚𝘼𝙄`;
    
    try {
        let result;
        let img;

        if (m.quoted) {
            try {
                img = await dave.profilePictureUrl(m.quoted.sender, 'image');
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg";
            }
            result = await canvacord.Canvacord.trash(img);
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            try {
                img = await dave.profilePictureUrl(m.mentionedJid[0], 'image');
            } catch {
                img = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
            }
            result = await canvacord.Canvacord.trash(img);
        } else {
            try {
                img = await dave.profilePictureUrl(m.sender, 'image');
            } catch {
                img = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
            }
            result = await canvacord.Canvacord.trash(img);
        }

        await dave.sendMessage(m.chat, { image: result, caption: cap }, { quoted: m });

    } catch (e) {
        reply("Something wrong occurred.");
    }
};

daveplug.help = ['trash'];
daveplug.tags = ['fun'];
daveplug.command = ['trash'];

module.exports = daveplug;