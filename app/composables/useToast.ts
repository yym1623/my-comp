import { useToast as usePrimeToast } from 'primevue/usetoast'

export const useAppToast = () => {
  const toast = usePrimeToast()

  // 성공 토스트 메시지 표시
  const showSuccess = (summary: string, detail: string, life: number = 2000) => {
    toast.add({
      severity: 'secondary',
      summary,
      detail,
      life
    })
  }

  // 에러 토스트 메시지 표시
  const showError = (summary: string, detail: string, life: number = 2000) => {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life
    })
  }

  // 정보 토스트 메시지 표시
  const showInfo = (summary: string, detail: string, life: number = 2000) => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life
    })
  }

  // 경고 토스트 메시지 표시
  const showWarning = (summary: string, detail: string, life: number = 2000) => {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life
    })
  }

  return {
    toast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}
