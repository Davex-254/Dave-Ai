const axios = require('axios');

let daveplug = async (m, { dave, daveshown, isAdmins, reply, text }) => {
    if (!m.isGroup) return reply('👥 This command can only be used in groups!');
    if (!isAdmins && !daveshown) return reply('🚨 Admin only!');
    
    if (!text && !m.quoted) {
        return reply(`Usage: .add 254712345678\nOr reply to someone's message with .add`);
    }
    
    const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
    
    if (!numbersOnly) {
        return reply('❌ Please provide a valid number or reply to a message!');
    }

    try {
        await dave.groupParticipantsUpdate(m.chat, [numbersOnly], 'add')
            .then(async (res) => {
                for (let i of res) {
                    let invv = await dave.groupInviteCode(m.chat);
                    
                    if (i.status == 408) return reply('❌ User is already in the group');
                    if (i.status == 401) return reply('❌ Bot is blocked by this user');
                    if (i.status == 409) return reply('❌ User has left the group recently');
                    if (i.status == 500) return reply('❌ Invalid request, try again later');
                    
                    if (i.status == 403) {
                        // Private account - send invitation
                        await dave.sendMessage(m.chat, { 
                            text: `@${numbersOnly.split('@')[0]} - Account is private. Sending invitation...`, 
                            mentions: [numbersOnly] 
                        }, { quoted: m });
                        
                        await dave.sendMessage(numbersOnly, { 
                            text: `📨 You've been invited to join our group!\n\n🔗 Group Link: https://chat.whatsapp.com/${invv}\n👤 Invited by: @${m.sender.split('@')[0]}`,
                            mentions: [m.sender]
                        }).catch((err) => {
                            reply('❌ Failed to send invitation to private account');
                        });
                    } else {
                        reply('✅ User added successfully!');
                    }
                }
            });
    } catch (e) {
        console.error('Add user error:', e);
        reply('❌ Could not add user!');
    }
};

daveplug.help = ['add <number> - Add user to group'];
daveplug.tags = ['add'];
daveplug.command = ['add', 'invite'];

module.exports = daveplug;

