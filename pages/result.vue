<!-- pages/result.vue -->
<template>
  <div>
    <h1>Натальная карта для {{ result.name }}</h1>
    <client-only>
      <NatalChartD3 :data="result.chartData" />
    </client-only>
  </div>
</template>

<script setup>
import NatalChartD3 from '~/components/NatalChartD3.vue'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const result = ref({})

onMounted(() => {
  if (route.query.data) {
    try {
      result.value = JSON.parse(route.query.data)
    } catch (e) {
      console.error('Ошибка при парсинге данных:', e)
    }
  }
})
</script>
