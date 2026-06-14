import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0, diamond: 0, inventory: [] }
    user = global.db.data.users[who]
  }

  if (!global.lastRoll || !global.lastRoll[who]) {
    return conn.sendMessage(m.chat, {
      text: '🎁 「 DARKO CLAIM 」 🎁\n\n💫 » No tienes personaje pendiente\n\n> Usa #rw primero'
    }, { quoted: m })
  }

  let char = global.lastRoll[who]

  if (!user.inventory) user.inventory = []

  let rarityGemas = { 'SSR': 10, 'SR': 5, 'R': 2 }

  user.inventory.push(char.name)

  if (user.darkcoins !== undefined) {
    user.darkcoins = (user.darkcoins || 0) + (rarityGemas[char.rarity] || 0)
  } else {
    user.darkcoin = (user.darkcoin || 0) + (rarityGemas[char.rarity] || 0)
  }

  let total = user.darkcoins !== undefined ? user.darkcoins : (user.darkcoin || 0)
  let rarityEmojis = { 'SSR': '🌟', 'SR': '⭐', 'R': '✨' }

  let texto = '⛩ 「 DARKO CLAIM 」 ⛩\n\n'
  texto += '  💫 Personaje reclamado\n\n'
  texto += '  ✦ ' + char.name + ' ✦\n'
  texto += '  ' + rarityEmojis[char.rarity] + ' Rareza: ' + char.rarity + '\n'
  texto += '  ⚔️ ' + char.attack + ' | 🛡️ ' + char.defense + ' | ❤️ ' + char.health + '\n'
  texto += '  💵 +' + (rarityGemas[char.rarity] || 0) + ' diamantes\n'
  texto += '  💰 Total: ' + total + ' 💵\n'
  texto += '  🎒 Guardado en inventario'

  delete global.lastRoll[who]

  await conn.sendMessage(m.chat, {
    image: { url: char.image },
    caption: texto
  }, { quoted: m })
}

handler.help = ['claim']
handler.tags = ['gacha']
handler.command = /^(claim|reclamar)$/i
handler.desc = 'Reclama tu último personaje de #rw'

export default handler