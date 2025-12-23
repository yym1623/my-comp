export interface ComponentDef {
  id: string
  name: string
  description: string
  icon: string
  type: string
  defaultProps: Record<string, any>
}

export interface CanvasItem {
  uid: string
  type: string
  props: Record<string, any>
}

export interface Page {
  id: string
  name: string
  description?: string
}

