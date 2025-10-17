const fetch = require('node-fetch');

let daveplug = async (m, { dave, reply, text }) => {
    if (!text) {
        return reply(`SCREENSHOT\n\n.ss <url>\n.ssweb <url>\n.screenshot <url>\n\nTake a screenshot of any website\n\nExample:\n.ss https://google.com\n.ssweb https://google.com\n.screenshot https://google.com`);
    }

    try {
        // Extract URL from command
        const url = text.trim();
        
        // Validate URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return reply('Please provide a valid URL starting with http:// or https://');
        }

        // Call the API
        const apiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&theme=light&device=desktop`;
        const response = await fetch(apiUrl, { headers: { 'accept': '*/*' } });
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        // Get the image buffer
        const imageBuffer = await response.buffer();

        // Send the screenshot
        await dave.sendMessage(m.chat, {
            image: imageBuffer,
        }, {
            quoted: m
        });

    } catch (error) {
        console.error('Error in ss command:', error);
        reply('Failed to take screenshot. Please try again in a few minutes.\n\nPossible reasons:\n• Invalid URL\n• Website is blocking screenshots\n• Website is down\n• API service is temporarily unavailable');
    }
};

daveplug.help = ['ss'];
daveplug.tags = ['tools'];
daveplug.command = ['ss', 'ssweb', 'screenshot'];

module.exports = daveplug; 