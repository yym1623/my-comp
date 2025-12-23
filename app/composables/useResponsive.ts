export const useResponsive = () => {
  const LG_BREAKPOINT = 1024
  
  // 클라이언트 사이드에서 즉시 화면 크기 계산
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

