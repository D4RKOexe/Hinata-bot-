import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let handler = async (m, { conn, text }) => {
  if (!text) {
    let sections = [{
      title: '🔥 BÚSQUEDAS RÁPIDAS',
      rows: [
        { header: '🐉', title: 'Goku', description: 'Stickers de Goku', id: 'stickerly_Goku' },
        { header: '🍃', title: 'Naruto', description: 'Stickers de Naruto', id: 'stickerly_Naruto' },
        { header: '👒', title: 'Luffy', description: 'Stickers de Luffy', id: 'stickerly_Luffy' },
        { header: '😂', title: 'Meme', description: 'Stickers de memes', id: 'stickerly_Meme' }
      ]
    }]

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: '🌟 HINATA STICKERLY 🌟', subtitle: 'Busca paquetes de stickers', hasMediaAttachment: false },
      body: { text: '🌟 「 HINATA STICKERLY 」 🌟\n\n💫 » Busca stickers en Stickerly\n\n> #stickerly <búsqueda>\n> #stickerly Goku' },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🔍 BÚSQUEDAS',
            sections: sections
          })
        }]
      }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return
  }

  await m.react('🔍')

  try {
    let searchUrl = `https://api.delirius.store/search/stickerly?query=${encodeURIComponent(text)}`
    let res = await fetch(searchUrl)
    let json = await res.json()

    if (!json.status || !json.data?.length) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: '🌟 「 HINATA STICKERLY 」 🌟\n\n💫 » Sin resultados'
      }, { quoted: m })
    }

    let resultados = json.data.slice(0, 10)
    let rows = resultados.map((pack, i) => ({
      header: pack.isAnimated ? '🎬 Animado' : '🖼️ Estático',
      title: pack.name.substring(0, 35),
      description: '👤 ' + pack.author + ' | 📦 ' + pack.sticker_count + ' stickers',
      id: 'stickerlydl_' + i + '_' + Buffer.from(pack.url).toString('base64') + '_' + Buffer.from(pack.name).toString('base64')
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: '🌟 HINATA STICKERLY 🌟', subtitle: 'Selecciona un paquete', hasMediaAttachment: false },
      body: { text: '🌟 「 HINATA STICKERLY 」 🌟\n\n💫 » Búsqueda: ' + text + '\n📦 » ' + json.data.length + ' paquetes\n\n> Elige un paquete de stickers' },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '📦 PAQUETES',
            sections: [{ title: '📋 ' + text.toUpperCase(), rows }]
          })
        }]
      }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.sendMessage(m.chat, { text: '❌ Error al buscar' }, { quoted: m })
  }
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id || !id.startsWith('stickerlydl_')) return false

    let parts = id.split('_')
    let urlBase64 = parts[2]
    let nameBase64 = parts[3]
    let packUrl = Buffer.from(urlBase64, 'base64').toString()
    let packName = Buffer.from(nameBase64, 'base64').toString()

    await conn.sendMessage(m.chat, { text: '🌟 「 HINATA STICKERLY 」 🌟\n\n🔗 » ' + packUrl + '\n📦 » ' + packName + '\n\n> Abre el enlace para descargar los stickers' }, { quoted: m })

    return true

  } catch (e) {
    console.log(e)
    return false
  }
}

handler.help = ['stickerly']
handler.tags = ['downloader']
handler.command = /^(stickerly|stickers|stickerpack)$/i
handler.desc = 'Busca paquetes de stickers en Stickerly'

export default handler