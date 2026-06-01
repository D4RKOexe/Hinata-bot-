let cooldowns = {}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  if (!user) return

  // 🌸 Recursos generados
  let coin = pickRandom([200, 500, 700, 888, 1500, 2000, 2500, 3000, 5000, 9999])
  let emerald = pickRandom([10, 15, 20, 25, 30, 50])
  let iron = pickRandom([100, 150, 200, 250, 300, 400, 500, 600, 700, 800])
  let gold = pickRandom([200, 300, 400, 500, 600, 800, 1000])
  let coal = pickRandom([500, 600, 700, 800, 1000, 1200, 1500, 2000])
  let stone = pickRandom([2000, 3000, 4000, 5000, 6000, 7000, 8000, 10000])

  let img = 'https://adofiles.i11.eu/dl/uos9.jpg'

  let cooldownTime = 600000
  let now = Date.now()
  let nextMine = (user.lastmiming || 0) + cooldownTime

  // 🌸 Cooldown
  if (now < nextMine) {
    let wait = msToTime(nextMine - now)
    return conn.reply(
      m.chat,
      `
╭━━━〔 🌸 ELYSSIA MD • MINERÍA 〕━━━⬣

⚠️ Sistema en enfriamiento

⏳ Tiempo restante:
➜ ${wait}

💡 Elyssia MD está estabilizando los recursos del sistema.

╰━━━━━━━━━━━━━━━━━━⬣
      `.trim(),
      m,
      { ...global.rcanal }
    )
  }

  // 🌸 EXP
  let exp = Math.floor(Math.random() * 5000) + 2000

  let info =
`╭━━━〔 🌸 ELYSSIA MD • MINERÍA 〕━━━⬣

⛏️ *Extracción completada exitosamente*

📊 *RECURSOS OBTENIDOS:*

✨ XP: ${exp}
💰 Zeni: ${coin}
♦️ Esmeraldas: ${emerald}
🔩 Hierro: ${iron}
🏅 Oro: ${gold}
🕋 Carbón: ${coal}
🪨 Piedra: ${stone}

━━━━━━━━━━━━━━━━━━⬣

⚡ *Estado del sistema:* ACTIVO
🌸 Elyssia MD supervisa la extracción
`

  await conn.sendFile(m.chat, img, 'mina.jpg', info, m, { ...global.rcanal })
  await m.react('⛏️')

  // 🌸 Aplicar recompensas
  user.health -= 20
  user.pickaxedurability -= 15

  user.coin += coin
  user.emerald += emerald
  user.iron += iron
  user.gold += gold
  user.coal += coal
  user.stone += stone

  user.lastmiming = now

  global.db.write()
}

handler.help = ['minar']
handler.tags = ['eco']
handler.command = ['minar', 'mine', 'miming', 'elyssiamine']
handler.register = false
handler.group = false

export default handler

// 🌸 Utilidades
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes}m ${seconds}s`
}