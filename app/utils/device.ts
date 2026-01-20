const MAC_PATTERN = /Mac|iPhone|iPod|iPad/i

// Mac 기기인지 확인
export const isMac = (): boolean => {
  if (typeof navigator === 'undefined') return false
  return MAC_PATTERN.test(navigator.platform) || MAC_PATTERN.test(navigator.userAgent)
}
