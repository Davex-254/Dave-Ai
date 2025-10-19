const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Repository ZIP URL
global.updateZipUrl = "https://codeload.github.com/gifteddevsmd/Dave-Ai/zip/refs/heads/main";

// Run shell commands
function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) return reject(stderr || stdout || err.message);
      resolve(stdout.toString());
    });
  });
}

// Download ZIP file
async function downloadFile(url, dest) {
  const writer = fs.createWriteStream(dest);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 40000,
  });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
    response.data.on('error', reject);
  });
}

// Extract ZIP file
async function extractZip(zipPath, outDir) {
  try {
    await run(`unzip -o "${zipPath}" -d "${outDir}"`);
  } catch {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outDir, true);
  }
}

// Copy recursively, ignoring some folders
async function copyRecursive(src, dest, ignore = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src);

  for (const entry of entries) {
    if (ignore.includes(entry)) continue;
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.lstatSync(s);

    if (stat.isDirectory()) await copyRecursive(s, d, ignore);
    else fs.copyFileSync(s, d);
  }
}

// Main updater function
async function updateViaZip(dave, m) {
  const zipUrl = global.updateZipUrl;
  if (!zipUrl) throw new Error('No ZIP URL configured.');

  let currentVersion = 'unknown';
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json'));
    currentVersion = pkg.version || 'unknown';
  } catch {}

  const tmpDir = path.join(process.cwd(), 'tmp_update');
  const zipPath = path.join(tmpDir, 'update.zip');
  const extractTo = path.join(tmpDir, 'update_extract');

  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  // Send initial message
  let msg = await dave.sendMessage(m.chat, { 
    text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nStarting update process...`
  }, { quoted: m });

  const update = async (status) => {
    await dave.sendMessage(m.chat, { text: status, edit: msg.key });
  };

  try {
    await update(`DaveAI Updater\n\nCurrent version: v${currentVersion}\nDownloading update...`);
    await downloadFile(zipUrl, zipPath);

    await update(`DaveAI Updater\n\nCurrent version: v${currentVersion}\nExtracting update files...`);
    await extractZip(zipPath, extractTo);

    const folders = fs.readdirSync(extractTo);
    const mainFolder = folders.length === 1 ? path.join(extractTo, folders[0]) : extractTo;

    await update(`DaveAI Updater\n\nCurrent version: v${currentVersion}\nCopying files...`);
    await copyRecursive(mainFolder, process.cwd(), ['node_modules', '.git', 'session', '.env', 'config.js']);

    await update(`DaveAI Updater\n\nCurrent version: v${currentVersion}\nInstalling dependencies...`);
    await run('npm install --no-audit --no-fund');

    await update(`DaveAI Updater\n\nUpdate complete!\nFrom: v${currentVersion}\nTo: latest version\nRestarting bot...`);

    setTimeout(() => process.exit(0), 3000);
  } catch (err) {
    await update(`DaveAI Updater\n\nUpdate failed.\nError: ${err.message}`);
  } finally {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// Plugin definition
let daveplug = async (m, { dave, daveshown, command, reply }) => {
  if (!daveshown) return reply("Only the owner can use this command.");

  if (command === 'update') {
    await updateViaZip(dave, m);
  } else if (command === 'restart' || command === 'start') {
    await reply("Restarting DaveAI...");
    setTimeout(() => process.exit(0), 2000);
  } else {
    reply("Usage: .update or .restart");
  }
};

daveplug.help = ['update', 'restart', 'start'];
daveplug.tags = ['system'];
daveplug.command = ['update', 'restart', 'start'];

module.exports = daveplug;