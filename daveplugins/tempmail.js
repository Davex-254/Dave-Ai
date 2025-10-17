const axios = require('axios');

let daveplug = async (m, { dave, text, prefix, command, reply }) => {
    class TempMail {
        constructor() {
            this.cookie = null;
            this.baseUrl = 'https://tempmail.so';
        }

        async updateCookie(response) {
            if (response.headers['set-cookie']) {
                this.cookie = response.headers['set-cookie'].join('; ');
            }
        }

        async makeRequest(url) {
            const response = await axios({
                method: 'GET',
                url: url,
                headers: {
                    'accept': 'application/json',
                    'cookie': this.cookie || '',
                    'referer': this.baseUrl + '/',
                    'x-inbox-lifespan': '600',
                    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                    'sec-ch-ua-mobile': '?1'
                }
            });
            await this.updateCookie(response);
            return response;
        }

        async initialize() {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
                    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"'
                }
            });
            await this.updateCookie(response);
            return this;
        }

        async getInbox() {
            const url = `${this.baseUrl}/us/api/inbox?requestTime=${Date.now()}&lang=us`;
            const response = await this.makeRequest(url);
            return response.data;
        }

        async getMessage(messageId) {
            const url = `${this.baseUrl}/us/api/inbox/messagehtmlbody/${messageId}?requestTime=${Date.now()}&lang=us`;
            const response = await this.makeRequest(url);
            return response.data;
        }
    }

    try {
        const mail = new TempMail();
        await mail.initialize();

        const inbox = await mail.getInbox();
        if (!inbox.data?.name) throw new Error('Failed to get temporary email');

        await reply(`📨 Temporary Email\n\n*Email:* ${inbox.data.name}\n*Expires:* 10 minutes\nInbox Messages: ${inbox.data.inbox?.length || 0}\n\n> Email will expire in 10 minutes`);

        const state = { processedMessages: new Set(), isRunning: true };

        const processInbox = async () => {
            if (!state.isRunning) return;

            try {
                const updatedInbox = await mail.getInbox();
                if (updatedInbox.data?.inbox?.length > 0) {
                    const sortedMessages = [...updatedInbox.data.inbox].sort((a, b) => new Date(b.date) - new Date(a.date));
                    for (const message of sortedMessages) {
                        if (!state.processedMessages.has(message.id)) {
                            const messageDetail = await mail.getMessage(message.id);
                            const cleanContent = messageDetail.data?.html
                                ? messageDetail.data.html.replace(/<[^>]*>?/gm, '').trim()
                                : 'No text content';

                            const msgText = `📩 *New Email*\nFrom: ${message.from || 'Unknown'}\nSubject: ${message.subject || 'No Subject'}\n\nMessage:\n${cleanContent}`;
                            await dave.sendMessage(m.chat, { text: msgText }, { quoted: m });
                            state.processedMessages.add(message.id);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        await processInbox();
        const checkInterval = setInterval(processInbox, 10000);

        setTimeout(() => {
            state.isRunning = false;
            clearInterval(checkInterval);
            reply('⌛ Email session expired (10 minutes).');
        }, 600000);

    } catch (err) {
        reply(`❌ Error: ${err.message}`);
    }
};

daveplug.help = ['tempmail']
daveplug.tags = ['tempmail']
daveplug.command = ['tempmail']

module.exports = daveplug;