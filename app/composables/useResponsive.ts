export const useResponsive = () => {
  const LG_BREAKPOINT = 1024
  
  // 클라이언트 사이드에서 즉시 화면 크기 계산
  // SSR에서는 false로 시작 (PC로 가정)하여 클라이언트에서 즉시 확인
  const isMobile = ref(
    process.client ? window.innerWidth < LG_BREAKPOINT : false
  )

  const checkScreenSize = () => {
    if (!process.client) return false
    const isSmall = window.innerWidth < LG_BREAKPOINT
    isMobile.value = isSmall
    return isSmall
  }

  onMounted(() => {
    // 마운트 시 다시 한 번 확인 (초기값이 정확한지 보장)
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

