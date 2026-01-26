export default defineCachedEventHandler(
  async () => {
    const res = await $fetch('https://equran.id/api/v2/surat')
    return res
  },
  {
    maxAge: 60 * 60 * 36,
  }
)