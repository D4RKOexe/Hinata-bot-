import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['51937012839', 'Bryce', true],
  ['51913454004', 'Darko', true]
]

global.mods = []
global.prems = []

global.namebot = 'DARKO BOT'
global.packname = 'DARKO BOT⚡'
global.author = 'D4rko| © 𝟸𝟶𝟸𝟼 '
global.moneda = 'Darkcoins'

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.vs = '2.2.0'
global.sessions = 'sessions'

global.namecanal = ''
global.idcanal = ''
global.idcanal2 = ''
global.canal = ''
global.canalreg = ''

global.ch = {
  ch1: ''
}

global.multiplier = 30
global.maxwarn = 2

global.lastRoll = {}

global.APIs = {
  adonix: { url: "https://api-adonix.ultraplus.click", key: "Yuki-WaBot" },
  vreden: { url: "https://api.vreden.web.id", key: null },
  nekolabs: { url: "https://api.nekolabs.web.id", key: null },
  siputzx: { url: "https://api.siputzx.my.id", key: null },
  delirius: { url: "https://api.delirius.store", key: null },
  ootaizumi: { url: "https://api.ootaizumi.web.id", key: null },
  stellar: { url: "https://api.stellarwa.xyz", key: "YukiWaBot", key2: '1bcd4698ce6c75217275c9607f01fd99' },
  apifaa: { url: "https://api-faa.my.id", key: null },
  xyro: { url: "https://api.xyro.site", key: null },
  yupra: { url: "https://api.yupra.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("⌛Se actualizó 'config.js'"))
  import(`file://${file}?update=${Date.now()}`)
})
