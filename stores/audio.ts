import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', () => {
  const audio = ref<HTMLAudioElement | null>(null)
  const currentAyah = ref<string | null>(null)
  const isPlaying = ref(false)

  function toggle(url: string, ayahKey: string) {
    // kalau ayat sama → STOP
    if (currentAyah.value === ayahKey && audio.value) {
      audio.value.pause()
      audio.value.currentTime = 0
      audio.value = null
      currentAyah.value = null
      isPlaying.value = false
      return
    }

    // stop audio sebelumnya
    if (audio.value) {
      audio.value.pause()
      audio.value.currentTime = 0
    }

    audio.value = new Audio(url)
    currentAyah.value = ayahKey
    isPlaying.value = true

    audio.value.play()

    // selesai → stop (tidak lanjut)
    audio.value.onended = () => {
      audio.value = null
      currentAyah.value = null
      isPlaying.value = false
    }
  }

  return { toggle, currentAyah, isPlaying }
})