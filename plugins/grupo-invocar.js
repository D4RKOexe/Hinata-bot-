let handler = async (m, { conn, participants, isOwner, isAdmin }) => {
  try {
    // 🌸 Verificación de grupo
    if (!m.isGroup) {
      return conn.reply(
        m.chat,
        `❌ *ELYSSIA MD - SISTEMA*\n\nEste comando solo puede ser usado en grupos.`,
        m
      )
    }

    // 🌸 Verificación de permisos
    if (!isAdmin && !isOwner) {
      return conn.reply(
        m.chat,
        `⚠️ *ELYSSIA MD - ACCESO DENEGADO*\n\nSolo administradores pueden ejecutar esta función.`,
        m
      )
    }

    const inicio = Date.now()

    // 🌸 Reacciones iniciales
    await m.react('🌸')
    await m.react('⚡')
    await m.react('✨')

    const mentions = participants.map(a => a.id)

    const tiempo = (Date.now() - inicio) / 1000

    const listaCompleta = mentions
      .map((jid, i) => `┃ ${i + 1}. @${jid.split('@')[0]}`)
      .join('\n')

    const mensaje =
`╭━━━━━━━━━━━━━━━━━━⬣
┃ 🌸 ELYSSIA MD • INVOCACIÓN TOTAL
╰━━━━━━━━━━━━━━━━━━⬣

✨ *Todos los miembros han sido sincronizados*

⚡ *Estado del sistema:* ACTIVADO
🌸 *Modo Elyssia:* INVOCACIÓN GLOBAL

👤 *Invocador:* @${m.sender.split('@')[0]}
👥 *Total de usuarios:* ${mentions.length}
⏱️ *Tiempo de ejecución:* ${tiempo.toFixed(2)}s
📅 *Fecha:* ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━⬣

🌸 *LISTA DE PARTICIPANTES*
${listaCompleta}

━━━━━━━━━━━━━━━━━━⬣

⚡ *Elyssia MD ha completado la sincronización global*
✨ Todos los usuarios han sido mencionados exitosamente
`

    await conn.sendMessage(m.chat, {
      text: mensaje,
      mentions,
      contextInfo: {
        mentionedJid: mentions,
        externalAdReply: {
          title: '🌸 ELYSSIA MD - INVOCACIÓN GLOBAL',
          body: `${mentions.length} usuarios sincronizados`,
          thumbnailUrl: 'https://i.ibb.co/5W7YrD6J/IMG-20260215-WA0190.jpg',
          sourceUrl: 'https://github.com/WILKER-OFC/Gohan-beast',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    await m.react('✅')
    await m.react('🌸')
    await m.react('✨')

  } catch (error) {
    console.error('ELYSSIA ERROR:', error)

    await m.react('❌')

    return conn.reply(
      m.chat,
      `❌ *ELYSSIA MD - ERROR DE SISTEMA*\n\n${error.message || 'Error desconocido'}`,
      m
    )
  }
}

// 🌸 Configuración del comando
handler.command = ['invocar', 'invocacion', 'todos', 'llamartodos']
handler.tags = ['grupo']
handler.help = ['invocar']
handler.group = true
handler.admin = true

export default handler