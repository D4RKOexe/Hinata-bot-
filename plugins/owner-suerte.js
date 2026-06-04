let suerteGacha = { activa: false, probSSR: 0.02, probSR: 0.15 }

let handler = async (m, { conn, args }) => {
  let who = m.sender
  let owners = ['59177474230@s.whatsapp.net', '573223090406@s.whatsapp.net']

  if (!owners.includes(who)) {
    return conn.sendMessage(m.chat, {
      text: '🍀 「 HINATA SUERTE GACHA 」 🍀\n\n💫 » Solo los creadores'
    }, { quoted: m })
  }

  if (!args[0]) {
    let estado = suerteGacha.activa ? '✅ Activada' : '❌ Desactivada'
    return conn.sendMessage(m.chat, {
      text: '🍀 「 HINATA SUERTE GACHA 」 🍀\n\n💫 » Estado: ' + estado + '\n🌟 » SSR: ' + (suerteGacha.probSSR * 100) + '%\n⭐ » SR: ' + (suerteGacha.probSR * 100) + '%\n\n> #suertegacha on/off\n> #suertegacha ssr <porcentaje>\n> #suertegacha normal'
    }, { quoted: m })
  }

  if (args[0] === 'on') {
    suerteGacha.activa = true
    global.suerteGacha = suerteGacha
    return conn.sendMessage(m.chat, {
      text: '🍀 「 HINATA SUERTE GACHA 」 🍀\n\n🌟 » Suerte activada\n📊 » SSR: ' + (suerteGacha.probSSR * 100) + '%\n📊 » SR: ' + (suerteGacha.probSR * 100) + '%\n\n> Todos tienen más suerte en #rw'
    }, { quoted: m })
  }

  if (args[0] === 'off') {
    suerteGacha.activa = false
    suerteGacha.probSSR = 0.02
    suerteGacha.probSR = 0.15
    global.suerteGacha = suerteGacha
    return conn.sendMessage(m.chat, {
      text: '🍀 「 HINATA SUERTE GACHA 」 🍀\n\n💫 » Suerte desactivada\n📊 » Probabilidades normales'
    }, { quoted: m })
  }

  if (args[0] === 'ssr') {
    let porcentaje = parseFloat(args[1])
    if (isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 50) {
      return conn.sendMessage(m.chat, {
        text: '🍀 「 HINATA SUERTE GACHA 」 🍀\n\n💫 » Porcentaje inválido (1-50)'
      }, { quoted: m })
    }
    suerteGacha.probSSR = porcentaje / 100
    if (suerteGacha.activa) global.suerteGacha = suerteGacha
    return conn.sendMessage(m.chat, {
      text: '🍀 「 HINATA SUERTE GACHA 」 🍀\n\n🌟 » SSR: ' + porcentaje + '%\n\n> Usa #suertegacha on para activar'
    }, { quoted: m })
  }

  if (args[0] === 'normal') {
    suerteGacha.probSSR = 0.02
    suerteGacha.probSR = 0.15
    if (suerteGacha.activa) global.suerteGacha = suerteGacha
    return conn.sendMessage(m.chat, {
      text: '🍀 「 HINATA SUERTE GACHA 」 🍀\n\n💫 » Probabilidades restauradas\n🌟 SSR: 2% | ⭐ SR: 13% | ✨ R: 85%'
    }, { quoted: m })
  }
}

handler.help = ['suerte']
handler.tags = ['owner']
handler.command = /^(suerte|luckgacha)$/i
handler.desc = 'Modifica probabilidades de la gacha'
handler.owner = true

export default handler