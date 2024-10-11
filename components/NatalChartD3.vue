<template>
  <div class="chart-container" ref="chart"></div>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue'
import * as d3 from 'd3'

// Астрологические символы для планет (Unicode)
const planetSymbols = {
  'Sun': '\u2609',  // ☉ Солнце
  'Moon': '\u263D', // ☽ Луна
  'Mercury': '\u263F', // ☿ Меркурий
  'Venus': '\u2640', // ♀ Венера
  'Mars': '\u2642', // ♂ Марс
  'Jupiter': '\u2643', // ♃ Юпитер
  'Saturn': '\u2644', // ♄ Сатурн
  'Uranus': '\u26E2', // ♅ Уран
  'Neptune': '\u2646', // ♆ Нептун
  'Pluto': '\u2647' // ♇ Плутон
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const chart = ref(null)

onMounted(() => {
  if (!props.data || !props.data.planets || !props.data.houses) {
    console.error('Недостаточно данных для построения натальной карты.')
    return
  }

  const width = 600
  const height = 600
  const radius = Math.min(width, height) / 2

  // Очистка предыдущего SVG (если есть)
  d3.select(chart.value).selectAll('*').remove()

  const svg = d3.select(chart.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  // Цветовая шкала для домов
  const colorScale = d3.scaleOrdinal()
    .domain(d3.range(12))
    .range(d3.schemeSet3) // Яркие цвета

  // Отображение домов как секторов без обводки и с мягким свечением
  const arc = d3.arc()
    .innerRadius(radius - 80)
    .outerRadius(radius - 20)
    .startAngle((d, i) => (i * 30) * (Math.PI / 180))
    .endAngle((d, i) => ((i + 1) * 30) * (Math.PI / 180))

  svg.selectAll('path')
    .data(props.data.houses)
    .enter()
    .append('path')
    .attr('d', (d, i) => arc(d, i))
    .attr('fill', (d, i) => colorScale(i))
    .style('filter', (d, i) => `drop-shadow(0 0 5px ${colorScale(i)})`)  // Мягкое свечение домов
    .attr('stroke', 'none')  // Убираем обводку между элементами

  // Позиции планет (для радиуса чуть меньше внешнего края круга)
  const planetPositions = props.data.planets.map(d => ({
    name: d.name,
    x: (radius - 60) * Math.cos((d.longitude - 90) * (Math.PI / 180)), // Ограничение радиуса
    y: (radius - 60) * Math.sin((d.longitude - 90) * (Math.PI / 180)),
    longitude: d.longitude
  }))

  // Линии от центра до планет
  svg.selectAll('line.center-line')
    .data(planetPositions)
    .enter()
    .append('line')
    .attr('class', 'center-line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', d => d.x)  // Линии из центра к планетам
    .attr('y2', d => d.y)
    .attr('stroke', (d, i) => colorScale(i % 12))  // Цвет линии зависит от дома
    .attr('stroke-width', 2)  // Толстые линии
    .style('filter', (d, i) => `drop-shadow(0 0 5px ${colorScale(i % 12)})`)  // Мягкое цветное свечение линий

  // Соединение планет между собой с мягким цветным свечением
  svg.selectAll('line.planet-line')
    .data(planetPositions)
    .enter()
    .append('line')
    .attr('class', 'planet-line')
    .attr('x1', (d, i) => planetPositions[i].x)  // Начальная позиция планеты
    .attr('y1', (d, i) => planetPositions[i].y)
    .attr('x2', (d, i) => planetPositions[(i + 1) % planetPositions.length].x)  // Соединение с соседней планетой
    .attr('y2', (d, i) => planetPositions[(i + 1) % planetPositions.length].y)
    .attr('stroke', (d, i) => colorScale(i % 12))  // Цвет линии зависит от дома
    .attr('stroke-width', 2)  // Толстые линии
    .style('filter', (d, i) => `drop-shadow(0 0 5px ${colorScale(i % 12)})`)  // Мягкое цветное свечение линий

  // Отображение символов планет с мягким цветным свечением
  svg.selectAll('text')
    .data(planetPositions)
    .enter()
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .text(d => planetSymbols[d.name]) // Символы планет
    .attr('class', 'planet-symbol')
    .attr('font-size', '24px')
    .attr('fill', (d, i) => colorScale(i % 12))  // Цвет текста
    .style('filter', (d, i) => `drop-shadow(0 0 5px ${colorScale(i % 12)})`)  // Мягкое цветное свечение символов
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
})
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  background: linear-gradient(135deg, #0d0d0d, #2a2a2a); /* Градиентный тёмный фон */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3), 0 0 20px rgba(255, 0, 255, 0.3); /* Неоновый эффект */
}

.planet-symbol {
  font-family: 'Noto Sans Symbols', sans-serif;
  font-size: 24px;
}

.center-line, .planet-line {
  stroke-width: 2; /* Толстые линии */
}

svg {
  background-color: transparent; /* Прозрачный фон для SVG */
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.5); /* Неоновое свечение вокруг SVG */
}
</style>
