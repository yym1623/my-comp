export interface ComponentDef {
  name: string
  description: string
  icon: string
  type: string
  defaultProps: Record<string, any>
  ready?: boolean
}

export interface CanvasItem {
  id: string
  type?: string
  data?: Record<string, any>
  styles?: Record<string, any>
  items?: CanvasItem[] | CanvasItem[][]  // 일반 컴포넌트는 CanvasItem[], 그리드는 CanvasItem[][]
  [key: string]: any  // defaultProps의 다른 속성들도 포함 가능
}

export interface Page {
  id: string
  name: string
  description?: string
}

