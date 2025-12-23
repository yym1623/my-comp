import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePanelStore = defineStore('panel', () => {
  // 모바일 메뉴 상태
  const isMobileMenuOpen = ref(false)
  const activeMobilePanel = ref<'elements' | 'pages' | 'options' | null>(null)

  // 모바일 메뉴 열기
  function openMobileMenu() {
    isMobileMenuOpen.value = true
  }

  // 모바일 메뉴 닫기
  function closeMobileMenu() {
    isMobileMenuOpen.value = false
    activeMobilePanel.value = null
  }

  // 특정 패널 열기
  function openPanel(panel: 'elements' | 'pages' | 'options') {
    activeMobilePanel.value = panel
  }

  // 패널 닫기 (메뉴로 돌아가기)
  function closePanel() {
    activeMobilePanel.value = null
  }

  return {
    isMobileMenuOpen,
    activeMobilePanel,
    openMobileMenu,
    closeMobileMenu,
    openPanel,
    closePanel
  }
})


