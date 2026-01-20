import type { Page } from './component'

export interface SearchResult {
  title: string
  description: string
  icon: string
  category: string
  action?: () => void
  page?: Page
}

export interface ResultGroup {
  title: string
  results: SearchResult[]
}

