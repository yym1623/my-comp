export const useActivityTimeout = () => {
  const supabase = useSupabaseClient()
  const isModalVisible = ref<boolean>(false)
  const countdown = ref<number>(10)
  const inactivityTimer = ref<NodeJS.Timeout | null>(null)
  const countdownTimer = ref<NodeJS.Timeout | null>(null)

  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  
  // 게스트 여부 확인
  const checkIsGuest = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return !session
  }
  
  // 사용자 활동 감지 핸들러
  const handleActivity = () => {
    if (isModalVisible.value) {
      return
    }
    resetInactivityTimer()
  }

  // 비활동 타이머 리셋 (5분 후 모달 표시)
  const resetInactivityTimer = async () => {
    if (await checkIsGuest()) {
      return
    }
    
    if (inactivityTimer.value) {
      clearTimeout(inactivityTimer.value)
    }
    
    inactivityTimer.value = setTimeout(() => {
      isModalVisible.value = true
      startCountdown()
    }, 5 * 60 * 1000)
  }

  // 카운트다운 시작 (10초)
  const startCountdown = () => {
    countdown.value = 10
    
    countdownTimer.value = setInterval(() => {
      countdown.value--
      
      if (countdown.value <= 0) {
        clearCountdown()
        handleLogout()
      }
    }, 1000)
  }

  // 카운트다운 정리
  const clearCountdown = () => {
    if (countdownTimer.value) {
      clearInterval(countdownTimer.value)
      countdownTimer.value = null
    }
  }

  // 세션 유지 처리 (세션 갱신)
  const handleStay = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !sessionData.session) {
        handleLogout()
        return
      }

      const { error } = await supabase.auth.refreshSession()
      
      if (error) {
        handleLogout()
        return
      }
      
      clearCountdown()
      isModalVisible.value = false
      resetInactivityTimer()
    } catch {
      handleLogout()
    }
  }

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch {

    } finally {
      await navigateTo('/auth')
    }
  }

  // 활동 감지 시작
  const start = async () => {
    if (await checkIsGuest()) {
      return
    }
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })
    
    resetInactivityTimer()
  }

  // 활동 감지 중지
  const stop = () => {
    activityEvents.forEach(event => {
      window.removeEventListener(event, handleActivity)
    })
    
    if (inactivityTimer.value) {
      clearTimeout(inactivityTimer.value)
    }
    clearCountdown()
  }

  return {
    isModalVisible,
    countdown,
    handleStay,
    handleLogout,
    start,
    stop
  }
}