<template>
  <div id="chart"></div>
</template>

<script setup>
import { onMounted, defineProps } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

onMounted(async () => {
  const AstroChart = await import('astrochart')
  new AstroChart.Chart('chart', {
    width: 600,
    height: 600,
    planets: props.data.planets.map((planet) => ({
      name: planet.name,
      degree: planet.longitude,
    })),
    houses: props.data.houses.map((house) => house.longitude),
  })
})
</script>

<style scoped>
#chart {
  margin: auto;
}
</style>
