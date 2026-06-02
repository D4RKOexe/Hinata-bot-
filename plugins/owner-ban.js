let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🌸 Uso: #ban @usuario motivo 💫')

  // Obtener ID del usuario
  let who = m.mentionedJid?.[0] || (text.split(' ')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net')
  if (!who) return m.reply('❌ Por favor etiqueta o escribe el número del usuario 🌸')

  // Motivo del baneo
  let reason = text.split(' ').slice(1).join(' ') || 'Sin especificar 🌺'

  // Inicializar usuario si no existe
  global.db.data.users[who] = global.db.data.users[who] || {}
  global.db.data.users[who].banned = true
  global.db.data.users[who].bannedReason = reason

  // Mensaje de confirmación
  await conn.reply(m.chat, `✨ Usuario baneado con éxito 🌸\n\n👤 Usuario: ${who}\n📌 Motivo: ${reason}\n💫 Solo el dueño del bot puede revertir esto.`, m)
}

handler.help = ['ban <@usuario> <motivo>']
handler.tags = ['owner']
handler.command = ['ban']
handler.rowner = true // Solo el dueño puede usarlo

export default handler