const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../database/antitag.json');
// Ensure database file exists
function ensureDB() {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }
}

// Read database
function readDB() {
    ensureDB();
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Write database
function writeDB(data) {
    ensureDB();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Get current antitag settings
async function getAntitag(chatId, defaultState = 'off') {
    try {
        const data = readDB();
        if (!data[chatId]) {
            data[chatId] = { enabled: defaultState === 'on', action: 'delete' };
            writeDB(data);
        }
        return data[chatId];
    } catch (error) {
        console.error('Error reading antitag settings:', error);
        return { enabled: false, action: 'delete' };
    }
}

// Set or update antitag configuration
async function setAntitag(chatId, state = 'on', action = 'delete') {
    try {
        const data = readDB();
        data[chatId] = {
            enabled: state === 'on',
            action: action || 'delete'
        };
        writeDB(data);
        return true;
    } catch (error) {
        console.error('Error saving antitag settings:', error);
        return false;
    }
}

// Remove antitag entry (turn off)
async function removeAntitag(chatId) {
    try {
        const data = readDB();
        delete data[chatId];
        writeDB(data);
        return true;
    } catch (error) {
        console.error('Error removing antitag entry:', error);
        return false;
    }
}

module.exports = {
    getAntitag,
    setAntitag,
    removeAntitag
};