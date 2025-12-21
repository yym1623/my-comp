<template>
  <!-- <div class="error-page">
    <h1>{{ error?.statusCode || 500 }}</h1>
    <p>{{ error?.message || '오류가 발생했습니다' }}</p>
    <button @click="handleError">홈으로 돌아가기</button>
  </div> -->
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<style lang="scss" scoped></style>