 // antispam-pro.js

const users = new Map()

const CONFIG = {
  interval: 5000,      // ventana de tiempo (5s)
  maxCommands: 4,      // máximo permitido
  cooldown: 15000,     // castigo (15s)
  warnLimit: 3         // avisos antes del cooldown
}

let handler = m => m

handler.before = async function (m, { isAdmin, isOwner }) {

  // Ignorar mensajes del bot
  if (m.isBaileys) return

  // Ignorar admins y owner
  if (isAdmin || isOwner) return

  // Solo comandos
  if (!m.text || !m.text.startsWith(global.prefix)) return

  const id = m.sender
  const now = Date.now()

  if (!users.has(id)) {
    users.set(id, {
      count: 0,
      warns: 0,
      last: now,
      cooldown: 0
    })
  }

  const user = users.get(id)

  // Cooldown activo
  if (user.cooldown > now) {

    const left = Math.ceil(
      (user.cooldown - now) / 1000
    )

    throw `🚫 Espera *${left}s* antes de usar más comandos.`
  }

  // Reiniciar contador
  if (now - user.last > CONFIG.interval) {
    user.count = 0
  }

  user.count++
  user.last = now

  // Detectar spam
  if (user.count > CONFIG.maxCommands) {

    user.warns++

    if (user.warns >= CONFIG.warnLimit) {

      user.cooldown = now + CONFIG.cooldown
      user.warns = 0

      await this.reply(
        m.chat,
        `🚫 @${id.split('@')[0]}\n\n` +
        `Has excedido el límite de comandos.\n` +
        `⏳ Bloqueado por *${CONFIG.cooldown / 1000}s*`,
        m,
        { mentions: [id] }
      )

      throw false
    }

    await this.reply(
      m.chat,
      `⚠️ @${id.split('@')[0]}\n` +
      `Spam detectado.\n` +
      `Advertencia ${user.warns}/${CONFIG.warnLimit}`,
      m,
      { mentions: [id] }
    )

    throw false
  }

  // Limpieza automática
  if (users.size > 1000) {
    for (const [uid, data] of users) {
      if (now - data.last > 600000) {
        users.delete(uid)
      }
    }
  }
}

export default handler