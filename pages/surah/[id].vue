<script setup>
  const route = useRoute()
  const surahId = route.params.id
  const { data, pending, error } = await useFetch(
    `https://equran.id/api/v2/surat/${surahId}`
  )
  const surah = data.value.data
</script>

<template>
  <div>
    <h1>Surah {{ surah.namaLatin }}</h1>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Gagal memuat data</div>
    <div v-else>
      <!-- <pre>{{ surah }}</pre> -->
        <ul v-for="value in surah.ayat" :key="value.nomorAyat">
          <li
            :style="{
              paddingBottom: '10px',
              marginBottom: '10px',
              marginTop: '10px',
              marginLeft: '10px',
              marginRight: '10px',
              paddingTop: value.nomorAyat > 1 ? '10px' : '0',
              border: '1px solid #ccc',
            }"
          >
            <strong>({{ value.nomorAyat }})</strong> {{ value.teksArab }}
            <br>
            <br>
            {{ value.teksLatin }}
            <br>
            <br>
            {{ value.teksIndonesia }}
          </li>
        </ul>
    </div>
  </div>
</template>