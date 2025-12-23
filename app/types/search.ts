export interface SearchResult {
  title: string
  description: string
  icon: string
  category: string
  action?: () => void
}

export interface ResultGroup {
  title: string
  results: SearchResult[]
}

