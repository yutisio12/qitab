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
  <LastReadBanner />
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Daftar Surah Al-Qur’an
    </h1>

    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Gagal memuat data</div>

    <ul v-else>
      <SurahListItem 
        v-for="surah in surahList" 
        :key="surah.nomor" 
        :surah="surah" 
      />
    </ul>
  </div>
</template>