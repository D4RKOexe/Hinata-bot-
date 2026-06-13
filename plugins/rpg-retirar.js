let handler = async (m, { conn, args }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { darkcoins: 0, bank: 0 }
    user = global.db.data.users[who]
  }

  if (!args[0]) return conn.sendMessage(m.chat, { text: '⚔️ 「 DARKO RET 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❌ » Cantidad inválida\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n> #ret 100 | #ret all' }, { quoted: m })

  let cantidad = args[0].toLowerCase() === 'all' ? (user.bank || 0) : parseInt(args[0])
  if (isNaN(cantidad) || cantidad <= 0) return conn.sendMessage(m.chat, { text: '⚔️ 「 DARKO RET 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❌ » Cantidad inválida\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })
  if ((user.bank || 0) < cantidad) return conn.sendMessage(m.chat, { text: '⚔️ 「 DARKO RET 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❌ » No tienes tanto\n🏦 » Banco: ' + (user.bank || 0) + ' 💵\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })

  user.bank -= cantidad
  user.darkcoins = (user.darkcoins || 0) + cantidad

  await conn.sendMessage(m.chat, { text: '⚔️ 「 DARKO RET 」 ⚔️\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n✅ » Retiraste ' + cantidad + ' 💵\n🏦 » Banco: ' + user.bank + ' 💵\n💰 » Cartera: ' + user.darkcoins + ' 💵\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })
}

handler.help = ['retirar']
handler.tags = ['rpg']
handler.command = /^(ret|retirar)$/i
handler.desc = 'Retira darkcoins del banco'

export default handler