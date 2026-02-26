export default defineEventHandler(async (event) => {
  try {
    const posts = await queryCollection(event, 'blog')
      .order('date', 'DESC')
      .select('title', 'description', 'path', 'date', 'image')
      .all()
    return posts || []
  } catch (e) {
    console.error('[API blog] Error:', e)
    return []
  }
})
