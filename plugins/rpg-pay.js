let handler = async (m, { conn, args }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { darkcoinss: 0, darkcoin: 0, bank: 0 }
    user = global.db.data.users[who]
  }

  let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null
  let cantidad = target ? parseInt(args[1]) : parseInt(args[0])

  if (!target || isNaN(cantidad) || cantidad <= 0) {
    return conn.sendMessage(m.chat, {
      text: '💸 「 DARKO PAY 」 💸\n\n💫 » Transfiere darkcoins\n\n> #pay @usuario <cantidad>'
    }, { quoted: m })
  }

  if (target === who) {
    return conn.sendMessage(m.chat, {
      text: '💸 「 DARK PAY 」 💸\n\n💫 » No te puedes pagar a ti mismo'
    }, { quoted: m })
  }

  let misDarkcoins = user.darkcoins || user.darcoin || 0

  if (misDarkcoins < cantidad) {
    return conn.sendMessage(m.chat, {
      text: '💸 「 DARKO PAY 」 💸\n\n💫 » No tienes suficientes darkcoins\n💰 » Tienes: ' + misDarkcoins + ' 💵'
    }, { quoted: m })
  }

  if (user.darkcoins !== undefined) {
    user.diamantes = misDarkcoins - cantidad
  } else {
    user.darkcoin = misDarkcoins - cantidad
  }

  let targetUser = global.db.data.users[target]
  if (!targetUser) {
    global.db.data.users[target] = { diamantes: 0, diamond: 0 }
    targetUser = global.db.data.users[target]
  }

  if (targetUser.darkcoins !== undefined) {
    targetUser.darkcoins = (targetUser.diamantes || 0) + cantidad
  } else {
    targetUser.darkcoin = (targetUser.darkcoin || 0) + cantidad
  }

  let miTotal = user.darkcoins || user.dqrkcoin || 0
  let suTotal = targetUser.darkcoins || targetUser.darkcoin || 0

  let texto = '💸 「 DARKO PAY 」 💸\n\n'
  texto += '✅ » Transferencia exitosa\n\n'
  texto += '📤 » @' + who.split('@')[0] + '\n'
  texto += '📥 » @' + target.split('@')[0] + '\n'
  texto += '💵 » ' + cantidad + ' diamantes\n\n'
  texto += '💰 Tu saldo: ' + miTotal + ' 💵'

  await conn.sendMessage(m.chat, { text: texto, mentions: [who, target] }, { quoted: m })
}

handler.help = ['pay']
handler.tags = ['rpg']
handler.command = /^(pay|pagar|transferir)$/i
handler.desc = 'Transfiere darkcoins a otro usuario'

export default handler