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
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      Daftar Surah Al-Qur’an
    </h1>

    <div v-if="pending">
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
      <Skeleton width="100%" height="4rem" class="p-4 mb-2"></Skeleton>
    </div>
    <div v-else-if="error">Gagal memuat data</div>

    <ul v-else>
      <ScrollTop />
      <ScrollPanel class="shadow-md" style="width: 100%; height: 750px; padding: 15px;">
        <SurahListItem 
          v-for="surah in surahList" 
          :key="surah.nomor" 
          :surah="surah" 
        />
      </ScrollPanel>
    </ul>
  </div>
</template>