let handler = async (m, { conn, usedPrefix, command }) => {
  const opciones = ['piedra', 'papel', 'tijera']
  const emojis = { piedra: '✊', papel: '✋', tijera: '✌️' }

  // Detecta la jugada si vino en texto del botón
  let user = (m.text || '').toLowerCase().trim()

  // 🔹 Configurar botones
  const buttons = [
    { buttonId: `${usedPrefix}${command} piedra`, buttonText: { displayText: '✊ Piedra' }, type: 1 },
    { buttonId: `${usedPrefix}${command} papel`, buttonText: { displayText: '✋ Papel' }, type: 1 },
    { buttonId: `${usedPrefix}${command} tijera`, buttonText: { displayText: '✌️ Tijera' }, type: 1 }
  ]

  // 🔹 Si no hay elección válida, mostramos menú inicial
  if (!opciones.includes(user)) {
    return await conn.sendMessage(m.chat, {
      text: '✨ *PIEDRA, PAPEL O TIJERA – ELYSSIA MD* ✨\n💡 Presiona un botón para jugar:',
      footer: '🎮 Elyssia MD • Modo Pro',
      buttons,
      headerType: 1
    }, { quoted: m })
  }

  // 🔹 El bot elige aleatoriamente
  const bot = opciones[Math.floor(Math.random() * opciones.length)]

  // 🔹 Resultado
  let resultado = ''
  if (user === bot) resultado = '🤝 EMPATE'
  else if (
    (user === 'piedra' && bot === 'tijera') ||
    (user === 'papel' && bot === 'piedra') ||
    (user === 'tijera' && bot === 'papel')
  ) resultado = '🏆 ¡GANASTE!'
  else resultado = '💀 ¡PERDISTE!'

  // 🔹 Mensaje final con botones para seguir jugando
  const mensaje = `
╭━━━〔 🎮 RESULTADO PPT 〕━━━⬣
┃ 👤 Tú: ${emojis[user]} ${user.toUpperCase()}
┃ 🤖 Bot: ${emojis[bot]} ${bot.toUpperCase()}
┃
┃ 📊 ${resultado}
╰━━━━━━━━━━━━━━━━━━━━⬣

💡 Presiona un botón para jugar otra vez
  `

  await conn.sendMessage(m.chat, {
    text: mensaje,
    footer: '🎮 Elyssia MD • Modo Pro',
    buttons,
    headerType: 1
  }, { quoted: m })
}

handler.help = ['ppt']
handler.tags = ['game']
handler.command = ['ppt']

export default handler