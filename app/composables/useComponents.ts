import type { ComponentDef, CanvasItem } from '~/types/component'

export const useComponents = () => {
  const components: ComponentDef[] = [
    { id: '1', name: '헤더', description: '페이지 상단 네비게이션', icon: 'pi pi-bars', type: 'header', defaultProps: { title: '헤더 제목' } },
    { id: '2', name: '버튼', description: '클릭 가능한 액션 버튼', icon: 'pi pi-stop', type: 'button', defaultProps: { label: '버튼', severity: 'primary', outlined: false } },
    { id: '3', name: '입력창', description: '텍스트 입력 필드', icon: 'pi pi-pencil', type: 'input', defaultProps: { placeholder: '입력하세요...' } },
    { id: '4', name: '텍스트', description: '단락 텍스트 표시', icon: 'pi pi-align-left', type: 'text', defaultProps: { content: '텍스트 내용을 입력하세요.' } },
    { id: '5', name: '이미지', description: '이미지 미디어 요소', icon: 'pi pi-image', type: 'image', defaultProps: { alt: '이미지 설명' } },
    { id: '6', name: '카드', description: '컨텐츠 카드 컨테이너', icon: 'pi pi-id-card', type: 'card', defaultProps: { title: '카드 제목', content: '카드 내용' } },
  ]

  const componentNames: Record<string, string> = {
    header: '헤더',
    button: '버튼',
    input: '입력창',
    text: '텍스트',
    image: '이미지',
    card: '카드'
  }

  const componentIcons: Record<string, string> = {
    header: 'pi pi-bars',
    button: 'pi pi-stop',
    input: 'pi pi-pencil',
    text: 'pi pi-align-left',
    image: 'pi pi-image',
    card: 'pi pi-id-card'
  }

  const severityOptions = ['primary', 'secondary', 'success', 'info', 'warn', 'danger']

  const getComponentIcon = (type: string) => {
    return componentIcons[type] || 'pi pi-box'
  }

  const getComponentName = (type: string) => {
    return componentNames[type] || type
  }

  const getComponentLabel = (item: CanvasItem) => {
    const name = getComponentName(item.type)
    if (item.type === 'header') return item.props.title || name
    if (item.type === 'button') return item.props.label || name
    if (item.type === 'text') return item.props.content?.substring(0, 20) || name
    return name
  }

  const generateUid = () => {
    return Math.random().toString(36).substring(2, 9)
  }

  return {
    components,
    componentNames,
    componentIcons,
    severityOptions,
    getComponentIcon,
    getComponentName,
    getComponentLabel,
    generateUid
  }
}

