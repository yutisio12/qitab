<script setup>
  const { data, pending, error } = await useFetch(
    'https://equran.id/api/v2/surat'
  )
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Daftar Surah Al-Qur’an
    </h1>

    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Gagal memuat data</div>

    <ul v-else>
      <li v-for="surah in data.data" :key="surah.nomor">
        <NuxtLink
          :to="`/surah/${surah.nomor}`"
          class="block border-b py-3 hover:bg-gray-50"
        >
          <strong>{{ surah.nomor }}.</strong>
          {{ surah.namaLatin }}
          ({{ surah.jumlahAyat }} ayat)
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>