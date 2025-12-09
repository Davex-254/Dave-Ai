// antiDelete.js
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = function initAntiDelete(DaveAi, opts = {}) {  // ✅ Changed dave to DaveAi
  // FIXED: Correct paths for your project structure
  const DB_PATH = opts.dbPath || path.join(__dirname, '../database/antidelete.json');
  const STATE_PATH = path.join(__dirname, '../database/antidelete_state.json');
  const MAX_CACHE = opts.maxCache || 500;

  // Ensure database directory exists
  const dbDir = path.dirname(DB_PATH);
  fs.mkdirSync(dbDir, { recursive: true });

  // Default config
  const defaultEnabled = typeof opts.enabled === 'boolean' ? opts.enabled : true;

  // Load persistent feature state
  let featureState = defaultEnabled;
  try {
    if (fs.existsSync(STATE_PATH)) {
      const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
      featureState = !!state.enabled;
    }
  } catch (e) {
    console.warn('antiDelete: failed to load state file, using default');
  }

  global.antiDeleteEnabled = featureState;

  const botNumber = opts.botNumber?.endsWith('@s.whatsapp.net')
    ? opts.botNumber
    : `${opts.botNumber}@s.whatsapp.net`;

  const cache = new Map();

  // Ensure database file exists
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
  }

  // Load previous cache (metadata only)
  try {
    const persisted = JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}');
    for (const k of Object.keys(persisted)) cache.set(k, persisted[k]);
  } catch (e) {
    console.warn('antiDelete: no persisted db or parse failed', e);
  }

  function persist() {
    try {
      const obj = {};
      for (const [k, v] of cache.entries()) {
        const store = { ...v };
        delete store.contentBuffer;
        obj[k] = store;
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2));
    } catch (e) {
      console.error('antiDelete persist error', e);
    }
  }

  function saveState(enabled) {
    try {
      global.antiDeleteEnabled = enabled;
      fs.writeFileSync(STATE_PATH, JSON.stringify({ enabled }, null, 2));
    } catch (e) {
      console.error('antiDelete saveState error', e);
    }
  }

  function addToCache(key, messageObj) {
    cache.set(key, messageObj);
    if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value);
    persist();
  }

  async function handleIncomingMessage(m) {
    try {
      if (!global.antiDeleteEnabled || !m?.message) return;

      const chat = m.key.remoteJid;
      const id = m.key.id || `${chat}-${Date.now()}`;
      const cacheKey = `${chat}:${id}`;

      // TEXT MESSAGE
      if (m.message.conversation || m.message.extendedTextMessage) {
        const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
        addToCache(cacheKey, {
          id,
          chat,
          type: 'text',
          text,
          sender: m.key.participant || m.key.remoteJid,
          timestamp: Date.now()
        });
        return;
      }

      // MEDIA MESSAGE
      const mediaNode =
        m.message.imageMessage ||
        m.message.videoMessage ||
        m.message.audioMessage ||
        m.message.stickerMessage ||
        m.message.documentMessage ||
        null;

      if (mediaNode) {
        const mediaType =
          m.message.imageMessage ? 'image' :
          m.message.videoMessage ? 'video' :
          m.message.audioMessage ? 'audio' :
          m.message.stickerMessage ? 'sticker' :
          m.message.documentMessage ? 'document' : 'unknown';

        try {
          const stream = await downloadContentFromMessage(
            mediaNode,
            mediaType === 'document'
              ? (mediaNode.mimetype?.split('/')[0] || 'document')
              : mediaType
          );

          let buffer = Buffer.from([]);
          for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

          addToCache(cacheKey, {
            id,
            chat,
            type: mediaType,
            sender: m.key.participant || m.key.remoteJid,
            timestamp: Date.now(),
            fileName: mediaNode.fileName || null,
            mimetype: mediaNode.mimetype || null,
            size: buffer.length,
            contentBuffer: buffer,
            caption: mediaNode.caption || null
          });
        } catch (err) {
          console.error('Failed to cache media for anti-delete:', err);
          // Still cache metadata even if media download fails
          addToCache(cacheKey, {
            id,
            chat,
            type: mediaType,
            sender: m.key.participant || m.key.remoteJid,
            timestamp: Date.now(),
            fileName: mediaNode.fileName || null,
            mimetype: mediaNode.mimetype || null,
            caption: mediaNode.caption || null,
            error: 'Failed to download media'
          });
        }
        return;
      }

      // OTHER MESSAGE TYPES
      addToCache(cacheKey, {
        id,
        chat,
        type: 'raw',
        raw: m.message,
        sender: m.key.participant || m.key.remoteJid,
        timestamp: Date.now()
      });

    } catch (err) {
      console.error('antiDelete.handleIncomingMessage error', err);
    }
  }

  async function handleProtocolMessage(m) {
    try {
      if (!global.antiDeleteEnabled || !m?.message?.protocolMessage) return;

      const protoMsg = m.message.protocolMessage;
      const revokedKey = protoMsg.key;
      if (!revokedKey) return;

      const chat = revokedKey.remoteJid || m.key.remoteJid;
      const revokedId = revokedKey.id;
      const cacheKey = `${chat}:${revokedId}`;
      const saved = cache.get(cacheKey);

      // Don't send "not found" message - just silently skip
      if (!saved) {
        // console.log(`AntiDelete: Message ${revokedId} not found in cache for ${chat}`);
        return;
      }

      const isGroup = chat.endsWith('@g.us');
      let chatName = chat;

      if (isGroup) {
        try {
          const meta = await DaveAi.groupMetadata(chat);  // ✅ Changed dave to DaveAi
          chatName = meta?.subject || chat;
        } catch {
          chatName = chat;
        }
      }

      const senderJid = saved.sender || 'unknown@s.whatsapp.net';
      const userTag = `@${senderJid.split('@')[0]}`;
      const mention = [senderJid];
      const header = `🛡️ *Anti-Delete*\nChat: ${chatName}\nUser: ${userTag}\nTime: ${new Date(saved.timestamp).toLocaleTimeString()}`;
      const targetJid = botNumber;

      // TEXT MESSAGE
      if (saved.type === 'text') {
        await DaveAi.sendMessage(targetJid, {  // ✅ Changed dave to DaveAi
          text: `${header}\n\n📝 *Deleted Message:*\n${saved.text}`,
          mentions: mention
        });
        return;
      }

      // MEDIA MESSAGE
      if (['image', 'video', 'audio', 'sticker', 'document'].includes(saved.type)) {
        // Check if media download failed
        if (saved.error === 'Failed to download media' || !saved.contentBuffer) {
          await DaveAi.sendMessage(targetJid, {  // ✅ Changed dave to DaveAi
            text: `${header}\n📎 Deleted ${saved.type} (media not cached)\n${saved.caption ? `Caption: ${saved.caption}` : ''}`,
            mentions: mention
          });
          return;
        }

        const msgOptions = {};
        switch (saved.type) {
          case 'image': 
            msgOptions.image = saved.contentBuffer; 
            msgOptions.caption = `${header}\n${saved.caption ? `Caption: ${saved.caption}` : 'No caption'}`;
            break;
          case 'video': 
            msgOptions.video = saved.contentBuffer; 
            msgOptions.caption = `${header}\n${saved.caption ? `Caption: ${saved.caption}` : 'No caption'}`;
            break;
          case 'audio': 
            msgOptions.audio = saved.contentBuffer; 
            msgOptions.mimetype = saved.mimetype || 'audio/mpeg';
            msgOptions.caption = header;
            break;
          case 'sticker': 
            msgOptions.sticker = saved.contentBuffer; 
            await DaveAi.sendMessage(targetJid, { text: `${header}\n📎 Deleted sticker` });  // ✅ Changed dave to DaveAi
            return;
          case 'document': 
            msgOptions.document = saved.contentBuffer; 
            msgOptions.fileName = saved.fileName || 'deleted_file';
            msgOptions.caption = `${header}\n${saved.caption ? `Caption: ${saved.caption}` : ''}`;
            break;
        }

        if (['image', 'video', 'document'].includes(saved.type)) {
          msgOptions.contextInfo = { mentionedJid: mention };
        }

        await DaveAi.sendMessage(targetJid, msgOptions);  // ✅ Changed dave to DaveAi
        return;
      }

      // OTHER MESSAGE TYPES
      await DaveAi.sendMessage(targetJid, {  // ✅ Changed dave to DaveAi
        text: `${header}\n(Deleted message type: ${saved.type})`,
        mentions: mention
      });

    } catch (err) {
      console.error('antiDelete.handleProtocolMessage error:', err);
    }
  }

  DaveAi.ev.on('messages.upsert', async ({ messages }) => {  // ✅ Changed dave to DaveAi
    for (const m of messages) {
      try {
        if (m?.message?.protocolMessage) await handleProtocolMessage(m);
        else if (m?.message) await handleIncomingMessage(m);
      } catch (e) {
        console.error('antiDelete messages.upsert loop error', e);
      }
    }
  });

  return {
    clearCache: () => { cache.clear(); persist(); },
    getCacheSize: () => cache.size,
    saveState
  };
};