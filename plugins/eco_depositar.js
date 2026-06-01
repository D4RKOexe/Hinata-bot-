import db from '../lib/database.js'

let handler = async (m, { args, conn }) => {
  let user = global.db.data.users[m.sender]
  let moneda = global.moneda || '💸'

  if (!args[0]) {
    return conn.reply(
      m.chat,
      `╭━━━〔 🌸 ELYSSIA MD • BANCO 〕━━━⬣

⚠️ Debes ingresar una cantidad para depositar.

👤 Usuario: @${m.sender.split('@')[0]}

📌 Ejemplos:
➜ deposit 5000
➜ dep all

💡 Protege tus recursos en el sistema bancario.

╰━━━━━━━━━━━━━━━━━━⬣`,
      m,
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  // 🌸 Depósito total
  if (args[0] === 'all') {
    let count = parseInt(user.coin)

    if (!count || count < 1) {
      return conn.reply(
        m.chat,
        `╭━━━〔 🌸 ELYSSIA MD • BANCO 〕━━━⬣

⚠️ No tienes recursos disponibles para depositar.

👤 Usuario: @${m.sender.split('@')[0]}

╰━━━━━━━━━━━━━━━━━━⬣`,
        m,
        { mentions: [m.sender], ...global.rcanal }
      )
    }

    user.coin -= count
    user.bank += count

    return conn.reply(
      m.chat,
      `╭━━━〔 🌸 ELYSSIA MD • TRANSACCIÓN 〕━━━⬣

✅ Depósito completado

👤 Usuario: @${m.sender.split('@')[0]}
💰 Cantidad: ${count} ${moneda}

🏦 Estado: Transferido al banco

💡 Tus recursos ahora están protegidos.

╰━━━━━━━━━━━━━━━━━━⬣`,
      m,
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  // 🌸 Validación numérica
  if (isNaN(args[0])) {
    return conn.reply(
      m.chat,
      `╭━━━〔 🌸 ELYSSIA MD • ERROR 〕━━━⬣

⚠️ Ingresa una cantidad válida.

📌 Ejemplo:
➜ deposit 5000

╰━━━━━━━━━━━━━━━━━━⬣`,
      m,
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  let count = parseInt(args[0])

  if (!user.coin || user.coin < 1) {
    return conn.reply(
      m.chat,
      `╭━━━〔 🌸 ELYSSIA MD • BANCO 〕━━━⬣

❌ No tienes fondos disponibles.

👤 Usuario: @${m.sender.split('@')[0]}

╰━━━━━━━━━━━━━━━━━━⬣`,
      m,
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  if (user.coin < count) {
    return conn.reply(
      m.chat,
      `╭━━━〔 🌸 ELYSSIA MD • BANCO 〕━━━⬣

⚠️ Fondos insuficientes

💰 Disponible: ${user.coin} ${moneda}
📉 Solicitado: ${count} ${moneda}

╰━━━━━━━━━━━━━━━━━━⬣`,
      m,
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  user.coin -= count
  user.bank += count

  await conn.reply(
    m.chat,
    `╭━━━〔 🌸 ELYSSIA MD • BANCO 〕━━━⬣

✅ Depósito exitoso

👤 Usuario: @${m.sender.split('@')[0]}
💰 Cantidad: ${count} ${moneda}

🏦 Estado: Seguro en el banco

✨ Elyssia MD ha protegido tus recursos correctamente.

╰━━━━━━━━━━━━━━━━━━⬣`,
    m,
    { mentions: [m.sender], ...global.rcanal }
  )
}

handler.help = ['deposit', 'depositar', 'dep']
handler.tags = ['eco']
handler.command = ['deposit', 'depositar', 'dep', 'guardar']
handler.group = false
handler.register = false

export default handler