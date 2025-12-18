<template>
  <header class="app-header">
    <nav>
      <NuxtLink to="/">홈</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/users">Users</NuxtLink>
    </nav>
    <Button
      :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
      :severity="isDark ? 'warn' : 'secondary'"
      rounded
      text
      @click="toggleTheme"
    />
  </header>
</template>

<script lang="ts" setup>
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  // 시스템 다크모드 감지
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = prefersDark
  document.documentElement.classList.toggle('dark', prefersDark)
})
</script>

<style lang="scss" scoped>
.app-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav {
  display: flex;
  gap: 1rem;
}
</style>

