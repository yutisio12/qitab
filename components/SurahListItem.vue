<script setup lang="ts">
defineProps<{ surah: any }>()
</script>

<template>
  <div class="ambient-glow">
    <NuxtLink
      :to="`/surah/${surah.nomor}`"
      class="double-bezel group block"
    >
      <div class="double-bezel-inner p-4 sm:p-5 transition-all duration-700 ease-premium group-hover:bg-white dark:group-hover:bg-white/[0.03]">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-100/50 dark:bg-purple-900/20 border border-purple-200/30 dark:border-purple-700/20 flex items-center justify-center shrink-0 transition-all duration-500 ease-premium group-hover:bg-purple-200/50 dark:group-hover:bg-purple-800/30 group-hover:border-purple-300/50 dark:group-hover:border-purple-600/30 group-hover:scale-105">
            <span class="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400">{{ surah.nomor }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate transition-colors duration-500 ease-premium group-hover:text-purple-700 dark:group-hover:text-purple-300">
                {{ surah.namaLatin }}
              </h3>
              <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500">{{ surah.nama }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ surah.arti }} · {{ surah.jumlahAyat }} ayat
            </p>
          </div>
          <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0 transition-all duration-500 ease-premium group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-colors duration-500 ease-premium group-hover:text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
