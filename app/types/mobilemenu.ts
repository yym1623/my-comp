import type { ComponentDef, Page, CanvasItem } from './component'

export interface MobileMenuProps {
  isOpen: boolean
  activePanel: string | null
  currentPage: Page | null
  currentPageId?: string | null
  canvasItems: CanvasItem[]
  selectedIndex: number | null
  selectedItem: CanvasItem | null
  isPreviewMode: boolean
}

export interface MobileMenuEmits {
  (e: 'close'): void
  (e: 'openPanel', panel: string): void
  (e: 'closePanel'): void
  (e: 'update:pages', pages: Page[]): void
  (e: 'addComponent', comp: ComponentDef): void
  (e: 'selectPage', page: Page): void
  (e: 'createPage'): void
  (e: 'update:canvasItems', items: CanvasItem[]): void
  (e: 'selectItem', index: number): void
  (e: 'deleteItem', index: number): void
  (e: 'savePage'): void
}

