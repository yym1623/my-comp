export const useFormErrors = <T extends Record<string, string>>(initialErrors: T) => {
  const errors = reactive({ ...initialErrors }) as T

  // 특정 필드의 에러 초기화
  const clearError = (field: keyof T) => {
    errors[field] = '' as T[keyof T]
  }

  // 모든 에러 초기화
  const clearAllErrors = () => {
    Object.keys(errors).forEach(key => {
      errors[key as keyof T] = '' as T[keyof T]
    })
  }

  // 특정 필드에 에러 설정
  const setError = (field: keyof T, message: string) => {
    errors[field] = message as T[keyof T]
  }

  // 에러가 있는지 확인
  const hasErrors = computed(() => {
    return Object.values(errors).some(error => error !== '')
  })

  // 특정 필드에 에러가 있는지 확인
  const hasError = (field: keyof T) => {
    return !!(errors as Record<string, string>)[field as string]
  }

  return {
    errors,
    clearError,
    clearAllErrors,
    setError,
    hasErrors,
    hasError
  }
}
