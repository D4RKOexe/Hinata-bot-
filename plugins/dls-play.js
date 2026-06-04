import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.sender
  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { diamantes: 0 }
    user = global.db.data.users[who]
  }

  if (!text) {
    let media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/r60c8l.jpg' } }, { upload: conn.waUploadToServer })

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'HINATA BOT - PLAY',
        subtitle: 'Busca y descarga de YouTube',
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },
      body: {
        text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT - PLAY ㅤ֢ㅤׄㅤׅ\n\n❥ *COMANDO:* ' + usedPrefix + command + '\n\n> Envía el nombre o link de YouTube\n> 💎 Cuesta 2 diamantes por descarga'
      },
      footer: {
        text: '⫏⫏ HINATA BOT ✿'
      },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🎵 YOUTUBE',
            sections: [{
              title: '🔗 BÚSQUEDA',
              rows: [{
                header: '📥 DESCARGAR',
                title: '🎵 PEGAR LINK O NOMBRE',
                description: '💎 2 diamantes | Ejemplo: Paulo Londra',
                id: 'play '
              }]
            }]
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

  if ((user.diamantes || 0) < 2) {
    return conn.sendMessage(m.chat, {
      text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❥ ❌ No tienes suficientes diamantes\n\n💎 Necesitas: 2 diamantes\n💰 Tienes: ' + (user.diamantes || 0) + ' diamantes\n\n> Usa #work para ganar'
    }, { quoted: m })
  }

  await m.react('🎵')

  let query = text.trim()
  let isDirectLink = query.includes('youtu.be') || query.includes('youtube.com')

  try {
    if (!isDirectLink) {
      const searchUrl = `https://api.delirius.store/search/ytsearch?q=${encodeURIComponent(query)}`
      const searchRes = await fetch(searchUrl)
      const searchData = await searchRes.json()

      if (!searchData.status || !searchData.result?.length) {
        throw new Error('No se encontraron resultados')
      }

      const resultados = searchData.result.slice(0, 10)
      let primeraMiniatura = resultados[0].thumbnail || ''

      let media = null
      if (primeraMiniatura) {
        media = await prepareWAMessageMedia({ image: { url: primeraMiniatura } }, { upload: conn.waUploadToServer })
      }

      const rows = resultados.map((video, i) => ({
        header: '🎵 ' + (video.channel || 'Desconocido'),
        title: video.title.substring(0, 35),
        description: '⏱️ ' + (video.duration || '?') + ' | 👁️ ' + (video.views || '?'),
        id: 'select_' + i + '_' + Buffer.from(video.url).toString('base64') + '_' + Buffer.from(video.title).toString('base64')
      }))

      const interactiveMessage = proto.Message.InteractiveMessage.create({
        header: {
          title: 'HINATA BOT - PLAY',
          subtitle: 'Selecciona una canción',
          hasMediaAttachment: !!media,
          imageMessage: media ? media.imageMessage : undefined
        },
        body: {
          text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ RESULTADOS ㅤ֢ㅤׄㅤׅ\n\n❥ *BÚSQUEDA:* ' + query + '\n\n> Elige una opción\n> 💎 2 diamantes al descargar'
        },
        footer: {
          text: '⫏⫏ HINATA BOT ✿'
        },
        nativeFlowMessage: {
          buttons: [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: '🎵 RESULTADOS',
              sections: [{ title: '📋 ' + query.toUpperCase(), rows }]
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

    let media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/r60c8l.jpg' } }, { upload: conn.waUploadToServer })

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'HINATA BOT - PLAY',
        subtitle: 'Elige formato',
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },
      body: {
        text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ DESCARGAR ㅤ֢ㅤׄㅤׅ\n\n❥ *ENLACE:* ' + query + '\n\n> Elige audio o video\n> 💎 Cuesta 2 diamantes'
      },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '📥 FORMATO',
            sections: [{
              title: '🎵 ELIGE',
              rows: [
                { header: '🎧 AUDIO', title: 'Descargar MP3', description: '💎 2 diamantes', id: 'dl_audio_' + Buffer.from(query).toString('base64') },
                { header: '🎬 VIDEO', title: 'Descargar MP4', description: '💎 2 diamantes', id: 'dl_video_' + Buffer.from(query).toString('base64') }
              ]
            }]
          })
        }]
      }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (error) {
    console.log(error)
    await m.react('❌')
    conn.sendMessage(m.chat, { text: '❌ Error al procesar' }, { quoted: m })
  }
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id) return false

    if (id.startsWith('select_')) {
      const parts = id.split('_')
      const urlBase64 = parts[2]
      const titleBase64 = parts[3]
      const videoUrl = Buffer.from(urlBase64, 'base64').toString()
      const videoTitle = Buffer.from(titleBase64, 'base64').toString()

      let media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/r60c8l.jpg' } }, { upload: conn.waUploadToServer })

      const interactiveMessage = proto.Message.InteractiveMessage.create({
        header: {
          title: 'HINATA BOT - DESCARGAR',
          subtitle: videoTitle.substring(0, 60),
          hasMediaAttachment: true,
          imageMessage: media.imageMessage
        },
        body: {
          text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ DESCARGAR ㅤ֢ㅤׄㅤׅ\n\n❥ *TÍTULO:* ' + videoTitle + '\n\n> Elige audio o video\n> 💎 Cuesta 2 diamantes'
        },
        footer: { text: '⫏⫏ HINATA BOT ✿' },
        nativeFlowMessage: {
          buttons: [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: '📥 FORMATO',
              sections: [{
                title: '🎵 ELIGE',
                rows: [
                  { header: '🎧 AUDIO', title: 'Descargar MP3', description: '💎 2 diamantes', id: 'dl_audio_' + Buffer.from(videoUrl).toString('base64') + '_' + Buffer.from(videoTitle).toString('base64') },
                  { header: '🎬 VIDEO', title: 'Descargar MP4', description: '💎 2 diamantes', id: 'dl_video_' + Buffer.from(videoUrl).toString('base64') + '_' + Buffer.from(videoTitle).toString('base64') }
                ]
              }]
            })
          }]
        }
      })

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
      }, { quoted: m })

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
      return true
    }

    if (id.startsWith('dl_audio_') || id.startsWith('dl_video_')) {
      let who = m.sender
      let user = global.db.data.users[who]
      if (!user) {
        global.db.data.users[who] = { diamantes: 0 }
        user = global.db.data.users[who]
      }

      if ((user.diamantes || 0) < 2) {
        await conn.sendMessage(m.chat, { text: '❌ No tienes 2 diamantes. Usa #work para ganar' }, { quoted: m })
        return true
      }

      const parts = id.split('_')
      const isAudio = parts[1] === 'audio'
      const urlBase64 = parts[2]
      const titleBase64 = parts[3] || ''
      const videoUrl = Buffer.from(urlBase64, 'base64').toString()
      const videoTitle = titleBase64 ? Buffer.from(titleBase64, 'base64').toString() : 'Desconocido'

      user.diamantes -= 2

      await m.react('⏳')
      await conn.sendMessage(m.chat, { text: '⏳ Descargando ' + (isAudio ? 'audio' : 'video') + '...\n💎 -2 diamantes' }, { quoted: m })

      const apiUrl = isAudio
        ? `https://api.delirius.store/download/ytmp3?url=${encodeURIComponent(videoUrl)}`
        : `https://api-de-el-vigilante-8jnf.onrender.com/download/ytvideo?url=${encodeURIComponent(videoUrl)}`

      const response = await fetch(apiUrl)
      const result = await response.json()

      if (!result.status || !result.result?.download_url) {
        user.diamantes += 2
        throw new Error('No se pudo descargar, diamantes devueltos')
      }

      const downloadUrl = result.result.download_url
      const title = result.result.title || videoTitle

      const tmpDir = path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

      const filePath = path.join(tmpDir, Date.now() + (isAudio ? '.mp3' : '.mp4'))
      const fileRes = await fetch(downloadUrl)
      const fileBuffer = await fileRes.buffer()
      fs.writeFileSync(filePath, fileBuffer)

      if (isAudio) {
        await conn.sendMessage(m.chat, {
          audio: fs.readFileSync(filePath),
          mimetype: 'audio/mpeg',
          fileName: title + '.mp3'
        }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, {
          video: fs.readFileSync(filePath),
          mimetype: 'video/mp4',
          fileName: title + '.mp4'
        }, { quoted: m })
      }

      fs.unlinkSync(filePath)
      await conn.sendMessage(m.chat, { text: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ\n\n❥ ✅ Descarga completada\n\n🎵 ' + title + '\n💎 Restantes: ' + user.diamantes + '\n\n⫏⫏ HINATA BOT ✿' }, { quoted: m })
      await m.react('✅')
      return true
    }

    return false

  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, { text: '❌ Error: ' + e.message }, { quoted: m })
    await m.react('❌')
    return true
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|mp3|mp4|ytaudio|ytvideo|ytmp3|ytmp4|musica|cancion|video)$/i
handler.desc = 'Busca y descarga música/video de YouTube 💎2'

export default handler