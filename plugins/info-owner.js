let handler = async (m, { conn }) => {
  let texto = '𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA OWNER ㅤ֢ㅤׄㅤׅ\n\n'
  
  texto += '👑 » *EL VIGILANTE*\n'
  texto += ''
  texto += '   💎 » Desarrollador Principal\n'
  texto += '   🇭🇳 '
  texto += '📦 » *REPOSITORIO*\n'
  texto += '   🐙 » https://github.com/ElvigilanteDv\n\n'
  
  texto += '👑 » *BRAYANRK*\n'
  texto += '   📱 » +57 3223090406\n'
  texto += '   💎 » Desarrollador Principal\n'
  texto += '   🇨🇴 '
  texto += '📦 » *REPOSITORIO*\n'
  texto += '   🐙 » https://github.com/BrayanRK\n\n' 

texto += '👑 » *D4RKO*\n'
  texto += ''
  texto += '   💎 » MODIFICADOR
  texto += '   🇵🇪 '
  texto += '📦 » *REPOSITORIO*\n'
  texto += '   🐙 » PRIVADO
  
  texto += '⫏⫏ DARKO BOT ✿\n\n'
  texto += '> Contáctanos si tienes dudas ♡'

  await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = /^(owner|creador|creadores|devs)$/i
handler.desc = 'Info de los creadores'

export default handler