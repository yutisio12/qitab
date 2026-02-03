<script setup lang="ts">
  defineProps<{
    surah: any
  }>()
</script>

<template>
  <li>
    <NuxtLink
      :to="`/surah/${surah.nomor}`"
      class="block p-4 mb-2 border rounded hover:bg-orange-100"
      style="border: 1px solid rgba(255, 193, 6, 0.3); --p-ripple-background: rgba(255, 193, 6, 0.3)"
    >
      <p class="font-semibold">
        {{ surah.namaLatin }} • {{ surah.jumlahAyat }} ayat
      </p>
    </NuxtLink>
  </li>
</template>