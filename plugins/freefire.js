let handler = async (m, { conn }) => {
  try {
    // MENSAJE PRINCIPAL
    const texto = `
🔥 *CENTRO FREE FIRE* 🔥

👋 ¡Hola! Bienvenido al menú Free Fire de Elyssia MD 🌸

🌟 Selecciona una opción usando los botones de abajo:
`;

    // BOTONES PRINCIPALES
    const buttons = [
      { buttonId: 'ffarmas', buttonText: { displayText: '🔫 Armas' }, type: 1 },
      { buttonId: 'ffpersonajes', buttonText: { displayText: '👤 Personajes' }, type: 1 },
      { buttonId: 'ffmascotas', buttonText: { displayText: '🐾 Mascotas' }, type: 1 },
      { buttonId: 'ffconsejos', buttonText: { displayText: '💡 Consejos' }, type: 1 }
    ];

    await conn.sendMessage(m.chat, {
      text: texto,
      footer: '🌸 Elyssia MD • #FreeFire',
      buttons: buttons,
      headerType: 1
    }, { quoted: m });

    // ESCUCHAR RESPUESTAS DE BOTONES
    conn.ev.on('messages.upsert', async (messageUpdate) => {
      const messages = messageUpdate.messages;
      for (let msg of messages) {
        if (!msg.message?.buttonsResponseMessage) continue;
        if (msg.key.remoteJid !== m.chat) continue; // Solo responder en este chat
        if (msg.key.fromMe) continue; // Ignorar mensajes del bot mismo

        const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;

        let reply = '';
        switch (buttonId) {
          case 'ffarmas':
            reply = '🔥 *Top armas Free Fire:*\n\n• MP40\n• AK47\n• XM8\n• M1887\n• AWM';
            break;
          case 'ffpersonajes':
            reply = '👤 *Personajes meta:*\n\n• Alok\n• Chrono\n• Kelly\n• Hayato\n• Dimitri';
            break;
          case 'ffmascotas':
            reply = '🐾 *Mascotas populares:*\n\n• Falco\n• Rockie\n• Ottero\n• Beaston';
            break;
          case 'ffconsejos':
            reply = '💡 *Consejos PRO:*\n\n✓ Usa audífonos para escuchar pasos\n✓ Lleva siempre paredes gloo\n✓ No recargues en campo abierto\n✓ Aprovecha la cobertura';
            break;
        }

        if (reply) {
          await conn.sendMessage(m.chat, { text: reply }, { quoted: msg });
        }
      }
    });

  } catch (e) {
    console.error(e);
    m.reply('💥 Ocurrió un error en el plugin Free Fire.');
  }
};

handler.help = ['freefire'];
handler.tags = ['freefire'];
handler.command = ['freefire', 'ff'];
export default handler;