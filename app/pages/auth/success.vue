<template>
  <div class="w-full max-w-md">
    <div class="flex flex-col items-center gap-6">
      <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
        <i class="pi pi-check-circle text-4xl text-primary-600 dark:text-primary-400" />
      </div>
      <div class="text-center space-y-3">
        <p class="text-base text-surface-700 dark:text-surface-200">
          회원가입이 완료되었습니다
        </p>
        <p class="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
          이메일 확인이 완료되었습니다.<br />
          로그인해주세요.
        </p>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
      <p class="text-center text-muted-color text-sm">
        이미 계정이 있으신가요?
        <NuxtLink to="/auth" class="text-primary font-medium hover:underline">
          로그인
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  
useSeoMeta({
  title: 'MyComp - 로그인 성공',
  description: '이메일 확인이 완료되었습니다. 로그인해주세요.',
  ogTitle: 'MyComp - 로그인 성공',
  ogDescription: '이메일 확인이 완료되었습니다',
  ogType: 'website',
  ogImage: '/og.svg',
  ogImageWidth: 1200,
  ogImageHeight: 630
})

definePageMeta({
  layout: 'auth'
})
</script>

<style lang="scss" scoped>
.text-muted-color {
  color: var(--p-text-color-muted);
}
</style>