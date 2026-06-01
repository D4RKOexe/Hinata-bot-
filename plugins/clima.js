import fetch from 'node-fetch'

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply('🌸 Escribe una ciudad o lugar.\nEjemplo: .climapro Lima')

  try {
    let res = await fetch(`https://wttr.in/${encodeURIComponent(text)}?format=j1`)
    let data = await res.json()
    if (!data.current_condition) return m.reply('❌ No se encontró la ciudad, prueba otra.')

    let current = data.current_condition[0]
    let forecast = data.weather.slice(0, 3) // pronóstico 3 días
    let img = `https://wttr.in/${encodeURIComponent(text)}.png`

    // Mensaje principal
    let mensaje = `
╔══════════════════════╗
║ 🌤️ 𝙲𝙻𝙸𝙼𝙰 𝚄𝙻𝚃𝚁𝙰 𝙿𝚁𝙾 ║
╠══════════════════════╣
📍 Lugar: ${text}
☁️ Estado: ${current.weatherDesc[0].value}
🌡️ Temp: ${current.temp_C}°C
🤒 Sensación: ${current.FeelsLikeC}°C
💧 Humedad: ${current.humidity}%
🌬️ Viento: ${current.windspeedKmph} km/h
🔹 Presión: ${current.pressure} hPa
╚══════════════════════╝
`

    // Botones
    const buttons = [
      { buttonId: `.climahoy ${text}`, buttonText: { displayText: '🌤️ Clima Actual' }, type: 1 },
      { buttonId: `.climapron ${text}`, buttonText: { displayText: '📅 Pronóstico 3 días' }, type: 1 },
      { buttonId: `.climamap ${text}`, buttonText: { displayText: '🗺️ Ver Mapa' }, type: 1 }
    ]

    const buttonMessage = {
      image: { url: img },
      caption: mensaje,
      footer: '✨ Elyssia MD - Clima Ultra PRO ✨',
      buttons: buttons,
      headerType: 4
    }

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error obteniendo el clima. Intenta otra ciudad.')
  }
}

handler.help = ['climapro']
handler.tags = ['info']
handler.command = ['climapro', 'weatherpro', 'climaultra']
handler.register = false

export default handler