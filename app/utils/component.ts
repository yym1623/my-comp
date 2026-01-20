interface LayoutConfig {
  width: number
  widthUnit: '%' | 'px'
  height: number
  heightUnit?: 'px'
}

interface TypographyConfig {
  fontSize: number
}

const TEXT_COMPONENT_TYPES = ['heading1', 'heading2', 'heading3', 'textarea', 'button']

// 컴포넌트 타입별 기본 레이아웃 설정
export const getComponentDefaultLayout = (type: string): Partial<LayoutConfig> => {
  const layoutDefaults: Record<string, LayoutConfig> = {
    heading1: { width: 100, widthUnit: '%', height: 48 },
    heading2: { width: 100, widthUnit: '%', height: 36 },
    heading3: { width: 100, widthUnit: '%', height: 28 },
    button: { width: 100, widthUnit: 'px', height: 40 },
    inputText: { width: 100, widthUnit: '%', height: 40 },
    inputPassword: { width: 100, widthUnit: '%', height: 40 },
    inputEmail: { width: 100, widthUnit: '%', height: 40 },
    inputUrl: { width: 100, widthUnit: '%', height: 40 },
    inputDate: { width: 100, widthUnit: '%', height: 40 },
    inputTime: { width: 100, widthUnit: '%', height: 40 },
    select: { width: 100, widthUnit: '%', height: 40 },
    textarea: { width: 100, widthUnit: '%', height: 120 },
    image: { width: 100, widthUnit: '%', height: 100, heightUnit: 'px' },
    checkbox: { width: 100, widthUnit: '%', height: 40 },
    toggleSwitch: { width: 100, widthUnit: '%', height: 40 },
    radio: { width: 100, widthUnit: '%', height: 20 },
    prevNext: { width: 100, widthUnit: 'px', height: 40 },
    spacer: { width: 100, widthUnit: '%', height: 16, heightUnit: 'px' },
    divider: { width: 100, widthUnit: '%', height: 1, heightUnit: 'px' }
  }
  
  return layoutDefaults[type] || {}
}

// 컴포넌트 타입별 기본 Typography 설정
export const getComponentDefaultTypography = (type: string): Partial<TypographyConfig> => {
  const typographyDefaults: Record<string, TypographyConfig> = {
    heading1: { fontSize: 32 },
    heading2: { fontSize: 24 },
    heading3: { fontSize: 18 },
    textarea: { fontSize: 14 },
    button: { fontSize: 14 }
  }
  
  return typographyDefaults[type] || {}
}

// 컴포넌트 타입이 텍스트 관련 요소인지 확인
export const isTextComponent = (type: string): boolean => {
  return TEXT_COMPONENT_TYPES.includes(type)
}
