let handler = async (m, { conn, isAdmin, text }) => {
  if (!m.isGroup) return conn.sendMessage(m.chat, { text: '👥 「 HINATA SETWELCOME 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❥ Solo para grupos\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })
  if (!isAdmin) return conn.sendMessage(m.chat, { text: '👥 「 HINATA SETWELCOME 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n❥ Solo administradores\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔' }, { quoted: m })

  let chat = global.db.data.chats[m.chat]

  if (!text) {
    let msg = chat?.sWelcome || 'No personalizado'
    return conn.sendMessage(m.chat, {
      text: '👥 「 HINATA SETWELCOME 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n📝 » Actual: ' + msg + '\n\n📋 » Variables: @user, @group, @members\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n> #setwelcome texto | #setwelcome default'
    }, { quoted: m })
  }

  if (text.toLowerCase() === 'default') {
    chat.sWelcome = ''
    return conn.sendMessage(m.chat, {
      text: '👥 「 HINATA SETWELCOME 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n✅ » Mensaje por defecto restaurado\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔'
    }, { quoted: m })
  }

  chat.sWelcome = text
  return conn.sendMessage(m.chat, {
    text: '👥 「 HINATA SETWELCOME 」 👥\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n✅ » Mensaje guardado\n📝 » ' + text + '\n\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔'
  }, { quoted: m })
}

handler.help = ['setwelcome']
handler.tags = ['group']
handler.command = /^(setwelcome|setbienvenida)$/i
handler.desc = 'Personaliza bienvenida'
handler.admin = true

export default handler