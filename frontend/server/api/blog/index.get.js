function extractString (val, depth = 0) {
  if (depth > 5) return ''
  if (typeof val === 'string') return (val && val !== '[object Object]') ? val : ''
  if (!val || typeof val !== 'object') return ''
  const keys = ['value', 'text', 'default', 'content', 'description', 'title', 'children']
  for (const k of keys) {
    const v = val[k]
    if (typeof v === 'string') return (v && v !== '[object Object]') ? v : ''
    if (Array.isArray(v)) {
      for (const item of v) {
        const s = extractString(item, depth + 1)
        if (s) return s
      }
    }
    if (v && typeof v === 'object' && k === 'children') {
      for (const item of v) {
        const s = extractString(item, depth + 1)
        if (s) return s
      }
    }
  }
  for (const v of Object.values(val)) {
    if (typeof v === 'string' && v.length > 20 && v !== '[object Object]') return v
  }
  return ''
}

function extractImageUrl (val, depth = 0) {
  if (depth > 5) return ''
  if (typeof val === 'string' && val && (val.startsWith('http') || val.startsWith('/'))) return val
  if (!val || typeof val !== 'object') return ''
  const u = val.url ?? val.src ?? val.href
  if (typeof u === 'string' && (u.startsWith('http') || u.startsWith('/'))) return u
  for (const v of Object.values(val)) {
    if (typeof v === 'string' && (v.startsWith('http') || v.startsWith('/'))) return v
  }
  if (Array.isArray(val)) {
    for (const item of val) {
      const u2 = extractImageUrl(item, depth + 1)
      if (u2) return u2
    }
  }
  return ''
}

const SLUG_TO_IMAGE = {
  'como-funciona-inspeccion-auto': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800',
  '10-cosas-revisar-comprar-auto': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800',
  'remate-vs-clasificados': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800',
  'como-funcionan-remates-chile': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800',
  'como-se-realiza-remate-correctamente': 'https://images.unsplash.com/photo-1652660771416-032b5debd5be?q=80&w=800',
  'que-es-un-remate-funcion': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',
  'quien-puede-ser-postor-remate': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800',
  'subasta-vs-remate': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800',
  'tipos-de-remates-chile': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
  'fases-etapas-remate': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
  'mejor-pagina-comprar-autos-usados-chile': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800'
}

function getSlugFromPost (p) {
  const stem = p.stem ?? p.slug ?? ''
  if (stem) return String(stem).replace(/^blog\//, '')
  const path = p.path ?? p._path ?? ''
  if (path) {
    const m = String(path).match(/\/blog\/([^/]+)$/) || String(path).match(/\/([^/]+)$/)
    if (m) return m[1]
  }
  const id = p.id ?? p._id ?? ''
  const m2 = String(id).match(/:([^:]+)\.md$/) || String(id).match(/[\/:]([^\/:]+)\.md?$/)
  return m2 ? m2[1] : ''
}

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
            const descM = fm.match(/description:\s*(.+?)(?:\n|$)/) || fm.match(/description:\s*["']([^"']*)["']/)
            const imgM = fm.match(/image:\s*(.+?)(?:\n|$)/) || fm.match(/image:\s*["']([^"']*)["']/)
            let desc = ''
            let img = ''
            if (descM) {
              desc = descM[1] ? descM[1].trim().replace(/^['"]|['"]$/g, '').split('\n')[0] : ''
            }
            if (imgM) {
              img = imgM[1] ? imgM[1].trim().replace(/^['"]|['"]$/g, '') : ''
            }
            console.log(`[API blog] parseFrontmatter OK slug=${slug} path=${filePath} descLen=${desc.length} imgLen=${img.length}`)
            return { description: desc, image: img }
          }
        }
      }
    }
    console.log(`[API blog] parseFrontmatter NO FILE slug=${slug} cwd=${cwd} path1=${join(basePaths[0], slug + '.md')} exists=${existsSync(join(basePaths[0], slug + '.md'))}`)
  } catch (e) {
    console.error('[API blog] parseFrontmatterFromFile error:', e?.message)
  }
  return { description: '', image: '' }
}

function normalizePost (p) {
  if (!p || typeof p !== 'object') return null
  const meta = p.meta || {}
  const seo = p.seo || {}
  const desc = p.description ?? meta.description ?? seo.description ?? (p.head?.meta?.find(m => m?.name === 'description')?.content)
  const img = p.image ?? meta.image ?? (typeof seo.ogImage === 'string' ? seo.ogImage : (seo.ogImage?.url ?? seo.image))
  const slug = getSlugFromPost(p)
  const pathVal = (p.path ?? p._path ?? (slug ? '/blog/' + slug : '')).toString().trim()
  let descStr = extractString(desc)
  let imgStr = extractImageUrl(img)
  const titleStr = (p.title || meta.title || '').toString()
  if (slug) {
    const fromFile = parseFrontmatterFromFile(slug)
    if (fromFile.description && fromFile.description.length > 20) descStr = fromFile.description
    if (fromFile.image && fromFile.image.startsWith('http')) imgStr = fromFile.image
    if (!imgStr && SLUG_TO_IMAGE[slug]) imgStr = SLUG_TO_IMAGE[slug]
  }
  let descFinal = (typeof descStr === 'string' ? descStr : '').trim()
  if (!descFinal || descFinal.length < 20) {
    descFinal = `${titleStr}. Información y guía en AutoRemates Chile.`
  }
  const imgFinal = (typeof imgStr === 'string' ? imgStr : '')
  return {
    title: titleStr,
    description: descFinal,
    path: pathVal ? (pathVal.startsWith('/') ? pathVal : '/blog/' + pathVal) : (slug ? '/blog/' + slug : ''),
    date: p.date || '',
    image: imgFinal
  }
}

export default defineEventHandler(async (event) => {
  try {
    console.log('[API blog] /api/blog llamada - iniciando')
    const posts = await queryCollection(event, 'blog')
      .order('date', 'DESC')
      .all()
    const raw = posts || []
    console.log(`[API blog] queryCollection retornó ${raw.length} posts`)
    if (raw.length > 0) {
      const first = raw[0]
      console.log('[API blog] Primer post raw - stem:', first?.stem, 'path:', first?.path, 'title:', first?.title, 'imgType:', typeof first?.image, 'imgVal:', JSON.stringify(first?.image)?.slice(0, 100))
    }
    const result = raw.map(normalizePost).filter(Boolean)
    // Ordenar por fecha descendente (más nuevos primero); sin fecha van al final
    result.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    result.forEach((p, i) => {
      console.log(`[API blog] Post ${i} final - title:${p?.title?.slice(0, 40)} image:${p?.image ? 'SI(' + p.image.slice(0, 50) + '...)' : 'NO'} descLen:${p?.description?.length || 0}`)
    })
    return result
  } catch (e) {
    console.error('[API blog] Error:', e)
    return []
  }
})
