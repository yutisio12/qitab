<script setup lang="ts">
  const { lastRead } = useLastRead()
</script>

<template>
  <div 
    v-if="lastRead"
    class="mb-6 p-4 border rounded-lg bg-yellow-50 flex justify-between items-center"
  >
    <p class="text-sm text-gray-600">Terakhir Dibaca: </p>
    <NuxtLink :to="`/surah/${lastRead.surahId}#ayat-${lastRead.ayat}`"
      class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
      {{ lastRead.surahName }} - {{ lastRead.ayat }}
    </NuxtLink>
  </div>
</template>