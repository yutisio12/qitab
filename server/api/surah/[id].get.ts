export default defineCachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
    const res = await $fetch(`https://equran.id/api/v2/surat/${id}`)
    return res
  },
  {
    maxAge: 60 * 60 * 36,
  }
)