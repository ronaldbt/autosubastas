export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) return null
  const fullPath = `/blog/${path}`
  try {
    const page = await queryCollection(event, 'blog').path(fullPath).first()
    return page
  } catch (e) {
    console.error('[API blog article] Error:', e)
    return null
  }
})
