import speed from 'performance-now'

let handler = async (m, { conn }) => {
  let start = speed()
  await conn.sendMessage(m.chat, { text: '⏳ » Hinata está midiendo su chakra...' }, { quoted: m })
  let end = speed()

  let vel = (end - start).toFixed(3)

  let emoji, frase, color
  let chakra = Math.floor(Math.random() * 100)

  if (vel < 80) {
    emoji = '⚡'
    frase = '¡DARKO ACTIVO/LIBERANDO POTENCIAL'
    color = '#00FF00'
  } else if (vel < 200) {
    emoji = '🌸'
    frase = 'DARKO ENTRENANDO,DEMOSTRTANDO POTENCIAL'
    color = '#7FFF00'
  } else if (vel < 400) {
    emoji = '🍥'
    frase = 'darko está cansado, velocidad normal'
    color = '#FFD700'
  } else if (vel < 700) {
    emoji = '😤'
    frase = 'Darko con mucho sueño, va lento'
    color = '#FF8C00'
  } else {
    emoji = '💤'
    frase = 'Darko se desmayó... soporte lo está llevando al hospital'
    color = '#FF0000'
  }

  let texto = emoji + ' 「 DARKO PING 」 ' + emoji + '\n'
  texto += '▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n'
  texto += frase + '\n\n'
  texto += '📊 Velocidad: ' + vel + ' ms\n'
  texto += '💙 Chakra: ' + chakra + '%\n\n'
  texto += '▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔'

  await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping|velocidad|speed)$/i
handler.desc = 'Mide la velocidad de Hinata'

export default handler