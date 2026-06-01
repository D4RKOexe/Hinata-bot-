let cooldowns = {}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let tiempo = 5 * 60 // 5 minutos en segundos

  // 🌸 Verificar cooldown
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
    const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
    return conn.reply(
      m.chat,
      `⚡ *ELYSSIA MD – KI RECARGANDO* ⚡\n\n🦾 Guerrero: @${m.sender.split("@")[0]}\n⏳ Espera *${tiempoRestante}* antes de usar tu poder de nuevo`,
      m,
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  // 🌸 Ganancias épicas con Elyssia MD
  let ganancia = Math.floor(Math.random() * 5000) + 1000
  cooldowns[m.sender] = Date.now()
  user.coin += ganancia

  const frase = pickRandom(trabajo)

  await conn.reply(
    m.chat,
    `🦾 *ELYSSIA MD TRABAJO BESTIAL* 🦾\n\n✦ ${frase} *${toNum(ganancia)}* (${ganancia} ${moneda}) 💫\n\n🌀 ¡El poder de Elyssia MD genera riqueza y gloria! 🌀`,
    m,
    { ...global.rcanal }
  )
}

handler.help = ['work', 'trabajar', 'bestiawork']
handler.tags = ['eco']
handler.command = ['w', 'work', 'chambear', 'chamba', 'trabajar', 'bestiawork', 'elyssiawork']
handler.group = false
handler.register = false

export default handler

// 🌸 Funciones auxiliares
function toNum(number) {
  if (number >= 1000 && number < 1000000) return (number / 1000).toFixed(1) + 'k'
  else if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M'
  else if (number <= -1000 && number > -1000000) return (number / 1000).toFixed(1) + 'k'
  else if (number <= -1000000) return (number / 1000000).toFixed(1) + 'M'
  else return number.toString()
}

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minuto${minutos !== 1 ? 's' : ''} y ${segundosRestantes} segundo${segundosRestantes !== 1 ? 's' : ''}`
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

// 🌸 Frases épicas Elyssia MD
const trabajo = [
  "Entrenaste como un guerrero Elyssia MD y ganaste",
  "Destruiste obstáculos con tu poder y conseguiste",
  "Enseñaste a un aprendiz de héroe y te recompensó con",
  "Le ganaste en sparring a un rival y recibiste",
  "Salvaste al planeta y obtuviste",
  "Usaste tu onda de energía y llovió dinero: ",
  "Volaste alto y encontraste un tesoro de",
  "Transformaste tu ki en monedas y obtuviste",
  "Derrotaste al enemigo y te recompensaron con",
  "Hiciste un Kamehameha y cayeron",
  "Protegiste a los inocentes y te dieron",
  "Entrenaste con maestros y recibiste por tu esfuerzo",
  "Usaste tu forma épica en un torneo y ganaste",
  "Enseñaste a los aprendices y te recompensaron con",
  "Salvaste a un aliado y las esferas te dieron",
  "Volaste tan rápido que hallaste nubes de",
  "Tu poder impresionó a todos y recibiste",
  "Le ganaste a un rival poderoso y te pagaron",
  "Protegiste la ciudad y te otorgaron",
  "Hiciste un ritual de energía y llovieron",
  "Tu ki despertó fuerzas ocultas y te regaló",
  "Destruiste montañas entrenando y hallaste",
  "Le ganaste a un enemigo legendario y recibiste",
  "Tu forma épica inspiró a todos y te donaron"
]

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}