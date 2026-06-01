import speed from 'performance-now'
import os from 'os'
import process from 'process'

let handler = async (m, { conn, usedPrefix }) => {
  let timestamp = speed()

  await m.react('⚡')

  let sentMsg = await m.reply('🤖 *Elyssia MD iniciando diagnóstico del sistema...*')

  let latency = speed() - timestamp

  // Estado según latencia
  let estado = ''
  let tecnica = ''
  let emoji = ''

  if (latency < 50) {
    estado = '⚡ *MODO ULTRA INSTANTE*'
    tecnica = 'Respuesta cuántica optimizada'
    emoji = '✨'
  } else if (latency < 150) {
    estado = '🚀 *MODO RÁPIDO ESTABLE*'
    tecnica = 'Procesamiento acelerado IA'
    emoji = '💫'
  } else if (latency < 300) {
    estado = '🔥 *MODO NORMAL ACTIVO*'
    tecnica = 'Ejecución estándar del sistema'
    emoji = '🌟'
  } else if (latency < 500) {
    estado = '💨 *MODO LENTO ADVERTENCIA*'
    tecnica = 'Carga alta en servidores'
    emoji = '☁️'
  } else {
    estado = '🐌 *MODO CRÍTICO LENTO*'
    tecnica = 'Sistema sobrecargado'
    emoji = '⚠️'
  }

  // Información adicional
  const uptime = process.uptime() // en segundos
  const hours = Math.floor(uptime / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  const seconds = Math.floor(uptime % 60)

  const totalMem = os.totalmem() / 1024 / 1024 // MB
  const usedMem = (os.totalmem() - os.freemem()) / 1024 / 1024 // MB

  const hostname = os.hostname()
  const platform = os.platform() + ' ' + os.arch()

  const result = `
╭━━━〔 ⚡ ELYSSIA MD SYSTEM ⚡ 〕━━━⬣

${emoji} ${estado}

📊 *Ping:* ${latency.toFixed(0)} ms
🧠 *Estado:* ${tecnica}

🖥️ *Servidor:* ${hostname} (${platform})
⏱️ *Tiempo activo:* ${hours}h ${minutes}m ${seconds}s
💾 *RAM usada:* ${usedMem.toFixed(0)} MB / ${totalMem.toFixed(0)} MB
📌 *Prefijo:* ${usedPrefix}

⬣ Bot: 🤖 Elyssia MD
⬣ Owner: 👑 AmílcarGit
⬣ Sistema: Online

╰━━━━━━━━━━━━━━━━━━⬣
`

  try {
    await conn.sendMessage(m.chat, {
      text: result,
      edit: sentMsg.key
    })
  } catch {
    await m.reply(result)
  }

  await m.react('✅')
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping|p|velocidad|speed|status)$/i

export default handler