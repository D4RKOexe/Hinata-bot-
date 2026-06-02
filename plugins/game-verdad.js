import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let partidas = {}

let verdadesPicantes = [
    { pregunta: "¿Alguna vez has besado a alguien del mismo sexo?", castigo: "Envía un emoji que represente ese beso 😘" },
    { pregunta: "¿Has enviado fotos atrevidas a alguien?", castigo: "Cuenta brevemente la historia (sin nombres reales)" },
    { pregunta: "¿Te han pillado mirando a alguien prohibido?", castigo: "Envía un sticker que represente vergüenza 😳" },
    { pregunta: "¿Cuál es tu mayor fantasía secreta?", castigo: "Mímala con emojis sin palabras 🔥🍑" },
    { pregunta: "¿Has fingido un beso o abrazo?", castigo: "Imita ese gesto en tu selfie y mándala" },
    { pregunta: "¿Has tenido un crush prohibido?", castigo: "Describe con emojis cómo lo ves 😏💌" },
    { pregunta: "¿Alguna vez has hecho algo travieso en público?", castigo: "Cuenta la anécdota usando solo 3 emojis 🤫" },
    { pregunta: "¿Has enviado mensajes subidos de tono?", castigo: "Envía solo el emoji que resumiría el mensaje 😈" },
    { pregunta: "¿Cuál ha sido tu beso más atrevido?", castigo: "Imita la expresión con sticker o GIF 😘💋" },
    { pregunta: "¿Has coqueteado con alguien sabiendo que era prohibido?", castigo: "Envía un emoji culpable 😅" }
]

let handler = async (m, { conn }) => {
    // Elegir pregunta aleatoria
    const seleccion = verdadesPicantes[Math.floor(Math.random() * verdadesPicantes.length)]
    const pregunta = seleccion.pregunta
    const castigo = seleccion.castigo

    // Guardar partida activa del usuario
    partidas[m.sender] = { activo: true, castigo }

    // Crear mensaje interactivo con botones
    const interactiveMessage = proto.Message.InteractiveMessage.create({
        header: { title: '🌸 ELYSSIA MD - 🎮 VERDAD', subtitle: 'Juego de sinceridad', hasMediaAttachment: false },
        body: { text: `> 🌸 *VERDAD PICANTE* ⸜(｡˃ ᵕ ˂ )⸝♡\n\n❖ Pregunta:\n${pregunta}\n\n❖ Castigo:\n${castigo}\n\n> Responde directamente en el chat o toca un botón:` },
        footer: { text: '⫏⫏ ELYSSIA MD 🌸' },
        nativeFlowMessage: {
            buttons: [
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🎲 OTRA VERDAD', id: 'verdad_nueva' }) },
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '💀 RETO', id: 'reto_random' }) }
            ]
        }
    })

    const msg = generateWAMessageFromContent(
        m.chat,
        { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } },
        { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('🌸')
}

handler.before = async (m, { conn }) => {
    if (!m.sender) return false

    const partida = partidas[m.sender]
    if (!partida || !partida.activo) return false

    // Usuario respondió en chat normal
    const resp = m.text.trim()

    // Confirmar si cumplió el castigo (simplemente comparar emoji incluido)
    if (resp.includes(partida.castigo.split(' ')[0])) {
        delete partidas[m.sender]
        await conn.sendMessage(m.chat, { text: `🌸 *ELYSSIA* 🌸\n\n✔ ¡Cumpliste el castigo correctamente!\n💫 Interesante... 😏` }, { quoted: m })
        await m.react('🌸')
    } else {
        await conn.sendMessage(m.chat, { text: `🌸 *ELYSSIA* 🌸\n\n❌ No era eso...\n💀 El castigo era: ${partida.castigo}` }, { quoted: m })
    }

    return true
}

handler.help = ['verdad']
handler.tags = ['game']
handler.command = ['verdad']

export default handler