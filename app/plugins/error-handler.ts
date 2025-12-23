export default defineNuxtPlugin((nuxtApp) => {
  const isDev = import.meta.env.DEV

  // Vue 전역 에러 핸들러 (컴포넌트 렌더/이벤트 중 에러)
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    const message = `[Vue error] ${info ?? ''}`

    if (isDev) {
      console.error(message, error, instance)
    } else {
      console.error(message, error instanceof Error ? error.message : String(error))
    }
  }

  // Nuxt 훅 기반 Vue 에러 (필요 시 별도 처리 가능)
  nuxtApp.hook('vue:error', (error, instance, info) => {
    const message = `[Nuxt vue:error] ${info ?? ''}`
    console.error(message, error)
  })

  // Nuxt 앱 전역 에러 (라우트 전환/서버 응답 등에서 발생한 에러)
  nuxtApp.hook('app:error', (error) => {
    console.error('[Nuxt app:error]', error)
  })
})