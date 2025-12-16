export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = false

  if (!isAuthenticated && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})

