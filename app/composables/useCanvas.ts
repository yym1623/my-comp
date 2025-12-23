import type { CanvasItem } from '~/types/component'

export const useCanvas = () => {
  const cloneCanvasItems = (items: CanvasItem[]): CanvasItem[] => {
    return items.map((item) => ({
      uid: item.uid,
      type: item.type,
      props: { ...item.props }
    }))
  }

  return {
    cloneCanvasItems
  }
}

