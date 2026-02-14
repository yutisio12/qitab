import { ref } from 'vue'

type LastRead = {
  surahId: number
  surahName: string
  ayat: number
}

const lastRead = ref<LastRead | null>(null)

export function useLastRead() {
  function load() {
    if (process.client) {
      const saved = localStorage.getItem('lastRead')
      if (saved) {
        lastRead.value = JSON.parse(saved)
      }
    }
  }

  function save(payload: LastRead) {
    lastRead.value = payload

    if (process.client) {
      localStorage.setItem('lastRead', JSON.stringify(payload))
    }
  }

  return {
    lastRead,
    load,
    save
  }
}