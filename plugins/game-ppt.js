import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let handler = async (m, { conn, usedPrefix, command }) => {

  const opciones = ['piedra', 'papel', 'tijera']
  const emojis = { piedra: '✊', papel: '✋', tijera: '✌️' }

  const userId = m.sender

  const buttons = [{
    name: 'single_select',
    buttonParamsJson: JSON.stringify({
      title: '🎮 ELIGE TU JUGADA',
      sections: [{
        title: '⚔️ JUGAR PPT',
        rows: [
          {
            header: '✊',
            title: 'Piedra',
            description: 'Rompe tijeras',
            id: `ppt_piedra_${userId}`
          },
          {
            header: '✋',
            title: 'Papel',
            description: 'Cubre piedra',
            id: `ppt_papel_${userId}`
          },
          {
            header: '✌️',
            title: 'Tijera',
            description: 'Corta papel',
            id: `ppt_tijera_${userId}`
          }
        ]
      }]
    })
  }]

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {},
        interactiveMessage: proto.Message.InteractiveMessage.create({
          header: {
            title: 'ELYSSIA MD 🌸 - PPT GAME',
            subtitle: 'Piedra, Papel o Tijera',
            hasMediaAttachment: false
          },
          body: {
            text: `🌸 *PIEDRA, PAPEL O TIJERA*

👉 Solo presiona un botón para jugar`
          },
          footer: {
            text: '🎮 Elyssia MD 🌸'
          },
          nativeFlowMessage: { buttons }
        })
      }
    }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return

  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id
    if (!id || !id.startsWith('ppt_')) return

    const opciones = ['piedra', 'papel', 'tijera']
    const emojis = { piedra: '✊', papel: '✋', tijera: '✌️' }

    const parts = id.split('_')
    const user = parts[1]
    const userId = parts[2]

    const bot = opciones[Math.floor(Math.random() * opciones.length)]

    let resultado = ''

    if (user === bot) resultado = '🤝 EMPATE'
    else if (
      (user === 'piedra' && bot === 'tijera') ||
      (user === 'papel' && bot === 'piedra') ||
      (user === 'tijera' && bot === 'papel')
    ) resultado = '🏆 GANASTE'
    else resultado = '💀 PERDISTE'

    const text = `
╭━━━〔 🎮 PPT RESULTADO 〕━━━⬣
┃ 👤 Tú: ${emojis[user]} ${user}
┃ 🤖 Bot: ${emojis[bot]} ${bot}
┃
┃ 📊 ${resultado}
╰━━━━━━━━━━━━━━━━━━━━⬣

👉 Presiona otra vez para jugar
`

    const buttons = [{
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: '🎮 JUGAR DE NUEVO',
        sections: [{
          title: '⚔️ OPCIONES',
          rows: [
            { header: '✊ Piedra', title: 'Piedra', id: `ppt_piedra_${m.sender}` },
            { header: '✋ Papel', title: 'Papel', id: `ppt_papel_${m.sender}` },
            { header: '✌️ Tijera', title: 'Tijera', id: `ppt_tijera_${m.sender}` }
          ]
        }]
      })
    }]

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: {
              title: 'ELYSSIA MD 🌸 - RESULTADO',
              subtitle: 'PPT GAME',
              hasMediaAttachment: false
            },
            body: { text },
            footer: { text: '🎮 Elyssia MD 🌸' },
            nativeFlowMessage: { buttons }
          })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return true

  } catch (e) {
    console.log(e)
  }
}

handler.command = ['ppt']
handler.tags = ['game']
handler.help = ['ppt']

export default handler