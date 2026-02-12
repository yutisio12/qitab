<script setup>
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    @click="toggleColorMode"
    class="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:ring-2 hover:ring-primary-500 transition-all duration-300 focus:outline-none"
    aria-label="Toggle Dark Mode"
  >
    <i v-if="colorMode.value === 'dark'" class="pi pi-moon text-lg"></i>
    <i v-else class="pi pi-sun text-lg"></i>
  </button>
</template>
