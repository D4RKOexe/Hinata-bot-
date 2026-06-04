let handler = async (m, { conn }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0, diamond: 0, inventory: [] }
    user = global.db.data.users[who]
  }

  if (!m.quoted) {
    return conn.sendMessage(m.chat, {
      text: '𖣔 「 HINATA CLAIM 」 ˚ʚ♡ɞ˚\n\n💫 » Responde a un #rw para reclamar\n\n> También puedes usarlo sin responder para reclamar tu propio personaje'
    }, { quoted: m })
  }

  let target = m.quoted.sender
  let esPropio = target === who

  if (!esPropio) {
    let misDiamantes = user.diamantes || user.diamond || 0
    if (misDiamantes < 3) {
      return conn.sendMessage(m.chat, {
        text: '𖣔 「 HINATA CLAIM 」 ˚ʚ♡ɞ˚\n\n💫 » Necesitas 3 💎 para robar\n💰 » Tienes: ' + misDiamantes
      }, { quoted: m })
    }
  }

  if (!global.lastRoll || !global.lastRoll[target]) {
    return conn.sendMessage(m.chat, {
      text: '𖣔 「 HINATA CLAIM 」 ˚ʚ♡ɞ˚\n\n💫 » No hay personaje pendiente de @' + target.split('@')[0],
      mentions: [target]
    }, { quoted: m })
  }

  let char = global.lastRoll[target]

  if (!user.inventory) user.inventory = []

  let rarityGemas = { 'SSR': 10, 'SR': 5, 'R': 2 }

  if (!esPropio) {
    if (user.diamantes !== undefined) {
      user.diamantes = (user.diamantes || 0) - 3
    } else {
      user.diamond = (user.diamond || 0) - 3
    }
  }

  user.inventory.push(char.name)

  if (esPropio) {
    if (user.diamantes !== undefined) {
      user.diamantes = (user.diamantes || 0) + (rarityGemas[char.rarity] || 0)
    } else {
      user.diamond = (user.diamond || 0) + (rarityGemas[char.rarity] || 0)
    }
  }

  let total = user.diamantes !== undefined ? user.diamantes : (user.diamond || 0)
  let rarityEmojis = { 'SSR': '🌟', 'SR': '⭐', 'R': '✨' }

  let texto = '𖣔 「 HINATA CLAIM 」 ˚ʚ♡ɞ˚\n\n'
  texto += '  💫 Personaje ' + (esPropio ? 'reclamado' : 'robado') + '\n\n'
  texto += '  ✦ ' + char.name + ' ✦\n'
  texto += '  ' + rarityEmojis[char.rarity] + ' Rareza: ' + char.rarity + '\n'
  texto += '  ⚔️ ' + char.attack + ' | 🛡️ ' + char.defense + ' | ❤️ ' + char.health + '\n'

  if (esPropio) {
    texto += '  💎 +' + (rarityGemas[char.rarity] || 0) + ' diamantes\n'
  } else {
    texto += '  💎 -3 diamantes (robo)\n'
    texto += '  🎯 Robado de @' + target.split('@')[0] + '\n'
  }

  texto += '  💰 Total: ' + total + ' 💎\n'
  texto += '  🎒 Guardado en inventario'

  delete global.lastRoll[target]

  let mentions = esPropio ? [] : [target]
  await conn.sendMessage(m.chat, { text: texto, mentions }, { quoted: m })
}

handler.help = ['claim']
handler.tags = ['gacha']
handler.command = /^(claim|reclamar)$/i
handler.desc = 'Reclama o roba un personaje de #rw'

export default handler