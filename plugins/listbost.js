let handler = async (m, { conn }) => {
  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== require('ws').CLOSED).map((conn) => conn)])]

  if (subBots.length === 0) {
    return conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/r60c8l.jpg' },
      caption: '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA SUB-BOTS ㅤ֢ㅤׄㅤׅ\n\n❥ 🤖 No hay Sub-Bots activos\n\n> Usa #qr o #code para crear uno\n\n⫏⫏ HINATA BOT ✿'
    }, { quoted: m })
  }

  let fotosSubBot = [
    'https://files.catbox.moe/r60c8l.jpg',
    'https://files.catbox.moe/zthq3s.jpeg',
    'https://files.catbox.moe/qyjtab.jpeg',
    'https://files.catbox.moe/xjn6am.jpeg',
    'https://files.catbox.moe/ug1ecw.jpeg',
    'https://files.catbox.moe/ap5nos.jpeg',
    'https://files.catbox.moe/j3z3eo.jpeg',
    'https://files.catbox.moe/r60c8l.jpg',
    'https://files.catbox.moe/zthq3s.jpeg',
    'https://files.catbox.moe/qyjtab.jpeg'
  ]

  let texto = '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA SUB-BOTS ㅤ֢ㅤׄㅤׅ\n\n'

  for (let i = 0; i < subBots.length; i++) {
    let bot = subBots[i]
    let name = bot.authState?.creds?.me?.name || bot.user?.name || 'Hinata Sub-Bot ' + (bot.numero || (i + 1))
    let jid = bot.user?.jid || 'Desconocido'
    texto += '🤖 » *' + name + '*\n'
    texto += '   🆔 » ' + jid.split('@')[0] + '\n\n'
  }

  texto += '⫏⫏ HINATA BOT ✿\n\n'
  texto += '> Total: ' + subBots.length + '/10 Sub-Bots activos'

  let fotoIndex = Math.floor(Math.random() * subBots.length) % fotosSubBot.length

  await conn.sendMessage(m.chat, {
    image: { url: fotosSubBot[fotoIndex] },
    caption: texto
  }, { quoted: m })
}

handler.help = ['listbots']
handler.tags = ['serbot']
handler.command = /^(listbots|subbots|botslist)$/i
handler.desc = 'Muestra los Sub-Bots activos'

export default handler