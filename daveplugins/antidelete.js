const fs = require('fs');
const path = require('path');

// Anti-delete settings storage
const antiDelSettingsPath = path.join(__dirname, '../library/database/antidelete.json');

function loadAntiDelSettings() {
  try {
    if (fs.existsSync(antiDelSettingsPath)) {
      const data = fs.readFileSync(antiDelSettingsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading anti-delete settings:', error);
  }
  // Default settings - anti-delete ON by default
  return { enabled: true };
}

function saveAntiDelSettings(settings) {
  try {
    fs.writeFileSync(antiDelSettingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving anti-delete settings:', error);
  }
}

let daveplug = async (m, { command, xprefix, q, daveshown, reply, args, mess }) => {
    if (!daveshown) return reply(mess.owner);
    
    // Load current settings
    let antiDelSettings = loadAntiDelSettings();
    
    if (!args || args.length < 1) {
        const status = antiDelSettings.enabled ? 'ON ✅' : 'OFF ❌';
        return reply(
            `*Anti-Delete Status:* ${status}\n\n` +
            `*Usage:*\n` +
            `• ${xprefix + command} on - Enable anti-delete\n` +
            `• ${xprefix + command} off - Disable anti-delete\n\n` +
            `_When enabled, deleted messages will be recovered and resent._`
        );
    }

    let option = q.toLowerCase(); // handles ON / On / on

    if (option === 'on') {
        antiDelSettings.enabled = true;
        saveAntiDelSettings(antiDelSettings);
        global.antiDelSettings = antiDelSettings;
        reply(`✅ *Anti-Delete is now ON*\n\nDeleted messages will be recovered and resent.`);
    } else if (option === 'off') {
        antiDelSettings.enabled = false;
        saveAntiDelSettings(antiDelSettings);
        global.antiDelSettings = antiDelSettings;
        reply(`❌ *Anti-Delete is now OFF*\n\nDeleted messages will not be recovered.`);
    } else {
        reply(`❌ Invalid option. Use ${xprefix + command} on/off`);
    }
};

daveplug.help = ['antidelete'];
daveplug.tags = ['owner'];
daveplug.command = ['antidelete', 'antidel'];

module.exports = daveplug;