let cooldownsRobar = {}

let handler = async (m, { conn }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0, diamond: 0, inventory: [] }
    user = global.db.data.users[who]
  }

  let now = Date.now()
  let cd = cooldownsRobar[who] || 0
  let tiempoRestante = Math.ceil((cd - now) / 1000)

  if (now < cd) {
    let minutos = Math.floor(tiempoRestante / 60)
    let segundos = tiempoRestante % 60
    return conn.sendMessage(m.chat, {
      text: '🥷 「 HINATA ROBAR 」 🥷\n\n💫 » Espera ' + minutos + 'm ' + segundos + 's'
    }, { quoted: m })
  }

  let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null

  if (!target) {
    return conn.sendMessage(m.chat, {
      text: '🥷 「 HINATA ROBAR 」 🥷\n\n💫 » Menciona o responde a quien robar'
    }, { quoted: m })
  }

  if (target === who) {
    return conn.sendMessage(m.chat, {
      text: '🥷 「 HINATA ROBAR 」 🥷\n\n💫 » No te robes a ti mismo'
    }, { quoted: m })
  }

  let victim = global.db.data.users[target]
  if (!victim || !victim.inventory || victim.inventory.length === 0) {
    return conn.sendMessage(m.chat, {
      text: '🥷 「 HINATA ROBAR 」 🥷\n\n💫 » @' + target.split('@')[0] + ' no tiene personajes',
      mentions: [target]
    }, { quoted: m })
  }

  let misDiamantes = user.diamantes || user.diamond || 0

  if (misDiamantes < 3) {
    return conn.sendMessage(m.chat, {
      text: '🥷 「 HINATA ROBAR 」 🥷\n\n💫 » Necesitas 3 💎\n💰 » Tienes: ' + misDiamantes
    }, { quoted: m })
  }

  cooldownsRobar[who] = now + 600000

  if (Math.random() < 0.45) {
    if (user.diamantes !== undefined) {
      user.diamantes = misDiamantes - 3
    } else {
      user.diamond = misDiamantes - 3
    }

    let index = Math.floor(Math.random() * victim.inventory.length)
    let robado = victim.inventory[index]
    victim.inventory.splice(index, 1)

    if (!user.inventory) user.inventory = []
    user.inventory.push(robado)

    let total = user.diamantes !== undefined ? user.diamantes : (user.diamond || 0)

    let texto = '🥷 「 HINATA ROBAR 」 🥷\n\n'
    texto += '✅ » Robo exitoso\n\n'
    texto += '📦 » ' + robado + '\n'
    texto += '🎯 » De @' + target.split('@')[0] + '\n'
    texto += '💎 » -3 diamantes\n'
    texto += '💰 » Total: ' + total + ' 💎'

    await conn.sendMessage(m.chat, { text: texto, mentions: [target] }, { quoted: m })
  } else {
    if (user.diamantes !== undefined) {
      user.diamantes = misDiamantes - 3
    } else {
      user.diamond = misDiamantes - 3
    }

    let total = user.diamantes !== undefined ? user.diamantes : (user.diamond || 0)

    let mensajes = [
      '🚔 @' + target.split('@')[0] + ' te descubrió y llamó a la policía',
      '📸 Las cámaras grabaron todo, multa por robo',
      '🐕 El perro de @' + target.split('@')[0] + ' te mordió',
      '👊 @' + target.split('@')[0] + ' sabe karate y te golpeó'
    ]

    let texto = '🥷 「 HINATA ROBAR 」 🥷\n\n'
    texto += '❌ » Te atraparon\n\n'
    texto += mensajes[Math.floor(Math.random() * mensajes.length)] + '\n'
    texto += '💸 » Multa: 3 💎\n'
    texto += '💰 » Total: ' + total + ' 💎'

    await conn.sendMessage(m.chat, { text: texto, mentions: [target] }, { quoted: m })
  }
}

handler.help = ['robargacha']
handler.tags = ['gacha']
handler.command = /^(robar|robargacha)$/i
handler.desc = 'Roba un personaje del inventario de otro'

export default handler