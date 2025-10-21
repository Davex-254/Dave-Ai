const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

global.updateZipUrl = "https://codeload.github.com/gifteddevsmd/Dave-Ai/zip/refs/heads/main";
const githubRepo = "gifteddevsmd/Dave-Ai";

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) return reject(stderr || stdout || err.message);
      resolve(stdout.toString());
    });
  });
}

async function downloadFile(url, dest) {
  const writer = fs.createWriteStream(dest);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    maxRedirects: 5,
    timeout: 60000
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
    response.data.on('error', reject);
    setTimeout(() => reject(new Error('Download timeout')), 120000);
  });
}

async function extractZip(zipPath, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  try {
    await run(`unzip -o "${zipPath}" -d "${outDir}"`);
  } catch {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outDir, true);
  }
}

async function copyRecursive(src, dest, ignore = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src);

  for (const entry of entries) {
    if (ignore.includes(entry)) continue;
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.lstatSync(s);

    try {
      if (stat.isDirectory()) {
        await copyRecursive(s, d, ignore);
      } else {
        fs.copyFileSync(s, d);
      }
    } catch (copyErr) {
      console.error(`Failed to copy ${s}:`, copyErr.message);
    }
  }
}

function backupCriticalFiles() {
  const backupDir = path.join(process.cwd(), 'backup_' + Date.now());
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const criticalFiles = ['settings.js', 'config.js', '.env', 'database.json'];
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.copyFileSync(file, path.join(backupDir, file));
      } catch (err) {
        console.error(`Failed to backup ${file}:`, err.message);
      }
    }
  });
  return backupDir;
}

async function getLatestCommitInfo() {
  try {
    const url = `https://api.github.com/repos/${githubRepo}/commits/main`;
    const res = await axios.get(url, { headers: { 'User-Agent': 'DaveAI-Updater' }, timeout: 10000 });
    const commit = res.data;
    return {
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: new Date(commit.commit.author.date).toLocaleString(),
      sha: commit.sha.substring(0, 7)
    };
  } catch {
    return null;
  }
}

function safetyChecks() {
  if (!fs.existsSync('./package.json')) {
    throw new Error('Not in project root directory - missing package.json');
  }
  try {
    fs.accessSync('.', fs.constants.W_OK);
  } catch {
    throw new Error('No write permissions in current directory');
  }
}

async function checkForUpdates() {
  try {
    const currentPkg = JSON.parse(fs.readFileSync('./package.json'));
    const response = await axios.get(`https://raw.githubusercontent.com/${githubRepo}/main/package.json`);
    const latestPkg = response.data;

    return currentPkg.version !== latestPkg.version;
  } catch {
    return true;
  }
}

async function updateViaZip(dave, m) {
  safetyChecks();

  const zipUrl = (global.updateZipUrl || process.env.UPDATE_ZIP_URL || '').trim();
  if (!zipUrl) throw new Error('No ZIP URL configured in global.updateZipUrl.');

  const backupDir = backupCriticalFiles();

  let currentVersion = 'unknown';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
    currentVersion = pkg.version || 'unknown';
  } catch {}

  const updateNeeded = await checkForUpdates();
  if (!updateNeeded) {
    await dave.sendMessage(m.chat, { text: '✅ Already on latest version! No update needed.' });
    return;
  }

  const latestCommit = await getLatestCommitInfo();
  let changelog = '';
  if (latestCommit) {
    changelog = `\n\nLatest Commit:\n${latestCommit.message}\nBy: ${latestCommit.author}\nDate: ${latestCommit.date}\nSHA: ${latestCommit.sha}`;
  }

  const tmpDir = path.join(process.cwd(), 'tmp_update');
  const zipPath = path.join(tmpDir, 'update.zip');
  const extractTo = path.join(tmpDir, 'update_extract');

  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  let statusMessage;
  try {
    statusMessage = await dave.sendMessage(m.chat, {
      text: `🔄 DaveAI Updater\n\nCurrent: v${currentVersion}\nRepository: ${githubRepo}${changelog}\n\nStatus: Downloading update...`
    });

    await downloadFile(zipUrl, zipPath);
    await dave.sendMessage(m.chat, { text: '📦 Extracting update...', edit: statusMessage.key });
    await extractZip(zipPath, extractTo);

    const folders = fs.readdirSync(extractTo);
    const mainFolder = folders.length === 1 ? path.join(extractTo, folders[0]) : extractTo;
    if (!fs.existsSync(mainFolder)) throw new Error('Extracted folder not found.');

    await dave.sendMessage(m.chat, { text: '📁 Copying files...', edit: statusMessage.key });
    await copyRecursive(mainFolder, process.cwd(), [
      'node_modules', '.git', 'session', 'tmp', 'tmp_update', 'backup_*', '.env', 'config.js', 'settings.js', 'database.json'
    ]);

    // ⚠️ Skip overwriting settings.js entirely
    console.log('Preserving existing settings.js — no overwrite performed.');

    await dave.sendMessage(m.chat, { text: '📦 Installing dependencies...', edit: statusMessage.key });
    await run('npm install --omit=dev --no-audit --no-fund --silent');

    await dave.sendMessage(m.chat, {
      text: `✅ Update Complete!\n\nDaveAI updated successfully.\nFrom: v${currentVersion}\nTo: latest version${changelog}\n\nRestarting bot in 3 seconds...`,
      edit: statusMessage.key
    });

    setTimeout(() => process.exit(0), 3000);

  } catch (error) {
    if (fs.existsSync(backupDir)) {
      try {
        await copyRecursive(backupDir, process.cwd());
        console.log('Restored from backup due to update failure');
      } catch (restoreErr) {
        console.error('Failed to restore backup:', restoreErr);
      }
    }

    if (statusMessage) {
      await dave.sendMessage(m.chat, {
        text: `❌ Update Failed\n\nError: ${error.message}\n\nRestored from backup.`,
        edit: statusMessage.key
      });
    }
    throw error;
  } finally {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
    if (fs.existsSync(backupDir)) fs.rmSync(backupDir, { recursive: true, force: true });
  }
}

let daveplug = async (m, { dave, daveshown, command, reply }) => {
  if (!daveshown) return reply('Owner only command.');
  try {
    if (command === 'update') {
      await reply('Starting update process...');
      await updateViaZip(dave, m);
    } else if (command === 'restart' || command === 'start') {
      await reply('Restarting DaveAI...');
      setTimeout(() => process.exit(0), 2000);
    } else {
      reply('Usage:\n.update - Update bot\n.restart - Restart bot');
    }
  } catch (err) {
    console.error('Update Error:', err);
    reply(`Update failed: ${err.message || err}`);
  }
};

daveplug.help = ['update', 'restart', 'start'];
daveplug.tags = ['system'];
daveplug.command = ['update', 'restart', 'start'];

module.exports = daveplug;