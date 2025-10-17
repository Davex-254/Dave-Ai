const axios = require('axios');
const fs = require("fs");
const path = require("path");
const yts = require("yt-search");

let daveplug = async (m, { dave, reply, text }) => {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const fancyReply = (msg) => `🎶 *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐌𝐔𝐒𝐈𝐂 𝐏𝐋𝐀𝐘𝐄𝐑*\n\n${msg}\n\n> By 𝐃𝐀𝐕𝐄-𝐀𝐈`;

  // 🧩 No text provided
  if (!text) {
    return dave.sendMessage(m.chat, {
      text: fancyReply("Yo, drop a song name fam! 🎵 Example: *.play2 Not Like Us*")
    }, { quoted: m });
  }

  // 🧩 Prevent people from typing essays
  if (text.length > 100) {
    return dave.sendMessage(m.chat, {
      text: fancyReply("Bruh 😤 that’s too long! I ain’t reading a whole paragraph — keep it short, max 100 characters.")
    }, { quoted: m });
  }

  try {
    // 🎧 Search on YouTube
    const searchResult = await yts(`${text} official`);
    const video = searchResult.videos[0];

    if (!video) {
      return dave.sendMessage(m.chat, {
        text: fancyReply("No tunes found, bro 😕 Try another song name!")
      }, { quoted: m });
    }

    // 🎶 Download from API
    const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result?.downloadUrl)
      throw new Error("API didn’t return a valid download link");

    const filePath = path.join(tempDir, `audio_${Date.now()}.mp3`);

    const audioResponse = await axios({
      method: "get",
      url: data.result.downloadUrl,
      responseType: "stream",
      timeout: 600000,
    });

    const writer = fs.createWriteStream(filePath);
    audioResponse.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // 🎵 Inform user before sending
    await dave.sendMessage(m.chat, {
      text: fancyReply(`🎧 Hold up! Droppin’ *${data.result.title || video.title}* for ya 🔥`)
    }, { quoted: m });

    // 📩 Send audio
    await dave.sendMessage(m.chat, {
      audio: fs.createReadStream(filePath),
      mimetype: "audio/mpeg",
      fileName: `${(data.result.title || video.title).substring(0, 100)}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: data.result.title || video.title,
          body: `${video.author.name || "Unknown Artist"} | 𝐃𝐀𝐕𝐄-𝐀𝐈`,
          thumbnailUrl: video.thumbnail,
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });

    // 🧹 Clean temp
    fs.unlinkSync(filePath);
  } catch (err) {
    reply(fancyReply(`😕 Error: ${err.message}\nTry another song or check your connection.`));
  }
};

daveplug.help = ['play2 <song name>'];
daveplug.tags = ['downloader'];
daveplug.command = ['play2'];

module.exports = daveplug;