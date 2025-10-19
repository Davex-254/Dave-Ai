const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// CORRECT REPO URL - Updated to your GitHub
global.updateZipUrl = "https://codeload.github.com/gifteddevsmd/Dave-Ai/zip/refs/heads/main";

// Utility to run shell commands
function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) return reject(stderr || stdout || err.message);
      resolve(stdout.toString());
    });
  });
}

// Download ZIP with better error handling
async function downloadFile(url, dest) {
  try {
    const writer = fs.createWriteStream(dest);
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      maxRedirects: 5,
      timeout: 30000,
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
      response.data.on('error', reject);
      setTimeout(() => reject(new Error('Download timeout')), 60000);
    });
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
}

// Extract ZIP file with cross-platform support
async function extractZip(zipPath, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  try {
    await run(`unzip -o "${zipPath}" -d "${outDir}"`);
  } catch (error) {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outDir, true);
  }
}

// Copy recursively while ignoring key folders
async function copyRecursive(src, dest, ignore = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src);
  for (const entry of entries) {
    if (ignore.includes(entry)) continue;

    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.lstatSync(s);

    if (stat.isDirectory()) {
      await copyRecursive(s, d, ignore);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// Main updater with single message updates
async function updateViaZip(dave, m) {
  const zipUrl = (global.updateZipUrl || process.env.UPDATE_ZIP_URL || '').trim();
  if (!zipUrl) throw new Error('No ZIP URL configured in global.updateZipUrl.');

  let currentVersion = 'unknown';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
    currentVersion = pkg.version || 'unknown';
  } catch (e) {
    console.warn('Could not read package.json version:', e.message);
  }

  const tmpDir = path.join(process.cwd(), 'tmp_update');
  const zipPath = path.join(tmpDir, 'update.zip');
  const extractTo = path.join(tmpDir, 'update_extract');

  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  let statusMessage;

  try {
    // Send initial message and store the message object
    statusMessage = await dave.sendMessage(m.chat, { 
      text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nRepository: gifteddevsmd/Dave-Ai\nStatus: Downloading update...` 
    }, { quoted: m });

    await downloadFile(zipUrl, zipPath);

    // Update the same message
    await dave.sendMessage(m.chat, { 
      text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nRepository: gifteddevsmd/Dave-Ai\nStatus: Extracting update files...`,
      edit: statusMessage.key 
    });

    await extractZip(zipPath, extractTo);

    const folders = fs.readdirSync(extractTo);
    const mainFolder = folders.length === 1 ? path.join(extractTo, folders[0]) : extractTo;

    if (!fs.existsSync(mainFolder)) {
      throw new Error('Extracted folder not found');
    }

    await dave.sendMessage(m.chat, { 
      text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nRepository: gifteddevsmd/Dave-Ai\nStatus: Copying files...`,
      edit: statusMessage.key 
    });

    await copyRecursive(mainFolder, process.cwd(), [
      'node_modules', '.git', 'session', 'tmp', 'tmp_update', '.env', 'config.js'
    ]);

    await dave.sendMessage(m.chat, { 
      text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nRepository: gifteddevsmd/Dave-Ai\nStatus: Installing dependencies...`,
      edit: statusMessage.key 
    });

    await run('npm install --no-audit --no-fund');

    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    await dave.sendMessage(m.chat, {
      text: `Update Complete!\n\nDaveAI has been successfully updated!\nFrom: v${currentVersion}\nTo: latest version\n\nRestarting bot...`,
      edit: statusMessage.key 
    });

    setTimeout(() => {
      console.log('Restarting DaveAI after update...');
      process.exit(0);
    }, 3000);

  } catch (error) {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    
    if (statusMessage) {
      await dave.sendMessage(m.chat, {
        text: `Update Failed\n\nError: ${error.message}\n\nCheck the repository URL and try again.`,
        edit: statusMessage.key 
      });
    }
    throw error;
  }
}

// Plugin definition
let daveplug = async (m, { dave, daveshown, command, reply }) => {
  if (!daveshown) {
    return reply('Only the owner can use this command.');
  }

  try {
    if (command === 'update') {
      await updateViaZip(dave, m);
    } else if (command === 'restart' || command === 'start') {
      await reply('Restarting DaveAI...');
      setTimeout(() => {
        console.log('Manual restart initiated...');
        process.exit(0);
      }, 2000);
    } else {
      reply('Usage: .update or .restart');
    }
  } catch (err) {
    console.error('Update Error Details:', err);
    
    let errorMessage = "Unknown error occurred";
    if (err && typeof err === 'object') {
      if (err.message) {
        errorMessage = err.message;
      } else if (err.toString && typeof err.toString === 'function') {
        errorMessage = err.toString();
      }
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    
    reply(`Update failed: ${errorMessage}\n\nCheck the repository URL and try again.`);
  }
};

daveplug.help = ['update', 'restart', 'start'];
daveplug.tags = ['system'];
daveplug.command = ['update', 'restart', 'start'];

module.exports = daveplug;