<script setup>
  const route = useRoute()
  const surahId = route.params.id
  const { data, pending, error } = await useFetch(
    `https://equran.id/api/v2/surat/${surahId}`
  )
  const { save, load, lastRead } = useLastRead()

  load()

  function saveLastRead(ayat) {
    const payload = {
      surahId: data.value.data.nomor,
      surahName: data.value.data.namaLatin,
      ayat: ayat.nomorAyat
    }

    if(lastRead.value){
      console.log('Start Debug 1')
      
      if(lastRead.value.surahId == payload.surahId && lastRead.value.ayat == payload.ayat){
        console.log('Start Debug 2 - Data sama, skip save')
        return
      }
      
      // Cek apakah ayat sebelumnya lebih tinggi
      if(lastRead.value.surahId == payload.surahId && lastRead.value.ayat >= payload.ayat){
        console.log('Start Debug 3 - Ayat sebelumnya lebih tinggi, skip save')
        return
      }
    }
    
    console.log('Start Debug 4 - Saving data')
    console.table(payload)
    save(payload)
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
          :id="`ayat-${ayat.nomorAyat}`"
          class="border-b pb-6 cursor-pointer hover:bg-gray-50"
          :class="{
            'bg-yellow-100': lastRead?.surahId == surahId
            && lastRead?.ayat === ayat.nomorAyat
          }"
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

          <span v-if="lastRead?.surahId == surahId && lastRead?.ayat === ayat.nomorAyat">
            Last Read
          </span>

        </div>
      </div>
    </div>
  </div>
</template>