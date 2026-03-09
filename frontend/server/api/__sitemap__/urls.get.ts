import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(async (event) => {
  try {
    const posts = await queryCollection(event, 'blog')
      .order('date', 'DESC')
      .select('path', 'date')
      .all()

    if (!posts || posts.length === 0) return []

    return posts.map((p: { path?: string; date?: string }) => {
      const loc = p.path && p.path.startsWith('/') ? p.path : `/${p.path || ''}`
      return {
        loc,
        lastmod: p.date,
        changefreq: 'weekly' as const,
        priority: 0.8
      } satisfies SitemapUrlInput
    }).filter((u: SitemapUrlInput) => u.loc && u.loc.length > 1)
  } catch (e) {
    console.error('[Sitemap blog urls] Error:', e)
    return []
  }
})
