import type { Page } from './component'

export interface PagesProps {
  isPreviewMode?: boolean
  currentPageId?: string | null
  variant?: 'desktop' | 'mobile'
}

export interface PagesEmits {
  (e: 'update:pages', pages: Page[]): void
  (e: 'select', page: Page): void
  (e: 'create'): void
  (e: 'closePanel'): void
}

