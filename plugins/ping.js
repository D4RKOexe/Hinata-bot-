import speed from 'performance-now'
import os from 'os'
import process from 'process'

const formatBytes = bytes => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const runtime = seconds => {
  seconds = Number(seconds)

  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor(seconds % (3600 * 24) / 3600)
  const m = Math.floor(seconds % 3600 / 60)
  const s = Math.floor(seconds % 60)

  return `${d}d ${h}h ${m}m ${s}s`
}

let handler = async (m, { conn, usedPrefix }) => {

  const start = speed()

  await m.react('⚡')

  const msg = await m.reply('🔍 Analizando sistema Elyssia MD...')

  const ping = (speed() - start).toFixed(2)

  const cpus = os.cpus()

  const cpuModel = cpus[0].model
  const cpuCores = cpus.length
  const cpuSpeed = cpus[0].speed

  const totalRam = os.totalmem()
  const freeRam = os.freemem()
  const usedRam = totalRam - freeRam

  const ramPercent = ((usedRam / totalRam) * 100).toFixed(1)

  const nodeMemory = process.memoryUsage()

  let estado = '🟢 Excelente'
  let emoji = '🚀'

  if (ping > 150) {
    estado = '🟡 Estable'
    emoji = '⚡'
  }

  if (ping > 300) {
    estado = '🟠 Cargado'
    emoji = '🔥'
  }

  if (ping > 500) {
    estado = '🔴 Crítico'
    emoji = '⚠️'
  }

  const txt = `
╭━━━〔 ${emoji} ELYSSIA MD MONITOR ${emoji} 〕━━━⬣

⚡ *PING DEL SISTEMA*
│ ◦ ${ping} ms
│ ◦ Estado: ${estado}

🖥️ *SERVIDOR*
│ ◦ Host: ${os.hostname()}
│ ◦ OS: ${os.platform()} ${os.arch()}
│ ◦ Kernel: ${os.release()}

🧠 *CPU*
│ ◦ Modelo: ${cpuModel}
│ ◦ Núcleos: ${cpuCores}
│ ◦ Frecuencia: ${cpuSpeed} MHz

💾 *MEMORIA RAM*
│ ◦ Uso: ${formatBytes(usedRam)}
│ ◦ Libre: ${formatBytes(freeRam)}
│ ◦ Total: ${formatBytes(totalRam)}
│ ◦ Carga: ${ramPercent}%

📦 *NODE.JS*
│ ◦ Heap: ${formatBytes(nodeMemory.heapUsed)}
│ ◦ RSS: ${formatBytes(nodeMemory.rss)}

⏳ *UPTIME*
│ ◦ ${runtime(process.uptime())}

🤖 *BOT*
│ ◦ Nombre: Elyssia MD
│ ◦ Owner: AmílcarGit
│ ◦ Prefijo: ${usedPrefix}
│ ◦ Estado: Online

╰━━━━━━━━━━━━━━━━━━━━⬣
`

  try {
    await conn.sendMessage(m.chat, {
      text: txt,
      edit: msg.key
    })
  } catch {
    await m.reply(txt)
  }

  await m.react('✅')
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping|p|speed|status|velocidad)$/i

export default handler