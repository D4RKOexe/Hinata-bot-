import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

const VIDEO_QUALITY = '360p'
const GOHAN_API = 'https://api-gohan-v1.onrender.com'

const _processing = new Set()

function safeFileName(name) {
  return String(name || 'media').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'media'
}
function extractYouTubeUrl(text) {
  const m = String(text || '').match(/https?:\/\/(?:www\.)?(?:youtube\.com|music\.youtube\.com|youtu\.be)\/[^\s]+/i)
  return m ? m[0].trim() : ''
}
function isHttpUrl(v) { return /^https?:\/\//i.test(String(v || '')) }
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
  const res = await fetch(`${GOHAN_API}/search/youtube?q=${encodeURIComponent(query)}`)
  const data = await res.json()
  if (!data.status || !data.result?.length) throw new Error('No se encontraron resultados.')
  const video = data.result[0]
  return {
    videoUrl: video.url,
    title: safeFileName(video.title || 'media'),
    thumbnail: video.thumbnail || '',
  }
}

async function sendVideo(conn, m, videoUrl, title) {
  const res = await fetch(`${GOHAN_API}/download/ytvideo?url=${encodeURIComponent(videoUrl)}`)
  const json = await res.json()
  if (!json.status || !json.result?.download_url) throw new Error('No se pudo obtener el video.')

  const downloadUrl = json.result.download_url
  const finalTitle = safeFileName(json.result.title || title)

  try {
    let videoRes = await fetch(downloadUrl)
    let videoBuffer = await videoRes.buffer()
    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `${finalTitle}.mp4`,
      caption: `🎬 ${finalTitle}\n🎚️ ${json.result.quality || VIDEO_QUALITY}`,
    }, { quoted: m })
    return finalTitle
  } catch {
    await conn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      mimetype: 'video/mp4',
      fileName: `${finalTitle}.mp4`,
    }, { quoted: m })
    return finalTitle
  }
}

async function sendAudio(conn, m, videoUrl, title) {
  const res = await fetch(`${GOHAN_API}/download/ytaudio?url=${encodeURIComponent(videoUrl)}`)
  const json = await res.json()
  if (!json.status || !json.result?.download_url) throw new Error('No se pudo obtener el audio.')

  const downloadUrl = json.result.download_url
  const finalTitle = safeFileName(json.result.title || title)

  try {
    let audioRes = await fetch(downloadUrl)
    let audioBuffer = await audioRes.buffer()
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: false,
    }, { quoted: m })
  } catch {
    await conn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${finalTitle}.mp3`,
    }, { quoted: m })
  }

  if (json.result.thumbnail) {
    await conn.sendMessage(m.chat, {
      image: { url: json.result.thumbnail },
      caption: `🎵 ${finalTitle}`,
    }, { quoted: m })
  }

  return finalTitle
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const msgKey = `main_${m.id || m.key?.id}`
  if (_processing.has(msgKey)) return
  _processing.add(msgKey)
  setTimeout(() => _processing.delete(msgKey), 15000)

  let user = global.db.data.users[m.sender]
  if (!user) {
    global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }
    user = global.db.data.users[m.sender]
  }

  const input = text?.trim()

  if (!input) {
    let media = null
    try {
      media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/r60c8l.jpg' } }, { upload: conn.waUploadToServer })
    } catch {}

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'HINATA BOT - YOUTUBE', subtitle: 'Descarga música y videos', hasMediaAttachment: !!media, imageMessage: media?.imageMessage },
      body: { text: `🎬 」\n\n💫 » Descarga audio o video de YouTube\n\n> ${usedPrefix}${command} <nombre o link>\n> 💎 1 diamante por descarga` },
      footer: { text: '⫏⫏ HINATA BOT ✿' },
      nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🎬 YOUTUBE', sections: [{ title: '¿Qué deseas descargar?', rows: [{ header: '🎵 AUDIO', title: 'Descargar MP3', description: '🎧 Alta calidad | 💎 1', id: 'ytchoose|audio' }, { header: '🎬 VIDEO', title: 'Descargar MP4', description: `📹 ${VIDEO_QUALITY} | 💎 1`, id: 'ytchoose|video' }] }] }) }] }
    })

    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return
  }

  if (isHttpUrl(input) && !extractYouTubeUrl(input)) {
    return conn.sendMessage(m.chat, { text: '❌ Envía un link válido de YouTube.' }, { quoted: m })
  }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    return conn.sendMessage(m.chat, { text: `❌ No tienes diamantes\n💰 Tienes: ${diamantes}\n\n> Usa #work` }, { quoted: m })
  }

  await m.react('🔍')
  await conn.sendMessage(m.chat, { text: `🔍 Buscando: *${input}*...` }, { quoted: m })

  let videoUrl, title, thumbnail
  try {
    if (extractYouTubeUrl(input)) {
      videoUrl = extractYouTubeUrl(input)
      title = 'video'
      thumbnail = null
    } else {
      const search = await searchYouTube(input)
      videoUrl = search.videoUrl
      title = search.title
      thumbnail = search.thumbnail
    }
  } catch (e) {
    await m.react('❌')
    return conn.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m })
  }

  let media = null
  if (thumbnail) {
    try { media = await prepareWAMessageMedia({ image: { url: thumbnail } }, { upload: conn.waUploadToServer }) } catch {}
  }

  const urlB64 = Buffer.from(videoUrl).toString('base64')
  const titleB64 = Buffer.from(title).toString('base64')

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    header: { title: 'HINATA BOT - YOUTUBE', subtitle: title, hasMediaAttachment: !!media, imageMessage: media?.imageMessage },
    body: { text: `🎬 」\n\n💫 » *${title}*\n\n> ¿Audio o video?\n> 💎 1 diamante` },
    footer: { text: '⫏⫏ HINATA BOT ✿' },
    nativeFlowMessage: { buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🎬 YOUTUBE', sections: [{ title: 'Elige formato', rows: [{ header: '🎵 AUDIO', title: 'Descargar MP3', description: '🎧 Alta calidad | 💎 1', id: `ytdl~audio~${urlB64}~${titleB64}` }, { header: '🎬 VIDEO', title: 'Descargar MP4', description: `📹 ${VIDEO_QUALITY} | 💎 1`, id: `ytdl~video~${urlB64}~${titleB64}` }] }] }) }] }
  })

  const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } }, { quoted: m })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.before = async (m, { conn }) => {
  if (m.isBaileys) return false

  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  let id
  try { const data = JSON.parse(nativeFlow.paramsJson || '{}'); id = data.id || data.selectedId || data.selectedRowId || null } catch { return false }
  if (!id || !id.startsWith('ytdl~')) return false

  const parts = id.split('~')
  if (parts.length < 4) return true

  const tipo = parts[1]
  const urlB64 = parts[2]
  const titleB64 = parts[3]

  let videoUrl, title
  try {
    videoUrl = Buffer.from(urlB64, 'base64').toString()
    title = Buffer.from(titleB64, 'base64').toString()
  } catch { return true }

  let user = global.db.data.users[m.sender]
  if (!user) { global.db.data.users[m.sender] = { diamantes: 0, diamond: 0 }; user = global.db.data.users[m.sender] }

  const diamantes = getDiamantes(user)
  if (diamantes < 1) {
    await conn.sendMessage(m.chat, { text: `❌ No tienes 1 diamante\n💰 Tienes: ${diamantes}\n\n> Usa #work` }, { quoted: m })
    return true
  }

  restarDiamante(user)
  const restantes = getDiamantes(user)

  await m.react('⏳')
  await conn.sendMessage(m.chat, { text: tipo === 'audio' ? `🎵 Descargando audio...\n💎 -1 diamante` : `🎬 Descargando video...\n💎 -1 diamante` }, { quoted: m })

  try {
    let finalTitle
    if (tipo === 'audio') {
      finalTitle = await sendAudio(conn, m, videoUrl, title)
    } else {
      finalTitle = await sendVideo(conn, m, videoUrl, title)
    }

    await conn.sendMessage(m.chat, { text: `✅ Descarga completada\n\n${tipo === 'audio' ? '🎵' : '🎬'} » ${finalTitle || title}\n💎 Restantes: ${restantes}` }, { quoted: m })
    await m.react('✅')

  } catch (e) {
    devolverDiamante(user, diamantes)
    console.log('[YT ERROR]', e.message)
    await m.react('❌')
    await conn.sendMessage(m.chat, { text: `❌ ${e.message || 'Error al descargar'}\n💎 Diamante devuelto` }, { quoted: m })
  }

  return true
}

handler.help = ['yt', 'play', 'video']
handler.tags = ['downloader']
handler.command = /^(yt|ytmp3|ytmp4|video|mp3|song|play)$/i
handler.desc = 'Descarga audio o video de YouTube 💎1'

export default handler