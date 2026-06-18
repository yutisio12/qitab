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

const router = useRouter()
const menuOpen = ref(false)
const route = useRoute()
const isHome = computed(() => route.path === '/')

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

watch(route, () => { menuOpen.value = false })
</script>

<template>
  <div class="relative min-h-[100dvh]">
    <div class="noise-overlay" />

    <!-- Fluid Island Nav -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-4 pointer-events-none"
    >
      <div
        class="pointer-events-auto glass-pill flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full max-w-[96vw] sm:max-w-none"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-sm font-semibold text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-premium"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5Z" />
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          </svg>
          <span class="hidden sm:inline">Qitab</span>
        </NuxtLink>

        <div class="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />

        <button
          v-if="!isHome"
          @click="closeMenu(); router.push('/')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-premium"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span class="hidden sm:inline">Surah</span>
        </button>

        <div class="flex-1" />

        <button
          @click="toggleColorMode"
          class="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-premium"
          aria-label="Toggle dark mode"
        >
          <svg v-if="isDark" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
          </svg>
        </button>

        <!-- Hamburger -->
        <button
          @click="toggleMenu"
          class="relative flex flex-col items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-premium"
          aria-label="Menu"
        >
          <span
            class="block w-4 h-px bg-current rounded-full transition-all duration-500 ease-premium"
            :class="menuOpen ? 'rotate-45 translate-y-[0px]' : '-translate-y-[3px]'"
          />
          <span
            class="block w-4 h-px bg-current rounded-full transition-all duration-500 ease-premium"
            :class="menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 translate-y-[3px]'"
          />
          <span
            class="absolute block w-4 h-px bg-current rounded-full transition-all duration-500 ease-premium"
            :class="menuOpen ? '-rotate-45 translate-y-[0px] opacity-100' : 'translate-y-[3px] opacity-0'"
          />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <Teleport to="body">
      <transition
        enter-active-class="transition-all duration-500 ease-premium"
        leave-active-class="transition-all duration-400 ease-premium"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="menuOpen"
          @click="closeMenu"
          class="fixed inset-0 z-40 glass-overlay flex flex-col items-center justify-center gap-8"
        >
          <NuxtLink
            to="/"
            @click="closeMenu"
            class="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white opacity-0 translate-y-12 transition-all duration-700 ease-premium"
            :class="menuOpen ? '!opacity-100 !translate-y-0' : ''"
            style="transition-delay: 100ms"
          >
            Surah
          </NuxtLink>
          <p
            class="text-sm text-gray-500 dark:text-gray-400 opacity-0 translate-y-12 transition-all duration-700 ease-premium"
            :class="menuOpen ? '!opacity-100 !translate-y-0' : ''"
            style="transition-delay: 200ms"
          >
            Baca Al-Qur'an
          </p>
          <div
            class="flex gap-2 opacity-0 translate-y-12 transition-all duration-700 ease-premium"
            :class="menuOpen ? '!opacity-100 !translate-y-0' : ''"
            style="transition-delay: 300ms"
          >
            <button
              @click="toggleColorMode(); closeMenu()"
              class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300 ease-premium"
            >
              <svg v-if="isDark" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
              {{ isDark ? 'Terang' : 'Gelap' }}
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Main Content -->
    <main class="relative z-10">
      <slot />
    </main>
  </div>
</template>
