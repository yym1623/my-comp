import type { Page, CanvasItem } from './component'

export interface OptionsProps {
  isOpen: boolean
  isMobile: boolean
  isPreviewMode: boolean
  currentPage: Page | null
  canvasItems: CanvasItem[]
  selectedIndex: number | null
  selectedItem: CanvasItem | null
  isResponsiveChange?: boolean
}

export interface OptionsEmits {
  (e: 'update:isOpen', value: boolean): void
  (e: 'update:canvasItems', items: CanvasItem[]): void
  (e: 'selectItem', index: number): void
  (e: 'deleteItem', index: number): void
  (e: 'savePage'): void
  (e: 'deletePage'): void
  (e: 'closeOptions'): void
  (e: 'updatePageName', name: string): void
}

