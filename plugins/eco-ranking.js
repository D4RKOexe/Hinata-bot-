const handler = async (m, { conn }) => {

  let users = global.db.data.users

  // Convertir usuarios en array
  let sorted = Object.entries(users)
    .map(([id, data]) => ({
      id,
      exp: data.exp || 0,
      level: data.level || 0,
      coin: data.coin || 0
    }))
    .sort((a, b) => b.exp - a.exp)
    .slice(0, 10)

  let text = `
╭━━━〔 🏆 RANKING ELYSSIA 🌸 〕━━━⬣

🌟 TOP 10 JUGADORES

`

  for (let i = 0; i < sorted.length; i++) {
    let u = sorted[i]
    let name = await conn.getName(u.id)

    let emoji =
      i === 0 ? "👑" :
      i === 1 ? "🥈" :
      i === 2 ? "🥉" :
      "✨"

    text += `
${emoji} *${i + 1}.* ${name}
   ⭐ Nivel: ${u.level}
   ✨ XP: ${u.exp}
   🪙 Coins: ${u.coin}
`
  }

  text += `
╰━━━━━━━━━━━━━━━━━━⬣

🌸 Sigue jugando para entrar al TOP
💖 Elyssia te observa con orgullo
`

  await conn.sendMessage(
    m.chat,
    { text, mentions: sorted.map(u => u.id) },
    { quoted: m }
  )
}

handler.help = ['rank', 'ranking']
handler.tags = ['eco']
handler.command = /^(rank|ranking|top)$/i

export default handler