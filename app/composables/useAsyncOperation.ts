export const useAsyncOperation = () => {
  const isLoading = ref<boolean>(false)

  // 비동기 작업 실행 (로딩 상태 자동 관리)
  const execute = async <T>(
    operation: () => Promise<T>,
    options?: {
      onError?: (error: unknown) => void
      onFinally?: () => void
    }
  ): Promise<T | null> => {
    isLoading.value = true
    try {
      return await operation()
    } catch (error) {
      if (options?.onError) {
        options.onError(error)
      }
      return null
    } finally {
      isLoading.value = false
      if (options?.onFinally) {
        options.onFinally()
      }
    }
  }

  return {
    isLoading,
    execute
  }
}
