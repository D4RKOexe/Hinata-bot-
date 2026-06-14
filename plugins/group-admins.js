let handler = async (m, { conn, participants, groupMetadata }) => {
  if (!m.isGroup) return conn.sendMessage(m.chat, { text: '👤 」 👤\n\n💫 » Solo para grupos' }, { quoted: m })

  let admins = participants.filter(p => p.admin)
  let owner = groupMetadata.owner

  let texto = '👤 「 DARKO ADMINS 」 👤\n\n'
  texto += 'Creador » @' + owner.split('@')[0] + '\n\n'

  for (let admin of admins) {
    let rol = admin.admin === 'superadmin' ? 'Creador' : 'Admin'
    texto += rol + ' » @' + admin.id.split('@')[0] + '\n'
  }

  let mentions = admins.map(a => a.id)
  mentions.push(owner)

  await conn.sendMessage(m.chat, { text: texto, mentions }, { quoted: m })
}

handler.help = ['admins']
handler.tags = ['group']
handler.command = /^(admins|administradores|staff)$/i
handler.desc = 'Lista de administradores del grupo'
handler.group = true

export default handler