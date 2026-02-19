<script setup lang="ts">
  definePageMeta({
    keepalive: true
  })
  import { computed } from 'vue'
  import { useAudioStore } from '~/stores/audio'
  import { useRouter } from 'vue-router'
  
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter()
  
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
  
  const { data, pending, error } = useFetch<SurahResponse>(
    `/api/surah/${surahId}`, {
      key: `surah-${surahId}`,
      server: false,
      lazy: true,
    },
  )
  
  const surahData = computed(() => data.value?.data || null)
  const { save, load, lastRead } = useLastRead()
  const ayatRefs = ref<Record<number, any>>({})
  load()
  
  function saveLastRead(ayat: { nomorAyat: number }) {

    confirm.require({
        message: ' Simpan sebagai terakhir dibaca?',
        header: 'Tandai',
        icon: 'pi pi-bookmark',
        acceptLabel: 'Simpan',
        rejectLabel: 'Batal',
        accept: () => {
            const payload = {
              surahId: data.value.data.nomor,
              surahName: data.value.data.namaLatin,
              ayat: ayat.nomorAyat
            }
            save(payload)
            toast.add({ summary: 'Tersimpan', detail: 'Tandai berhasil disimpan', life: 3000 });
        },
        reject: () => {
            // toast.add({ summary: 'Dibatalkan', detail: 'Tandai dibatalkan', life: 3000 });
        }
    });
  }

  onMounted(async () => {
    if (
      !lastRead.value ||
      lastRead.value.surahId != surahId ||
      !lastRead.value.ayat
    ) return

    await nextTick()
    
    // Memberikan waktu ekstra untuk ScrollPanel merender kontennya
    setTimeout(() => {
      const target = document.getElementById(`ayat-${lastRead.value.ayat}`)
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }, 300)
  })

  const audioStore = useAudioStore()

  function playContinuous(index: number) {
    const ayat = surahData.value.ayat[index]
    if (!ayat) return

    // Scroll into view
    const target = document.getElementById(`ayat-${ayat.nomorAyat}`)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }

    audioStore.continuePlay(
      ayat.audio['05'], 
      `${surahId}-${ayat.nomorAyat}`,
      () => {
        if (index + 1 < surahData.value.ayat.length) {
          playContinuous(index + 1)
        }
      }
    )
  }

  function goBack() {
    router.push('/')
  }
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <button class="bg-gray-500 text-white px-2 py-1 rounded" @click="goBack">
      <i class="pi pi-arrow-left"></i> Kembali
    </button>

    <div v-if="pending && !surahData" class="mt-6">
      <Skeleton width="60%" height="2.5rem" class="mb-4"></Skeleton>
      <Skeleton width="40%" height="1.5rem" class="mb-8"></Skeleton>
      
      <div v-for="i in 3" :key="i" class="mb-8">
        <Skeleton width="100%" height="10rem" class="rounded-lg"></Skeleton>
      </div>
    </div>

    <div v-else-if="error" class="mt-6 text-red-600">
      Gagal memuat surah
    </div>

    <div v-else class="mt-6">
      <h1 class="text-3xl font-bold dark:text-white">
        {{ surahData.namaLatin }}
      </h1>

      <p class="text-gray-600 dark:text-gray-400 mt-1">
        {{ surahData.arti }} • {{ surahData.jumlahAyat }} ayat
      </p>

      <Divider />
      <div class="mt-8 space-y-8" >
        
        <ScrollPanel class="shadow-md" style="width: 100%; height: 750px; padding: 15px;">
          <Fieldset 
            v-for="(ayat, index) in surahData.ayat"
            :key="ayat.nomorAyat"
            :ref="el => { if (el) ayatRefs[ayat.nomorAyat] = el }"
            :id="`ayat-${ayat.nomorAyat}`"
            class="border-b dark:border-gray-700 pb-6 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            :class="{
              'bg-purple-100 dark:bg-purple-950/30': lastRead?.surahId == surahId
              && lastRead?.ayat === ayat.nomorAyat
            }"
            :legend="`Ayat ${ayat.nomorAyat}`"
          >
            <!-- START CONTENT -->
            <div class="grid grid-cols-2 gap-4 mt-3">
              <div class="col-md-6">
                <div class="text-sm text-gray-500 mb-2">
                </div>
              </div>
              <div class="col-md-6 text-right">
                <button class="bg-green-500 text-white px-2 py-1 rounded mt-3 mr-2"
                  @click="playContinuous(index)"
                >
                  <i :class="`pi pi-${audioStore.isPlayingContinue && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}` ? 'pause' : 'angle-double-right'}`"></i>
                  {{ audioStore.isPlayingContinue && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}` ? '' : '' }}
                </button>

                <button class="bg-blue-500 text-white px-2 py-1 rounded mt-3 mr-2"
                  @click="audioStore.toggle(ayat.audio['05'], `${surahId}-${ayat.nomorAyat}`)"
                >
                  <i :class="`pi pi-${audioStore.isPlaying && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}` ? 'pause' : 'play'}`"></i>
                  {{ audioStore.isPlaying && audioStore.currentAyah === `${surahId}-${ayat.nomorAyat}` ? '' : '' }}
                </button>
                <button class="bg-purple-500 text-white px-2 py-1 rounded"
                  @click="saveLastRead(ayat)"
                >
                  <i class="pi pi-thumbtack"></i>
                </button>
              </div>
            </div>

            <p class="text-3xl leading-loose mt-6 mb-6 text-right arabic-quran" style="font-size: 38px !important;">
              {{ ayat.teksArab }}
            </p>

            <div class="grid gap-4 mt-3">
              <div class="col-md-12">
                <p class="mt-3 italic text-gray-700 dark:text-gray-300">
                  {{ ayat.teksLatin }}
                </p>
              </div>
            </div>

            <Panel header="Artinya" class="mt-3 mb-1" toggleable collapsed>
              <p class="m-0">
                {{ ayat.teksIndonesia }}
              </p>
            </Panel>
          
            <span 
              v-if="lastRead?.surahId == surahId && lastRead?.ayat === ayat.nomorAyat"
              class="ml-2 text-xs bg-purple-400 dark:bg-purple-600 px-2 py-1 rounded text-white"
              style="background-color: #a855f7 !important;"
            >
              Last Read
            </span>
            <!-- END CONTENT -->
          </Fieldset>
        </ScrollPanel>
          
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>