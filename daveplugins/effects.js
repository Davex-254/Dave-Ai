const axios = require("axios");

let daveplug = async (m, { dave, q, command, reply }) => {
    if (!q) return reply(`Example: .${command} text`);
    
    try {
        const cleanedText = q.trim().slice(0, 50).replace(/[^a-zA-Z0-9\s]/g, '');
        if (cleanedText.length < 3) {
            return reply(`What's this weak-ass text? At least 3 characters, you dumbass!`);
        }

        const encodedText = encodeURIComponent(cleanedText);
        let apiUrl = '';
        
        // Map commands to their respective API endpoints
        const apiMap = {
            'galaxystyle': 'https://api.giftedtech.web.id/api/ephoto360/galaxystyle?apikey=gifted&text=',
            'advancedglow': 'https://api.giftedtech.co.ke/api/ephoto360/advancedglow?apikey=gifted&text=',
            'blackpinklogo': 'https://api.giftedtech.web.id/api/ephoto360/blackpinklogo?apikey=gifted&text=',
            'effectclouds': 'https://api.giftedtech.web.id/api/ephoto360/effectclouds?apikey=gifted&text=',
            'glitchtext': 'https://api.giftedtech.web.id/api/ephoto360/glitchtext?apikey=gifted&text=',
            'glossysilver': 'https://api.giftedtech.web.id/api/ephoto360/glossysilver?apikey=gifted&text=',
            'lighteffect': 'https://api.giftedtech.web.id/api/ephoto360/lighteffect?apikey=gifted&text=',
            'sandsummer': 'https://api.giftedtech.web.id/api/ephoto360/sandsummer?apikey=gifted&text=',
            'underwater': 'https://api.giftedtech.web.id/api/ephoto360/underwater?apikey=gifted&text=',
            'writetext': 'https://api.giftedtech.web.id/api/ephoto360/writetext?apikey=gifted&text='
        };

        apiUrl = apiMap[command] + encodedText;
        
        if (!apiUrl) {
            return reply(`Invalid command: ${command}`);
        }

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data && data.success && data.result && data.result.image_url) {
            const styleName = command.charAt(0).toUpperCase() + command.slice(1);
            
            await dave.sendMessage(m.chat, { 
                image: { url: data.result.image_url }, 
                caption: `Success: ${styleName}\nText: ${cleanedText}`
            }, { quoted: m });
        } else {
            reply(`API error: No image generated`);
        }
    } catch (error) {
        console.log(error);
        reply(`Error: ${error.message}`);
    }
};

daveplug.help = [
    'galaxystyle', 'advancedglow', 'blackpinklogo', 'effectclouds', 
    'glitchtext', 'glossysilver', 'lighteffect', 'sandsummer', 
    'underwater', 'writetext'
];
daveplug.tags = ['logo'];
daveplug.command = [
    'galaxystyle', 'advancedglow', 'blackpinklogo', 'effectclouds', 
    'glitchtext', 'glossysilver', 'lighteffect', 'sandsummer', 
    'underwater', 'writetext'
];

module.exports = daveplug;