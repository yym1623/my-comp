<template>
  <div class="flex h-screen w-full bg-surface-50 dark:bg-surface-900 overflow-hidden relative">
    <main :class="isMobile ? 'flex-1 w-full h-full' : 'flex-1 flex items-center justify-center px-2.5 md:px-10 py-10'">
      <Preview
        :canvas-items="canvasItems"
        :selected-index="null"
        :is-preview-mode="true"
        :is-mobile="isMobile"
        :preview-path="route.fullPath"
        :simple="true"
        :page-not-found="pageNotFound"
        :is-loading="isLoading"
        @update:canvas-items="noop"
        @select="noop"
        @delete="noop"
        @copy="noop"
        @drop="noop"
        @deselect="noop"
        @grid-drop="noop"
        @group-drop="noop"
      />
    </main>

    <Button
      icon="pi pi-home"
      severity="primary"
      text
      size="small"
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 !w-9 !h-9 shadow-sm z-50 bg-primary-500 dark:bg-primary-600 text-white"
      v-tooltip.left="'홈으로 가기'"
      @click="navigateTo('/')"
    />
  </div>
</template>

<script setup lang="ts">
import type { CanvasItem } from '~/types/component'

const route = useRoute()
const { isMobile, checkScreenSize } = useResponsive()
const { loadPageData } = usePages()

const canvasItems = ref<CanvasItem[]>([])
const pageNotFound = ref<boolean>(false)
const isLoading = ref<boolean>(true)

const noop = (): void => {}

useSeoMeta({
  title: 'MyComp - Preview',
  description: '페이지 미리보기',
  ogTitle: 'MyComp - Preview',
  ogDescription: '페이지 미리보기 화면입니다.',
  ogType: 'website',
  ogImage: '/og.svg',
  ogImageWidth: 1200,
  ogImageHeight: 630
})

// 페이지 데이터 로드
onMounted(async () => {
  if (!import.meta.client) return

  checkScreenSize()

  const pageId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  if (!pageId) {
    pageNotFound.value = true
    isLoading.value = false
    return
  }

  try {
    const result = await loadPageData(pageId.toString())
    
    if (result === null) {
      pageNotFound.value = true
      return
    }
    
    canvasItems.value = result
  } finally {
    isLoading.value = false
  }
})
</script>