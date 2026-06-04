import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: '📥 「 HINATA APK MOD 」 📥\n\n💫 » Busca APKs modificados\n\n> #apkmod <nombre>\n> #apkmod Free Fire\n> #apkmod Minecraft'
    }, { quoted: m })
  }

  await m.react('🔍')

  try {
    let apiUrl = `https://dv-yer-api.online/apkmodsearch?q=${encodeURIComponent(text)}&key=dvyer829163227334`
    let res = await fetch(apiUrl)
    let json = await res.json()

    if (!json.ok || !json.download_url) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: '📥 「 HINATA APK MOD 」 📥\n\n💫 » No se encontró: ' + text
      }, { quoted: m })
    }

    let { title, version, filesize, download_url, icon, mod_features } = json

    let texto = '📥 「 HINATA APK MOD 」 📥\n\n'
    texto += '📱 » *' + title + '*\n'
    texto += '📦 » Versión: ' + (version || 'N/A') + '\n'
    texto += '💾 » Tamaño: ' + (filesize || 'N/A') + '\n'

    if (mod_features && mod_features.length > 0) {
      texto += '🛠️ » Mod features incluidos\n'
    }

    texto += '\n> Enviando archivo...'

    await conn.sendMessage(m.chat, {
      image: { url: icon || 'https://files.catbox.moe/r60c8l.jpg' },
      caption: texto
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      document: { url: download_url },
      fileName: json.filename || title + '.apk',
      mimetype: 'application/vnd.android.package-archive'
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.sendMessage(m.chat, { text: '❌ Error al buscar' }, { quoted: m })
  }
}

handler.help = ['apkmod']
handler.tags = ['downloader']
handler.command = /^(apkmod|apk|modapk)$/i
handler.desc = 'Descarga APKs modificados'

export default handler