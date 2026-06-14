let handler = async (m, { conn }) => {
  await m.react('⏳')

  try {
    const ppUrl = await conn.profilePictureUrl(m.chat, 'image')

    await conn.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: `🤝 ㅤׄㅤׅㅤׄ DARKO BOT ㅤ֢ㅤׄㅤׅ\n\n🎴 Foto del grupo`
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    await conn.sendMessage(m.chat, {
      text: '🥀 ㅤׄㅤׅㅤׄ DARKO BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Este grupo no tiene foto'
    }, { quoted: m })
  }
}

handler.help = ['fotogrupo']
handler.tags = ['group']
handler.command = /^fotogrupo$/i
handler.desc = 'Obtiene la foto del grupo'
handler.group = true

export default handler
