const handler = async (m, { conn }) => {

  // Crear estructura si no existe
  global.db = global.db || { data: { users: {} } }
  global.db.data.users = global.db.data.users || {}

  // Crear usuario automáticamente
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
      level: 1,
      exp: 0,
      money: 500,
      gems: 0,
      piedra: 0,
      hierro: 0,
      plata: 0,
      oro: 0,
      diamante: 0,
      registrado: Date.now()
    }
  }

  let user = global.db.data.users[m.sender]

  let nombre = await conn.getName(m.sender)

  let perfil = `
╭━━━〔 🌸 PERFIL ELYSSIA 🌸 〕━━━⬣

👤 Nombre
│ ${nombre}

🌷 Estadísticas
│ ⭐ Nivel: ${user.level}
│ ✨ XP: ${user.exp}
│ 💰 Coins: ${user.money}
│ 💎 Gems: ${user.gems}

⛏️ Minería
│ 🪨 Piedra: ${user.piedra}
│ ⛓️ Hierro: ${user.hierro}
│ 🥈 Plata: ${user.plata}
│ 🥇 Oro: ${user.oro}
│ 💎 Diamante: ${user.diamante}

🏆 Rango
│ ${
  user.level >= 50 ? '👑 Reina Elyssia' :
  user.level >= 30 ? '🌟 Leyenda' :
  user.level >= 15 ? '⚔️ Aventurera' :
  '🌱 Novata'
}

╰━━━━━━━━━━━━━━━━⬣

🌸 Sigue explorando para subir de nivel.
💖 Elyssia siempre te acompaña.
`

  await conn.sendMessage(
    m.chat,
    {
      text: perfil,
      mentions: [m.sender]
    },
    { quoted: m }
  )
}

handler.help = ['perfil']
handler.tags = ['eco']
handler.command = /^(perfil|profile|me)$/i

export default handler