<script setup lang="ts">
  const { lastRead } = useLastRead()
</script>

<template>
  <div 
    v-if="lastRead"
    class="mb-6 p-4 border bg-yellow-100 dark:bg-yellow-950/20 dark:border-yellow-700/50 flex justify-between items-center"
    style="border-bottom-right-radius: 10px; border-bottom-left-radius: 10px;"
  >
    <p class="text-sm text-gray-600 dark:text-gray-300 text-semibold">Terakhir Dibaca: </p>
    <NuxtLink :to="`/surah/${lastRead.surahId}#ayat-${lastRead.ayat}`"
      class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
      {{ lastRead.lastRead?.surahName || lastRead.surahName }} - {{ lastRead.ayat }}
    </NuxtLink>
  </div>
</template>