import { useElements } from '~/composables/useElements'

type ComponentOptionField = {
  key: string
  label: string
  component: 'InputText' | 'Textarea' | 'Select' | 'ToggleSwitch'
  componentProps?: Record<string, unknown>
}

type ComponentOptionsMap = Record<string, ComponentOptionField[]>

export const useElementOptions = () => {
  const { severityOptions } = useElements()

  const componentOptions: ComponentOptionsMap = {
    heading1: [
      { key: 'text', label: '제목 텍스트', component: 'InputText' }
    ],
    heading2: [
      { key: 'text', label: '제목 텍스트', component: 'InputText' }
    ],
    heading3: [
      { key: 'text', label: '제목 텍스트', component: 'InputText' }
    ],
    spacer: [
      { key: 'height', label: '높이 (예: 1rem, 2rem)', component: 'InputText' }
    ],
    divider: [],
    button: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'text', label: '버튼 텍스트', component: 'InputText' },
      {
        key: 'severity',
        label: '스타일',
        component: 'Select',
        componentProps: {
          options: severityOptions
        }
      },
      { key: 'outlined', label: '아웃라인', component: 'ToggleSwitch' }
    ],
    inputText: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'placeholder', label: 'Placeholder', component: 'InputText' }
    ],
    inputPassword: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'placeholder', label: 'Placeholder', component: 'InputText' }
    ],
    inputEmail: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'placeholder', label: 'Placeholder', component: 'InputText' }
    ],
    inputDate: [
      { key: 'label', label: '레이블', component: 'InputText' }
    ],
    inputTime: [
      { key: 'label', label: '레이블', component: 'InputText' }
    ],
    select: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'placeholder', label: 'Placeholder', component: 'InputText' },
      {
        key: 'options',
        label: '옵션 목록 (쉼표로 구분)',
        component: 'InputText'
      }
    ],
    inputTextSmall: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'placeholder', label: 'Placeholder', component: 'InputText' }
    ],
    textarea: [
      { key: 'label', label: '레이블', component: 'InputText' },
      {
        key: 'content',
        label: '내용',
        component: 'Textarea',
        componentProps: {
          rows: 4
        }
      }
    ],
    inputUrl: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'placeholder', label: 'Placeholder', component: 'InputText' }
    ],
    checkbox: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'checked', label: '체크됨', component: 'ToggleSwitch' }
    ],
    radio: [
      { key: 'label', label: '레이블', component: 'InputText' },
      {
        key: 'options',
        label: '옵션 목록 (쉼표로 구분)',
        component: 'InputText'
      },
      { key: 'selected', label: '선택된 값', component: 'InputText' }
    ],
    toggleSwitch: [
      { key: 'label', label: '레이블', component: 'InputText' },
      { key: 'checked', label: '켜짐', component: 'ToggleSwitch' }
    ],
    image: [
      {
        key: 'alt',
        label: 'Alt 텍스트',
        component: 'InputText'
      }
    ],
    prevNext: [
      { key: 'prevText', label: '이전 버튼 텍스트', component: 'InputText' },
      { key: 'nextText', label: '다음 버튼 텍스트', component: 'InputText' }
    ],
    grid: [
      { key: 'columns', label: '컬럼 수', component: 'InputText' },
      { key: 'gap', label: '간격 (예: 1rem)', component: 'InputText' }
    ],
    group: [
      { key: 'title', label: '그룹 제목', component: 'InputText' }
    ],
    table: [
      {
        key: 'columns',
        label: '컬럼 이름 (쉼표로 구분)',
        component: 'InputText'
      }
    ]
  }

  const getOptionsForType = (type: string) => componentOptions[type] || []

  return {
    componentOptions,
    getOptionsForType
  }
}


