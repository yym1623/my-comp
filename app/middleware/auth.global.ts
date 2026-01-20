export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path.startsWith('/auth')) {
    return
  }

  if (to.path === '/' || to.path.startsWith('/preview')) {
    return
  }

  if (import.meta.server) {
    return
  }

  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      return navigateTo('/auth', { external: true })
    }
  } catch {
    return navigateTo('/auth', { external: true })
  }
})
