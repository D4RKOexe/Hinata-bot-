import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

const YOSOYYO_API = 'https://yosoyyo-api-ofc.onrender.com/api/youtube'
const API_KEY = 'yosoyyo_sk_04ly3dm7'

function safeFileName(name) {
  return String(name || 'media').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'media'
}
function getDiamantes(user) {
  return user?.diamantes ?? user?.diamond ?? 0
}
function restarDiamante(user) {
  if (user.diamantes !== undefined) user.diamantes = (user.diamantes || 0) - 1
  else user.diamond = (user.diamond || 0) - 1
}
function devolverDiamante(user, anterior) {
  if (user.diamantes !== undefined) user.diamantes = anterior
  else user.diamond = anterior
}

async function searchYouTube(query) {
  const res = await fetch(`${YOSOYYO_API}?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`)
  const data = await res.json()
  if (data.status !== 200 || !data.result?.length) throw new Error('No se encontraron resultados.')
  return data.result
}

async function getDownloads(videoUrl) {
  const res = await fetch(`${YOSOYYO_API}?url=${encodeURIComponent(videoUrl)}&apiKey=${API_KEY}`)
  const data = await res.json()
  if (data.status !== 200) throw new Error('No se pudo obtener descargas.')
  
  let video = data.result?.[0] || data.result || data
  let mp3 = video.downloads?.v2?.download?.mp3 || video.downloads?.mp3?.url || video.download?.mp3 || ''
  let mp4 = video.downloads?.v2?.download?.mp4 || video.downloads?.mp4?.url || video.download?.mp4 || ''
  
  return { mp3, mp4, title: video.title || '' }
}

async function sendVideo(conn, m, videoUrl, title) {
  const downloads = await getDownloads(videoUrl)
  if (!downloads.mp4) throw new Error('No se pudo obtener el video.')

  const finalTitle = safeFileName(downloads.title || title)
  try {
    let videoRes = await fetch(downloads.mp4)
    let videoBuffer = await videoRes.buffer()
    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `${finalTitle}.mp4`,
      caption: `🎬 ${finalTitle}`,
    }, { quoted: m })
    return finalTitle
  } catch {
    await conn.sendMessage(m.chat, {
      document: { url: downloads.mp4 },
      mimetype: 'video/mp4',
      fileName: `${finalTitle}.mp4`,
    }, { quoted: m })
    return finalTitle
  }
}

async function sendAudio(conn, m, videoUrl, title) {
  const downloads = await getDownloads(videoUrl)
  if (!downloads.mp3) throw new Error('No se pudo obtener el audio.')

  const finalTitle = safeFileName(downloads.title || title)
  try {
    let audioRes = await fetch(downloads.mp3)
    let audioBuffer = await audioRes.buffer()
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: false,
    }, { quoted: m })
  } catch {
    await conn.sendMessage(m.chat, {
      document: { url: downloads.mp3 },
      mimetype: 'audio/mpeg',
      fileName: `${finalTitle}.mp3`,
    }, { quoted: m })
  }

  return finalTitle
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) { global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[m.sender] }

  if (!text) {
    let media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/r60c8l.jpg' } }, { upload: conn.waUploadToServer }).catch(() => null)

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - YOUTUBE', subtitle: 'Busca y descarga música/videos', hasMediaAttachment: true, imageMessage: media?.imageMessage },
      body: { text: `🎬 」\n\n💫 » Busca y descarga de YouTube\n\n> ${usedPrefix}${command} <nombre>\n> 💎 1 diamante` },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🎬 YOUTUBE', sections: [{ title: '🔍 BUSCAR', rows: [{ header: '🎵', title: 'Buscar canción', description: '💎 1 diamante', id: 'play ' }] }] }) }] }
    })

    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return
  }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) return conn.sendMessage(m.chat, { text: `❌ No tienes diamantes\n💰 Tienes: ${diamantes}\n\n> Usa #work` }, { quoted: m })

  await m.react('🔍')

  try {
    let resultados = await searchYouTube(text)
    let primeraImagen = resultados[0].thumbnailUrl || ''
    let media = primeraImagen ? await prepareWAMessageMedia({ image: { url: primeraImagen } }, { upload: conn.waUploadToServer }).catch(() => null) : null

    let rows = resultados.slice(0, 10).map((video, i) => ({
      header: '🎵 ' + (video.channelName || 'Desconocido'),
      title: video.title.substring(0, 35),
      description: '⏱️ ' + (video.duration || '?'),
      id: 'ytyy_' + i + '_' + Buffer.from(video.videoUrl).toString('base64') + '_' + Buffer.from(video.title).toString('base64')
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - YOUTUBE', subtitle: 'Selecciona un video', hasMediaAttachment: !!media, imageMessage: media?.imageMessage },
      body: { text: `🎬 」\n\n💫 » Búsqueda: ${text}\n\n> Elige un video\n> 💎 1 diamante` },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🎬 RESULTADOS', sections: [{ title: '📋 ' + text.toUpperCase(), rows }] }) }] }
    })

    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m })
  }
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  let id
  try { const data = JSON.parse(nativeFlow.paramsJson || '{}'); id = data.id || data.selectedId || data.selectedRowId || null } catch { return false }
  if (!id || !id.startsWith('ytyy_')) return false

  let parts = id.split('_')
  let urlBase64 = parts[2], titleBase64 = parts[3]
  let videoUrl = Buffer.from(urlBase64, 'base64').toString()
  let title = Buffer.from(titleBase64, 'base64').toString()

  let user = global.db.data.users[m.sender]
  if (!user) { global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[m.sender] }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    await conn.sendMessage(m.chat, { text: `❌ No tienes 1 diamante\n💰 Tienes: ${diamantes}\n\n> Usa #work` }, { quoted: m })
    return true
  }

  let sections = [{
    title: '🎵 FORMATO',
    rows: [
      { header: '🎧 MP3', title: 'Descargar Audio', description: 'Solo música | 💎 1', id: 'ytyydl_mp3_' + urlBase64 + '_' + titleBase64 },
      { header: '🎬 MP4', title: 'Descargar Video', description: 'Video | 💎 1', id: 'ytyydl_mp4_' + urlBase64 + '_' + titleBase64 }
    ]
  }]

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    header: { title: 'HINATA BOT - YOUTUBE', subtitle: title.substring(0, 60), hasMediaAttachment: false },
    body: { text: `🎬 」\n\n💫 » Elige el formato\n\n🎧 MP3 | 🎬 MP4\n💎 1 diamante` },
    footer: { text: '⫏⫏ HINATA BOT ✿' },
    nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '📥 DESCARGAR', sections: sections }) }] }
  })

  const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  return true
}

handler.after = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  let id
  try { const data = JSON.parse(nativeFlow.paramsJson || '{}'); id = data.id || data.selectedId || data.selectedRowId || null } catch { return false }
  if (!id || !id.startsWith('ytyydl_')) return false

  let parts = id.split('_')
  let tipo = parts[1], urlBase64 = parts[2], titleBase64 = parts[3]
  let videoUrl = Buffer.from(urlBase64, 'base64').toString()
  let title = Buffer.from(titleBase64, 'base64').toString()

  let user = global.db.data.users[m.sender]
  if (!user) { global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[m.sender] }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    await conn.sendMessage(m.chat, { text: `❌ No tienes 1 diamante` }, { quoted: m })
    return true
  }

  restarDiamante(user)
  const restantes = getDiamantes(user)

  await m.react('⏳')
  await conn.sendMessage(m.chat, { text: `⏳ Descargando ${tipo === 'mp3' ? 'audio' : 'video'}...\n💎 -1 diamante` }, { quoted: m })

  try {
    let finalTitle
    if (tipo === 'mp3') {
      finalTitle = await sendAudio(conn, m, videoUrl, title)
    } else {
      finalTitle = await sendVideo(conn, m, videoUrl, title)
    }

    await conn.sendMessage(m.chat, { text: `✅ Descarga completada\n\n${tipo === 'mp3' ? '🎵' : '🎬'} » ${finalTitle || title}\n💎 Restantes: ${restantes}` }, { quoted: m })
    await m.react('✅')

  } catch (e) {
    devolverDiamante(user, diamantes)
    console.log('[YT ERROR]', e.message)
    await m.react('❌')
    await conn.sendMessage(m.chat, { text: `❌ ${e.message || 'Error al descargar'}\n💎 Diamante devuelto` }, { quoted: m })
  }

  return true
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|yt|youtube|musica|cancion)$/i
handler.desc = 'Busca y descarga música/video de YouTube 💎1'

export default handler