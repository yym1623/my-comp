import type { Page } from '~/types/component'

const pages = ref<Page[]>([
  { id: '1', name: 'MyForm', description: '폼 페이지' },
  { id: '2', name: 'Home', description: '홈 페이지' },
  { id: '3', name: 'About', description: '소개 페이지' }
])

export const usePages = () => {
  return {
    pages
  }
}


