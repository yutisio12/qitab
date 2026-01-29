<script setup lang="ts">
  definePageMeta({
    keepalive: true
  })
  import { computed } from 'vue'
  import Button from 'primevue/button'
  import { useAudioStore } from '~/stores/audio'
  
  // ✅ Definisikan interface untuk response API
  interface Ayat {
    nomorAyat: number
    teksArab: string
    teksLatin: string
    teksIndonesia: string,
    audio: any
  }

  interface SurahData {
    nomor: number
    namaLatin: string
    arti: string
    jumlahAyat: number
    ayat: Ayat[]
  }

  interface SurahResponse {
    data: SurahData
  }

  const route = useRoute()
  const surahId = route.params.id
  
  const { data, pending, error } = await useFetch<SurahResponse>(
    `/api/surah/${surahId}`, {
      key: `surah-${surahId}`,
      server: false,
      lazy: false,
    },
  )
  
  const surahData = computed(() => data.value?.data || null)
  const { save, load, lastRead } = useLastRead()
  const ayatRefs = ref<Record<number, any>>({})
  load()
  
  function saveLastRead(ayat: { nomorAyat: number }) {
    const payload = {
      surahId: data.value.data.nomor,
      surahName: data.value.data.namaLatin,
      ayat: ayat.nomorAyat
    }

    if(lastRead.value){
      // console.log('Start Debug 1')
      
      if(lastRead.value.surahId == payload.surahId && lastRead.value.ayat == payload.ayat){
        // console.log('Start Debug 2 - Data sama, skip save')
        return
      }
      
      if(lastRead.value.surahId == payload.surahId && lastRead.value.ayat >= payload.ayat){
        // console.log('Start Debug 3 - Ayat sebelumnya lebih tinggi, skip save')
        return
      }
    }
    
    // console.log('Start Debug 4 - Saving data')
    // console.table(payload)
    save(payload)
  }

  onMounted(async () => {
    // ✅ Fixed: Cek lastRead dengan .value
    if (
      !lastRead.value ||
      lastRead.value.surahId != surahId ||
      !lastRead.value.ayat
    ) return

    await nextTick()

    const target = ayatRefs.value[lastRead.value.ayat] // ✅ Fixed
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })

  const audioStore = useAudioStore()

</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <NuxtLink to="/" class="text-blue-600 underline">
      ← Kembali ke daftar surah
    </NuxtLink>

    <div v-if="pending && !surahData" class="mt-6">
      Loading surah...
    </div>

    <div v-else-if="error" class="mt-6 text-red-600">
      Gagal memuat surah
    </div>

    <div v-else class="mt-6">
      <h1 class="text-3xl font-bold">
        {{ surahData.namaLatin }}
      </h1>

      <p class="text-gray-600 mt-1">
        {{ surahData.arti }} • {{ surahData.jumlahAyat }} ayat
      </p>

      <!-- Daftar Ayat -->
      <div class="mt-8 space-y-8">
        <div
          v-for="ayat in surahData.ayat"
          :key="ayat.nomorAyat"
          :ref="el => { if (el) ayatRefs[ayat.nomorAyat] = el }"
          :id="`ayat-${ayat.nomorAyat}`"
          class="border-b pb-6 hover:bg-gray-50"
          :class="{
            'bg-yellow-100': lastRead?.surahId == surahId
            && lastRead?.ayat === ayat.nomorAyat
          }"
          @click="saveLastRead(ayat)"
          @mouseover="saveLastRead(ayat)"
          style="padding: 15px; border-radius: 10px;"
        >
          <div class="text-sm text-gray-500 mb-2">
            Ayat {{ ayat.nomorAyat }}
          </div>

          <p class="text-3xl leading-loose text-right arabic-quran" style="font-size: 38px !important;">
            {{ ayat.teksArab }}
          </p>

          <div class="grid grid-cols-2 gap-4 mt-3">
            <div class="col-md-6">
              <p class="mt-3 italic text-gray-700">
                {{ ayat.teksLatin }}
              </p>
            </div>
            <div class="col-md-6 text-right">
              <button class="bg-blue-500 text-white px-2 py-1 rounded mt-3"
                @click="audioStore.toggle(ayat.audio['05'], `${surahId}-${ayat.nomorAyat}`)"
              >
                <i :class="`pi pi-${audioStore.isPlaying && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}` ? 'stop' : 'play'}`"></i>
                 {{ audioStore.isPlaying && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}` ? 'Stop' : 'Play' }}
              </button>
            </div>
          </div>

          <p class="mt-2">
            {{ ayat.teksIndonesia }}
          </p>

          <span 
            v-if="lastRead?.surahId == surahId && lastRead?.ayat === ayat.nomorAyat"
            class="ml-2 text-xs bg-yellow-400 px-2 py-1 rounded"
            style="background-color: yellow !important;"
          >
            Last Read
          </span>
        </div>
      </div>
    </div>
  </div>
</template>