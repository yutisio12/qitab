<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() { return colorMode.value === 'dark' },
  set(v) { colorMode.preference = v ? 'dark' : 'light' }
})
const toggleColorMode = () => {
  const saved = localStorage.getItem('nuxt-color-mode')
  colorMode.preference = (saved ?? colorMode.value) === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    @click="toggleColorMode"
    class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ease-premium active:scale-[0.92] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-purple-400"
    aria-label="Toggle dark mode"
  >
    <svg v-if="isDark" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
    <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  </button>
</template>
