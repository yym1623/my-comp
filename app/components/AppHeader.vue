<template>
  <header class="app-header">
    <nav>
      <NuxtLink to="/">홈</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/users">Users</NuxtLink>
    </nav>
  </header>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.app-header {
  padding: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
}
</style>

