<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>Имя:</label>
      <input type="text" v-model="name" required />
    </div>
    <div>
      <label>Дата рождения:</label>
      <input type="date" v-model="birthDate" required />
    </div>
    <div>
      <label>Время рождения:</label>
      <input type="time" v-model="birthTime" required />
    </div>
    <div>
      <label>Место рождения:</label>
      <input type="text" v-model="birthPlace" required />
    </div>
    <button type="submit">Рассчитать</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const birthDate = ref('')
const birthTime = ref('')
const birthPlace = ref('')

const emit = defineEmits(['submit'])

const onSubmit = () => {
  const formData = {
    name: name.value,
    birthDate: birthDate.value,
    birthTime: birthTime.value,
    birthPlace: birthPlace.value,
  }
  emit('submit', formData)
}
</script>
