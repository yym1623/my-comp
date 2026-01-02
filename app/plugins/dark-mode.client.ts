export default defineNuxtPlugin(() => {
  // 클라이언트에서만 실행
  if (import.meta.client) {
    // HTML에 dark 클래스가 없으면 추가 (nuxt.config.ts 설정과 일치)
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark')
    }
  }
})

