
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ Envía un archivo con el texto *.${command}* o responde al archivo con este comando.`,
    }, { quoted: m })
  }

  // Descargar el archivo
  const media = await q.download()
  const tempDir = './temp'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

  const ext = mime.split('/')[1] || 'dat'
  const fileName = `media_${Date.now()}.${ext}`
  const filePath = path.join(tempDir, fileName)
  fs.writeFileSync(filePath, media)

  const buffer = fs.readFileSync(filePath)

  // Reacción de carga
  await conn.sendMessage(m.chat, {
    react: { text: '⏳', key: m.key }
  })

  // Función para subir a GohanFile Storage
  const uploadToGohanFile = async (buffer) => {
    try {
      // Necesitamos la extensión del archivo
      const fileInfo = await fileTypeFromBuffer(buffer)
      const extension = fileInfo ? fileInfo.ext : ext
      
      const form = new FormData()
      form.append('file', buffer, {
        filename: `file_${Date.now()}.${extension}`,
        contentType: mime
      })
      
      // Opción 1: Subida directa (si la API lo soporta)
      const res = await axios.post('https://gohanfile-storage.neocities.org/api/upload', form, {
        headers: form.getHeaders()
      })
      
      // Opción 2: Si hay problemas con la URL de API, intenta con la página principal
      if (!res.data || res.status !== 200) {
        throw new Error('Primer intento fallido')
      }
      
      // Dependiendo de la respuesta de GohanFile, ajusta esto
      return res.data.url || res.data.link || res.data.direct_url
      
    } catch (err) {
      console.error('Error GohanFile 1:', err.message)
      
      // Intento alternativo usando la interfaz web
      try {
        const formAlt = new FormData()
        formAlt.append('file', buffer, `file_${Date.now()}.${ext}`)
        
        const resAlt = await axios.post('https://gohanfile-storage.neocities.org/upload', formAlt, {
          headers: {
            ...formAlt.getHeaders(),
            'Origin': 'https://gohanfile-storage.neocities.org',
            'Referer': 'https://gohanfile-storage.neocities.org/'
          },
          maxRedirects: 5
        })
        
        // Extrae la URL del resultado (depende del HTML/JSON devuelto)
        const responseText = resAlt.data
        if (typeof responseText === 'string') {
          // Busca patrones comunes de URLs en la respuesta
          const urlMatch = responseText.match(/(https?:\/\/[^\s"']+)/)
          if (urlMatch) return urlMatch[0]
        }
        
        return null
      } catch (err2) {
        console.error('Error GohanFile 2:', err2.message)
        return null
      }
    }
  }

  // Subir a varios servicios (versión actualizada)
  const uploadToSupa = async (buffer) => {
    try {
      const form = new FormData()
      form.append('file', buffer, 'upload.jpg')
      const res = await axios.post('https://i.supa.codes/api/upload', form, {
        headers: form.getHeaders()
      })
      return res.data?.link || null
    } catch (err) {
      console.error('Error Supa:', err?.response?.data || err.message)
      return null
    }
  }

  const uploadToTmpFiles = async (filePath) => {
    try {
      const buf = fs.readFileSync(filePath)
      const { ext, mime } = await fileTypeFromBuffer(buf)
      const form = new FormData()
      form.append('file', buf, {
        filename: `${Date.now()}.${ext}`,
        contentType: mime
      })
      const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
        headers: form.getHeaders()
      })
      return res.data.data.url.replace('s.org/', 's.org/dl/')
    } catch (err) {
      console.error('Error TmpFiles:', err)
      return null
    }
  }

  const uploadToUguu = async (filePath) => {
    try {
      const form = new FormData()
      form.append('files[]', fs.createReadStream(filePath))
      const res = await axios.post('https://uguu.se/upload.php', form, {
        headers: form.getHeaders()
      })
      return res.data.files?.[0]?.url || null
    } catch (err) {
      console.error('Error Uguu:', err)
      return null
    }
  }

  const uploadToFreeImageHost = async (buffer) => {
    try {
      const form = new FormData()
      form.append('source', buffer, 'file')
      const res = await axios.post('https://freeimage.host/api/1/upload', form, {
        params: {
          key: '6d207e02198a847aa98d0a2a901485a5' // Cambia si se acaba la cuota
        },
        headers: form.getHeaders()
      })
      return res.data.image.url
    } catch (err) {
      console.error('Error FreeImageHost:', err?.response?.data || err.message)
      return null
    }
  }

  // Ejecutar todas las subidas en paralelo
  const [supa, tmp, uguu, freehost, gohan] = await Promise.allSettled([
    uploadToSupa(buffer),
    uploadToTmpFiles(filePath),
    uploadToUguu(filePath),
    uploadToFreeImageHost(buffer),
    uploadToGohanFile(buffer)
  ])

  // Procesar resultados
  const getResult = (promise) => promise.status === 'fulfilled' ? promise.value : null

  let message = '*✅ Archivo subido exitosamente a varios servicios:*\n'
  if (getResult(supa)) message += `\n🔗 *Supa:* ${getResult(supa)}`
  if (getResult(tmp)) message += `\n🔗 *TmpFiles:* ${getResult(tmp)}`
  if (getResult(uguu)) message += `\n🔗 *Uguu:* ${getResult(uguu)}`
  if (getResult(freehost)) message += `\n🔗 *FreeImage.Host:* ${getResult(freehost)}`
  if (getResult(gohan)) message += `\n🔗 *GohanFile:* ${getResult(gohan)}`

  // Si ningún servicio funcionó
  if (message === '*✅ Archivo subido exitosamente a varios servicios:*\n') {
    message = '❌ Error: No se pudo subir el archivo a ningún servicio'
  }

  await conn.sendMessage(m.chat, { text: message }, { quoted: m })
  await conn.sendMessage(m.chat, {
    react: { text: '✅', key: m.key }
  })

  // Borra el archivo temporal
  fs.unlinkSync(filePath)
}

handler.help = ['tourl']
handler.tags = ['uploader']
handler.command = /^(tourl)$/i

export default handler