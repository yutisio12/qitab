<script setup lang="ts">
  defineProps<{
    surah: any
  }>()
</script>

<template>
  <li>
    <NuxtLink
      :to="`/surah/${surah.nomor}`"
      class="block p-4 border rounded hover:bg-gray-50"
    >
      <p class="font-semibold">
        {{ surah.namaLatin }} • {{ surah.jumlahAyat }} ayat
      </p>
    </NuxtLink>
  </li>
</template>