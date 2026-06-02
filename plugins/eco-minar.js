let minerales = [
  { nombre: '🪨 Piedra', cantidad: [1, 5] },
  { nombre: '⛓️ Hierro', cantidad: [1, 3] },
  { nombre: '🥈 Plata', cantidad: [1, 2] },
  { nombre: '🥇 Oro', cantidad: [1, 2] },
  { nombre: '💎 Diamante', cantidad: [1, 1] }
]

let cooldown = 300000 // 5 minutos

const handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  if (!user.mineria) user.mineria = 0

  let tiempo = cooldown - (Date.now() - user.mineria)

  if (tiempo > 0) {
    return conn.reply(
      m.chat,
`🌸 *Mina Elyssia* 🌸

Aún estás descansando, minera~ ⛏️

⏳ Regresa en:
*${msToTime(tiempo)}*

✨ La montaña seguirá esperándote.`,
      m
    )
  }

  let mineral = minerales[Math.floor(Math.random() * minerales.length)]

  let cantidad =
    Math.floor(
      Math.random() *
      (mineral.cantidad[1] - mineral.cantidad[0] + 1)
    ) + mineral.cantidad[0]

  switch (mineral.nombre) {
    case '🪨 Piedra':
      user.piedra = (user.piedra || 0) + cantidad
      break
    case '⛓️ Hierro':
      user.hierro = (user.hierro || 0) + cantidad
      break
    case '🥈 Plata':
      user.plata = (user.plata || 0) + cantidad
      break
    case '🥇 Oro':
      user.oro = (user.oro || 0) + cantidad
      break
    case '💎 Diamante':
      user.diamante = (user.diamante || 0) + cantidad
      break
  }

  let xp = Math.floor(Math.random() * 150) + 50
  let coins = Math.floor(Math.random() * 300) + 100

  user.exp += xp
  user.money += coins
  user.mineria = Date.now()

  conn.reply(
    m.chat,
`🌸 *MINA ELYSSIA* 🌸

⛏️ Has explorado una cueva misteriosa...

╭─「 RECOMPENSAS 」
│ ${mineral.nombre} × ${cantidad}
│ ✨ XP +${xp}
│ 💰 Coins +${coins}
╰────────────

🌷 ¡Excelente trabajo, minera!
💖 Sigue explorando para encontrar tesoros más raros.`,
    m
  )
}

handler.help = ['minar']
handler.tags = ['rpg']
handler.command = ['minar', 'mine']

export default handler

function msToTime(duration) {
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let seconds = Math.floor((duration / 1000) % 60)

  return `${minutes}m ${seconds}s`
}