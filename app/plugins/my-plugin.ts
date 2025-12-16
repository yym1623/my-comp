export default defineNuxtPlugin((nuxtApp) => {
  // Vue 플러그인 등록 ex
  // nuxtApp.vueApp.use(SomeVuePlugin)

  // 전역 함수 제공 예시
  return {
    provide: { 
      hello: (name: string) => `Hello, ${name}!`,
    },
  }
})
