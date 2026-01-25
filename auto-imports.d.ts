// auto-imports.d.ts
export {}
declare global {
  const useFetch: typeof import('#app')['useFetch']
  const useRoute: typeof import('#app')['useRoute']
  const onMounted: typeof import('vue')['onMounted']
  const nextTick: typeof import('vue')['nextTick']
  const ref: typeof import('vue')['ref']
  // dst...
}