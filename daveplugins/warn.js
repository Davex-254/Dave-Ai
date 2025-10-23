const fs = require('fs');
const path = require('path');

let daveplug = async (m, { daveshown, dave, reply, isBotAdmins, isAdmins, mentioned, quoted, prefix, command }) => {
  if (!m.isGroup) return reply("This command only works in groups.");
  if (!isBotAdmins) return reply("I need admin rights to warn someone.");
  if (!daveshown && !isAdmins) return reply("Only group admins can use this command.");

  // Identify target user
  if (!quoted && !mentioned[0]) {
    return reply(`Example: ${prefix + command} @user or reply to a message.`);
  }

  let target = mentioned[0] ? mentioned[0] : quoted ? quoted.sender : null;

  if (!target) {
    return reply("Invalid user specified.");
  }

  // Prevent warning owner
  const targetNumber = target.replace('@s.whatsapp.net', '');
  if (global.owner && global.owner.includes(targetNumber)) {
    return reply("You can't warn the bot owner.");
  }

  // Prevent warning self
  if (target === m.sender) {
    return reply("You can't warn yourself.");
  }

  // Prevent warning bot
  const botJid = dave.user.id.split(':')[0] + '@s.whatsapp.net';
  if (target === botJid) {
    return reply("I can't warn myself!");
  }

  try {
    // Add processing reaction
    await dave.sendMessage(m.chat, {
      react: { text: '...', key: m.key }
    });

    // Define warnings database path
    const warningsPath = path.join(__dirname, '../library/database/warnings.json');
    
    // Create database directory if it doesn't exist
    const databaseDir = path.dirname(warningsPath);
    if (!fs.existsSync(databaseDir)) {
      fs.mkdirSync(databaseDir, { recursive: true });
    }
    
    // Read or initialize warnings
    let warnings = {};
    if (fs.existsSync(warningsPath)) {
      try {
        warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
      } catch (error) {
        warnings = {};
      }
    }

    // Initialize group and user warnings if they don't exist
    if (!warnings[m.chat]) warnings[m.chat] = {};
    if (!warnings[m.chat][target]) warnings[m.chat][target] = 0;
    
    // Increment warning count
    warnings[m.chat][target]++;
    
    // Save warnings
    fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

    const warningCount = warnings[m.chat][target];
    
    // Send warning message
    await reply(`WARNING\n\nUser: @${target.split('@')[0]}\nWarnings: ${warningCount}/3\nWarned by: @${m.sender.split('@')[0]}`, { 
      mentions: [target, m.sender] 
    });

    // Add success reaction
    await dave.sendMessage(m.chat, {
      react: { text: '✓', key: m.key }
    });

    // Auto-kick after 3 warnings
    if (warningCount >= 3) {
      await dave.groupParticipantsUpdate(m.chat, [target], 'remove');
      
      // Remove user from warnings after kick
      delete warnings[m.chat][target];
      fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));
      
      await reply(`USER KICKED\n\n@${target.split('@')[0]} has been removed from the group after 3 warnings.`, { 
        mentions: [target] 
      });
    }

  } catch (err) {
    console.error('Warn Command Error:', err);
    
    // Add error reaction
    await dave.sendMessage(m.chat, {
      react: { text: '✗', key: m.key }
    });
    
    if (err.message.includes('not authorized')) {
      await reply("Bot doesn't have permission to warn users.");
    } else if (err.message.includes('not in group')) {
      await reply("User is not in this group.");
    } else {
      await reply("Failed to warn user. Check bot permissions.");
    }
  }
};

daveplug.help = ['warn'];
daveplug.tags = ['group'];
daveplug.command = ['warn', 'warning'];

module.exports = daveplug;