import type { CanvasItem } from '~/types/component'
import { createServerSupabaseClient } from '@server/utils/supabase'
import { getAuthenticatedUser, handleApiError } from '@server/utils/auth'

interface UpdatePageBody {
  page?: {
    name?: string
    description?: string
  }
  elements?: CanvasItem[]
}

interface PageData {
  updated_at?: string
  page: {
    page: {
      name?: string
      description?: string
    }
    elements: CanvasItem[]
  }
}

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '페이지 ID는 필수입니다.'
      })
    }

    const body = await readBody<UpdatePageBody>(event)
    const user = await getAuthenticatedUser(event)
    const serverSupabase = createServerSupabaseClient()

    const { data: existingPage, error: checkError } = await serverSupabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingPage) {
      throw createError({
        statusCode: 404,
        statusMessage: '페이지를 찾을 수 없습니다.'
      })
    }

    let existingPageData: PageData['page'] = existingPage.page as PageData['page']
    if (typeof existingPageData === 'string') {
      try {
        existingPageData = JSON.parse(existingPageData) as PageData['page']
      } catch {
        existingPageData = { page: {}, elements: [] }
      }
    }

    const elements = body.elements !== undefined
      ? body.elements.map((el: CanvasItem & { uid?: string }) => {
          const { uid, id, ...rest } = el
          return { id: uid || id, ...rest } as CanvasItem
        })
      : (existingPageData?.elements || [])

    const pageInfo = {
      ...(existingPageData?.page || {}),
      ...(body.page || {})
    }

    const finalPageInfo = Object.keys(pageInfo).length > 0 ? pageInfo : (existingPageData?.page || {})

    const updateData: Partial<PageData> = {
      updated_at: new Date().toISOString(),
      page: {
        page: finalPageInfo,
        elements
      }
    }

    const { data, error } = await serverSupabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase pages update error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '페이지 업데이트 중 오류가 발생했습니다.'
      })
    }

    return {
      success: true,
      page: data
    }
  } catch (err: unknown) {
    handleApiError(err, 'Put pages API error:')
  }
})