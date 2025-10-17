const fs = require('fs')
const chalk = require('chalk')

// Default values
global.menuImage = global.menuImage || 'https://files.catbox.moe/na6y1b.jpg'
global.botname = global.botname || '𝘿𝙖𝙫𝙚𝘼𝙄'

const Menu = `
╭━━━〔 *${global.botname}* 〕━━━╮
┃ ✦ Owner    : *${global.ownername}*
┃ ✦ Version  : *1.0.0*
┃ ✦ BotType  : *${global.typebot}*
┃ ✦ Prefix   : *${global.xprefix}*
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╰┈➤ *ʙᴜɢ ᴀɴᴅʀᴏɪᴅ*
> ${global.xprefix}xandroid
> ${global.xprefix}xandroid2
> ${global.xprefix}systemuicrash
> ${global.xprefix}xsysui

╰┈➤ *ʙᴜɢ ɪᴏꜱ*
> ${global.xprefix}xios
> ${global.xprefix}xios2

╰┈➤ *ʙᴜɢ ɢʀᴏᴜᴘ ᴄʜᴀᴛ*
> ${global.xprefix}dave-group

╰┈➤ *ᴏᴡɴᴇʀ ᴍᴇɴᴜ*
> ${global.xprefix}join
> ${global.xprefix}shutdown
> ${global.xprefix}restart
> ${global.xprefix}autoread *[on/off]*
> ${global.xprefix}autotyping *[on/off]*
> ${global.xprefix}autorecording *[on/off]*
> ${global.xprefix}autoreact *[on/off]*
> ${global.xprefix}autobio *[on/off]*
> ${global.xprefix}autoswview *[on/off]*
> ${global.xprefix}mode *[private/public]*
> ${global.xprefix}block
> ${global.xprefix}unblock
> ${global.xprefix}backup
> ${global.xprefix}addowner
> ${global.xprefix}delowner
> ${global.xprefix}setprefix
> ${global.xprefix}setnamabot
> ${global.xprefix}setbiobot
> ${global.xprefix}setppbot
> ${global.xprefix}delppbot
> ${global.xprefix}onlygroup *[on/off]*
> ${global.xprefix}onlypc *[on/off]*
> ${global.xprefix}unavailable *[on/off]*
> ${global.xprefix}anticall *[on/off/status]*
> ${global.xprefix}listgc
> ${global.xprefix}listowner
> ${global.xprefix}clearchat
> ${global.xprefix}on
> ${global.xprefix}off
> ${global.xprefix}anticall whitelist
> ${global.xprefix}areact charts
> ${global.xprefix}antiedit
> ${global.xprefix}setpp
> ${global.xprefix}disp-1
> ${global.xprefix}disp-7
> ${global.xprefix}disp-90
> ${global.xprefix}disp-off
> ${global.xprefix}antidelete 
> ${global.xprefix}vv

╰┈➤ *ɢʀᴏᴜᴘ ᴍᴇɴᴜ*
> ${global.xprefix}closetime
> ${global.xprefix}opentime
> ${global.xprefix}kick
> ${global.xprefix}add
> ${global.xprefix}promote
> ${global.xprefix}demote
> ${global.xprefix}setdesc
> ${global.xprefix}setppgc
> ${global.xprefix}tagall
> ${global.xprefix}hidetag
> ${global.xprefix}group *[option]*
> ${global.xprefix}linkgc
> ${global.xprefix}revoke
> ${global.xprefix}listonline
> ${global.xprefix}welcome *[on/off]*
> ${global.xprefix}antilink *[on/off]*
> ${global.xprefix}antilinkgc *[on/off]*
> ${global.xprefix}warning
> ${global.xprefix}unwarning
> ${global.xprefix}kill
> ${global.xprefix}close
> ${global.xprefix}open
> ${global.xprefix}vcf
> ${global.xprefix}vcf2

╰┈➤ *ᴍᴀɪɴ ᴍᴇɴᴜ*
> ${global.xprefix}menu
> ${global.xprefix}buypremium
> ${global.xprefix}runtime
> ${global.xprefix}script
> ${global.xprefix}donate
> ${global.xprefix}owner
> ${global.xprefix}dev
> ${global.xprefix}request
> ${global.xprefix}Quran
> ${global.xprefix}Bible

╰┈➤ *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
> ${global.xprefix}sticker
> ${global.xprefix}smeme
> ${global.xprefix}take
> ${global.xprefix}toimage
> ${global.xprefix}toaudio
> ${global.xprefix}tovn
> ${global.xprefix}togif
> ${global.xprefix}tourl
> ${global.xprefix}url
> ${global.xprefix}tourl2
> ${global.xprefix}toqr
> ${global.xprefix}tovideo
> ${global.xprefix}emojimix
> ${global.xprefix}stickerwm
> ${global.xprefix}stickermeme
> ${global.xprefix}hd
> ${global.xprefix}remini
> ${global.xprefix}hdvideo
> ${global.xprefix}readmore

╰┈➤ *ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ*
> ${global.xprefix}play
> ${global.xprefix}ytmp3
> ${global.xprefix}ytmp4
> ${global.xprefix}fb
> ${global.xprefix}igdl
> ${global.xprefix}tiktok
> ${global.xprefix}mediafire
> ${global.xprefix}snackvideo
> ${global.xprefix}capcut
> ${global.xprefix}playdoc
> ${global.xprefix}apk
> ${global.xprefix}instagram/ig

╰┈➤ *ᴀɪ / ᴄʜᴀᴛɢᴘᴛ*
> ${global.xprefix}ai
> ${global.xprefix}ai2
> ${global.xprefix}gpt
> ${global.xprefix}gemma
> ${global.xprefix}mistral
> ${global.xprefix}gemini
> ${global.xprefix}luminai
> ${global.xprefix}openai
> ${global.xprefix}dave

╰┈➤ *ɪᴍᴀɢᴇ ᴀɪ*
> ${global.xprefix}imagebing
> ${global.xprefix}edit-ai
> ${global.xprefix}toanime
> ${global.xprefix}toreal
> ${global.xprefix}remove-wm
> ${global.xprefix}editanime
> ${global.xprefix}faceblur
> ${global.xprefix}removebg

╰┈➤ *sᴇᴀʀᴄʜ ᴛᴏᴏʟs*
> ${global.xprefix}pinterest
> ${global.xprefix}yts
> ${global.xprefix}lyrics
> ${global.xprefix}dictionary
> ${global.xprefix}weather
> ${global.xprefix}google
> ${global.xprefix}playstore
> ${global.xprefix}playstation
> ${global.xprefix}animesearch
> ${global.xprefix}whatsong
> ${global.xprefix}getpastebin
> ${global.xprefix}getpp

╰┈➤ *ꜱᴘᴏʀᴛꜱ*
> ${global.xprefix}fixtures
> ${global.xprefix}epl
> ${global.xprefix}laliga
> ${global.xprefix}bundesliga
> ${global.xprefix}serie-a
> ${global.xprefix}ligue-1

╰┈➤ *ᴅᴇᴠᴇʟᴏᴘᴇʀ ᴍᴇɴᴜ*
> ${global.xprefix}githubstalk
> ${global.xprefix}gitclone
> ${global.xprefix}getfile
> ${global.xprefix}setvar
> ${global.xprefix}getvar
> ${global.xprefix}update
> ${global.xprefix}enc
> ${global.xprefix}tojs
> ${global.xprefix}listcase
> ${global.xprefix}pair

╰┈➤ *ᴇᴍᴀɪʟ & ᴜᴛɪʟs*
> ${global.xprefix}sendemail
> ${global.xprefix}tempmail
> ${global.xprefix}myip
> ${global.xprefix}trackip
> ${global.xprefix}ocr
> ${global.xprefix}ssweb
> ${global.xprefix}trt

╰┈➤ *ᴄʜᴀɴɴᴇʟ & ꜱᴛᴀᴛᴜꜱ*
> ${global.xprefix}reactch
> ${global.xprefix}idch
> ${global.xprefix}uploadstatus
> ${global.xprefix}save
> ${global.xprefix}viewonce
> ${global.xprefix}rvo

╰┈➤ *ɢᴀᴍᴇꜱ & ꜰᴜɴ*
> ${global.xprefix}truth
> ${global.xprefix}dare
> ${global.xprefix}meme
> ${global.xprefix}brat
> ${global.xprefix}neko
> ${global.xprefix}shinobu
> ${global.xprefix}megumin
> ${global.xprefix}bully
> ${global.xprefix}cuddle
> ${global.xprefix}cry
> ${global.xprefix}hug
> ${global.xprefix}awoo
> ${global.xprefix}kiss
> ${global.xprefix}lick
> ${global.xprefix}pat
> ${global.xprefix}smug
> ${global.xprefix}bonk
> ${global.xprefix}yeet
> ${global.xprefix}blush
> ${global.xprefix}smile
> ${global.xprefix}wave
> ${global.xprefix}highfive
> ${global.xprefix}handhold
> ${global.xprefix}nom
> ${global.xprefix}bite
> ${global.xprefix}glomp
> ${global.xprefix}slap
> ${global.xprefix}kill
> ${global.xprefix}happy
> ${global.xprefix}wink
> ${global.xprefix}poke
> ${global.xprefix}dance
> ${global.xprefix}cringe
> ${global.xprefix}trap
> ${global.xprefix}blowjob
> ${global.xprefix}hentai
> ${global.xprefix}boobs
> ${global.xprefix}ass
> ${global.xprefix}pussy
> ${global.xprefix}thighs
> ${global.xprefix}lesbian
> ${global.xprefix}lewdneko
> ${global.xprefix}cum
> ${global.xprefix}woof
> ${global.xprefix}8ball
> ${global.xprefix}goose
> ${global.xprefix}gecg
> ${global.xprefix}feed
> ${global.xprefix}avatar
> ${global.xprefix}fox_girl
> ${global.xprefix}lizard
> ${global.xprefix}spank
> ${global.xprefix}meow
> ${global.xprefix}tickle

╰┈➤ *ᴛᴇxᴛ ᴇꜰꜰᴇᴄᴛꜱ*
> ${global.xprefix}glitchtext
> ${global.xprefix}writetext
> ${global.xprefix}advancedglow
> ${global.xprefix}typographytext
> ${global.xprefix}pixelglitch
> ${global.xprefix}neonglitch
> ${global.xprefix}flagtext
> ${global.xprefix}flag3dtext
> ${global.xprefix}deletingtext
> ${global.xprefix}blackpinkstyle
> ${global.xprefix}glowingtext
> ${global.xprefix}underwatertext
> ${global.xprefix}logomaker
> ${global.xprefix}cartoonstyle
> ${global.xprefix}papercutstyle
> ${global.xprefix}watercolortext
> ${global.xprefix}effectclouds
> ${global.xprefix}blackpinklogo
> ${global.xprefix}gradienttext
> ${global.xprefix}summerbeach
> ${global.xprefix}luxurygold
> ${global.xprefix}multicoloredneon
> ${global.xprefix}sandsummer
> ${global.xprefix}galaxywallpaper
> ${global.xprefix}1917style
> ${global.xprefix}makingneon
> ${global.xprefix}royaltext
> ${global.xprefix}freecreate
> ${global.xprefix}galaxystyle
> ${global.xprefix}lighteffects

╰┈➤ *ꜱᴘᴀᴍ & ᴛᴏᴏʟꜱ*
> ${global.xprefix}nglspam
> ${global.xprefix}sendchat

> *${global.botname}*
> Enjoy premium performance
`;

module.exports = Menu

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})