const ro = 300

const handler = async (m, { conn }) => {
const user = global.db.data.users[m.sender]
const cooldown = 2 * 60 * 60 * 1000
const nextRob = user.lastrob2 + cooldown

if (Date.now() < nextRob) {
return conn.reply(
m.chat,
`
╭━━━〔 🌸 ELYSSIA MD • SEGURIDAD 〕━━━⬣

⚠️ Operación en enfriamiento

👤 Usuario: @${m.sender.split('@')[0]}
⏳ Disponible en: ${msToTime(nextRob - Date.now())}

💡 Elyssia MD está recalibrando tus sistemas.

╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim(),
m,
{ mentions: [m.sender], ...global.rcanal }
)
}

let who = m.isGroup ? m.mentionedJid?.[0] || m.quoted?.sender : m.chat

if (!who) {
return conn.reply(
m.chat,
`
╭━━━〔 🌸 ELYSSIA MD • ERROR 〕━━━⬣

❌ Debes mencionar a un usuario.

📌 Ejemplo:
.robar @usuario

╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim(),
m,
{ mentions: [m.sender], ...global.rcanal }
)
}

if (!(who in global.db.data.users)) {
return conn.reply(
m.chat,
`
╭━━━〔 🌸 ELYSSIA MD • OBJETIVO 〕━━━⬣

🔍 El usuario seleccionado no posee recursos registrados.

💫 No hay activos disponibles para transferir.

╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim(),
m,
{ mentions: [m.sender], ...global.rcanal }
)
}

const target = global.db.data.users[who]
const robAmount = Math.floor(Math.random() * ro) + 50

if (target.coin < robAmount) {
return conn.reply(
m.chat,
`
╭━━━〔 🌸 ELYSSIA MD • OPERACIÓN FALLIDA 〕━━━⬣

👤 Solicitante: @${m.sender.split('@')[0]}
🎯 Objetivo: @${who.split('@')[0]}

❌ Fondos insuficientes.

💰 Recursos requeridos:
${robAmount} ${moneda}

╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim(),
m,
{ mentions: [m.sender, who], ...global.rcanal }
)
}

user.coin += robAmount
target.coin -= robAmount
user.lastrob2 = Date.now()

return conn.reply(
m.chat,
`
╭━━━〔 🌸 ELYSSIA MD • TRANSFERENCIA 〕━━━⬣

👤 Operador: @${m.sender.split('@')[0]}
🎯 Objetivo: @${who.split('@')[0]}

💰 Recursos obtenidos:
➜ ${robAmount} ${moneda}

✨ Transferencia completada exitosamente.

🤖 Elyssia MD ha registrado la operación.

╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim(),
m,
{ mentions: [m.sender, who], ...global.rcanal }
)
}

handler.help = ['robar @usuario']
handler.tags = ['eco']
handler.command = ['robar', 'rob', 'steal']
handler.group = false
handler.register = false

export default handler

function msToTime(duration) {
let s = Math.floor((duration / 1000) % 60)
let m = Math.floor((duration / (1000 * 60)) % 60)
let h = Math.floor(duration / (1000 * 60 * 60))

h = h < 10 ? '0' + h : h
m = m < 10 ? '0' + m : m
s = s < 10 ? '0' + s : s

return "${h}h ${m}m ${s}s"
}