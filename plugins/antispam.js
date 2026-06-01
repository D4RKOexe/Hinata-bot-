// antispam.js
const spam = new Map()

let handler = async (m, { conn }) => {
  const user = m.sender
  const now = Date.now()

  if (!spam.has(user)) {
    spam.set(user, { count: 1, time: now })
    return
  }

  const data = spam.get(user)

  if (now - data.time < 5000) { // menos de 5 segundos entre mensajes
    data.count++

    if (data.count >= 5) {
      // Envía mensaje de advertencia
      await conn.sendMessage(m.chat, { text: `🚫 @${user.split('@')[0]}, ¡espera 5 segundos antes de enviar más comandos!` }, { mentions: [user] })
      throw '🚫 AntiSpam activado'
    }
  } else {
    data.count = 1
    data.time = now
  }

  spam.set(user, data)
}

// Se ejecuta antes que cualquier otro handler
handler.before = true

export default handler