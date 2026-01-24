<script setup>
  const route = useRoute()
  const surahId = route.params.id
  const { data, pending, error } = await useFetch(
    `https://equran.id/api/v2/surat/${surahId}`
  )
  function saveLastRead(ayat) {
    const payload = {
      surahId: data.value.data.nomor,
      surahName: data.value.data.namaLatin,
      ayat: ayat.nomorAyat
    }
    if(localStorage.getItem('lastRead')){
      const lastRead = JSON.parse(localStorage.getItem('lastRead'))
      if(lastRead.surahId == payload.surahId && lastRead.ayat == payload.ayat){
        // console.log('Start Debug 1')
        // console.table(lastRead)
        // console.table(payload)
        // console.log('End Debug 1')
        return
      }
      if(lastRead.surahId == payload.surahId && lastRead.ayat >= payload.ayat){
        // console.log('Start Debug 2')
        // console.table(lastRead)
        // console.table(payload)
        // console.log('End Debug 2')
        return
      }
    }
    // console.log('Start Debug 3')
    // console.table(payload)
    // console.log('End Debug 3')
    localStorage.setItem('lastRead', JSON.stringify(payload))
  }
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <NuxtLink to="/" class="text-blue-600 underline">
    ← Kembali ke daftar surah
    </NuxtLink>

    <div v-if="pending" class="mt-6">
      Loading surah...
    </div>

    <div v-else-if="error" class="mt-6 text-red-600">
      Gagal memuat surah
    </div>

    <div v-else class="mt-6">
      <!-- Info Surah -->
      <h1 class="text-3xl font-bold">
        {{ data.data.namaLatin }}
      </h1>

      <p class="text-gray-600 mt-1">
        {{ data.data.arti }} • {{ data.data.jumlahAyat }} ayat
      </p>

      <!-- Daftar Ayat -->
      <div class="mt-8 space-y-8">
        <div
          v-for="ayat in data.data.ayat"
          :key="ayat.nomorAyat"
          class="border-b pb-6 cursor-pointer hover:bg-gray-50"
          @click="saveLastRead(ayat)"
          v-on:mouseover="saveLastRead(ayat)"
        >
          <div class="text-sm text-gray-500 mb-2">
            Ayat {{ ayat.nomorAyat }}
          </div>


          <p class="text-2xl leading-loose text-right font-arabic" style="font-size: 25px !important;">
            {{ ayat.teksArab }}
          </p>


          <p class="mt-3 italic text-gray-700">
            {{ ayat.teksLatin }}
          </p>


          <p class="mt-2">
            {{ ayat.teksIndonesia }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>