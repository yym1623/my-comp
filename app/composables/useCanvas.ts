import type { CanvasItem } from '~/types/component'

export const useCanvas = () => {
  // 캔버스 아이템 배열을 깊은 복사로 복제
  const cloneCanvasItems = (items: CanvasItem[]): CanvasItem[] => {
    return items.map((item) => ({
      id: item.id,
      type: item.type,
      props: { ...item.props },
      items: item.items ? cloneCanvasItems(item.items) : undefined
    }))
  }

  return {
    cloneCanvasItems
  }
}