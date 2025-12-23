import type { CanvasItem } from './component'

export interface PreviewProps {
  canvasItems: CanvasItem[]
  selectedIndex: number | null
  isPreviewMode: boolean
  isMobile: boolean
}

export interface PreviewEmits {
  (e: 'update:canvasItems', items: CanvasItem[]): void
  (e: 'select', index: number): void
  (e: 'delete', index: number): void
  (e: 'drop'): void
  (e: 'deselect'): void
}

