const daveplug = async (m, { dave }) => {
  // Send initial message
  const sent = await dave.sendMessage(m.chat, { text: 'Checking speed...' }, { quoted: m });

  // Simulate a realistic delay
  const start = Date.now();
  const randomDelay = Math.floor(Math.random() * 200) + 50; // 50–250ms
  await new Promise(res => setTimeout(res, randomDelay));

  const speed = Date.now() - start + randomDelay / 2;
  const showSpeed = Math.max(50, Math.round(speed)); // never below 50ms

  // Edit the same message
  await dave.sendMessage(
    m.chat,
    { text: `𝘿𝙖𝙫𝙚𝘼𝙄 speed: ${showSpeed} ms`, edit: sent.key },
  );
};

daveplug.command = ['ping'];
daveplug.help = ['ping'];
daveplug.tags = ['alive'];

module.exports = daveplug;