import type { CanvasItem } from '~/types/component'
import { createServerSupabaseClient } from '@server/utils/supabase'
import { getAuthenticatedUser, handleApiError } from '@server/utils/auth'

interface PageBody {
  page: {
    name: string
    description?: string
  }
  elements: CanvasItem[]
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<PageBody>(event)
    const { page, elements } = body

    if (!page || !page.name) {
      throw createError({
        statusCode: 400,
        statusMessage: '페이지 정보는 필수입니다.'
      })
    }

    const user = await getAuthenticatedUser(event)
    const serverSupabase = createServerSupabaseClient()

    // elements의 uid를 id로 변환
    const convertedElements = (elements || []).map((el: CanvasItem & { uid?: string }) => {
      const { uid, id, ...rest } = el
      return { id: uid || id, ...rest } as CanvasItem
    })

    const pageData = {
      user_id: user.id,
      page: {
        page: {
          name: page.name,
          description: page.description || null
        },
        elements: convertedElements
      },
      updated_at: new Date().toISOString()
    }

    const { data, error } = await serverSupabase
      .from('pages')
      .insert([pageData])
      .select()
      .single()

    if (error) {
      console.error('Supabase pages insert error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '페이지 저장 중 오류가 발생했습니다.'
      })
    }

    return {
      success: true,
      page: data
    }
  } catch (err: unknown) {
    handleApiError(err, 'Post pages API error:')
  }
})
