<script setup>
  import { onMounted } from 'vue'
  const { lastRead, load } = useLastRead()
  const { data, pending, error } = await useFetch(
    '/api/surah', {
      key: 'surah-list',
      getCachedData: (key) => useNuxtData(key).data.value
    }
  )
  const surahList = computed(() => data.value?.data || null)
  onMounted(() => {
    load()
  })
</script>

<template>
  <div v-if="lastRead">
    <p>Terakhir Dibaca: </p>
    <NuxtLink :to="`/surah/${lastRead.surahId}#ayat-${lastRead.ayat}`">
      {{ lastRead.surahName }}
    </NuxtLink>
    Ayat {{ lastRead.ayat }}
  </div>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Daftar Surah Al-Qur’an
    </h1>

    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Gagal memuat data</div>

    <ul v-else>
      <li v-for="surah in surahList" :key="surah.nomor">
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