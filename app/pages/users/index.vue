<template>
  <div>
    <h1>사용자 목록1</h1>
    <p>app/pages/users/index.vue → "/users" 라우트</p>
    <ul>
      <li><NuxtLink to="/users/1">사용자 1</NuxtLink></li>
      <li><NuxtLink to="/users/2">사용자 2</NuxtLink></li>
    </ul>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>