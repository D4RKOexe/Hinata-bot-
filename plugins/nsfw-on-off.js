const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
    const primaryBot = global.db.data.chats[m.chat].primaryBot
    if (primaryBot && conn.user.jid !== primaryBot) throw !1
    
    const chat = global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    
    let type = command.toLowerCase()
    let isEnable = chat[type] !== undefined ? chat[type] : false
    
    if (args[0] === 'on' || args[0] === 'enable') {
        if (isEnable) return conn.reply(m.chat, `ꕥ *${type}* ya estaba *activado*.`, m)
        isEnable = true
    } else if (args[0] === 'off' || args[0] === 'disable') {
        if (!isEnable) return conn.reply(m.chat, `ꕥ *${type}* ya estaba *desactivado*.`, m)
        isEnable = false
    } else {
        return conn.reply(m.chat, `「✦」Un administrador puede activar o desactivar el *${command}* utilizando:\n\n● _Activar_ » *${usedPrefix}${command} enable*\n● _Desactivar_ » *${usedPrefix}${command} disable*\n\nꕥ Estado actual » *${isEnable ? '✓ Activado' : '✗ Desactivado'}*`, m)
    }
    
    // Solo manejar NSFW
    if (!m.isGroup) {
        if (!isOwner) {
            global.dfail('group', m, conn)
            throw false
        }
    } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
    }
    
    chat.nsfw = isEnable
    conn.reply(m.chat, `❀ Has *${isEnable ? 'activado' : 'desactivado'}* el *${type}* para este grupo.`, m)
}

handler.help = ['nsfw', 'modohorny']
handler.tags = ['nable']
handler.command = ['nsfw', 'modohorny']
handler.group = true

export default handler