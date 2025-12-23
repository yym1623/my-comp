export interface UserData {
  id: string
  name: string
  email: string
  role: string
  joinedDate: string
}

export interface MenuItem {
  id: string
  title?: string
  description?: string
  icon?: string
  action?: string
  isDanger?: boolean
  divider?: boolean
}

