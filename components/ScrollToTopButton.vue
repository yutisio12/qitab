<script setup>
const scrollToTop = () => {
  const container = document.querySelector('.p-scrollpanel-content')
  if (container) {
    container.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}
</script>

<template>
  <button
    @click="scrollToTop"
    class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:ring-2 hover:ring-purple-500 transition-all duration-300 focus:outline-none"
    aria-label="Scroll to Top"
  >
    <i class="pi pi-arrow-up text-lg"></i>
  </button>
</template>
