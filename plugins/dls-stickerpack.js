// © 2026 EL VIGILANTE & BRAYANRK - HINATA BOT
// No quitar créditos

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const query = text?.trim()

  if (!query) return conn.sendMessage(m.chat, {
    text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Descarga packs de stickers\n\n> ${usedPrefix}${command} <tema>\n> Ejemplo: ${usedPrefix}${command} anime`
  }, { quoted: m })

  await m.react('🔍')

  try {
    const res = await fetch(`https://api.delirius.store/tools/stickerpack?query=${encodeURIComponent(query)}&page=0`)
    const json = await res.json()

    if (!json.status || !json.data) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ No se encontraron stickers\n\n> Intenta con otro tema`
      }, { quoted: m })
    }

    const { title, username, total, stickers } = json.data

    await conn.sendMessage(m.chat, {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❀ Pack: *${title}*\n❀ Autor: *${username}*\n❀ Total: *${total} stickers*\n\n> Enviando stickers...`
    }, { quoted: m })

    await m.react('⏳')

    for (const url of stickers) {
      try {
        await conn.sendMessage(m.chat, {
          sticker: { url }
        }, { quoted: m })
      } catch {}
    }

    await m.react('✅')

  } catch (e) {
    await m.react('❌')
    await conn.sendMessage(m.chat, {
      text: `𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❌ Error al obtener stickers\n\n> ${e.message}`
    }, { quoted: m })
  }
}

handler.help = ['stickerpack']
handler.tags = ['downloader']
handler.command = /^(stickerly|stickerpack|spack)$/i
handler.desc = 'Descarga packs de stickers de getstickerpack'

export default handler
