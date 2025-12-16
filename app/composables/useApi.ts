export const useApi = () => {
  const get = async <T>(endpoint: string) => {
    return await $fetch<T>(`/api${endpoint}`)
  }

  const post = async <T>(endpoint: string, body: unknown) => {
    return await $fetch<T>(`/api${endpoint}`, {
      method: 'POST',
      body: body as BodyInit,
    })
  }

  return {
    get,
    post,
  }
}

