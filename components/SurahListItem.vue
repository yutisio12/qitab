<script setup lang="ts">
  defineProps<{
    surah: any
  }>()
</script>

<template>
  <li>
    <NuxtLink
      :to="`/surah/${surah.nomor}`"
      class="block p-4 mb-2 border rounded hover:bg-purple-100 dark:hover:bg-purple-950/20 transition-all duration-300"
      style="border: 1px solid rgba(168, 85, 247, 0.3); --p-ripple-background: rgba(168, 85, 247, 0.3)"
    >
      <p class="font-semibold dark:text-gray-200">
        {{ surah.namaLatin }} • {{ surah.jumlahAyat }} ayat
      </p>
    </NuxtLink>
  </li>
</template>