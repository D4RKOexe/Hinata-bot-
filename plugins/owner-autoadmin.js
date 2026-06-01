const handler = async (m, { conn, isAdmin, groupMetadata }) => {
  // Emojis de Elyssia MD
  const emojiSuccess = '👑'
  const emojiError = '⚠️'
  const emojiProcess = '🤖'

  if (isAdmin) {
    return m.reply(`${emojiSuccess} Elyssia MD dice: Ya eres un admin glorioso, no necesito coronarte de nuevo mi Creador.`)
  }

  try {
    // Promocionar al usuario
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
    
    await m.react('✅') // Confirmación visual

    // Mensaje estilizado
    m.reply(`
${emojiSuccess} ¡Felicidades! Elyssia MD te ha otorgado la corona de admin 👑
Ahora eres oficialmente un líder del grupo.
${emojiProcess} Recuerda usar tus poderes sabiamente.
    `)
  } catch (err) {
    console.error(err)
    m.reply(`${emojiError} Ups... Elyssia MD no pudo coronarte 😓
Tal vez no tengo permisos suficientes o ocurrió un error inesperado.`)
  }
}

handler.tags = ['owner']
handler.help = ['autoadmin']
handler.command = ['autoadmin']
handler.rowner = true
handler.group = true
handler.botAdmin = true

export default handler