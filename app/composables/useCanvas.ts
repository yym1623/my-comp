import type { CanvasItem } from '~/types/component'

export const useCanvas = () => {
  // 캔버스 아이템 배열을 깊은 복사로 복제
  const cloneCanvasItems = (items: CanvasItem[]): CanvasItem[] => {
    return items.map((item) => {
      const { id, type, items: itemItems, data, styles, ...rest } = item
      
      // items가 CanvasItem[]인지 CanvasItem[][]인지 확인하여 처리
      let clonedItems: CanvasItem[] | CanvasItem[][] | undefined = undefined
      if (itemItems) {
        if (Array.isArray(itemItems[0]) && Array.isArray(itemItems[0][0])) {
          // CanvasItem[][] (그리드)
          clonedItems = (itemItems as CanvasItem[][]).map(cellItems => 
            cloneCanvasItems(cellItems as CanvasItem[])
          )
        } else {
          // CanvasItem[] (일반)
          clonedItems = cloneCanvasItems(itemItems as CanvasItem[])
        }
      }
      
      return {
        id,
        type,
        data: data ? JSON.parse(JSON.stringify(data)) : undefined, // 깊은 복사
        styles: styles ? JSON.parse(JSON.stringify(styles)) : undefined, // 깊은 복사
        ...rest,
        items: clonedItems
      }
    })
  }

  return {
    cloneCanvasItems
  }
}