<template>
  <header class="py-3 px-6 flex justify-between items-center border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
    <NuxtLink to="/" class="flex items-center gap-2 no-underline">
      <span class="logo-icon">
        <span class="rounded-sm bg-primary-500" />
        <span class="rounded-sm bg-primary-400" />
        <span class="rounded-sm bg-primary-300" />
        <span class="rounded-sm bg-primary-600" />
      </span>
      <span class="text-lg font-bold text-surface-800 dark:text-surface-100">MyComp</span>
    </NuxtLink>
    <div class="flex items-center gap-1">
      <Button
        icon="pi pi-search"
        severity="secondary"
        rounded
        text
      />
      <Button
        :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
        :severity="isDark ? 'secondary' : 'warn'"
        rounded
        text
        @click="toggleTheme"
      />
    </div>
  </header>
</template>

<script lang="ts" setup>
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  // HTML에 설정된 초기 dark 클래스 여부 확인
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>

<style lang="scss" scoped>
.logo-icon {
  width: 20px;
  height: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}
</style>

