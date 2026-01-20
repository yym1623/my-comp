<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-ground p-4">
    <div class="w-full max-w-md">
      <div class="flex flex-col items-center gap-6 mb-8">

        <div class="text-center space-y-2">
          <h1 class="text-6xl font-bold text-color">
            {{ error?.statusCode || 500 }}
          </h1>
          <p class="text-xl text-color font-medium">
            {{ getErrorTitle(error?.statusCode || 500) }}
          </p>
        </div>
      </div>

      <Button
        label="홈으로 돌아가기"
        icon="pi pi-home"
        class="w-full !bg-primary !border-primary hover:!bg-primary/90 !py-3"
        @click="handleError"
      />

      <div class="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
        <p class="text-center text-muted-color text-sm">
          문제가 계속되면
          <a href="mailto:support@mycomp.dev" class="text-primary font-medium hover:underline">
            고객지원
          </a>
          으로 문의해주세요
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const getErrorTitle = (statusCode: number): string => {
  const titles: Record<number, string> = {
    400: '잘못된 요청',
    401: '인증이 필요합니다',
    403: '접근이 거부되었습니다',
    404: '페이지를 찾을 수 없습니다',
    500: '서버 오류',
    502: '게이트웨이 오류',
    503: '서비스를 사용할 수 없습니다'
  }
  return titles[statusCode] || '오류가 발생했습니다'
}

const handleError = () => clearError({ redirect: '/' })
</script>

<style lang="scss" scoped>
.bg-surface-ground {
  background-color: var(--p-surface-ground);
}

.text-color {
  color: var(--p-text-color);
}

.text-muted-color {
  color: var(--p-text-color-muted);
}
</style>