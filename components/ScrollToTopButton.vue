<script setup lang="ts">
const scrollToTop = () => {
  const container = document.querySelector('.p-scrollpanel-content')
  if (container) {
    container.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <button
    @click="scrollToTop"
    class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ease-premium active:scale-[0.92] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-purple-400"
    aria-label="Scroll to top"
  >
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  </button>
</template>
