<script setup>
  import { onMounted, ref, computed } from 'vue'
  const { lastRead, load } = useLastRead()
  const searchQuery = ref('')
  
  const { data, pending, error } = useFetch(
    '/api/surah', {
      key: 'surah-list',
      lazy: true,
      // getCachedData: (key) => useNuxtData(key).data.value
    }
  )
  
  const surahList = computed(() => {
    if (!data.value?.data) return []
    if (!searchQuery.value) return data.value.data
    
    const query = searchQuery.value.toLowerCase()
    return data.value.data.filter(surah => 
      surah.namaLatin.toLowerCase().includes(query) || 
      surah.nomor.toString().includes(query)
    )
  })

  const isMinLoading = ref(true)
  
  onMounted(() => {
    load()
    setTimeout(() => {
      isMinLoading.value = false
    }, 500)
  })
</script>

<template>
  <LastReadBanner />
  <div class="p-6 max-w-3xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold dark:text-white">
        Daftar Surah Al-Qur’an
      </h1>
      <div class="relative w-full md:w-64">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
        <InputText v-model="searchQuery" placeholder="Cari Surah..." class="w-full pl-10 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-gray-500 rounded-xl" />
      </div>
    </div>
    

    <div v-if="pending || isMinLoading" class="mt-4">
      <div v-for="i in 8" :key="i" class="mb-3">
        <Skeleton width="100%" height="4.5rem" class="rounded-xl"></Skeleton>
      </div>
    </div>
    
    <div v-else-if="error" class="mt-4 text-red-500">
      Gagal memuat data surah.
    </div>

    <div v-else-if="!surahList || surahList.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400 italic">
      <template v-if="searchQuery">
        Surah "{{ searchQuery }}" tidak ditemukan.
      </template>
      <template v-else>
        Memuat data...
      </template>
    </div>

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