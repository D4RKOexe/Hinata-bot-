let handler = async (m, { conn, args, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  let moneda = global.moneda || '💸'
  
  // Verificar si hay argumentos
  if (!args[0]) {
    return conn.reply(m.chat, 
      `⚡ *GOHAN BESTIA - RETIRAR KI* ⚡\n\n🦾 Guerrero: @${m.sender.split('@')[0]}\n\n⚠️ Ingresa la cantidad de *ki* que deseas retirar del banco.\n\n💫 Ejemplos:\n➡️ *${usedPrefix + command} 5000*\n➡️ *${usedPrefix + command} all* (retirar todo)\n➡️ *${usedPrefix + command} half* (retirar mitad)`, 
      m, 
      { mentions: [m.sender] }
    )
  }

  // Verificar si tiene banco
  if (!user.bank || user.bank < 1) {
    return conn.reply(m.chat, 
      `⚡ *GOHAN BESTIA - SIN KI PROTEGIDO* ⚡\n\n🦾 Bestia: @${m.sender.split('@')[0]}\n\n❌ No tienes ki protegido en el banco Saiyan.\n\n💰 Usa *${usedPrefix}deposit* para proteger tu ki de Freezer.`, 
      m, 
      { mentions: [m.sender] }
    )
  }

  let cantidadARetirar = 0

  // Opción "all" - retirar todo
  if (args[0].toLowerCase() === 'all') {
    cantidadARetirar = user.bank
  }
  // Opción "half" - retirar mitad
  else if (args[0].toLowerCase() === 'half') {
    cantidadARetirar = Math.floor(user.bank / 2)
  }
  // Cantidad específica
  else {
    if (isNaN(args[0])) {
      return conn.reply(m.chat, 
        `⚡ *GOHAN BESTIA - CANTIDAD INVÁLIDA* ⚡\n\n🦾 Bestia: @${m.sender.split('@')[0]}\n\n⚠️ Ingresa una cantidad válida.\n💫 Ejemplo: *${usedPrefix + command} 5000*`, 
        m, 
        { mentions: [m.sender] }
      )
    }
    
    cantidadARetirar = parseInt(args[0])
    
    if (cantidadARetirar < 100) {
      return conn.reply(m.chat, 
        `⚡ *GOHAN BESTIA - RETIRO MÍNIMO* ⚡\n\n🦾 Bestia: @${m.sender.split('@')[0]}\n\n⚠️ El retiro mínimo es de *100 ${moneda}*`, 
        m, 
        { mentions: [m.sender] }
      )
    }
  }

  // Verificar si tiene suficiente en el banco
  if (user.bank < cantidadARetirar) {
    return conn.reply(m.chat, 
      `⚡ *GOHAN BESTIA - KI INSUFICIENTE EN BANCO* ⚡\n\n🦾 Bestia: @${m.sender.split('@')[0]}\n\n⚠️ Solo tienes *${user.bank.toLocaleString()} ${moneda}* protegidos.\n💰 Intentaste retirar: *${cantidadARetirar.toLocaleString()} ${moneda}*`, 
      m, 
      { mentions: [m.sender] }
    )
  }

  // Realizar el retiro
  user.bank -= cantidadARetirar
  user.coin += cantidadARetirar

  // Calcular porcentaje retirado
  let porcentaje = ((cantidadARetirar / (user.bank + cantidadARetirar)) * 100).toFixed(1)

  // Mensaje de éxito
  let mensaje = `
🦾 *GOHAN BESTIA - RETIRO EXITOSO* 🦾

⚡ Guerrero: @${m.sender.split('@')[0]}

💰 *Ki retirado:* *+${cantidadARetirar.toLocaleString()} ${moneda}*
🏦 *Ki restante en banco:* *${user.bank.toLocaleString()} ${moneda}*
💫 *Porcentaje retirado:* *${porcentaje}%* del banco

📊 *NUEVO PODER:*
├ 💰 Ki en mano: *${user.coin.toLocaleString()} ${moneda}*
├ 🏦 Ki en banco: *${user.bank.toLocaleString()} ${moneda}*
└ ✨ Ki total: *${(user.coin + user.bank).toLocaleString()} ${moneda}*

🌀 *¡KI LIBERADO CON ÉXITO!* 🌀
💥 *AHORA USA ESE PODER SABIAMENTE* 💥
  `.trim()

  await conn.reply(m.chat, mensaje, m, { mentions: [m.sender] })
  
  global.db.write()
}

handler.help = ['retirar']
handler.tags = ['eco']
handler.command = ['rt', 'retirar', 'withdraw', 'sacar']
handler.register = false
handler.group = false

export default handler