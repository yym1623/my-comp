<template>
  <header class="py-3 px-6 flex justify-between items-center border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
    <div class="flex items-center gap-2">

      <NuxtLink to="/" class="flex items-center gap-2 no-underline">
        <span class="logo-icon">
          <span class="rounded-sm bg-primary-500" />
          <span class="rounded-sm bg-primary-400" />
          <span class="rounded-sm bg-primary-300" />
          <span class="rounded-sm bg-primary-600" />
        </span>
        <span class="text-lg font-bold text-surface-800 dark:text-surface-100">MyComp</span>
      </NuxtLink>
    </div>
    <div class="flex items-center gap-1">
      <Button
        icon="pi pi-search"
        severity="secondary"
        rounded
        text
        @click="openSearch"
      />
      <Button
        :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
        :severity="isDark ? 'secondary' : 'warn'"
        rounded
        text
        @click="toggleTheme"
      />
      <Button
        ref="userButtonRef"
        icon="pi pi-user"
        severity="secondary"
        rounded
        text
        @click="toggleUserPanel"
      />
      
      <!-- 모바일 햄버거 메뉴 버튼 -->
      <Button
        v-if="isMobile"
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        @click="panelStore.openMobileMenu()"
      />
    </div>

    <ModalsUser ref="userPanelRef" />
    <ModalsSearch v-model:visible="isSearchOpen" />
  </header>
</template>

<script lang="ts" setup>
import { usePanelStore } from '@/stores/panel'
import { useResponsive } from '~/composables/useResponsive'

// Pinia store
const panelStore = usePanelStore()
const { isMobile } = useResponsive()

// 초기 테마를 다크 모드 기준으로 설정 (app.head.htmlAttrs.class = 'dark'와 일치)
const isDark = ref(true)
const userPanelRef = ref()
const isSearchOpen = ref(false)

function toggleUserPanel(event: Event) {
  userPanelRef.value?.toggle(event)
}

function openSearch() {
  isSearchOpen.value = true
}

function toggleTheme() {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
  }
}

onMounted(() => {
  // HTML에 설정된 초기 dark 클래스 여부 확인
  if (process.client) {
    isDark.value = document.documentElement.classList.contains('dark')
  }
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

