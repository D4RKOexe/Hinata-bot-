import speed from 'performance-now'
import os from 'os'
import process from 'process'

let handler = async (m, { conn, usedPrefix }) => {
  const start = speed()

  await m.react('⚡')

  let sentMsg = await m.reply('🌸 *Elyssia MD* analizando sistema...')

  const latency = speed() - start

  // 🌸 Estado visual mejorado
  let status = ''
  let desc = ''
  let emoji = ''

  if (latency < 60) {
    status = '⚡ ULTRA FLUIDO'
    desc = 'Respuesta cuántica optimizada'
    emoji = '✨'
  } else if (latency < 150) {
    status = '🚀 RÁPIDO Y ESTABLE'
    desc = 'Procesamiento eficiente activo'
    emoji = '💫'
  } else if (latency < 300) {
    status = '🔥 NORMAL'
    desc = 'Ejecución estándar del sistema'
    emoji = '🌟'
  } else if (latency < 500) {
    status = '💨 CARGA ALTA'
    desc = 'Rendimiento afectado temporalmente'
    emoji = '☁️'
  } else {
    status = '🐌 CRÍTICO'
    desc = 'Sistema saturado o inestable'
    emoji = '⚠️'
  }

  // ⏱ Uptime bonito
  const uptime = process.uptime()
  const h = Math.floor(uptime / 3600)
  const m = Math.floor((uptime % 3600) / 60)
  const s = Math.floor(uptime % 60)

  // 💾 RAM real mejor calculada
  const totalMem = os.totalmem() / 1024 / 1024
  const freeMem = os.freemem() / 1024 / 1024
  const usedMem = totalMem - freeMem

  const hostname = os.hostname()
  const platform = `${os.platform()} ${os.arch()}`

  const result = `
╭━━━〔 🌸 ELYSSIA MD - SYSTEM PRO 〕━━━⬣

${emoji} *Estado:* ${status}
🧠 *Descripción:* ${desc}

📡 *Ping:* ${latency.toFixed(0)} ms
⏱️ *Uptime:* ${h}h ${m}m ${s}s

🖥️ *Servidor:* ${hostname}
💻 *Plataforma:* ${platform}

💾 *RAM:* ${usedMem.toFixed(0)}MB / ${totalMem.toFixed(0)}MB
⚙️ *Prefijo:* ${usedPrefix}

╰━━━━━━━━━━━━━━━━━━━━━━⬣
🌸 *Elyssia MD Bot • Online & Stable*
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
handler.command = /^(ping|p|speed|status|velocidad)$/i

export default handler