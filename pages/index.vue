<template>
  <div>
    <h1>Расчёт натальной карты</h1>
    <UserForm @submit="calculateNatalChart" />
  </div>
</template>

<script setup>
import UserForm from '~/components/UserForm.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const calculateNatalChart = async (formData) => {
  try {
    const response = await $fetch('/api/calculate', {
      method: 'POST',
      body: formData,
    })
    if (response.error) {
      console.error(response.error)
    } else {
      router.push({ path: '/result', query: { data: JSON.stringify(response) } })
    }
  } catch (error) {
    console.error('Ошибка при расчёте натальной карты:', error)
  }
}
</script>
