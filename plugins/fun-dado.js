// plugins/fun-dado.js
let handler = async (m, { conn, usedPrefix: _p }) => {
  let user = m.sender.split('@')[0]

  // Reacción inicial
  await m.react('🎲')

  // Dado y energía
  let dado = Math.floor(Math.random() * 6) + 1
  let emojis = ['⚡', '🌀', '🔥', '🌸', '💥', '✨']
  let emoji = emojis[dado - 1]

  // Mini animación de carga estilo Elyssia
  let loading = [
    '🎲 Lanzando el dado...',
    '🌀 Canalizando Ki...',
    '⚡ Calculando poder...',
    '🔥 Despertando fuerza...',
    '✨ Revelando resultado...'
  ]

  for (let txt of loading) {
    await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    await new Promise(r => setTimeout(r, 600))
  }

  // Resultado final con botones
  let text = `
╔══════════════════╗
║ 🌸 *ELYSSIA MD DADO* 🌸
╚══════════════════╝

🦾 Guerrero: @${user}

🎲 Resultado: *${dado}* ${emoji}

━━━━━━━━━━━━━━━
✨ Destino: ${getDestino(dado)}

🌀 *¡El Ki ha decidido tu suerte!*`

  const buttons = [
    { buttonId: `${_p}tirardado`, buttonText: { displayText: '🎲 Tirar de nuevo' }, type: 1 },
    { buttonId: `${_p}menu`, buttonText: { displayText: '🌀 Menú Elyssia' }, type: 1 }
  ]

  await conn.sendMessage(
    m.chat,
    { text, buttons, headerType: 1, mentions: [m.sender] },
    { quoted: m }
  )

  await m.react('⚡')
}

function getDestino(n) {
  switch (n) {
    case 1: return 'Poca energía… entrena más 💤'
    case 2: return 'Energía débil, pero estable 🌱'
    case 3: return 'Buen nivel de Ki ⚡'
    case 4: return 'Fuerte energía Saiyan 🔥'
    case 5: return '¡Modo bestia activado! 🌀'
    case 6: return '🔥 PODER MÁXIMO DESATADO 🔥'
    default: return 'Destino desconocido'
  }
}

handler.help = ['dado', 'tirardado']
handler.tags = ['fun', 'beast']
handler.command = ['dado', 'tirardado', 'roll', 'luck']
handler.register = false
handler.limit = false

export default handler