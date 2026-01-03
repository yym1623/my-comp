export interface ComponentDef {
  id: string
  name: string
  description: string
  icon: string
  type: string
  defaultProps: Record<string, any>
  ready?: boolean
}

export interface CanvasItem {
  uid: string
  type: string
  props: Record<string, any>
  items?: CanvasItem[] // 그리드나 그룹 안에 들어가는 컴포넌트들
}

export interface Page {
  id: string
  name: string
  description?: string
}

