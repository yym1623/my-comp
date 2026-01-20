import type { CanvasItem, Page } from './component'

export interface PreviewProps {
  canvasItems: CanvasItem[]
  selectedIndex: number | null
  isPreviewMode: boolean
  isMobile: boolean
  previewPath?: string
  simple?: boolean // 간단 모드 (카드 디자인 없이 컴포넌트만 렌더링)
  pageNotFound?: boolean // 페이지가 존재하지 않음
  isLoading?: boolean // 데이터 로딩 중
  currentPage?: Page | null // 현재 페이지 (모바일 미리보기 버튼용)
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
  (e: 'toggle-preview'): void // 미리보기 모드 토글
}

