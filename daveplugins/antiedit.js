// antiedit.js
const processedEdits = new Map();
const EDIT_COOLDOWN = 5000; // 5 seconds cooldown

let daveplug = {
    onMessageUpdate: async (messageUpdates, { dave, store }) => {
        try {
            // Check if antiedit is enabled (you'll need to implement this based on your settings)
            const currentAntiedit = global.antiedit || 'off';
            if (currentAntiedit === 'off') return;

            const now = Date.now();

            for (const update of messageUpdates) {
                const { key, update: updateData } = update;
                if (!key?.id || !updateData.message) continue;

                const editId = `${key.id}-${key.remoteJid}`;

                // Skip if recently processed
                if (processedEdits.has(editId)) {
                    const [timestamp] = processedEdits.get(editId);
                    if (now - timestamp < EDIT_COOLDOWN) continue;
                }

                const chat = key.remoteJid;
                const isGroup = chat.endsWith('@g.us');

                // Handle both edit structures
                const editedMsg = updateData.message?.editedMessage?.message 
                               || updateData.message?.protocolMessage?.editedMessage?.message 
                               || updateData.message?.editedMessage;
                if (!editedMsg) continue;

                const originalMsg = await store.loadMessage(chat, key.id) || {};
                const sender = key.participant || key.remoteJid;
                const senderName = await dave.getName(sender);

                const getContent = (msg) => {
                    if (!msg) return '[Deleted]';
                    const type = Object.keys(msg)[0];
                    const content = msg[type];

                    switch (type) {
                        case 'conversation':
                            return content;
                        case 'extendedTextMessage':
                            return content.text + (content.contextInfo?.quotedMessage ? ' (with quoted message)' : '');
                        case 'imageMessage':
                            return `Image: ${content.caption || 'No caption'}`;
                        case 'videoMessage':
                            return `Video: ${content.caption || 'No caption'}`;
                        case 'documentMessage':
                            return `Document: ${content.fileName || 'No filename'}`;
                        default:
                            return `[${type.replace('Message', '')}]`;
                    }
                };

                const originalContent = getContent(originalMsg.message);
                const editedContent = getContent(editedMsg);

                if (originalContent === editedContent) {
                    console.log(`[ANTIEDIT] No content change detected for ${editId}`);
                    continue;
                }

                const notificationMessage =
                    `DaveAI ANTIEDIT ALERT\n\n` +
                    `Sender: @${sender.split('@')[0]}\n` +
                    `Original: ${originalContent}\n` +
                    `Edited: ${editedContent}\n` +
                    `Chat: ${isGroup ? 'Group' : 'Private'}`;

                const sendTo = currentAntiedit === 'private' ? dave.user.id : chat;

                await dave.sendMessage(sendTo, {
                    text: notificationMessage,
                    mentions: [sender]
                });

                processedEdits.set(editId, [now, originalContent, editedContent]);
                console.log(`[ANTIEDIT] Reported edit from ${senderName}`);
            }

            // Cleanup old entries
            for (const [id, data] of processedEdits) {
                if (now - data[0] > 60000) processedEdits.delete(id);
            }
        } catch (err) {
            console.error('[ANTIEDIT ERROR]', err);
        }
    }
};

// Command to toggle antiedit
daveplug.commands = {
    antiedit: async (m, { dave, reply, text }) => {
        if (!global.daveshown) return reply('This command is for owner only');

        const args = text?.trim().toLowerCase();
        
        if (!args || !['on', 'off', 'private'].includes(args)) {
            return reply('Usage: .antiedit <on|off|private>\n\non - Enable in chats\nprivate - Send alerts to bot owner\noff - Disable');
        }

        global.antiedit = args;
        
        if (args === 'on') {
            reply('Antiedit enabled in all chats');
        } else if (args === 'private') {
            reply('Antiedit enabled - alerts will be sent privately to bot owner');
        } else {
            reply('Antiedit disabled');
        }
    }
};

daveplug.help = ['antiedit'];
daveplug.tags = ['security'];
daveplug.command = ['antiedit'];

module.exports = daveplug;