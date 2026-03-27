function parseFrontmatterFromFile (slug) {
  if (!slug) return { description: '', image: '' }
  try {
    const { readFileSync, existsSync } = require('node:fs')
    const { join } = require('node:path')
    const cwd = process.cwd()
    const basePaths = [
      '/app/content/blog',
      join(cwd, 'content', 'blog'),
      join(cwd, 'content'),
      join(cwd, '..', 'content', 'blog'),
      join(cwd, '..', 'content'),
      join(cwd, '.output', 'server', 'content', 'blog'),
      cwd
    ]
    const fileNames = [slug + '.md', 'blog/' + slug + '.md']
    for (const base of basePaths) {
      for (const fn of fileNames) {
        const filePath = base.startsWith('/') ? join(base, fn) : join(base, fn)
        if (existsSync(filePath)) {
          const raw = readFileSync(filePath, 'utf8')
          const match = raw.match(/^---\s*\n([\s\S]*?)\n---/)
          if (match) {
            const fm = match[1]
            // description: primera línea (valor sin comillas) o entre comillas
            const descM = fm.match(/description:\s*["']([^"']*)["']/) ||
              fm.match(/description:\s*(.+?)(?:\n|$)/)
            const imgM = fm.match(/image:\s*(.+?)(?:\n|$)/) || fm.match(/image:\s*["']([^"']*)["']/)
            let desc = ''
            let img = ''
            if (descM && descM[1]) {
              desc = descM[1].trim().replace(/^['"]|['"]$/g, '').replace(/\n+/g, ' ').slice(0, 320)
            }
            if (imgM && imgM[1]) {
              img = imgM[1].trim().replace(/^['"]|['"]$/g, '')
            }
            return { description: desc, image: img }
          }
        }
      }
    }
  } catch (e) {
    console.error('[API blog path] parseFrontmatter error:', e?.message)
  }
  return { description: '', image: '' }
}

function ensureString (val) {
  if (typeof val === 'string') return val
  if (!val || typeof val !== 'object') return ''
  if (val.content && typeof val.content === 'string') return val.content
  if (val.value !== undefined) return String(val.value)
  if (val.text !== undefined) return String(val.text)
  return ''
}

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) return null
  const fullPath = `/blog/${path}`
  const slug = path.replace(/\.md$/, '')
  try {
    const page = await queryCollection(event, 'blog').path(fullPath).first()
    if (!page) return null
    const fromFile = parseFrontmatterFromFile(slug)
    const descRaw = page.description ?? fromFile.description
    const description = typeof descRaw === 'string' ? descRaw : ensureString(descRaw) || fromFile.description
    const image = (typeof page.image === 'string' && page.image) ? page.image : fromFile.image
    // Descripción única por artículo: del frontmatter o fallback con título (nunca genérica igual para todos)
    const fallbackByTitle = page.title
      ? `${page.title}. Guía y consejos en el blog de AutoRemates Chile.`
      : 'Artículo del blog AutoRemates Chile. Remates y subastas de autos.'
    const finalDescription = (description && description !== '[object Object]')
      ? description
      : (fromFile.description || fallbackByTitle)

    return {
      ...page,
      description: finalDescription,
      image: image || page.image
    }
  } catch (e) {
    console.error('[API blog article] Error:', e)
    return null
  }
})
