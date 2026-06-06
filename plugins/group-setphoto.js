let handler = async (m, { conn }) => {
  let who = m.sender
  const groupMetadata = await conn.groupMetadata(m.chat)
  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net'
  const botAdmin = groupMetadata.participants.find(p => p.id === botId)
  const senderAdmin = groupMetadata.participants.find(p => p.id === who)

  if (!botAdmin?.admin) {
    return conn.sendMessage(m.chat, {
      text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Necesito ser administrador\n\n> Dame permisos de admin para usar este comando'
    }, { quoted: m })
  }

  if (!senderAdmin?.admin) {
    return conn.sendMessage(m.chat, {
      text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Solo administradores\n\n> No tienes permisos para usar este comando'
    }, { quoted: m })
  }

  const quoted = m.quoted || m
  const mime = quoted?.mimetype || ''

  if (!mime.startsWith('image/')) {
    return conn.sendMessage(m.chat, {
      text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Envía o responde una imagen\n\n> Úsalo respondiendo a una foto'
    }, { quoted: m })
  }

  await m.react('⏳')

  try {
    const media = await quoted.download()
    await conn.updateProfilePicture(m.chat, media)

    await conn.sendMessage(m.chat, {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Foto del grupo actualizada\n\n> Solicitado por @${who.split('@')[0]}`,
      mentions: [who]
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    await conn.sendMessage(m.chat, {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ No se pudo cambiar la foto\n\n> ${e.message}`
    }, { quoted: m })
  }
}

handler.help = ['setphoto']
handler.tags = ['group']
handler.command = /^setphoto$/i
handler.desc = 'Cambia la foto del grupo'
handler.group = true
handler.botAdmin = true


export default handler
