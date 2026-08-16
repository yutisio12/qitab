<script setup lang="ts">
definePageMeta({ keepalive: true })
import { computed, ref, nextTick } from 'vue'
import { useAudioStore } from '~/stores/audio'
import { useRouter } from 'vue-router'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"

const confirm = useConfirm()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const surahId = parseInt(route.params.id as string)

interface Ayat {
  nomorAyat: number
  teksArab: string
  teksLatin: string
  teksIndonesia: string
  audio: any
}
interface SurahData {
  nomor: number
  namaLatin: string
  arti: string
  jumlahAyat: number
  ayat: Ayat[]
}
interface SurahResponse { data: SurahData }

const { data, pending, error } = useFetch<SurahResponse>(`/api/surah/${surahId}`, {
  key: `surah-${surahId}`,
  server: false,
  lazy: true,
})

const { data: surahNext } = useFetch<SurahResponse>(`/api/surah/${surahId + 1}`, {
  key: `surah-${surahId + 1}`,
  server: false,
  lazy: true,
})

const { data: surahPrev } = useFetch<SurahResponse>(`/api/surah/${surahId - 1}`, {
  key: `surah-${surahId - 1}`,
  server: false,
  lazy: true,
})

const surahData = computed(() => data.value?.data || null)
const { save, load, lastRead } = useLastRead()
const audioStore = useAudioStore()

load()

const colorMode = useColorMode()
const isDark = computed({
  get() { return colorMode.value === 'dark' },
  set(v) { colorMode.preference = v ? 'dark' : 'light' }
})

const searchQuery = ref<number | null>(null)
const searchInput = ref<any>(null)
const scrollPanelEl = ref<any>(null)
const ayatRefs = ref<Record<number, any>>({})

function scrollToTop() {
  if (scrollPanelEl.value) {
    scrollPanelEl.value.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const focusSearch = () => {
  nextTick(() => searchInput.value?.focus())
}

const toggleColorMode = () => {
  const saved = localStorage.getItem('nuxt-color-mode')
  colorMode.preference = (saved ?? colorMode.value) === 'dark' ? 'light' : 'dark'
}

const itemsSpeed = computed(() => [
  {
    label: 'Search',
    icon: 'pi pi-search',
    command: () => focusSearch()
  },
  {
    label: 'Scroll Top',
    icon: 'pi pi-arrow-up',
    command: () => scrollToTop()
  },
  {
    label: 'Color Mode',
    icon: colorMode.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon',
    command: () => toggleColorMode()
  },
  {
    label: 'List',
    icon: 'pi pi-list',
    command: () => goBack()
  },
  {
    label: 'Prev',
    icon: 'pi pi-backward',
    command: () => goPrev()
  },
  {
    label: 'Next',
    icon: 'pi pi-forward',
    command: () => goNext()
  },
])

function saveLastRead(ayat: { nomorAyat: number }) {
  confirm.require({
    message: 'Simpan sebagai terakhir dibaca?',
    header: 'Tandai',
    icon: 'pi pi-bookmark',
    acceptLabel: 'Simpan',
    rejectLabel: 'Batal',
    accept: () => {
      const payload = {
        surahId: data.value!.data.nomor,
        surahName: data.value!.data.namaLatin,
        ayat: ayat.nomorAyat
      }
      save(payload)
      toast.add({ summary: 'Tersimpan', detail: 'Tandai berhasil disimpan', life: 3000 })
    }
  })
}

onMounted(async () => {
  if (!lastRead.value || lastRead.value.surahId !== surahId || !lastRead.value.ayat) return
  await nextTick()
  setTimeout(() => {
    const target = document.getElementById(`ayat-${lastRead.value!.ayat}`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 300)
})

function playContinuous(index: number) {
  const ayat = surahData.value?.ayat[index]
  if (!ayat) return
  const target = document.getElementById(`ayat-${ayat.nomorAyat}`)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  audioStore.continuePlay(
    ayat.audio['05'],
    `${surahId}-${ayat.nomorAyat}`,
    () => {
      if (surahData.value && index + 1 < surahData.value.ayat.length) {
        playContinuous(index + 1)
      }
    }
  )
}

function goBack() { router.push('/') }
function goNext() { router.push(`/surah/${surahId + 1}`) }
function goPrev() { router.push(`/surah/${surahId - 1}`) }

const jumpToSurah = async () => {
  const val = searchQuery.value
  if (!val || !surahData.value) return
  if (val < 1 || val > surahData.value.jumlahAyat) return
  await nextTick()
  const container = scrollPanelEl.value
  const target = container?.querySelector(`#ayat-${val}`)
  if (target) {
    container.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="px-4 sm:px-6 pt-28 sm:pt-32 pb-24 max-w-4xl mx-auto">
    <!-- Loading state -->
    <div v-if="pending && !surahData" class="space-y-4">
      <div class="double-bezel">
        <div class="double-bezel-inner p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <div class="w-20 h-9 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse" />
              <div class="w-28 h-9 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse" />
              <div class="w-24 h-9 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse" />
            </div>
            <div class="w-40 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
          </div>
          <div class="h-8 w-48 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
          <div class="h-4 w-36 bg-gray-50 dark:bg-white/[0.03] rounded-lg animate-pulse" />
          <div class="space-y-3 mt-8">
            <div v-for="i in 3" :key="i" class="h-32 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
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
      <p class="text-sm text-red-500">Gagal memuat surah</p>
    </div>

    <!-- Content -->
    <div v-else-if="surahData" class="animate-fade-up opacity-0" style="animation-fill-mode: forwards;">
      <!-- Navigation bar -->
      <div class="double-bezel mb-6 sm:mb-8">
        <div class="double-bezel-inner px-3 sm:px-4 py-2 flex items-center gap-2 flex-wrap">
          <button
            @click="goBack"
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-premium"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Daftar
          </button>

          <button
            v-if="surahPrev"
            @click="goPrev"
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-premium"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span class="hidden sm:inline truncate max-w-[80px]">{{ surahPrev.data?.namaLatin }}</span>
          </button>

          <button
            v-if="surahNext"
            @click="goNext"
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ease-premium"
          >
            <span class="hidden sm:inline truncate max-w-[80px]">{{ surahNext.data?.namaLatin }}</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <div class="flex-1" />

          <!-- Ayat search -->
          <div class="w-[110px] sm:w-40">
            <div class="double-bezel">
              <div class="double-bezel-inner flex items-center gap-1.5 px-3 py-1">
                <svg class="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref="searchInput"
                  v-model.number="searchQuery"
                  @input="jumpToSurah"
                  @keydown.enter="jumpToSurah"
                  type="number"
                  :min="1"
                  :max="surahData.jumlahAyat"
                  placeholder="Ayat"
                  class="w-full bg-transparent border-0 outline-none text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Surah Header -->
      <div class="double-bezel mb-6 sm:mb-8">
        <div class="double-bezel-inner px-5 sm:px-8 py-6 sm:py-8 text-center">
          <span class="eyebrow mb-3 inline-flex">Surah ke-{{ surahData.nomor }}</span>
          <h1 class="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-2">
            {{ surahData.namaLatin }}
          </h1>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ surahData.arti }} · {{ surahData.jumlahAyat }} ayat
          </p>
          <div class="mt-5 pt-5 border-t border-gray-100 dark:border-white/5">
            <p class="text-lg sm:text-2xl arabic-quran text-gray-700 dark:text-gray-300 opacity-70 leading-[2.2]">
              بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        </div>
      </div>

      <!-- Ayat List -->
      <div
        ref="scrollPanelEl"
        class="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin"
      >
        <div
          v-for="(ayat, index) in surahData.ayat"
          :key="ayat.nomorAyat"
          :id="`ayat-${ayat.nomorAyat}`"
          :ref="(el: any) => { if (el) ayatRefs[ayat.nomorAyat] = el }"
          class="double-bezel"
          :class="{
            '!border-purple-500/30 !bg-purple-500/5': lastRead?.surahId === surahId && lastRead?.ayat === ayat.nomorAyat
          }"
        >
          <div
            class="double-bezel-inner p-4 sm:p-6 transition-all duration-500 ease-premium hover:bg-white/50 dark:hover:bg-white/[0.02]"
            :class="{
              '!bg-purple-50/50 dark:!bg-purple-950/20': lastRead?.surahId === surahId && lastRead?.ayat === ayat.nomorAyat
            }"
          >
            <!-- Header: Ayat number + actions -->
            <div class="flex items-center justify-between gap-3 mb-3">
              <span class="eyebrow text-[9px] !px-2.5 !py-1">Ayat {{ ayat.nomorAyat }}</span>
              <div class="flex items-center gap-1.5">
                <!-- Play continuous -->
                <button
                  @click="playContinuous(index)"
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-premium active:scale-[0.92]"
                  :class="audioStore.isPlayingContinue && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}`
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/40'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-200'"
                  :title="audioStore.isPlayingContinue && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}` ? 'Pause' : 'Putar lanjut'"
                >
                  <svg v-if="audioStore.isPlayingContinue && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}`" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>

                <!-- Play single -->
                <button
                  @click="audioStore.toggle(ayat.audio['05'], `${surahId}-${ayat.nomorAyat}`)"
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-premium active:scale-[0.92]"
                  :class="audioStore.isPlaying && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}`
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/40'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-200'"
                  :title="audioStore.isPlaying && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}` ? 'Pause' : 'Putar'"
                >
                  <svg v-if="audioStore.isPlaying && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}`" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </button>

                <!-- Bookmark -->
                <button
                  @click="saveLastRead(ayat)"
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-premium active:scale-[0.92] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-purple-400"
                  title="Tandai"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Arabic text -->
            <p class="arabic-quran text-right" style="font-size: 32px !important; line-height: 2.4;">
              {{ ayat.teksArab }}
            </p>

            <!-- Latin transliteration -->
            <p class="mt-3 text-sm italic text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ ayat.teksLatin }}
            </p>

            <!-- Indonesian translation (collapsible) -->
            <div class="mt-3">
              <details class="group">
                <summary
                  class="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                >
                  <svg class="w-3 h-3 transition-transform duration-300 ease-premium group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  Artinya
                </summary>
                <div class="mt-2 p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {{ ayat.teksIndonesia }}
                  </p>
                </div>
              </details>
            </div>

            <!-- Last read badge -->
            <div
              v-if="lastRead?.surahId === surahId && lastRead?.ayat === ayat.nomorAyat"
              class="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border border-purple-200/30 dark:border-purple-700/20"
            >
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
              </svg>
              Terakhir Dibaca
            </div>
          </div>
        </div>
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

details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}
</style>
