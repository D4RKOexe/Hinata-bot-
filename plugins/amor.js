let handler = async (m, { conn }) => {
  let user

  if (m.mentionedJid && m.mentionedJid[0]) {
    user = m.mentionedJid[0]
  } else if (m.quoted) {
    user = m.quoted.sender
  } else {
    return m.reply('💖 Etiqueta o responde a alguien.\n\nEjemplo:\n.amor @usuario')
  }

  let porcentaje = Math.floor(Math.random() * 101)

  let mensaje = ''
  let estado = ''
  let emoji = ''

  if (porcentaje <= 10) {
    emoji = '💀'
    estado = 'Relación Imposible'
    mensaje = 'Ni las Esferas del Dragón pueden salvar esto.'
  } else if (porcentaje <= 20) {
    emoji = '💔'
    estado = 'Friendzone Extrema'
    mensaje = 'Parece que el amor está de vacaciones.'
  } else if (porcentaje <= 40) {
    emoji = '😅'
    estado = 'Interés Dudoso'
    mensaje = 'Hay interés, pero falta entrenamiento .'
  } else if (porcentaje <= 60) {
    emoji = '💕'
    estado = 'Buena Química'
    mensaje = 'Podrían convertirse en una gran pareja.'
  } else if (porcentaje <= 80) {
    emoji = '💘'
    estado = 'Pareja Poderosa'
    mensaje = 'Una combinación capaz de superar cualquier batalla.'
  } else if (porcentaje <= 95) {
    emoji = '💞'
    estado = 'Amor Verdadero'
    mensaje = 'Su energía romántica se siente en todo el universo.'
  } else {
    emoji = '💍'
    estado = 'Almas Gemelas'
    mensaje = '¡Almas gemelas nivel Ultra Instinto!'
  }

  const frases = [
    '🌹 El amor está en el aire.',
    '✨ El destino los ha unido.',
    '💫 tú y yo aprueba esta pareja.',
    '🐉 Una conexión digna de una leyenda.',
    '🌸 Qué bonita combinación.',
    '⚡ Sus energías son compatibles.',
    '💖 El radar del amor está explotando.',
    '🌟 Esta pareja tiene futuro.',
    '🫶 Hay chispas entre ustedes.',
    '💌 El corazón no miente.'
  ]

  let frase = frases[Math.floor(Math.random() * frases.length)]

  let txt = `
╔═══════💖═══════╗
     *MEDIDOR DE AMOR*
╚═══════💖═══════╝

👤 Usuario:
@${m.sender.split('@')[0]}

🌸 Crush:
@${user.split('@')[0]}

━━━━━━━━━━━━━━

❤️ Compatibilidad:
*${porcentaje}%*

${emoji} Estado:
*${estado}*

💬 Resultado:
${mensaje}

${frase}

━━━━━━━━━━━━━━
💘 Elyssia Love System 💘
`

  await conn.sendMessage(
    m.chat,
    {
      text: txt,
      mentions: [m.sender, user]
    },
    { quoted: m }
  )
}

handler.help = ['amor @usuario']
handler.tags = ['fun']
handler.command = ['amor', 'love', 'compatibilidad', 'crush']

export default handler