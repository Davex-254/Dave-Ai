const fs = require('fs');
const path = require('path');

// Correct absolute path to settings.json
const settingsPath = path.join(__dirname, 'library/database/settings.json');

function loadSettings() {
    if (!fs.existsSync(settingsPath)) {
        console.warn('⚠️ settings.json not found, creating a new one...');
        const defaultSettings = {
            botname: "𝘿𝙖𝙫𝙚𝘼𝙄",
            ownername: "GIFTED DAVE",
            owner: ["254104260236"],
            xprefix: ".",
            packname: "𝘿𝙖𝙫𝙚𝘼𝙄",
            author: "𝘿𝙖𝙫𝙚𝘼𝙄",
            themeemoji: "🪀",
            showConnectMsg: false,
            footer: "𝘿𝙖𝙫𝙚𝘼𝙄",
            thumb: "https://files.catbox.moe/cp8oat.jpg",
            websitex: "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
            wagc: "https://chat.whatsapp.com/CaPeB0sVRTrL3aG6asYeAC",
            socialm: "IG: @_gifted_dave",
            location: "Kenya",

            // Store config
            maxStoreMessages: 20,       // default max messages per chat
            storeWriteInterval: 10000,  // default write interval in ms

            // Automation
            autoread: { enabled: false },
            autotyping: { enabled: false },
            autorecord: { enabled: false },
            autoviewstatus: true,
            autolike: { enabled: false },
            autoreactstatus: true,
            autoreactmessages: { enabled: false },
            welcome: false,
            goodbye: false,
            anticall: false,
            autobio: true,
            antidelete: { enabled: true },
            antilinkgc: { enabled: false },
            antilink: { enabled: false },
            antitag: {},
            antibadword: {},
            antipromote: { enabled: false, mode: "revert" },
            antidemote: { enabled: false, mode: "revert" },
            antibot: {},
            areact: {
                enabled: false,
                chats: {},
                emojis: ["😂","🔥","😎","👍","💀","❤️","🤖","🥵","🙌","💯"],
                mode: "random"
            },
            warnings: { enabled: true, maxWarnings: 3, chats: {} },

            // Bot mode
            online: true,
            public: true,
            onlygroup: false,
            onlypc: false,

            // Messages
            mess: {
                success: "✅ Done.",
                admin: "Admin only.",
                premium: "Premium user only.",
                botAdmin: "Make me admin first.",
                owner: "Owner only.",
                OnlyGrup: "Group only.",
                private: "Private chat only.",
                wait: "Processing...",
                error: "Error occurred."
            },

            // Bot config
            typebot: "Plugin × case",
            session: "davesession",
            connect: true,
            adminevent: true,
            groupevent: true,
            hituet: 0
        };

        fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
        return defaultSettings;
    }

    return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

function saveSettings(settings) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

// Load global settings
global.settings = loadSettings();
global.saveSettings = saveSettings;

// Shortcut globals
global.owner = global.settings.owner;
global.ownername = global.settings.ownername;
global.botname = global.settings.botname;
global.mess = global.settings.mess;
global.xprefix = global.settings.xprefix;
global.typebot = global.settings.typebot;
global.session = global.settings.session;
global.connect = global.settings.connect;
global.adminevent = global.settings.adminevent;
global.groupevent = global.settings.groupevent;
global.hituet = global.settings.hituet;

module.exports = { loadSettings, saveSettings };