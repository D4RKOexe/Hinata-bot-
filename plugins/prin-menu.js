import fs from 'fs'
import path, { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

const tags = {
  main: '⭐ ρяιη¢ιραℓ',
  group: '👥 ɢяυρσѕ',
  rpg: '⚔️ яρg',
  game: '🎮 gαмє',
  gacha: '🎰 gα¢нα',
  serbot: '🤖 ѕєявσт',
  owner: '👑 σωηєя',
  downloader: '📥 ∂σωηℓσα∂єя',
  info: 'ℹ️ ιηƒσ'
}

const bannerCategory = {
  main: 'https://files.catbox.moe/r60c8l.jpg',
  group: 'https://files.catbox.moe/qyjtab.jpeg',
  rpg: 'https://files.catbox.moe/zthq3s.jpeg',
  game: 'https://files.catbox.moe/ug1ecw.jpeg',
  gacha: 'https://files.catbox.moe/j3z3eo.jpeg',
  serbot: 'https://files.catbox.moe/r60c8l.jpg',
  owner: 'https://files.catbox.moe/r60c8l.jpg',
  downloader: 'https://files.catbox.moe/xjn6am.jpeg',
  info: 'https://files.catbox.moe/ap5nos.jpeg'
}

const defaultMenu = {
  before: `
𑁍ࠬܓ ⁾ ㅤׄㅤׅㅤׄ HINATA BOT ㅤ֢ㅤׄㅤׅ

> ¡Hola! ⸜(｡˃ ᵕ ˂ )⸝♡ Soy 𓆩⚝𓆪 HINATA BOT 𓍯 𓆩⚝𓆪

𑁍𓂃 𓈒𓏸 *HORA ::* %time
𑁍𓂃 𓈒𓏸 *USUARIOS ::* %totalreg
𑁍𓂃 𓈒𓏸 *COMANDOS ::* %totalcmd
𑁍𓂃 𓈒𓏸 *ACTIVA ::* %uptime

%readmore
`,
  header: '\n%emoji %category (%count cmd)\n',
  body: '❥ %cmd %desc',
  footer: '',
  after: ''
}

let handler = async (m, { conn, usedPrefix: _p, command }) => {
  try {
    let user = global.db.data.users[m.sender]
    if (!user) {
      user = { exp: 0, level: 0 }
      global.db.data.users[m.sender] = user
    }

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        desc: p.desc || ''
      }))

    let tagSeleccionada = null
    if (command.startsWith('menu') && command.length > 4) {
      let tagBuscada = command.replace('menu', '').toLowerCase()
      for (let key of Object.keys(tags)) {
        if (key.toLowerCase() === tagBuscada) {
          tagSeleccionada = key
          break
        }
      }
    }

    let bannerFinal = tagSeleccionada ? bannerCategory[tagSeleccionada] : 'https://files.catbox.moe/r60c8l.jpg'

    let textoMenu = defaultMenu.before
      .replace(/%time/g, new Date().toLocaleString())
      .replace(/%totalreg/g, Object.keys(global.db.data.users).length)
      .replace(/%totalcmd/g, Object.keys(global.plugins).length)
      .replace(/%uptime/g, Math.floor(process.uptime() / 60) + 'm ' + Math.floor(process.uptime() % 60) + 's')

    if (tagSeleccionada) {
      textoMenu = textoMenu.replace('HINATA BOT', 'HINATA BOT - ' + tags[tagSeleccionada].replace(/[⭐👥⚔️🎮🎰🤖👑📥ℹ️]/g, '').trim())
    }

    for (let tag of Object.keys(tags)) {
      if (tagSeleccionada && tag !== tagSeleccionada) continue

      const cmds = help
        .filter(menu => menu.tags?.includes(tag))
        .map(menu => menu.help.map(h =>
          defaultMenu.body
            .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
            .replace(/%desc/g, menu.desc ? `\n   ↳ ${menu.desc}` : '')
        ).join('\n')).join('\n')

      if (cmds) {
        let count = help.filter(menu => menu.tags?.includes(tag)).length
        let emoji = tags[tag].split(' ')[0]
        textoMenu += defaultMenu.header.replace(/%category/g, tags[tag].replace(emoji + ' ', '')).replace(/%count/g, count).replace(/%emoji/g, emoji)
        textoMenu += cmds + '\n\n'
      }
    }

    if (!tagSeleccionada) {
      textoMenu += '> *HINATA BOT | EL VIGILANTE & BRAYANRK*'
    }

    const replace = {
      readmore: readMore
    }

    let texto = textoMenu
    for (let key of Object.keys(replace)) {
      texto = texto.replace(new RegExp(`%${key}`, 'g'), replace[key])
    }

    await conn.sendMessage(m.chat, {
      image: { url: bannerFinal },
      caption: texto.trim()
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, { text: `❌ Error:\n${e}` }, { quoted: m })
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|menú|help)(rpg|group|game|gacha|serbot|owner|downloader|info|main)?$/i
handler.register = false
handler.desc = 'Muestra el menú'

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)