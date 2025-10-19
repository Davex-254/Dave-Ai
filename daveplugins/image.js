const axios = require("axios");

let daveplug = async (m, { dave, reply, text }) => {
    try {
        if (!text) {
            return reply('Usage: .image <search query>\nExample: .image cute cat');
        }

        await reply(`Searching for: ${text}`);

        const apiUrl = `https://api.giftedtech.co.ke/api/search/googleimage?apikey=gifted&query=${encodeURIComponent(text)}`;
        const resp = await axios.get(apiUrl, { timeout: 15000 });

        if (!resp.data || !resp.data.results || !Array.isArray(resp.data.results) || resp.data.results.length === 0) {
            return reply('No images found. Try another search.');
        }

        const allImages = resp.data.results;
        const MAX_SEND = 5;
        const imagesToSend = allImages.slice(0, MAX_SEND);

        await reply(`Found ${allImages.length} images - sending ${imagesToSend.length}`);

        let sentCount = 0;
        for (const imgUrl of imagesToSend) {
            try {
                await dave.sendMessage(
                    m.chat,
                    {
                        image: { url: imgUrl },
                        caption: `Search: ${text}\nImage ${sentCount + 1}/${imagesToSend.length}`
                    },
                    { quoted: m }
                );
                sentCount++;
            } catch (e) {
                console.warn(`Failed to send image:`, e.message);
            }
        }

        if (sentCount === 0) {
            await reply('Failed to send any images. Try again later.');
        } else {
            await reply(`Sent ${sentCount} image(s)`);
        }

    } catch (error) {
        console.error('Image search error:', error.message);
        reply('An error occurred while searching for images');
    }
};

daveplug.help = ['image'];
daveplug.tags = ['search'];
daveplug.command = ['image', 'img'];

module.exports = daveplug;