const handler = async (m, { conn }) => {

  let user = global.db.data.users[m.sender]

  let name = await conn.getName(m.sender)

  let perfil = `
╭━━━〔 🌸 ELYSSIA PROFILE 🌸 〕━━━⬣

👤 Usuario: ${name}

╭─〔 🌷 STATS 〕
│ ⭐ Nivel: ${user.level}
│ ✨ XP: ${user.exp}
│ 💰 Coins: ${user.coin}
│ 💎 Diamantes: ${user.diamond}
│ ❤️ Vida: ${user.health}
╰────────────⬣

╭─〔 🏦 BANCO 〕
│ 🏦 Guardado: ${user.bank}
╰────────────⬣

╭─〔 🏅 ESTADO 〕
│ 💎 Premium: ${user.premium ? 'Sí' : 'No'}
│ 📌 Registrado: ${user.registered ? 'Sí' : 'No'}
│ ⚔️ Estado: ${user.banned ? 'Baneado' : 'Activo'}
╰────────────⬣

🌸 Elyssia te acompaña en tu aventura
💖 Sube de nivel y conviértete en leyenda
`

  await conn.sendMessage(
    m.chat,
    { text: perfil, mentions: [m.sender] },
    { quoted: m }
  )
}

handler.help = ['perfil']
handler.tags = ['eco']
handler.command = /^(perfil|profile|me)$/i

export default handler