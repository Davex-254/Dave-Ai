const fs = require('fs').promises;
const path = require('path');

class TextFile {
    constructor(filename) {
        this.filename = filename;
    }
    
    async read() {
        try {
            const data = await fs.readFile(this.filename, 'utf-8');
            return data;
        } catch (e) {
            if (e.code === 'ENOENT') {
                return null;
            }
            throw e;
        }
    }
    
    async write(str) {
        // Ensure directory exists
        const dir = path.dirname(this.filename);
        await fs.mkdir(dir, { recursive: true });
        
        // Write file atomically by writing to temp then renaming
        const tempFile = this.filename + '.tmp';
        await fs.writeFile(tempFile, str, 'utf-8');
        await fs.rename(tempFile, this.filename);
    }
}

module.exports = { TextFile };