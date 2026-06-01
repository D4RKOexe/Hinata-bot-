import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

const tags = {
  jadibot: '🌸 SUBBOTS',
  eco: '⚡ ENERGÍA 𝙴𝙻𝚈𝚂𝚂𝙸𝙰',
  descargas: '🌀 DESCARGAS',
  tools: '🔧 HERRAMIENTAS',
  owner: '👑 MAESTRA ELYSSIA',
  info: 'ℹ️ INFORMACIÓN',
  game: '🎮 JUEGOS',
  gacha: '🎲 ECO DEL REY',
  reacciones: '💥 REACCIONES',
  group: '👥 GRUPOS ELYSSIA',
  search: '🔎 BUSCADOR BRILLO',
  sticker: '📌 STICKERS',
  ia: '🤖 ANDROID 16',
  channel: '📺 ELYSSIA HOUSE',
  fun: '😂 DIVERSIÓN ELYSSIA',
  premium: '🌸 PREMIUM ELYSSIA',
freefire: '🎮🔥 FREE FIRE 🔥🎮',
}

const defaultMenu = {
  before: `
╔══════════════════╗
║✨ 𝙴𝙻𝚈𝚂𝚂𝙸𝙰 𝙼𝙳 ✨
╠══════════════════╣
║ Hola~ soy %botname
║ *%name*, %greeting
║
║ 🌸 Tipo: %tipo
║ ⚡ Nivel ELYSSIA: 100%
║ 📅 Fecha: %date
║ 🕐 Hora Perú: %time
║ ⏱️ Activo: %uptime
╠══════════════════╣
║ 👑 COMANDOS 𝙴𝙻𝚈𝚂𝚂𝙸𝙰 MD
%readmore
`.trimStart(),

  header: '\n╠═ %category ═╣\n',
  body: '║ 👑 %cmd %islimit %isPremium',
  footer: '',
  after: `
╠════════════════╣
║👑 * 𝙴𝙻𝚈𝚂𝚂𝙸𝙰 𝙼𝙳 *
║⚡ Creado por AmilcarGit~ (◕‿◕✿)
║🌸 Base: asistente Virtual
║💫 Domina el chat con poder Saiyan!
╚════════════════╝

¡Que la fuerza de 𝙴𝙻𝚈𝚂𝚂𝙸𝙰 te acompañe! 🌀✨
`.trim(),
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const user = global.db.data.users[m.sender] || {}
    const { exp = 0, limit = 0, level = 0 } = user
    const { min, xp, max } = xpRange(level, global.multiplier || 1)
    const name = await conn.getName(m.sender)

    const ahora = new Date()
    const horaPeru = new Date(
      ahora.toLocaleString('en-US', { timeZone: 'America/Lima' })
    )

    const date = horaPeru.toLocaleDateString('es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    })

    const time = horaPeru.toLocaleTimeString('es', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })

    const help = Object.values(global.plugins || {})
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        limit: p.limit,
        premium: p.premium,
      }))

    let nombreBot = 'Elyssia MD'
    let bannerFinal = null
    const imagePath = join(process.cwd(), 'lib', 'ElyssiaMD.jpg')
    if (fs.existsSync(imagePath)) bannerFinal = fs.readFileSync(imagePath)

    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = join('./JadiBots', botActual, 'config.json')
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath))
        if (config.name) nombreBot = config.name
      } catch (e) { console.error('👑 Error leyendo config:', e) }
    }

    const tipo = conn.user.jid === global.conn.user.jid ? '🔥 PRINCIPAL' : '⚡ SUB-Elyssia-MD'
    const menuConfig = conn.menu || defaultMenu

    const _text = [
      menuConfig.before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(menu => menu.tags?.includes(tag))
          .map(menu => menu.help.map(h =>
            menuConfig.body
              .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
              .replace(/%islimit/g, menu.limit ? '🔒' : '')
              .replace(/%isPremium/g, menu.premium ? '💎' : '🌸')
          ).join('\n')).join('\n')
        return cmds ? [menuConfig.header.replace(/%category/g, tags[tag]), cmds, menuConfig.footer].join('\n') : ''
      }).filter(Boolean),
      menuConfig.after
    ].join('\n')

    const replace = {
      '%': '%',
      p: _p,
      botname: nombreBot,
      taguser: '@' + m.sender.split('@')[0],
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      level,
      limit,
      name,
      date,
      time,
      uptime: clockString(process.uptime() * 1000),
      tipo,
      readmore: readMore,
      greeting: getUwUGreeting(horaPeru.getHours()),
    }

    const text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
      (_, name) => String(replace[name])
    )

    const buttons = [
      {
        buttonId: '.code',
        buttonText: { displayText: '🌸 Elyssia-MD' },
        type: 1
      }
    ]

    const messageContent = {
      caption: text.trim(),
      footer: '🌸 *Elyssia MD* - ¡Comandos Oficiales!',
      buttons,
      headerType: 1,
      mentionedJid: conn.parseMention(text),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true
      }
    }

    if (bannerFinal) {
      messageContent.image = bannerFinal
      messageContent.headerType = 4
    } else {
      messageContent.text = text.trim()
    }

    await conn.sendMessage(m.chat, messageContent, { quoted: m })
    await m.react('🌸')
    setTimeout(() => m.react('⚡'), 500)
    setTimeout(() => m.react('🌸'), 1000)

  } catch (e) {
    console.error('💥 Error en el menú uwu:', e)
    await conn.reply(
      m.chat,
      `
🌸 *¡Ups! Algo salió mal~* (´•̥̥̥ω•̥̥̥\)

El menú de Elyssia MD no pudo cargarse...
⚡ Causa: Energía insuficiente
🌸 Solución: Intenta de nuevo~

Mientras usa: ${_p}help simple
      `,
      m
    )
  }
}

handler.command = ['menu', 'help', 'menú', 'ayuda', 'comandos', 'beastmenu', 'gohan']
handler.tags = ['beast', 'main', 'menu']
handler.help = ['menu']
handler.register = false
handler.limit = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function getUwUGreeting(hour) {
  const greetings = {
    0: 'una noche mágica bajo las estrellas 🌙✨',
    1: 'una noche de sueños ELYSSIA 💤 🌀',
    2: 'una noche llena de energía Brillo 🌌⚡',
    3: 'un amanecer en la Room of Spirit and Time 🌅⏳',
    4: 'un amanecer de meditación  🧘🌀',
    5: 'un amanecer de entrenamiento con Elyssia 👑🌅',
    6: 'una mañana de super Brillo en la playa 🏖️🌀',
    7: 'una mañana en Elyssia House con tortugas 🏠🐢',
    8: 'una mañana volando en Nubes ☁️ 🌀',
    9: 'una mañana en el Tenkaichi Budokai 🥋🎯',
    10: 'un día de batalla en el Elyssia Games ⚔️💥',
    11: 'un día de torneo del Brillo 💪🌟',
    12: 'un día soleado en el Planet tierra 🌍☀️',
    13: 'una tarde de entrenamiento con Whis 🥛🌀',
    14: 'una tarde en el Hyperbolic Time Chamber ⏱️✨',
    15: 'una tarde de fusiones en el grupo 🔄🌸',
    16: 'una tarde de transformaciones Elyssia 🌀💫',
    17: 'un atardecer después del super Brillo 🌇⚡',
    18: 'una noche de recuperación en la cápsula 💊🏥',
    19: 'una noche viendo las estrellas Elyssia 🌠🐉',
    20: 'una noche de cuentos del Planeta tierra 🪐📖',
    21: 'una noche preparando Semillas  🌱🍡',
    22: 'una noche protegiendo la Tierra 🌎🛡️',
    23: 'una noche de vigilia 𝙴𝙻𝚈𝚂𝚂𝙸𝙰 🌃🌸',
  }
  return 'Espero que tengas ' + (greetings[hour] || 'un día increíble con Elyssia MD~ 🌸✨')
}

handler.alias = ['menuu', 'ayudame', 'comanditos', 'beasthelp']