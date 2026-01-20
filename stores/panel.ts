import { defineStore } from 'pinia'
import { ref } from 'vue'

type PanelType = 'elements' | 'pages' | 'options'

export const usePanelStore = defineStore('panel', () => {
  // 모바일 메뉴 상태
  const isMobileMenuOpen = ref<boolean>(false)
  const activeMobilePanel = ref<PanelType | null>(null)

  // 모바일 메뉴 열기
  function openMobileMenu(): void {
    isMobileMenuOpen.value = true
  }

  // 모바일 메뉴 닫기
  function closeMobileMenu(): void {
    isMobileMenuOpen.value = false
    activeMobilePanel.value = null
  }

  // 특정 패널 열기
  function openPanel(panel: PanelType): void {
    activeMobilePanel.value = panel
  }

  // 패널 닫기 (메뉴로 돌아가기)
  function closePanel(): void {
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
