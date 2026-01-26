<template>
  <!-- Preview 타입 스켈레톤 -->
  <div v-if="type === 'preview'" class="absolute inset-0 flex flex-col items-center justify-center px-4 py-8 pointer-events-none">
    <div class="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <Skeleton width="60%" height="2rem" borderRadius="8px" class="mb-2" />
      <Skeleton width="100%" height="1.5rem" borderRadius="8px" class="mb-1" />
      <Skeleton width="80%" height="1.5rem" borderRadius="8px" class="mb-4" />
      <Skeleton width="100%" height="200px" borderRadius="12px" class="mb-4" />
      <Skeleton width="100%" height="1.5rem" borderRadius="8px" class="mb-1" />
      <Skeleton width="90%" height="1.5rem" borderRadius="8px" class="mb-4" />

      <div class="flex gap-2">
        <Skeleton width="120px" height="2.5rem" borderRadius="8px" />
        <Skeleton width="120px" height="2.5rem" borderRadius="8px" />
      </div>
    </div>
  </div>

  <!-- Options 타입 스켈레톤 -->
  <div v-if="type === 'options'" class="absolute inset-0 flex flex-col pointer-events-none">
    <div class="px-4 py-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 shrink-0">
      <Skeleton shape="circle" size="1rem" class="shrink-0" />
      <Skeleton width="40%" height="0.875rem" borderRadius="4px" class="flex-1" />
      <div class="flex items-center gap-1 shrink-0">
        <Skeleton width="1.5rem" height="1.5rem" borderRadius="4px" />
        <Skeleton width="1.5rem" height="1.5rem" borderRadius="4px" />
        <Skeleton width="1.5rem" height="1.5rem" borderRadius="4px" />
      </div>
    </div>
    
    <!-- 트리 영역 스켈레톤 -->
    <div class="flex-1 overflow-y-auto p-2 relative">
      <div class="w-full flex flex-col gap-2">
        <div v-for="i in 5" :key="i" class="relative flex items-center gap-2 pl-8 pr-3 py-1.5">
          <div
            v-if="i < 5"
            class="absolute left-4 top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-700"
          />
          <div
            v-else
            class="absolute left-4 top-0 w-px bg-surface-200 dark:bg-surface-700"
            style="height: 50%;"
          />
          <div class="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-surface-200 dark:bg-surface-700" />
          <Skeleton width="1.5rem" height="1.5rem" borderRadius="4px" class="shrink-0 relative z-10" />
          <Skeleton :width="i % 2 === 0 ? '70%' : '85%'" height="1rem" borderRadius="4px" />
        </div>
      </div>
    </div>
  </div>

  <!-- Pages 타입 스켈레톤 -->
  <div 
    v-if="type === 'pages' || type === 'searchPages'" 
    ref="pagesSkeletonContainer"
    :class="[
      'flex-1 overflow-y-auto min-h-0',
      type === 'pages' ? 'p-3' : ''
    ]"
  >
    <!-- 페이지 아이템 스켈레톤 (화면 높이에 맞춰 동적으로 계산) -->
    <div class="grid gap-2">
      <div 
        v-for="i in skeletonCount" 
        :key="i" 
        class="flex items-center gap-3 p-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50"
      >
        <Skeleton width="2.5rem" height="2.5rem" borderRadius="8px" class="shrink-0" />
        <div class="flex flex-col gap-1.5 flex-1 min-w-0">
          <Skeleton :width="i % 2 === 0 ? '70%' : '85%'" height="0.875rem" borderRadius="4px" />
          <Skeleton width="50%" height="0.75rem" borderRadius="4px" />
        </div>
      </div>
    </div>
  </div>

  <!-- User 타입 스켈레톤 -->
  <div v-if="type === 'user'" class="flex items-center gap-3">
    <Skeleton
      width="3.5rem"
      height="3.5rem"
      borderRadius="9999px"
      class="shrink-0"
    />
    <!-- 텍스트 영역 Skeleton -->
    <div class="flex flex-col gap-2 min-w-0 flex-1">
      <Skeleton width="60%" height="1rem" borderRadius="4px" />
      <Skeleton width="80%" height="0.875rem" borderRadius="4px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
type SkeletonType = 'preview' | 'options' | 'pages' | 'searchPages' | 'user'

interface Props {
  type: SkeletonType
}

const props = defineProps<Props>()

const pagesSkeletonContainer = ref<HTMLElement | null>(null)
const skeletonCount = ref<number>(10) // 기본값

  // ResizeObserver로 화면 크기 변경 감지
let resizeObserver: ResizeObserver | null = null

// 각 페이지 아이템의 대략적인 높이 (p-3 + gap-2 + 아이콘 높이 등)
const ITEM_HEIGHT = 88

// 동적 스켈레톤 개수 계산 함수 (pages & searchPages)
const calculateSkeletonCount = () => {
  if (props.type !== 'pages' && props.type !== 'searchPages') return
  
  nextTick(() => {
    if (!pagesSkeletonContainer.value) return
    
    const containerHeight = pagesSkeletonContainer.value.clientHeight
    const padding = props.type === 'pages' ? 24 : 0 // p-3 = 12px * 2
    
    // 컨테이너 높이에서 패딩을 제외하고, 각 아이템 높이로 나눔
    const availableHeight = containerHeight - padding
    const count = Math.ceil(availableHeight / ITEM_HEIGHT) - 1
    
    // 최소 3개, 최대 50개로 제한
    skeletonCount.value = Math.max(3, Math.min(count + 2, 50)) // +2는 여유를 위해
  })
}

onMounted(() => {
  if (props.type === 'pages' || props.type === 'searchPages') {
    calculateSkeletonCount()
    
    // ResizeObserver로 컨테이너 크기 변경 감지
    if (process.client && pagesSkeletonContainer.value) {
      resizeObserver = new ResizeObserver(() => {
        calculateSkeletonCount()
      })
      resizeObserver.observe(pagesSkeletonContainer.value)
    }
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>