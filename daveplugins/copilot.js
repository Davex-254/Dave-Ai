const axios = require('axios');

let daveplug = async (m, { dave, reply, text }) => {
    try {
        if (!text) return reply('❌ Please provide a query!\nExample: .copilot explain quantum physics');
        
        const response = await axios.get(`https://api.nekolabs.my.id/ai/copilot?text=${encodeURIComponent(text)}`);
        
        if (response.data?.result?.text) {
            reply(response.data.result.text);
        } else {
            reply('❌ No response from AI service');
        }
    } catch (e) {
        console.error('Copilot error:', e);
        reply('❌ Error fetching AI response');
    }
};

daveplug.help = ['copilot <query> - Get AI response from Copilot'];
daveplug.tags = ['ai'];
daveplug.command = ['copilot', 'ai', 'ask'];

module.exports = daveplug;