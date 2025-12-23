export default defineNuxtPlugin((nuxtApp) => {
  const isDev = import.meta.env.DEV

  // Vue 전역 에러 핸들러 (컴포넌트 렌더/이벤트 중 에러)
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    const message = `[Vue error] ${info ?? ''}`

    if (isDev) {
      // 개발 환경: 최대한 많은 정보 콘솔에 출력
      // eslint-disable-next-line no-console
      console.error(message, error, instance)
    } else {
      // 프로덕션: 민감한 정보는 최소화해서 로깅
      // eslint-disable-next-line no-console
      console.error(message, error instanceof Error ? error.message : String(error))
    }
  }

  // Nuxt 훅 기반 Vue 에러 (필요 시 별도 처리 가능)
  nuxtApp.hook('vue:error', (error, instance, info) => {
    const message = `[Nuxt vue:error] ${info ?? ''}`
    // eslint-disable-next-line no-console
    console.error(message, error)
  })

  // Nuxt 앱 전역 에러 (라우트 전환/서버 응답 등에서 발생한 에러)
  nuxtApp.hook('app:error', (error) => {
    // eslint-disable-next-line no-console
    console.error('[Nuxt app:error]', error)
  })
})