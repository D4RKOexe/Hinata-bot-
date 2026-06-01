// plugins/fun-adivina.js
let juegos = {} // Guardar juegos activos por usuario

let handler = async (m, { conn, usedPrefix: _p, text }) => {
  let user = m.sender.split('@')[0]

  // Crear juego si no existe
  if (!juegos[m.sender]) {
    let numero = Math.floor(Math.random() * 20) + 1
    juegos[m.sender] = {
      numero,
      intentos: 0
    }

    await conn.sendMessage(m.chat, {
      text: `
╔══════════════════╗
║ 🌸 *ELYSSIA MD - ADIVINA* 🌸
╚══════════════════╝

🦾 Guerrero: @${user}

✨ He elegido un número del 1 al 20.
🔮 ¡Intenta adivinarlo enviando: ${_p}adivina <número>!
💥 Tienes todo el poder de tu Ki para lograrlo!
      `,
      mentions: [m.sender]
    }, { quoted: m })

    return
  }

  // Si ya hay un juego activo
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ @${user}, ingresa un número para adivinar. Ejemplo: ${_p}adivina 5`,
      mentions: [m.sender]
    }, { quoted: m })
  }

  let numeroElegido = parseInt(text)
  let juego = juegos[m.sender]
  juego.intentos += 1

  if (isNaN(numeroElegido) || numeroElegido < 1 || numeroElegido > 20) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ @${user}, ingresa un número válido entre 1 y 20.`,
      mentions: [m.sender]
    }, { quoted: m })
  }

  if (numeroElegido === juego.numero) {
    delete juegos[m.sender]
    await conn.sendMessage(m.chat, {
      text: `
🎉 ¡Felicidades @${user}!
🔥 Adivinaste el número: *${numeroElegido}*
🌀 Intentos usados: ${juego.intentos}

💥 ¡El poder de tu Ki es impresionante!
      `,
      mentions: [m.sender]
    }, { quoted: m })
  } else {
    let pista = numeroElegido > juego.numero ? '⬇️ Demasiado alto' : '⬆️ Demasiado bajo'
    await conn.sendMessage(m.chat, {
      text: `⚡ @${user}, ${pista}... Intenta de nuevo.`,
      mentions: [m.sender]
    }, { quoted: m })
  }
}

handler.help = ['adivina <número>']
handler.tags = ['fun', 'beast']
handler.command = ['adivina', 'guessnumber', 'adivinanumero']
handler.register = false
handler.limit = false

export default handler