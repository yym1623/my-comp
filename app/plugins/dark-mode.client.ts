export default defineNuxtPlugin(() => {
  if (!document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.add('dark')
  }
})

