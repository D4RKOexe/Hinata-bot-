let cooldownsWeekly = {}

let handler = async (m, { conn }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0, lastWeekly: 0 }
    user = global.db.data.users[who]
  }

  let now = Date.now()
  let last = user.lastWeekly || 0
  let diff = now - last
  let cooldown = 604800000

  if (diff < cooldown) {
    let restante = cooldown - diff
    let dias = Math.floor(restante / 86400000)
    let horas = Math.floor((restante % 86400000) / 3600000)
    return conn.sendMessage(m.chat, {
      text: '⚡ 「 DARKO WEEKLY 」 ˚⚡˚\n\n💫 » Ya reclamaste\n⏳ » Vuelve en ' + dias + 'd ' + horas + 'h'
    }, { quoted: m })
  }

  user.darkcoins = (user.darkcoins || 0) + 500
  user.lastWeekly = now

  let texto = '⚡ 「 DARKO WEEKLY 」 ˚⚡˚\n\n'
  texto += '🎁 » Recompensa semanal\n'
  texto += '💵 » +500 darkcoins\n'
  texto += '💰 » Total: ' + user.darkcoins + ' 💵\n\n'
  texto += '> Vuelve en 7 días'

  await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
}

handler.help = ['weekly']
handler.tags = ['rpg']
handler.command = /^(weekly|semanal|don)$/i
handler.desc = 'Recompensa semanal de 500 💵'

export default handler