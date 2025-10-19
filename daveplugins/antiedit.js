const processedEdits = new Map();
const EDIT_COOLDOWN = 5000;

let daveplug = async (m, { daveshown, dave, args, reply }) => {
    if (!daveshown) return reply('This command is owner only.');

    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off', 'private'].includes(mode)) {
        return reply(
            'Usage: .antiedit <on|off|private>\n\n' +
            'on - Enable in chats\n' +
            'private - Send alerts to bot owner\n' +
            'off - Disable'
        );
    }

    global.antiedit = mode;

    if (mode === 'on') return reply('_Antiedit enabled in all chats_');
    if (mode === 'private') return reply('_Antiedit enabled - alerts will be sent privately_');
    return reply('_Antiedit disabled_');
};

// Event listener - this runs when plugin loads
daveplug.before = async (m, { dave }) => {
    // This ensures the listener is registered when the plugin loads
    if (!daveplug._listenerRegistered) {
        dave.ev.on('messages.update', async (updates) => {
            try {
                if (!global.antiedit || global.antiedit === 'off') return;

                const now = Date.now();

                for (const update of updates) {
                    const { key, update: updateData } = update;
                    if (!key?.id || !updateData?.message) continue;

                    const chat = key.remoteJid;
                    const sender = key.participant || key.remoteJid;
                    const senderKey = `${chat}-${sender}`;

                    // Find edited message
                    const editedMsg = updateData.message?.editedMessage?.message
                                   || updateData.message?.protocolMessage?.editedMessage?.message
                                   || updateData.message?.editedMessage;
                    
                    if (!editedMsg) continue;

                    // Cooldown check
                    if (processedEdits.has(senderKey)) {
                        const last = processedEdits.get(senderKey);
                        if (now - last.timestamp < EDIT_COOLDOWN) continue;
                    }

                    const getContent = (msg) => {
                        if (!msg) return '[Deleted]';
                        const type = Object.keys(msg)[0];
                        const content = msg[type];

                        switch (type) {
                            case 'conversation': return content;
                            case 'extendedTextMessage': 
                                return content.text + (content.contextInfo?.quotedMessage ? ' (with quote)' : '');
                            case 'imageMessage': return `📷 Image: ${content.caption || 'No caption'}`;
                            case 'videoMessage': return `🎥 Video: ${content.caption || 'No caption'}`;
                            case 'documentMessage': return `📄 Document: ${content.fileName || 'No filename'}`;
                            default: return `[${type.replace('Message', '')}]`;
                        }
                    };

                    const editedContent = getContent(editedMsg);

                    const notificationMessage =
                        `⚠️ *ANTIEDIT ALERT*\n\n` +
                        `👤 Sender: @${sender.split('@')[0]}\n` +
                        `✏️ Edited to: ${editedContent}\n` +
                        `📍 Chat: ${chat.endsWith('@g.us') ? 'Group' : 'Private'}`;

                    const sendTo = global.antiedit === 'private' 
                        ? dave.user.id.split(':')[0] + '@s.whatsapp.net'
                        : chat;

                    await dave.sendMessage(sendTo, { 
                        text: notificationMessage, 
                        mentions: [sender] 
                    }).catch(console.error);

                    processedEdits.set(senderKey, { timestamp: now });
                }

                // Cleanup old entries (every minute)
                for (const [key, data] of processedEdits) {
                    if (now - data.timestamp > 60000) processedEdits.delete(key);
                }

            } catch (err) {
                console.error('ANTIEDIT ERROR:', err);
            }
        });

        daveplug._listenerRegistered = true;
        console.log('✅ Antiedit listener registered');
    }
};

daveplug.help = ['antiedit'];
daveplug.tags = ['owner', 'security'];
daveplug.command = ['antiedit'];

module.exports = daveplug;