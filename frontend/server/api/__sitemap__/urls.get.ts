import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'

const SLUG_TO_IMAGE: Record<string, string> = {
  'como-funciona-inspeccion-auto': 'https://images.unsplash.com/photo-1486262715619-67b8a0b08d3?q=80&w=800',
  '10-cosas-revisar-comprar-auto': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800',
  'remate-vs-clasificados': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800',
  'como-funcionan-remates-chile': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800',
  'como-se-realiza-remate-correctamente': 'https://images.unsplash.com/photo-1652660771416-032b5debd5be?q=80&w=800',
  'que-es-un-remate-funcion': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',
  'quien-puede-ser-postor-remate': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800',
  'subasta-vs-remate': 'https://images.unsplash.com/photo-1486262715619-67b8a6b08d3?q=80&w=800',
  'tipos-de-remates-chile': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
  'fases-etapas-remate': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
  'mejor-pagina-comprar-autos-usados-chile': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800'
}

function getSlugFromPath (path: string): string {
  if (!path) return ''
  const m = path.match(/\/blog\/([^/]+)$/) || path.match(/\/([^/]+)$/)
  return m ? m[1] : ''
}

function formatLastmod (d: string | undefined): string {
  if (!d) return new Date().toISOString().split('T')[0]
  try {
    const date = new Date(d)
    return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

export default defineSitemapEventHandler(async (event) => {
  try {
    const posts = await queryCollection(event, 'blog')
      .order('date', 'DESC')
      .all()

    if (!posts || posts.length === 0) return []

    return posts.map((p: { path?: string; date?: string; image?: string; title?: string }) => {
      const loc = (p.path && p.path.startsWith('/') ? p.path : `/${p.path || ''}`).replace(/\/\/+/g, '/')
      const slug = getSlugFromPath(loc)
      const imgUrl = (typeof p.image === 'string' && p.image.startsWith('http') ? p.image : null) || SLUG_TO_IMAGE[slug]
      const entry: SitemapUrlInput = {
        loc,
        lastmod: formatLastmod(p.date),
        changefreq: 'weekly' as const,
        priority: 0.8
      }
      if (imgUrl) {
        entry.images = [{ loc: imgUrl, title: (p.title || slug) }]
      }
      return entry
    }).filter((u: SitemapUrlInput) => u.loc && u.loc.length > 1)

    return [...staticUrls, ...blogUrls]
  } catch (e) {
    console.error('[Sitemap blog urls] Error:', e)
    return staticUrls
  }
})
