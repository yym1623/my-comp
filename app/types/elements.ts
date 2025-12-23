import type { ComponentDef } from './component'

export interface ElementsProps {
  isPreviewMode?: boolean
  variant?: 'desktop' | 'mobile'
}

export interface ElementsEmits {
  (e: 'add', comp: ComponentDef): void
  (e: 'dragStart', comp: ComponentDef): void
  (e: 'close'): void
}

