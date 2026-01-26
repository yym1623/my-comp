import type { CanvasItem } from '~/types/component'

// width/height 스타일 적용 유틸
export const applySizeStyle = (style: Record<string, string>, styles: Record<string, any>, key: 'width' | 'height') => {
  if (styles[key] !== undefined && styles[key] !== null) {
    if (typeof styles[key] === 'string') {
      style[key] = styles[key]
    } else if (typeof styles[key] === 'number' && styles[key] > 0) {
      style[key] = `${styles[key]}px`
    }
  }
}

// Position 스타일 적용 유틸
export const applyPositionStyle = (style: Record<string, string>, styles: Record<string, any>) => {
  if (styles.position) {
    const hasX = styles.position.x !== undefined && styles.position.x !== null && styles.position.x !== 0
    const hasY = styles.position.y !== undefined && styles.position.y !== null && styles.position.y !== 0
    
    if (hasX) {
      style.position = 'relative'
      style.left = `${styles.position.x}px`
    }
    if (hasY) {
      if (!style.position) {
        style.position = 'relative'
      }
      style.top = `${styles.position.y}px`
    }
    // rotation이 0이 아니면 적용
    if (styles.position.rotation !== undefined && styles.position.rotation !== null && styles.position.rotation !== 0) {
      style.transform = `rotate(${styles.position.rotation}deg)`
    }
  }
}

// Appearance(opacity) 스타일 적용 유틸
export const applyAppearanceOpacityStyle = (style: Record<string, string>, styles: Record<string, any>) => {
  if (styles.appearance) {
    if (styles.appearance.opacity !== undefined && styles.appearance.opacity !== null) {
      style.opacity = `${styles.appearance.opacity / 100}`
    }
  }
}
