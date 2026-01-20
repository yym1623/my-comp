export const useModal = (initialValue: boolean = false) => {
  const visible = ref<boolean>(initialValue)

  // 모달 열기
  const open = () => {
    visible.value = true
  }

  // 모달 닫기
  const close = () => {
    visible.value = false
  }

  // 모달 토글
  const toggle = () => {
    visible.value = !visible.value
  }

  return {
    visible,
    open,
    close,
    toggle
  }
}
