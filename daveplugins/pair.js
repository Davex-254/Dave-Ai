const axios = require('axios');
const { sleep } = require('./library/lib/functions');

let daveplug = async (m, { dave, daveshown, reply, text }) => {
    if (!daveshown) return reply('❌ This command is only available for the owner!');

    if (!text) {
        return reply('Please provide valid WhatsApp number\nExample: .pair 254104260236');
    }

    const numbers = text.split(',')
        .map((v) => v.replace(/[^0-9]/g, ''))
        .filter((v) => v.length > 5 && v.length < 20);

    if (numbers.length === 0) {
        return reply('Invalid number 🤷Please use the correct format!\nExample: .pair 254104260236');
    }

    for (const number of numbers) {
        const whatsappID = number + '@s.whatsapp.net';
        const result = await dave.onWhatsApp(whatsappID);

        if (!result[0]?.exists) {
            return reply(`That number ${number} is not registered on WhatsApp❗️`);
        }

        await reply('Wait a moment for the code...');

        try {
            const response = await axios.get(`https://knight-bot-paircode.onrender.com/code?number=${number}`);
            
            if (response.data && response.data.code) {
                const code = response.data.code;
                if (code === "Service Unavailable") {
                    throw new Error('Service Unavailable');
                }
                
                await sleep(5000);
                await reply(`Your pairing code: ${code}`);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (apiError) {
            console.error('API Error:', apiError);
            const errorMessage = apiError.message === 'Service Unavailable' 
                ? "Service is currently unavailable. Please try again later."
                : "Failed to generate pairing code. Please try again later.";
            
            await reply(errorMessage);
        }
    }
};

daveplug.help = ['pair <number> - Get WhatsApp pairing code for a number'];
daveplug.tags = ['owner', 'tools'];
daveplug.command = ['pair', 'paircode', 'getcode'];

module.exports = daveplug;