import { useComponents } from '~/composables/useComponents'

type ComponentOptionField = {
  key: string
  label: string
  component: 'InputText' | 'Textarea' | 'Select' | 'ToggleSwitch'
  componentProps?: Record<string, unknown>
}

type ComponentOptionsMap = Record<string, ComponentOptionField[]>

export const useComponentOptions = () => {
  const { severityOptions } = useComponents()

  const componentOptions: ComponentOptionsMap = {
    header: [
      {
        key: 'title',
        label: '제목',
        component: 'InputText'
      }
    ],
    button: [
      {
        key: 'label',
        label: '라벨',
        component: 'InputText'
      },
      {
        key: 'severity',
        label: '스타일',
        component: 'Select',
        componentProps: {
          options: severityOptions
        }
      },
      {
        key: 'outlined',
        label: '아웃라인',
        component: 'ToggleSwitch'
      }
    ],
    input: [
      {
        key: 'placeholder',
        label: 'Placeholder',
        component: 'InputText'
      }
    ],
    text: [
      {
        key: 'content',
        label: '내용',
        component: 'Textarea',
        componentProps: {
          rows: 4
        }
      }
    ],
    image: [
      {
        key: 'alt',
        label: 'Alt 텍스트',
        component: 'InputText'
      }
    ],
    card: [
      {
        key: 'title',
        label: '제목',
        component: 'InputText'
      },
      {
        key: 'content',
        label: '내용',
        component: 'Textarea',
        componentProps: {
          rows: 3
        }
      }
    ]
  }

  const getOptionsForType = (type: string) => componentOptions[type] || []

  return {
    componentOptions,
    getOptionsForType
  }
}


