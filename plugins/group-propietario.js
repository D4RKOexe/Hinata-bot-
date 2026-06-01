let handler = async (m, { conn }) => {
  m.reply(`
╔══════════════════╗
     👑 *PROPIETARIO* 👑
╚══════════════════╝

⚡ *║✨ 𝙴𝙻𝚈𝚂𝚂𝙸𝙰 𝙼𝙳 ✨  ║*

🏷️ *Nombre:* AMILCAR GIT
📞 *WhatsApp:* +51910227479
📧 *Email:* pronto

🔗 *Enlace directo:*
https://wa.me/51910227479

🛠️ *Desarrollador especializado en:*
• Bots de WhatsApp
• Bots de Telegram
• Bost de discord

📌 *Contacta para:*
• Bots personalizados
• Subbots
• Soporte técnico
• Colaboraciones

⚡ _Desarrollando con pasión desde 2026_
`)
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner', 'propietario']
export default handler