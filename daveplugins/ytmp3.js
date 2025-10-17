const axios = require('axios');

let ytmp3mobi = async (youtubeUrl, format = "mp3") => {
    const regYoutubeId = /https:\/\/(www.youtube.com\/watch\?v=|youtu.be\/|youtube.com\/shorts\/|youtube.com\/watch\?v=)([^&|^?]+)/
    const videoId = youtubeUrl.match(regYoutubeId)?.[2]
    if (!videoId) throw Error("Cannot extract YouTube video ID from given link")

    const availableFormat = ["mp3", "mp4"]
    const formatIndex = availableFormat.findIndex(v => v == format.toLowerCase())
    if (formatIndex == -1) throw Error(`${format} is invalid format, available format: ${availableFormat.join(", ")}`)

    const urlParam = {
        v: videoId,
        f: format,
        _: Math.random()
    }

    const headers = { "Referer": "https://id.ytmp3.mobi/" }

    const fetchJson = async (url, fetchDescription) => {
        const res = await fetch(url, { headers })
        if (!res.ok) throw Error(`Fetch failed on ${fetchDescription} | ${res.status} ${res.statusText}`)
        return await res.json()
    }

    const { convertURL } = await fetchJson("https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=" + Math.random(), "get convertURL")
    const { progressURL, downloadURL } = await fetchJson(`${convertURL}&${new URLSearchParams(urlParam).toString()}`, "get progressURL and downloadURL")

    let { error, progress, title } = {}
    while (progress != 3) {
        ({ error, progress, title } = await fetchJson(progressURL, "fetch progressURL"))
        if (error) throw Error(`Error found in json object after fetch progressURL: ${error}`)
    }

    return { title, downloadURL }
}

let daveplug = async (m, { dave, reply, text, command }) => {
    try {
        if (!text) return reply('Provide a YouTube link\nExample: .' + command + ' https://youtu.be/MN_JP4gyBNI')
        
        let format = command === 'ytmp4' ? 'mp4' : 'mp3'

        reply('Processing...')

        const { title, downloadURL } = await ytmp3mobi(text, format)
        
        let filename = `${title}.${format}`
        
        await dave.sendMessage(m.chat, { 
            document: { url: downloadURL }, 
            fileName: filename, 
            mimetype: format === 'mp4' ? 'video/mp4' : 'audio/mp3' 
        }, { quoted: m })
        
    } catch (e) {
        reply('Error: ' + e.message)
    }
}

daveplug.help = ['ytmp3 <link> - Download YouTube audio', 'ytmp4 <link> - Download YouTube video'];
daveplug.tags = ['downloader'];
daveplug.command = ['ytmp3', 'ytmp4'];

module.exports = daveplug;