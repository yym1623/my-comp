type ComponentOptionField = {
  key: string
  label: string
  component: 'InputNumber' | 'Select'
  componentProps?: Record<string, unknown>
  section?: string
}

type ComponentOptionsMap = Record<string, ComponentOptionField[]>

export const useElementOptions = () => {
  const getCommonOptions = (): ComponentOptionField[] => {
    return [
      {
        key: 'position.x',
        label: 'X',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Position'
      },
      {
        key: 'position.y',
        label: 'Y',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Position'
      },
      {
        key: 'position.rotation',
        label: 'Rotation',
        component: 'InputNumber',
        componentProps: { min: -360, max: 360 },
        section: 'Position'
      },
      {
        key: 'layout.width',
        label: 'W',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Layout'
      },
      {
        key: 'layout.height',
        label: 'H',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Layout'
      },
      {
        key: 'appearance.opacity',
        label: 'Opacity',
        component: 'InputNumber',
        componentProps: { min: 0, max: 100 },
        section: 'Appearance'
      },
      {
        key: 'appearance.cornerRadius',
        label: 'Corner radius',
        component: 'InputNumber',
        componentProps: { min: 0 },
        section: 'Appearance'
      },
      {
        key: 'typography.fontSize',
        label: 'Font Size',
        component: 'InputNumber',
        componentProps: { min: 8, max: 72 },
        section: 'Typography'
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
        section: 'Typography'
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
        section: 'Typography'
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
        section: 'Typography'
      }
    ]
  }

  const commonOptions = getCommonOptions()

  const getOptionsForType = (type: string) => commonOptions

  return {
    getOptionsForType
  }
}


