//--> Hecho por Ado-rgb (github.com/Ado-rgb) MODIFICADO MODO GO-HAN BEAST
// •|• No quites créditos..

// 🐉 Configuración Modo Gohan Beast para SAD
const BEAST_MODE = true
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
}

// 🐉 Logo Gohan Beast
const beastLogo = `
${colors.magenta}╔════════════════════════════════════╗
${colors.magenta}║    🐉 ${colors.cyan}GO-HAN BEAST MODE${colors.magenta} 🐉     ║
${colors.magenta}║    ${colors.blue}SAD SYSTEM ${colors.yellow}v1.0${colors.magenta}            ║
${colors.magenta}╚════════════════════════════════════╝${colors.reset}
`

// 🐉 Función de log
function beastLog(message, type = 'info') {
  if (!BEAST_MODE) return

  const icons = {
    info: `${colors.blue}🔵${colors.reset}`,
    success: `${colors.green}🟢${colors.reset}`,
    warning: `${colors.yellow}🟡${colors.reset}`,
    error: `${colors.red}🔴${colors.reset}`,
    beast: `${colors.magenta}🐉${colors.reset}`,
    sad: `${colors.cyan}😢${colors.reset}`
  }

  console.log(`${icons[type]} ${colors.cyan}[BEAST-SAD]${colors.reset} ${message}`)
}

// 🐉 Tus imágenes SAD
const sadImages = [
  'https://h.uguu.se/KtHwZdCl.jpeg',
  'https://d.uguu.se/OCgyMbmK.jpeg',
  'https://d.uguu.se/TefRYKjA.jpeg',
  'https://n.uguu.se/YvogJufj.jpeg',
  'https://o.uguu.se/eygoBisv.jpeg',
  'https://d.uguu.se/JskaUrdo.jpeg',
  'https://n.uguu.se/tgTMBdmt.jpeg'
]

// 🐉 Mensajes tristes estilo Gohan Beast (cortos y variados)
const sadMessages = [
  `🌧️ *MOMENTO DE TRISTEZA* 🌧️

*{user}* está pasando por un momento difícil...

💫 *"Hasta los guerreros más fuertes lloran"*

🐉 *El dolor de hoy, será la fuerza de mañana*`,

  `💔 *CORAZÓN ROTO* 💔

*{user}* necesita un abrazo...

🌟 *Recuerda: después de la tormenta, sale el sol*

🥀 *No estás solo en esta batalla*`,

  `😢 *LÁGRIMAS DE GUERRERO* 😢

*{user}* está triste...

⚡ *El verdadero poder nace del sufrimiento*

🌱 *Todo dolor tiene un propósito*`,

  `🌑 *NOCHE OSCURA DEL ALMA* 🌑

*{user}* se siente decaído...

🔥 *Un guerrero no se rinde, se levanta*

✨ *Esto también pasará*`,

  `💧 *GOTAS DE TRISTEZA* 💧

*{user}* no está bien hoy...

🛡️ *Hasta Gohan tuvo sus momentos difíciles*

🌈 *Mañana será un nuevo día*`,

  `🍂 *HOJAS QUE CAEN* 🍂

*{user}* está melancólico...

🌄 *Los guerreros también descansan y sanan*

💪 *Levántate, aún hay batallas por pelear*`,

  `🎭 *MÁSCARA DE FELICIDAD* 🎭

*{user}* oculta su dolor...

🎯 *Está bien no estar bien siempre*

🌞 *Busca apoyo en tus amigos*`,

  `🌊 *MAR DE LÁGRIMAS* 🌊

*{user}* está navegando en aguas turbulentas...

⚓ *Mantén el rumbo, guerrero*

🌟 *Tu fuerza interior te guiará*`,

  `🕯️ *LUZ TENUE* 🕯️

*{user}* siente que todo está oscuro...

💫 *Incluso la luz más pequeña brilla en la oscuridad*

🐉 *Tu poder interior despertará*`,

  `🍃 *VIENTO DE TRISTEZA* 🍃

*{user}* está siendo llevado por el dolor...

🌋 *Del magma nace la roca más fuerte*

⚔️ *Levántate y lucha*`
]

// 🐉 Función para obtener imagen aleatoria
function getRandomSadImage() {
  return sadImages[Math.floor(Math.random() * sadImages.length)]
}

// 🐉 Función para obtener mensaje aleatorio
function getRandomSadMessage(userTag) {
  const randomMsg = sadMessages[Math.floor(Math.random() * sadMessages.length)]
  return randomMsg.replace(/{user}/g, userTag)
}

// �️ Handler principal del comando .sad
const handler = async (m, { conn, args, command }) => {
  try {
    // Verificar si se menciona a alguien
    let userToSad = m.sender
    let mentionedUser = null

    // Si hay menciones en el mensaje
    if (m.mentionedJid && m.mentionedJid.length > 0) {
      mentionedUser = m.mentionedJid[0]
    } 
    // Si hay quoted message (responde a un mensaje)
    else if (m.quoted && m.quoted.sender) {
      mentionedUser = m.quoted.sender
    }
    // Si hay argumentos (número)
    else if (args[0]) {
      let number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
      mentionedUser = number
    }

    // Si se mencionó a alguien, usar ese usuario
    if (mentionedUser) {
      userToSad = mentionedUser
    }

    const userTag = `@${userToSad.split('@')[0]}`
    
    // Obtener imagen y mensaje aleatorio
    const sadImage = getRandomSadImage()
    const sadMessage = getRandomSadMessage(userTag)

    // Log en consola con estilo
    if (BEAST_MODE) {
      console.log(beastLogo)
      beastLog(`Usuario solicitó .sad: @${m.sender.split('@')[0]}`, 'info')
      if (mentionedUser) {
        beastLog(`Mencionando a: ${userTag}`, 'warning')
      }
      beastLog(`Usando imagen SAD #${sadImages.indexOf(sadImage) + 1}`, 'sad')
    }

    // Animación de "cargando" en consola
    if (BEAST_MODE) {
      const sadAnim = [
        "😢 Cargando tristeza...",
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
          title: `😢 MODO SAD - GOHAN BEAST`,
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
        react: {
          text: '😢',
          key: m.key
        }
      })
    } catch (e) {}

    beastLog(`Mensaje sad enviado exitosamente`, 'success')

  } catch (error) {
    beastLog(`Error: ${error.message}`, 'error')
    m.reply(`❌ *ERROR EN MODO SAD*

${colors.red}Ocurrió un error al enviar el mensaje.${colors.reset}

Intenta de nuevo más tarde.`)
  }
}

// 🐉 Configuración del handler
handler.command = ['sad', 'triste', 'melancolico', 'depre']
handler.tags = ['beast', 'efectos']
handler.help = [
  '.sad - Expresa tu tristeza',
  '.sad @usuario - Hacer sad a alguien',
  '.sad (respondiendo a mensaje) - Hacer sad a quien respondiste'
]

// 🐉 Descripción para el menú
handler.description = '😢 *MODO SAD* - Expresa tu tristeza con estilo Gohan Beast'

export default handler