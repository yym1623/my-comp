export const useResponsive = () => {
  const LG_BREAKPOINT = 1024
  
  // 클라이언트 사이드에서 즉시 화면 크기 계산
  const isMobile = ref<boolean>(
    process.client ? window.innerWidth < LG_BREAKPOINT : false
  )

  // 화면 크기 확인 및 모바일 상태 업데이트
  const checkScreenSize = (): boolean => {
    if (!process.client) return false
    const isSmall = window.innerWidth < LG_BREAKPOINT
    isMobile.value = isSmall
    return isSmall
  }

  onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', checkScreenSize)
    }
  })

  return {
    isMobile,
    checkScreenSize
  }
}