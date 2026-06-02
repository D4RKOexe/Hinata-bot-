import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text ? text.trim() : (m.quoted?.text || null)

    if (!query)
        return conn.reply(
            m.chat,
            `🌸 *Ingresa un enlace de Facebook para descargar*\n\n> *Ejemplo:* ${usedPrefix + command} https://facebook.com/...`,
            m
        )

    await m.react('🌀')

    try {
        const apiKey = 'dwk-NhZym8RK-IeYezUMe'
        const apiUrl =
            `https://dvwilkerofc-v1.onrender.com/api/download/facebook?url=${encodeURIComponent(query)}&apiKey=${apiKey}`

        const { data } = await axios.get(apiUrl)

        if (!data) {
            await m.react('❌')
            return m.reply('⚠️ *No se pudo obtener el video.*', m)
        }

        const downloadUrl =
            data.result?.url ||
            data.url ||
            data.download ||
            data.video

        if (!downloadUrl) {
            await m.react('❌')
            return m.reply('⚠️ *La API no devolvió ningún enlace de descarga.*', m)
        }

        const quality =
            data.result?.quality ||
            data.quality ||
            'HD'

        const ui = `
╭━━━〔 📥 FACEBOOK DL 〕━━━⬣
┃ 🌸 Elyssia Downloader
┃
┃ 🎬 Calidad: ${quality}
┃ 🔗 Facebook Video
┃ ✨ Elyssia MD
╰━━━━━━━━━━━━━━━━━━⬣
`

        await conn.sendMessage(
            m.chat,
            {
                video: { url: downloadUrl },
                caption: ui,
                mimetype: 'video/mp4'
            },
            { quoted: m }
        )

        await m.react('🌸')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ *Error al conectar con la API. Inténtalo más tarde.*', m)
    }
}

handler.help = ['fb', 'facebook']
handler.tags = ['descargas']
handler.command = /^(fb|facebook|fb2|faceboo)$/i

export default handler