const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

let daveplug = async (m, { dave, daveshown, reply }) => {
    if (!daveshown) return reply('❌ This command is only available for the owner!');

    // Check if message is a reply
    if (!m.quoted) return reply('⚠️ Please reply to an image with the .setpp command!');

    // Check if quoted message contains an image
    const quotedMessage = m.quoted.message;
    const imageMessage = quotedMessage?.imageMessage || quotedMessage?.stickerMessage;
    if (!imageMessage) return reply('❌ The replied message must contain an image!');

    try {
        // Create tmp directory if it doesn't exist
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        // Download the image
        const stream = await downloadContentFromMessage(imageMessage, 'image');
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const imagePath = path.join(tmpDir, `profile_${Date.now()}.jpg`);
        
        // Save the image
        fs.writeFileSync(imagePath, buffer);

        // Set the profile picture
        await dave.updateProfilePicture(dave.user.id, { url: imagePath });

        // Clean up the temporary file
        fs.unlinkSync(imagePath);

        reply('✅ Successfully updated bot profile picture!');

    } catch (error) {
        console.error('Error in setpp command:', error);
        reply('❌ Failed to update profile picture!');
    }
};

daveplug.help = ['setpp (reply to image) - Set bot profile picture'];
daveplug.tags = ['owner', 'profile'];
daveplug.command = ['setpp', 'setprofilepic', 'setppbot'];

module.exports = daveplug;