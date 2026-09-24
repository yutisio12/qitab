<script setup lang="ts">
const { lastRead } = useLastRead()
</script>

<template>
  <div
    v-if="lastRead"
    class="double-bezel mb-6"
  >
    <div class="double-bezel-inner px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200/30 dark:border-purple-700/20 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Terakhir ditandai</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ lastRead.surahName }} · Ayat {{ lastRead.ayat }}</p>
        </div>
      </div>
      <NuxtLink
        :to="`/surah/${lastRead.surahId}#ayat-${lastRead.ayat}`"
        class="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.97] transition-all duration-300 ease-premium shrink-0"
      >
        Lanjutkan
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>

  </div>
</template>
