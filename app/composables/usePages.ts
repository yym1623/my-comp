import type { Page } from '~/types/component'
import type { CanvasItem } from '~/types/component'

interface PageDataCache {
  id: string
  page: string | {
    page?: {
      name?: string
      description?: string
    }
    elements?: any[]
  }
}

const pages = ref<Page[]>([])
const isLoading = ref<boolean>(false)
const pagesDataCache = ref<Record<string, PageDataCache>>({})
const guestPages = ref<Page[]>([])
const guestPagesDataCache = ref<Record<string, PageDataCache>>({})

export const usePages = () => {
  const supabase = useSupabaseClient()

  // API에서 전체 페이지 데이터 로드 후 캐시에 저장
  const fetchAndCachePages = async (): Promise<{ pages: any[] } | null> => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return null
    }

    const response = await $fetch<{ pages: any[] }>('/api/pages', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    pagesDataCache.value = {}
    if (response.pages) {
      response.pages.forEach((dbPage: any) => {
        pagesDataCache.value[dbPage.id.toString()] = dbPage
      })
    }

    pages.value = (response.pages || []).map((dbPage: any) => {
      let pageData: any = dbPage.page
      if (typeof pageData === 'string') {
        try {
          pageData = JSON.parse(pageData)
        } catch {
          pageData = {}
        }
      }
      
      // page 컬럼 구조: { page: {...}, elements: [...] }
      const pageInfo = pageData?.page || {}
      
      return {
        id: dbPage.id.toString(),
        name: pageInfo.name || 'Untitled',
        description: pageInfo.description || undefined
      }
    })

    return response
  }

  // 페이지 목록 로드
  const loadPages = async (): Promise<void> => {
    try {
      isLoading.value = true
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        pages.value = guestPages.value
        pagesDataCache.value = guestPagesDataCache.value
        return
      }
      await fetchAndCachePages()
    } catch {
      pages.value = []
      pagesDataCache.value = {}
    } finally {
      isLoading.value = false
    }
  }

  // 페이지 생성
  const createPage = async (pageData: { name: string; description?: string }, elements: CanvasItem[] = []): Promise<Page> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      let newPage: Page
      if (!session) {
        newPage = {
          id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: pageData.name,
          description: pageData.description
        }
        guestPages.value.push(newPage)
        pages.value = guestPages.value

        guestPagesDataCache.value[newPage.id] = {
          id: newPage.id,
          page: JSON.stringify({
            page: {
              name: pageData.name,
              description: pageData.description
            },
            elements
          })
        }
        pagesDataCache.value = guestPagesDataCache.value
        return newPage
      }

      const response = await $fetch<{ success: boolean; page: any }>('/api/pages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: {
          page: {
            name: pageData.name,
            description: pageData.description
          },
          elements
        }
      })

      newPage = {
        id: response.page.id.toString(),
        name: pageData.name,
        description: pageData.description
      }
      pages.value.push(newPage)

      return newPage
    } catch (error) {
      throw error
    }
  }

  // 페이지 업데이트
  const updatePage = async (pageId: string, pageData?: { name?: string; description?: string }, elements?: CanvasItem[]): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (pageData) {
          const pageIndex = guestPages.value.findIndex(p => p.id === pageId)
          if (pageIndex !== -1 && guestPages.value[pageIndex]) {
            if (pageData.name) guestPages.value[pageIndex].name = pageData.name
            if (pageData.description !== undefined) guestPages.value[pageIndex].description = pageData.description
          }
          pages.value = guestPages.value
        }

        const cached = guestPagesDataCache.value[pageId] || { id: pageId, page: JSON.stringify({}) }
        let pageJson: any
        if (typeof cached.page === 'string') {
          try {
            pageJson = JSON.parse(cached.page) || {}
          } catch {
            pageJson = {}
          }
        } else {
          pageJson = cached.page || {}
        }

        pageJson.page = {
          ...(pageJson.page || {}),
          ...(pageData || {})
        }

        if (elements) {
          pageJson.elements = elements.map(el => ({
            id: el.id,
            type: el.type,
            props: el.props,
            items: el.items
          }))
        }

        guestPagesDataCache.value[pageId] = {
          ...cached,
          page: JSON.stringify(pageJson)
        }
        pagesDataCache.value = guestPagesDataCache.value
        return
      }

      await $fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: {
          page: pageData,
          elements
        }
      })

      if (pageData) {
        const pageIndex = pages.value.findIndex(p => p.id === pageId)
        if (pageIndex !== -1 && pages.value[pageIndex]) {
          if (pageData.name) pages.value[pageIndex].name = pageData.name
          if (pageData.description !== undefined) pages.value[pageIndex].description = pageData.description
        }
      }
      
      delete pagesDataCache.value[pageId]
    } catch (error) {
      throw error
    }
  }

  // 페이지 삭제
  const deletePage = async (pageId: string): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        const pageIndex = guestPages.value.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          guestPages.value.splice(pageIndex, 1)
        }
        pages.value = guestPages.value
        delete guestPagesDataCache.value[pageId]
        pagesDataCache.value = guestPagesDataCache.value
        return
      }

      await $fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      const pageIndex = pages.value.findIndex(p => p.id === pageId)
      if (pageIndex !== -1) {
        pages.value.splice(pageIndex, 1)
      }
      
      delete pagesDataCache.value[pageId]
    } catch (error) {
      throw error
    }
  }

  // 페이지 데이터 로드 (elements 포함, 캐시 우선)
  const loadPageData = async (pageId: string): Promise<CanvasItem[] | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        const cachedPage = guestPagesDataCache.value[pageId]
        if (!cachedPage) {
          return null
        }
        
        if (!cachedPage.page) {
          return []
        }

        let pageData: any = cachedPage.page
        if (typeof pageData === 'string') {
          try {
            pageData = JSON.parse(pageData)
          } catch {
            return []
          }
        }

        const elements = (pageData?.elements as any[]) || []
        return elements.map((el: any) => ({
          id: el.id || el.uid,
          type: el.type,
          props: el.props || {},
          items: el.items ? el.items.map((item: any) => ({
            id: item.id || item.uid,
            type: item.type,
            props: item.props || {}
          })) : undefined
        })) as CanvasItem[]
      }

      let cachedPage = pagesDataCache.value[pageId]

      if (!cachedPage) {
        const response = await fetchAndCachePages()
        if (!response || !response.pages) {
          return null
        }
        cachedPage = pagesDataCache.value[pageId]
        if (!cachedPage) {
          return null
        }
      }

      if (!cachedPage.page) {
        return []
      }

      let pageData: any = cachedPage.page
      if (typeof pageData === 'string') {
        try {
          pageData = JSON.parse(pageData)
        } catch {
          return []
        }
      }

      const elements = (pageData?.elements as any[]) || []
      
      return elements.map((el: any) => ({
        id: el.id || el.uid, // 기존 uid가 있으면 id로 변환
        type: el.type,
        props: el.props || {},
        items: el.items ? el.items.map((item: any) => ({
          id: item.id || item.uid,
          type: item.type,
          props: item.props || {}
        })) : undefined
      })) as CanvasItem[]
    } catch {
      return null
    }
  }

  return {
    pages,
    isLoading,
    loadPages,
    createPage,
    updatePage,
    deletePage,
    loadPageData
  }
}