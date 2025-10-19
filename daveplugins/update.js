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
    if (stat.isDirectory()) await copyRecursive(s, d, ignore);
    else fs.copyFileSync(s, d);
  }
}

// Fetch latest commit info
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

async function updateViaZip(dave, m) {
  const zipUrl = (global.updateZipUrl || process.env.UPDATE_ZIP_URL || '').trim();
  if (!zipUrl) throw new Error('No ZIP URL configured in global.updateZipUrl.');

  let currentVersion = 'unknown';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
    currentVersion = pkg.version || 'unknown';
  } catch {}

  const latestCommit = await getLatestCommitInfo();
  let changelog = '';
  if (latestCommit) {
    changelog = `\nLatest Commit:\n${latestCommit.message}\nBy: ${latestCommit.author}\nDate: ${latestCommit.date}\nSHA: ${latestCommit.sha}`;
  }

  const tmpDir = path.join(process.cwd(), 'tmp_update');
  const zipPath = path.join(tmpDir, 'update.zip');
  const extractTo = path.join(tmpDir, 'update_extract');

  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  let statusMessage;

  try {
    statusMessage = await dave.sendMessage(m.chat, {
      text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nRepository: ${githubRepo}${changelog}\n\nStatus: Downloading update...`
    }, { quoted: m });

    await downloadFile(zipUrl, zipPath);

    await dave.sendMessage(m.chat, {
      text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nStatus: Extracting files...`,
      edit: statusMessage.key
    });

    await extractZip(zipPath, extractTo);

    const folders = fs.readdirSync(extractTo);
    const mainFolder = folders.length === 1 ? path.join(extractTo, folders[0]) : extractTo;
    if (!fs.existsSync(mainFolder)) throw new Error('Extracted folder not found.');

    await dave.sendMessage(m.chat, {
      text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nStatus: Copying files...`,
      edit: statusMessage.key
    });

    await copyRecursive(mainFolder, process.cwd(), [
      'node_modules', '.git', 'session', 'tmp', 'tmp_update', '.env', 'config.js', 'settings.js', 'database.json'
    ]);

    await dave.sendMessage(m.chat, {
      text: `DaveAI Updater\n\nCurrent version: v${currentVersion}\nStatus: Installing dependencies...`,
      edit: statusMessage.key
    });

    await run('npm install --omit=dev --no-audit --no-fund');

    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });

    await dave.sendMessage(m.chat, {
      text: `Update Complete\n\nDaveAI updated successfully.\nFrom: v${currentVersion}\nTo: latest version${changelog}\n\nRestarting bot...`,
      edit: statusMessage.key
    });

    setTimeout(() => {
      console.log('Restarting DaveAI after update...');
      process.exit(0);
    }, 3000);

  } catch (error) {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
    if (statusMessage) {
      await dave.sendMessage(m.chat, {
        text: `Update Failed\n\nError: ${error.message}\nCheck internet, repository, or permissions and try again.`,
        edit: statusMessage.key
      });
    }
    throw error;
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
      setTimeout(() => {
        console.log('Manual restart initiated...');
        process.exit(0);
      }, 2000);
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