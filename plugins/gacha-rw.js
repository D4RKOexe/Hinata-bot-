import fs from 'fs'
import path from 'path'

let cooldownsGacha = {}

let handler = async (m, { conn }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0, exp: 0, level: 0, inventory: [] }
    user = global.db.data.users[who]
  }

  let now = Date.now()
  let cd = cooldownsGacha[who] || 0
  let tiempoRestante = Math.ceil((cd - now) / 1000)

  if (now < cd) {
    let minutos = Math.floor(tiempoRestante / 60)
    let segundos = tiempoRestante % 60
    return conn.sendMessage(m.chat, {
      text: '🔮 「 HINATA GACHA 」 🔮\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » Espera ' + minutos + 'm ' + segundos + 's\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦'
    }, { quoted: m })
  }

  let gachaPath = path.join(process.cwd(), 'gacha.json')

  if (!fs.existsSync(gachaPath)) {
    return conn.sendMessage(m.chat, {
      text: '🔮 「 HINATA GACHA 」 🔮\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » No hay personajes\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦'
    }, { quoted: m })
  }

  let characters = JSON.parse(fs.readFileSync(gachaPath, 'utf8'))

  if (!user.inventory) user.inventory = []

  let random = Math.random()
  let rarity

  if (random < 0.02) {
    rarity = 'SSR'
  } else if (random < 0.15) {
    rarity = 'SR'
  } else {
    rarity = 'R'
  }

  let pool = characters.filter(c => c.rarity === rarity)
  if (pool.length === 0) pool = characters

  let char = pool[Math.floor(Math.random() * pool.length)]

  user.inventory.push(char.name)
  cooldownsGacha[who] = now + 180000

  let rarityEmojis = { 'SSR': '🌟', 'SR': '⭐', 'R': '✨' }

  let texto = '🔮 「 HINATA GACHA 」 🔮\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n'
  texto += '  💫 Invocando...\n\n'
  texto += '  ✦ ' + char.name + ' ✦\n'
  texto += '  ' + rarityEmojis[rarity] + ' Rareza: ' + rarity + '\n'
  texto += '  ⚔️ ' + char.attack + ' | 🛡️ ' + char.defense + ' | ❤️ ' + char.health + '\n\n'
  texto += '  🎒 Guardado en inventario\n\n'
  texto += '✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n> ⏳ 3 minutos | #rw'

  await conn.sendMessage(m.chat, {
    image: { url: char.image },
    caption: texto
  }, { quoted: m })
}

handler.help = ['rw']
handler.tags = ['gacha']
handler.command = /^(rw|roll|gacha)$/i
handler.desc = 'Tira de la gacha'

export default handler