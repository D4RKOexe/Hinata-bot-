//--> Hecho por Ado-rgb (github.com/Ado-rgb) MODIFICADO MODO ELYSSIABOT-MD 
// •|• No quites créditos..

// 🌸 Configuración Modo ELYSSIA
const ELYSSIA_MODE = true

const colors = {
  pink: '\x1b[95m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
}

// 🌸 Logo ELYSSIA
const elyssiaLogo = `
${colors.magenta}╔════════════════════════════════════╗
${colors.magenta}║      🌸 ${colors.cyan}ELYSSIA SYSTEM${colors.magenta} 🌸      ║
${colors.magenta}║        ${colors.yellow}EMOTIONAL MODE${colors.magenta}         ║
${colors.magenta}╚════════════════════════════════════╝${colors.reset}
`

// 🌸 Función de log
function elyssiaLog(message, type = 'info') {
  if (!ELYSSIA_MODE) return

  const icons = {
    info: '🌸',
    success: '✨',
    warning: '🌙',
    error: '💔',
    sad: '🥀'
  }

  console.log(`${icons[type]} [ELYSSIA] ${message}`)
}

// 🌸 Tus imágenes ELYSSIA SAD
const sadImages = [
  'https://h.uguu.se/KtHwZdCl.jpeg',
  'https://d.uguu.se/OCgyMbmK.jpeg',
  'https://d.uguu.se/TefRYKjA.jpeg',
  'https://n.uguu.se/YvogJufj.jpeg',
  'https://o.uguu.se/eygoBisv.jpeg',
  'https://d.uguu.se/JskaUrdo.jpeg',
  'https://n.uguu.se/tgTMBdmt.jpeg'
]

// 🌸 Mensajes tristes estilo ELYSSIA
const sadMessages = [
`🥀 *MODO TRISTEZA ACTIVADO* 🥀

*{user}* se siente diferente hoy...

🌸 *ELYSSIA dice:*
_"Las flores también se marchitan para volver a florecer."_

✨ Todo pasará.`,

`🌧️ *LLUVIA EN EL CORAZÓN* 🌧️

*{user}* está atravesando un momento difícil...

🌙 *ELYSSIA susurra:*
_"No todas las noches duran para siempre."_

💫 Mañana será mejor.`,

`💔 *CORAZÓN CANSADO* 💔

*{user}* necesita un respiro...

🌸 *ELYSSIA recuerda:*
_"Está bien descansar cuando el alma pesa."_

✨ Sigue adelante.`,

`🕯️ *LUZ ENTRE LA OSCURIDAD* 🕯️

*{user}* está luchando en silencio...

🌺 *ELYSSIA dice:*
_"Incluso la llama más pequeña puede iluminar la noche."_

💫 No te rindas.`
]

// 🌸 Función para obtener imagen aleatoria
function getRandomSadImage() {
  return sadImages[Math.floor(Math.random() * sadImages.length)]
}

// 🌸 Función para obtener mensaje aleatorio
function getRandomSadMessage(userTag) {
  const randomMsg = sadMessages[Math.floor(Math.random() * sadMessages.length)]
  return randomMsg.replace(/{user}/g, userTag)
}

// 🌸 Handler principal del comando .sad
const handler = async (m, { conn, args, command }) => {
  try {
    let userToSad = m.sender
    let mentionedUser = null

    if (m.mentionedJid && m.mentionedJid.length > 0) {
      mentionedUser = m.mentionedJid[0]
    } else if (m.quoted && m.quoted.sender) {
      mentionedUser = m.quoted.sender
    } else if (args[0]) {
      let number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
      mentionedUser = number
    }

    if (mentionedUser) {
      userToSad = mentionedUser
    }

    const userTag = `@${userToSad.split('@')[0]}`
    const sadImage = getRandomSadImage()
    const sadMessage = getRandomSadMessage(userTag)

    // Logs en consola
    if (ELYSSIA_MODE) {
      console.log(elyssiaLogo)
      elyssiaLog(`Comando .sad ejecutado por: @${m.sender.split('@')[0]}`, 'info')
      if (mentionedUser) elyssiaLog(`Mencionando a: ${userTag}`, 'warning')
      elyssiaLog(`Imagen SAD #${sadImages.indexOf(sadImage) + 1} seleccionada`, 'sad')
    }

    // Animación de "cargando" en consola
    if (ELYSSIA_MODE) {
      const sadAnim = [
        "🥀 Cargando tristeza...",
        "💧 Preparando lágrimas...",
        "🌧️ Activando modo melancólico...",
        "🕯️ Enviando mensaje emotivo..."
      ]
      for (let i = 0; i < sadAnim.length; i++) {
        process.stdout.write(`\r${colors.cyan}${sadAnim[i]}${colors.reset}`)
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      console.log('\n')
    }

    // Enviar mensaje con imagen
    await conn.sendMessage(m.chat, {
      image: { url: sadImage },
      caption: sadMessage,
      mentions: [userToSad],
      contextInfo: {
        externalAdReply: {
          title: `🥀 ELYSSIA SAD MODE`,
          body: `Para ${userTag}`,
          thumbnail: await conn.getFile(sadImage).catch(() => null),
          mediaType: 1,
          sourceUrl: 'https://github.com/Ado-rgb'
        }
      }
    })

    // Reacción al mensaje original
    try {
      await conn.sendMessage(m.chat, {
        react: { text: '🥀', key: m.key }
      })
    } catch (e) {}

    elyssiaLog(`Mensaje sad enviado exitosamente`, 'success')

  } catch (error) {
    elyssiaLog(`Error: ${error.message}`, 'error')
    m.reply(`❌ *ERROR EN MODO SAD*

Ocurrió un error al enviar el mensaje.

Intenta de nuevo más tarde.`)
  }
}

// 🌸 Configuración del handler
handler.command = ['sad', 'triste', 'melancolico', 'depre']
handler.tags = ['elyssia', 'efectos']
handler.help = [
  '.sad - Expresa tu tristeza',
  '.sad @usuario - Hacer sad a alguien',
  '.sad (respondiendo a mensaje) - Hacer sad a quien respondiste'
]

// 🌸 Descripción para el menú
handler.description = '🥀 *ELYSSIA SAD MODE* - Expresa tu tristeza con estilo ELYSSIA'

export default handler