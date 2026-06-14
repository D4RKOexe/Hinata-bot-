let handler = async (m, { conn, args }) => {
  let who = m.sender
  let owners = ['51913454004@s.whatsapp.net', '51937012839@s.whatsapp.net']

  if (!owners.includes(who)) {
    return conn.sendMessage(m.chat, {
      text: '💎 「 DARKO DAR DARKCOINS 」 💎\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » Solo los creadores pueden usar esto\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦'
    }, { quoted: m })
  }

  let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : who
  let cantidad = target === who ? parseInt(args[0]) : parseInt(args[1])

  if (isNaN(cantidad) || cantidad <= 0) {
    return conn.sendMessage(m.chat, {
      text: '💎 「 DARKO DAR DARKCOINS 」 💎\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » Cantidad inválida\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n> #dardarkcoins 100\n> #dardarkcoins @usuario 100'
    }, { quoted: m })
  }

  let user = global.db.data.users[target]
  if (!user) {
    global.db.data.users[target] = { darkcoins: 0, bank: 0, exp: 0, level: 0 }
    user = global.db.data.users[target]
  }

  user.darkcoins = (user.darkcoins || 0) + cantidad
  global.markDatabaseModified()

  await conn.sendMessage(m.chat, {
    text: '💎 「 DARKO DAR DARKCOINS 」 💎\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦\n\n💫 » Darkcoins entregados\n\n👤 » @' + target.split('@')[0] + '\n💵 » +' + cantidad + ' darkcoins\n💰 » Total: ' + user.darkcoins + ' 💵\n\n✦•┈๑⋅⋯ ⋯⋅๑┈•✦',
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['dardarkcoins']
handler.tags = ['owner']
handler.command = /^(dardarkcoinss|dardinero|adddiamantes)$/i
handler.desc = 'Da darkcoins a un usuario'

export default handler