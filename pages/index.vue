<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'

const { lastRead, load } = useLastRead()

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const isMinLoading = ref(true)

const { data, pending, error } = useFetch('/api/surah', {
  key: 'surah-list',
  lazy: true,
})

const colorMode = useColorMode()
const isDark = computed({
  get() { return colorMode.value === 'dark' },
  set(v) { colorMode.preference = v ? 'dark' : 'light' }
})

const scrollToTop = () => {
  if (scrollPanelEl.value) {
    scrollPanelEl.value.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const focusSearch = () => {
  nextTick(() => searchInput.value?.$el?.focus())
}

const toggleColorMode = () => {
  const saved = localStorage.getItem('nuxt-color-mode')
  colorMode.preference = (saved ?? colorMode.value) === 'dark' ? 'light' : 'dark'
}

const itemsSpeed = computed(() => [
  {
    label: 'Top',
    icon: 'pi pi-arrow-up',
    command: () => scrollToTop()
  },
  {
    label: 'Search',
    icon: 'pi pi-search',
    command: () => focusSearch()
  },
  {
    label: 'Color Mode',
    icon: colorMode.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon',
    command: () => toggleColorMode()
  },
])

const surahList = computed(() => {
  if (!data.value?.data) return []
  if (!searchQuery.value) return data.value.data
  const q = searchQuery.value.toLowerCase()
  return data.value.data.filter((s: any) =>
    s.namaLatin.toLowerCase().includes(q) || s.nomor.toString().includes(q)
  )
})

const scrollPanelEl = ref<any>(null)
const scrollbarY = ref(0)

function onScroll(event: any) {
  const el = event.target
  const maxScroll = el.scrollHeight - el.clientHeight
  scrollbarY.value = maxScroll > 0 ? (el.scrollTop / maxScroll) * 100 : 0
}

onMounted(() => {
  load()
  setTimeout(() => { isMinLoading.value = false }, 500)
})
</script>

<template>
  <div class="px-4 sm:px-6 pt-28 sm:pt-32 pb-24 max-w-4xl mx-auto">
    <!-- Hero -->
    <div class="text-center mb-10 sm:mb-14 animate-fade-up opacity-0" style="animation-fill-mode: forwards;">
      <span class="eyebrow mb-4 inline-flex">Al-Qur'an</span>
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-gray-900 dark:text-white mt-4 leading-[1.1]">
        Daftar Surah
      </h1>
      <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto">
        Bacalah Al-Qur'an dengan khusyuk dan pahami maknanya
      </p>

      <!-- Search -->
      <div class="max-w-sm mx-auto mt-6 sm:mt-8">
        <div class="double-bezel">
          <div class="double-bezel-inner flex items-center gap-2 px-4 py-1">
            <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              placeholder="Cari surah..."
              class="w-full bg-transparent border-0 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 py-2.5"
            />
            <kbd class="hidden sm:inline-flex text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">/</kbd>
          </div>
        </div>
      </div>
    </div>

    <!-- Last Read -->
    <div class="animate-fade-up opacity-0" style="animation-delay: 150ms; animation-fill-mode: forwards;">
      <LastReadBanner />
    </div>

    <!-- Loading -->
    <div v-if="pending || isMinLoading" class="grid grid-cols-1 gap-3 mt-4">
      <div v-for="i in 6" :key="i" class="animate-fade-up opacity-0" :style="{ animationDelay: `${200 + i * 80}ms`, animationFillMode: 'forwards' }">
        <div class="double-bezel">
          <div class="double-bezel-inner p-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-32 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
                <div class="h-3 w-24 bg-gray-50 dark:bg-white/[0.03] rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <div class="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 border border-red-200/30 dark:border-red-700/20 flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
        </svg>
      </div>
      <p class="text-sm text-red-500">Gagal memuat data surah.</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!surahList || surahList.length === 0" class="text-center py-20">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200/30 dark:border-white/10 flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        <template v-if="searchQuery">Surah tidak ditemukan.</template>
        <template v-else>Memuat Surah ...</template>
      </p>
    </div>

    <!-- Surah List -->
    <div v-else>
      <div
        ref="scrollPanelEl"
        @scroll="onScroll"
        class="space-y-2 sm:space-y-3 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin"
      >
        <SurahListItem
          v-for="(surah, index) in surahList"
          :key="surah.nomor"
          :surah="surah"
          class="animate-fade-up opacity-0"
          :style="{ animationDelay: `${200 + index * 60}ms`, animationFillMode: 'forwards' }"
        />
      </div>

      <!-- SpeedDial -->
      <SpeedDial
        :model="itemsSpeed"
        :radius="100"
        type="quarter-circle"
        direction="up-left"
        :style="{ position: 'fixed', right: '1.5rem', bottom: '1.5rem' }"
        :buttonProps="{ severity: 'help', rounded: true }"
      />
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 3px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.2);
  border-radius: 999px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.4);
}
</style>
