const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const settings = require('../settings');
const { rmSync } = require('fs');

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
            if (err) return reject(new Error((stderr || stdout || err.message || '').toString()));
            resolve((stdout || '').toString());
        });
    });
}

async function hasGitRepo() {
    if (process.env.HEROKU_APP_NAME) return false;
    const gitDir = path.join(process.cwd(), '.git');
    if (!fs.existsSync(gitDir)) return false;
    try {
        await run('git --version');
        return true;
    } catch {
        return false;
    }
}

async function updateViaGit() {
    const oldRev = (await run('git rev-parse HEAD').catch(() => 'unknown')).trim();
    await run('git fetch --all --prune');
    const newRev = (await run('git rev-parse origin/main')).trim();
    const alreadyUpToDate = oldRev === newRev;
    const commits = alreadyUpToDate ? '' : await run(`git log --pretty=format:"%h %s (%an)" ${oldRev}..${newRev}`).catch(() => '');
    const files = alreadyUpToDate ? '' : await run(`git diff --name-status ${oldRev} ${newRev}`).catch(() => '');
    await run(`git reset --hard ${newRev}`);
    await run('git clean -fd');
    return { oldRev, newRev, alreadyUpToDate, commits, files };
}

function downloadFile(url, dest, visited = new Set()) {
    return new Promise((resolve, reject) => {
        try {
            if (visited.has(url) || visited.size > 5) {
                return reject(new Error('Too many redirects'));
            }
            visited.add(url);

            const useHttps = url.startsWith('https://');
            const client = useHttps ? require('https') : require('http');
            const req = client.get(url, {
                headers: {
                    'User-Agent': 'DaveAI-Updater/1.0',
                    'Accept': '*/*'
                }
            }, res => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
                    const location = res.headers.location;
                    if (!location) return reject(new Error(`HTTP ${res.statusCode} without Location`));
                    const nextUrl = new URL(location, url).toString();
                    res.resume();
                    return downloadFile(nextUrl, dest, visited).then(resolve).catch(reject);
                }

                if (res.statusCode !== 200) {
                    return reject(new Error(`HTTP ${res.statusCode}`));
                }

                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => file.close(resolve));
                file.on('error', err => {
                    try { file.close(() => {}); } catch {}
                    fs.unlink(dest, () => reject(err));
                });
            });
            req.on('error', err => {
                fs.unlink(dest, () => reject(err));
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function extractZip(zipPath, outDir) {
    if (process.platform === 'win32') {
        const cmd = `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${outDir.replace(/\\/g, '/')}' -Force"`;
        await run(cmd);
        return;
    }
    try {
        await run('command -v unzip');
        await run(`unzip -o '${zipPath}' -d '${outDir}'`);
        return;
    } catch {}
    try {
        await run('command -v 7z');
        await run(`7z x -y '${zipPath}' -o'${outDir}'`);
        return;
    } catch {}
    try {
        await run('busybox unzip -h');
        await run(`busybox unzip -o '${zipPath}' -d '${outDir}'`);
        return;
    } catch {}
    throw new Error("No system unzip tool found. ZIP method is recommended.");
}

function copyRecursive(src, dest, ignore = [], relative = '', outList = []) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
        if (ignore.includes(entry)) continue;
        const s = path.join(src, entry);
        const d = path.join(dest, entry);
        const stat = fs.lstatSync(s);
        if (stat.isDirectory()) {
            copyRecursive(s, d, ignore, path.join(relative, entry), outList);
        } else {
            fs.copyFileSync(s, d);
            if (outList) outList.push(path.join(relative, entry).replace(/\\/g, '/'));
        }
    }
}

async function updateViaZip(dave, m, zipOverride) {
    const zipUrl = (zipOverride || settings.updateZipUrl || process.env.UPDATE_ZIP_URL || '').trim();
    if (!zipUrl) throw new Error('No ZIP URL configured. Set updateZipUrl in settings or UPDATE_ZIP_URL env.');

    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const zipPath = path.join(tmpDir, 'update.zip');
    await downloadFile(zipUrl, zipPath);

    const extractTo = path.join(tmpDir, 'update_extract');
    if (fs.existsSync(extractTo)) fs.rmSync(extractTo, { recursive: true, force: true });
    await extractZip(zipPath, extractTo);

    const [root] = fs.readdirSync(extractTo).map(n => path.join(extractTo, n));
    const srcRoot = fs.existsSync(root) && fs.lstatSync(root).isDirectory() ? root : extractTo;

    const ignore = ['node_modules', '.git', 'session', 'tmp', 'temp', 'data', 'baileys_store.json', '.env'];
    const copied = [];

    // Preserve user settings
    let currentSettings = {};
    try { currentSettings = require('../settings'); } catch {}

    copyRecursive(srcRoot, process.cwd(), ignore, '', copied);

    // Restore settings
    try {
        const settingsPath = path.join(process.cwd(), 'settings.js');
        if (fs.existsSync(settingsPath)) {
            let text = fs.readFileSync(settingsPath, 'utf8');
            if (currentSettings.owner) text = text.replace(/owner\s*=\s*\[[^\]]*\]/, `owner = ["${currentSettings.owner[0]}"]`);
            if (currentSettings.botname) text = text.replace(/botname\s*=\s*[^,]+,\s*'[^']*'/, `botname = '${currentSettings.botname.replace(/'/g, "\\'")}'`);
            if (currentSettings.xprefix) text = text.replace(/xprefix\s*=\s*[^,]+,\s*'[^']*'/, `xprefix = '${currentSettings.xprefix}'`);
            if (currentSettings.SESSION_ID) text = text.replace(/SESSION_ID\s*=\s*[^,]+,\s*'[^']*'/, `SESSION_ID = '${currentSettings.SESSION_ID}'`);
            fs.writeFileSync(settingsPath, text);
        }
    } catch (e) {
        console.error('Error preserving settings:', e);
    }

    try { fs.rmSync(extractTo, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(zipPath, { force: true }); } catch {}

    return { copiedFiles: copied };
}

async function restartProcess(dave, m) {
    try { await dave.sendMessage(m.chat, { text: 'DaveAI update complete! Restarting...' }, { quoted: m }); } catch {}
    try { await dave.end(); } catch {}

    const sessionPath = path.join(process.cwd(), 'session');
    const filesToDelete = [
        'app-state-sync-version.json',
        'message-history.json',
        'sender-key-memory.json',
        'baileys_store_multi.json',
        'baileys_store.json'
    ];
    if (fs.existsSync(sessionPath)) {
        filesToDelete.forEach(f => {
            const fp = path.join(sessionPath, f);
            if (fs.existsSync(fp)) rmSync(fp, { force: true });
        });
    }

    if (process.env.HEROKU_APP_NAME) return setTimeout(() => process.exit(0), 1000);

    try { await run('pm2 restart all'); return; } catch {}
    setTimeout(() => process.exit(0), 0);
}

// ✅ Final Plugin Command
let daveUpdate = async (m, { dave, daveshown, reply, text }) => {
    if (!daveshown) return reply('This command is for owner only');

    const isSimpleRestart = text?.toLowerCase().includes('restart') && !text.toLowerCase().includes('update');

    try {
        if (!isSimpleRestart) {
            await reply('Updating bot...');
            if (process.env.HEROKU_APP_NAME || !(await hasGitRepo())) {
                const { copiedFiles } = await updateViaZip(dave, m);
                await reply(`Updated ${copiedFiles.length} files. Settings preserved.`);
            } else {
                const { oldRev, newRev, alreadyUpToDate } = await updateViaGit();
                if (alreadyUpToDate) await reply('Already up to date');
                else await reply(`Updated from ${oldRev.substring(0, 7)} to ${newRev.substring(0, 7)}`);
                await run('npm install --no-audit --no-fund');
            }
        } else {
            await reply('Restarting bot...');
        }

        await restartProcess(dave, m);
    } catch (err) {
        console.error('Update failed:', err);
        await reply(`Update failed: ${String(err.message || err)}`);
    }
};

daveUpdate.help = ['update'];
daveUpdate.tags = ['system'];
daveUpdate.command = ['update', 'restart'];

module.exports = daveUpdate;