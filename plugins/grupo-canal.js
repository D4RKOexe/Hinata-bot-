const handler = async (m, { conn }) => {

const canalInfo = `
╭━━━━━━━━━━━━━━━━━━━━━━⬣
┃ ✦ 🌸 𝐄𝐋𝐘𝐒𝐒𝐈𝐀 𝐌𝐃 • 𝐂𝐀𝐍𝐀𝐋 𝐎𝐅𝐈𝐂𝐈𝐀𝐋 🌸 ✦
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🤖 Bienvenido al centro oficial de Elyssia MD

Un espacio creado para mantenerte informado sobre todas las novedades, mejoras y actualizaciones del proyecto.

╭─❖「 📢 CONTENIDO 」❖─╮
│ ✨ Actualizaciones exclusivas
│ 🚀 Nuevas funciones y comandos
│ 🛠️ Correcciones y mejoras
│ 📚 Tutoriales y guías
│ 🎁 Recursos y contenido especial
│ 💬 Soporte y anuncios importantes
╰────────────────────╯

╭─❖「 🔗 ENLACE OFICIAL 」❖─╮
│ por el momento no ay
╰────────────────────╯

🌸 Forma parte de la comunidad Elyssia MD

"Más que un bot, una experiencia inteligente."

╭━━━━━━━━━━━━━━━━━━━━━━⬣
┃ 🤖 Elyssia MD
┃ 👑 Developer: AmílcarGit
┃ ⚡ Estado: Online
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`

await conn.sendMessage(m.chat, { text: canalInfo }, { quoted: m })
await m.react('🌸')

}

handler.help = ['canal']
handler.tags = ['info']
handler.command = ['canal', 'channel', 'elyssia']

export default handler