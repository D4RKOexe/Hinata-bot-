import yts from 'yt-search'
import fetch from 'node-fetch'

const API_KEY = 'dvyer079708280996'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🎬 Ingresa un nombre o enlace de YouTube.')

  await m.react('🎥')

  try {
    const search = await yts(text)
    if (!search.videos.length) return m.reply('❌ No encontré resultados.')

    const results = search.videos.slice(0, 4)

    let txt = `╭━━〔 🎬 PLAY2 SEARCH 〕━━⬣\n\n`
    txt += `Selecciona un video para descargar:\n\n`

    for (let i = 0; i < results.length; i++) {
      txt += `${i + 1}. ${results[i].title}\n`
    }

    txt += `\n🌸 ElyssiaMD 🌸`

    const buttons = results.map((v, i) => ({
      buttonId: `.play2dl ${encodeURIComponent(v.url)}`,
      buttonText: { displayText: `🎥 Video ${i + 1}` },
      type: 1
    }))

    await conn.sendMessage(
      m.chat,
      {
        image: { url: results[0].thumbnail },
        caption: txt,
        buttons,
        headerType: 4
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    m.reply('❌ Error en la búsqueda')
  }
}

// 🔥 DESCARGA REAL DEL VIDEO
export const play2dl = async (m, { conn, text }) => {
  if (!text) return m.reply('❌ URL inválida')

  await m.react('⏳')

  try {
    const url = decodeURIComponent(text)

    const wait = await conn.sendMessage(
      m.chat,
      { text: '⏳ Descargando video...' },
      { quoted: m }
    )

    const apiUrl =
      `https://dv-yer-api.online/ytmp4?url=${encodeURIComponent(url)}&apikey=${API_KEY}`

    const res = await fetch(apiUrl)

    if (!res.ok) {
      return m.reply(`❌ Error HTTP ${res.status}`)
    }

    const data = await res.json()

    const videoUrl =
      data.download ||
      data.url ||
      data.result?.download ||
      data.result?.url ||
      data.result?.download_url

    if (!videoUrl) {
      return m.reply('❌ No se encontró el video en la API')
    }

    const title = cleanName(
      data.title ||
      data.result?.title ||
      'video'
    )

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        text: `✅ Video enviado\n\n🎬 ${title}`,
        edit: wait.key
      }
    )

    await m.react('✅')

  } catch (e) {
    console.error(e)
    m.reply('❌ Error: ' + e.message)
    await m.react('💀')
  }
}

// 🧼 LIMPIAR NOMBRE
function cleanName(text) {
  return String(text)
    .replace(/[^\w\s.-]/g, '')
    .substring(0, 60)
}

handler.command = ['play2']
handler.tags = ['descargas']
handler.help = ['play2 <texto|url>']

export default handler