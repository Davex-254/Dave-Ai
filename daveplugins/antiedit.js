const fs = require('fs');
const path = './library/database/antiedit.json'; // Store state persistently
const processedEdits = new Map();
const EDIT_COOLDOWN = 5000;

// Load saved state
let antieditState = 'off';
if (fs.existsSync(path)) {
    try {
        const data = JSON.parse(fs.readFileSync(path, 'utf8'));
        antieditState = data.antiedit || 'off';
    } catch {}
}
global.antiedit = antieditState;

let daveplug = async (m, { daveshown, dave, args, reply }) => {
    if (!daveshown) return reply('❌ This command is owner only.');

    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off', 'private'].includes(mode)) {
        return reply(
            '*📝 ANTIEDIT USAGE*\n\n' +
            '`.antiedit on` - Enable in chats\n' +
            '`.antiedit private` - Send alerts to bot owner\n' +
            '`.antiedit off` - Disable'
        );
    }

    global.antiedit = mode;

    // Save state to JSON
    try {
        fs.writeFileSync(path, JSON.stringify({ antiedit: mode }, null, 2));
    } catch (err) {
        console.error('Failed to save antiedit state:', err.message);
    }

    if (mode === 'on') return reply('✅ _Antiedit enabled in all chats_');
    if (mode === 'private') return reply('✅ _Antiedit enabled - alerts will be sent privately_');
    return reply('❌ _Antiedit disabled_');
};

// Event listener for Baileys (kept intact)
daveplug.before = async (m, { dave }) => {
    if (!daveplug._listenerRegistered) {
        dave.ev.on('messages.update', async (updates) => {
            try {
                if (!global.antiedit || global.antiedit === 'off') return;

                const now = Date.now();

                for (const update of updates) {
                    const { key, update: updateData } = update;

                    if (!key?.remoteJid || !key?.id) continue;
                    if (!updateData?.message) continue;

                    const chat = key.remoteJid;
                    const sender = key.participant || key.remoteJid;
                    const senderKey = `${chat}-${sender}`;

                    const botNumber = dave.user.id.split(':')[0];
                    if (sender.includes(botNumber)) continue;

                    let editedMsg = null;

                    if (updateData.message.editedMessage) {
                        editedMsg = updateData.message.editedMessage.message;
                    } else if (updateData.message.protocolMessage) {
                        const proto = updateData.message.protocolMessage;
                        if (proto.type === 1 && proto.editedMessage) {
                            editedMsg = proto.editedMessage;
                        }
                    }

                    if (!editedMsg) continue;

                    if (processedEdits.has(senderKey)) {
                        const last = processedEdits.get(senderKey);
                        if (now - last.timestamp < EDIT_COOLDOWN) continue;
                    }

                    const getContent = (msg) => {
                        if (!msg) return '[Unable to retrieve content]';
                        const type = Object.keys(msg)[0];
                        const content = msg[type];

                        switch (type) {
                            case 'conversation': return content;
                            case 'extendedTextMessage': 
                                return content.text + (content.contextInfo?.quotedMessage ? ' _(with quote)_' : '');
                            case 'imageMessage': return `📷 Image: ${content.caption || '_No caption_'}`;
                            case 'videoMessage': return `🎥 Video: ${content.caption || '_No caption_'}`;
                            case 'documentMessage': return `📄 Document: ${content.fileName || '_No filename_'}`;
                            case 'audioMessage': return `🎵 Audio message`;
                            case 'stickerMessage': return `🎨 Sticker`;
                            default: return `[${type.replace('Message', '')}]`;
                        }
                    };

                    const editedContent = getContent(editedMsg);
                    const senderName = sender.split('@')[0];
                    const chatType = chat.endsWith('@g.us') ? 'Group' : 'Private';

                    let chatName = chatType;
                    if (chat.endsWith('@g.us')) {
                        try {
                            const groupMeta = await dave.groupMetadata(chat).catch(() => null);
                            chatName = groupMeta?.subject || 'Unknown Group';
                        } catch {}
                    }

                    const notificationMessage =
                        `⚠️ *MESSAGE EDITED*\n\n` +
                        `👤 *Sender:* @${senderName}\n` +
                        `✏️ *New Message:* ${editedContent}\n` +
                        `📍 *Chat:* ${chatName}\n` +
                        `🕐 *Time:* ${new Date().toLocaleTimeString()}`;

                    const sendTo = global.antiedit === 'private' 
                        ? dave.user.id.split(':')[0] + '@s.whatsapp.net'
                        : chat;

                    await dave.sendMessage(sendTo, { 
                        text: notificationMessage, 
                        mentions: [sender] 
                    }).catch(err => {
                        console.error('Failed to send antiedit alert:', err.message);
                    });

                    processedEdits.set(senderKey, { timestamp: now });

                    console.log(`📝 Antiedit: ${senderName} edited message in ${chatName}`);
                }

                // Cleanup old entries
                for (const [key, data] of processedEdits) {
                    if (now - data.timestamp > 60000) processedEdits.delete(key);
                }

            } catch (err) {
                console.error('ANTIEDIT ERROR:', err);
            }
        });

        daveplug._listenerRegistered = true;
        console.log('✅ Antiedit listener registered (Baileys messages.update)');
    }
};

daveplug.help = ['antiedit'];
daveplug.tags = ['owner', 'security'];
daveplug.command = ['antiedit'];

module.exports = daveplug;