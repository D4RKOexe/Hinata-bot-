import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    let apiUrl = 'https://api.delirius.store/reactions/angry'
    let res = await fetch(apiUrl)
    let json = await res.json()

    if (!json.status || !json.data?.url) {
      return conn.sendMessage(m.chat, { text: '❌ No se pudo obtener la reacción' }, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
      video: { url: json.data.url },
      caption: '😡 「 HINATA ANGRY 」 😡',
      gifPlayback: true
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    conn.sendMessage(m.chat, { text: '❌ Error' }, { quoted: m })
  }
}

handler.help = ['angry']
handler.tags = ['anime']
handler.command = /^(angry|enojado)$/i
handler.desc = 'Reacción anime angry'

export default handler