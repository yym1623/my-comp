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
  id: string
  type: string
  props: Record<string, any>
  items?: CanvasItem[]
}

export interface Page {
  id: string
  name: string
  description?: string
}

