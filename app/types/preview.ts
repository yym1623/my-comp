import type { CanvasItem } from './component'

export interface PreviewProps {
  canvasItems: CanvasItem[]
  selectedIndex: number | null
  isPreviewMode: boolean
  isMobile: boolean
  previewPath?: string
}

export interface PreviewEmits {
  (e: 'update:canvasItems', items: CanvasItem[]): void
  (e: 'select', index: number): void
  (e: 'delete', index: number): void
  (e: 'copy', index: number): void
  (e: 'drop'): void
  (e: 'deselect'): void
  (e: 'grid-drop', data: { gridElement: CanvasItem; cellIndex: number; event: DragEvent }): void
  (e: 'group-drop', data: { groupElement: CanvasItem; event: DragEvent }): void
}

