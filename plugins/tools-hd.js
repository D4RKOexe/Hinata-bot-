import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!/image/.test(mime)) {
    return conn.reply(
      m.chat,
      '🖼️ Responde a una imagen con *.hd* para mejorar su calidad.',
      m
    )
  }

  await conn.reply(
    m.chat,
    '⏳ Mejorando calidad de la imagen...',
    m
  )

  let media = await q.download()

  // Sube la imagen usando la función que tenga tu bot
  let url = await conn.uploadFile(media)

  // Reemplaza esta API por la que utilices
  let api = `https://api.example.com/hd?url=${encodeURIComponent(url)}`

  let res = await fetch(api)
  let json = await res.json()

  if (!json.status) {
    throw '❌ No se pudo mejorar la imagen.'
  }

  await conn.sendMessage(m.chat, {
    image: { url: json.result },
    caption: '✨ Imagen mejorada en HD\n🌸 Elyssia Bot MD'
  }, { quoted: m })
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd']

export default handler