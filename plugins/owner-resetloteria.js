import { loteria } from './rpg-loteria.js'

let handler = async (m, { conn }) => {
  let who = m.sender
  let owners = ['59177474230@s.whatsapp.net', '573223090406@s.whatsapp.net']

  if (!owners.includes(who)) {
    return conn.sendMessage(m.chat, { text: '🎫 」\n\n💫 » Solo creadores' }, { quoted: m })
  }

  loteria.boletos = {}
  loteria.totalRecaudado = 0
  loteria.activa = true

  await conn.sendMessage(m.chat, { text: '🎫 」\n\n✅ » Lotería reiniciada\n\n> 200 boletos | 1000 💎 c/u' }, { quoted: m })
}

handler.help = ['resetloteria']
handler.tags = ['owner']
handler.command = /^(resetloteria|resetloto)$/i
handler.desc = 'Reiniciar lotería'
handler.owner = true

export default handler