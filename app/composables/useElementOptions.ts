type ComponentOptionField = {
  key: string
  label: string
  component: 'InputNumber' | 'Select'
  componentProps?: Record<string, unknown>
  section?: string
  defaultValue?: unknown
  disabled?: boolean
}

type SectionReady = {
  Position?: boolean
  Layout?: boolean
  Appearance?: boolean
  Typography?: boolean
}

export const useElementOptions = () => {
  const getSectionReady = (type?: string): SectionReady => {
    const baseReady = {
      Position: true,
      Layout: true,
      Appearance: true,
      Typography: true
    }
    
    // spacer, divider, button, prevNext일 경우 Appearance 섹션 준비중
    if (type === 'spacer' || type === 'divider' || type === 'button' || type === 'prevNext') {
      const result: SectionReady = {
        ...baseReady,
        Appearance: false
      }
      
      // divider, spacer, button, prevNext일 경우 Typography 섹션도 준비중
      if (type === 'divider' || type === 'spacer' || type === 'button' || type === 'prevNext') {
        result.Typography = false
      }
      
      return result
    }
    
    return baseReady
  }

  const getCommonOptions = (): ComponentOptionField[] => {
    return [
      {
        key: 'position.x',
        label: 'X',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Position',
        defaultValue: 0
      },
      {
        key: 'position.y',
        label: 'Y',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Position',
        defaultValue: 0
      },
      {
        key: 'position.rotation',
        label: 'Rotation',
        component: 'InputNumber',
        componentProps: { min: -360, max: 360 },
        section: 'Position',
        defaultValue: 0
      },
      {
        key: 'layout.width',
        label: 'W',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Layout',
        defaultValue: 100
      },
      {
        key: 'layout.widthUnit',
        label: 'Width Unit',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'px', value: 'px' },
            { label: '%', value: '%' }
          ]
        },
        section: 'Layout',
        defaultValue: '%'
      },
      {
        key: 'layout.height',
        label: 'H',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Layout',
        defaultValue: 40
      },
      {
        key: 'layout.heightUnit',
        label: 'Height Unit',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'px', value: 'px' },
            { label: '%', value: '%' }
          ]
        },
        section: 'Layout',
        defaultValue: 'px'
      },
      {
        key: 'appearance.opacity',
        label: 'Opacity',
        component: 'InputNumber',
        componentProps: { min: 0, max: 100 },
        section: 'Appearance',
        defaultValue: 100
      },
      {
        key: 'appearance.cornerRadius',
        label: 'Corner radius',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Appearance',
        defaultValue: 0
      },
      {
        key: 'appearance.borderStyle',
        label: 'Border Style',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'None', value: 'none' },
            { label: 'Solid', value: 'solid' },
            { label: 'Dashed', value: 'dashed' },
            { label: 'Dotted', value: 'dotted' },
            { label: 'Double', value: 'double' }
          ]
        },
        section: 'Appearance',
        defaultValue: 'none'
      },
      {
        key: 'appearance.borderPosition',
        label: 'Border Position',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'None', value: 'none' },
            { label: 'Top', value: 'top' },
            { label: 'Left', value: 'left' },
            { label: 'Bottom', value: 'bottom' },
            { label: 'Right', value: 'right' }
          ]
        },
        section: 'Appearance',
        defaultValue: 'none'
      },
      {
        key: 'typography.fontSize',
        label: 'Font Size',
        component: 'InputNumber',
        componentProps: { min: 8, max: 72 },
        section: 'Typography',
        defaultValue: 14,
        disabled: true
      },
      {
        key: 'typography.fontFamily',
        label: 'Font Family',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'Arial', value: 'Arial' },
            { label: 'Helvetica', value: 'Helvetica' },
            { label: 'Times New Roman', value: 'Times New Roman' },
            { label: 'Courier New', value: 'Courier New' },
            { label: 'Verdana', value: 'Verdana' },
            { label: 'Georgia', value: 'Georgia' },
            { label: 'Palatino', value: 'Palatino' },
            { label: 'Garamond', value: 'Garamond' },
            { label: 'Comic Sans MS', value: 'Comic Sans MS' },
            { label: 'Trebuchet MS', value: 'Trebuchet MS' },
            { label: 'Impact', value: 'Impact' },
            { label: 'Montserrat', value: 'Montserrat' },
            { label: 'Inter', value: 'Inter' },
            { label: 'Roboto', value: 'Roboto' },
            { label: 'Open Sans', value: 'Open Sans' },
            { label: 'Lato', value: 'Lato' },
            { label: 'Poppins', value: 'Poppins' },
            { label: 'Raleway', value: 'Raleway' },
            { label: 'Ubuntu', value: 'Ubuntu' },
            { label: 'Playfair Display', value: 'Playfair Display' },
            { label: 'Oswald', value: 'Oswald' },
            { label: 'Source Sans Pro', value: 'Source Sans Pro' },
            { label: 'Nunito', value: 'Nunito' },
            { label: 'Merriweather', value: 'Merriweather' },
            { label: 'PT Sans', value: 'PT Sans' },
            { label: 'Dancing Script', value: 'Dancing Script' },
            { label: 'Pacifico', value: 'Pacifico' },
            { label: 'Crimson Text', value: 'Crimson Text' },
            { label: 'Fira Sans', value: 'Fira Sans' }
          ]
        },
        section: 'Typography',
        defaultValue: 'Arial'
      },
      {
        key: 'typography.fontWeight',
        label: 'Font Weight',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'Regular', value: '400' },
            { label: 'Medium', value: '500' },
            { label: 'Semi Bold', value: '600' },
            { label: 'Bold', value: '700' },
            { label: 'Extra Bold', value: '800' }
          ]
        },
        section: 'Typography',
        defaultValue: '400'
      },
      {
        key: 'typography.textAlign',
        label: 'Text Align',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        section: 'Typography',
        defaultValue: 'left'
      }
    ]
  }

  const getOptionsForType = (type: string) => getCommonOptions()

  // 컴포넌트 생성 시 사용할 기본 props 반환 (styles 객체 구조)
  const getDefaultProps = () => {
    const commonOptions = getCommonOptions()
    const styles: Record<string, any> = {}
    
    commonOptions.forEach(option => {
      if (option.key.includes('.')) {
        const parts = option.key.split('.')
        if (parts.length === 2) {
          const [objKey, propKey] = parts
          if (objKey && propKey) {
            if (!styles[objKey]) {
              styles[objKey] = {}
            }
            styles[objKey][propKey] = option.defaultValue
          }
        }
      }
    })
    
    return { styles }
  }

  return {
    getOptionsForType,
    getSectionReady,
    getDefaultProps
  }
}