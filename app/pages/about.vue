<template>
  <div class="about-page">
    <h1>About 페이지1</h1>
    <p>app/pages/about.vue → 자동으로 "/about" 라우트가 됩니다</p>
    <NuxtLink to="/">홈으로 돌아가기</NuxtLink>
    <DatePicker v-model="date" />
  </div>
</template>

<script lang="ts" setup>

const date = ref();
</script>


<style lang="scss" scoped></style>