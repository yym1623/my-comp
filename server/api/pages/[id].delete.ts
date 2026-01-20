import { createServerSupabaseClient } from '@server/utils/supabase'
import { getAuthenticatedUser, handleApiError } from '@server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '페이지 ID는 필수입니다.'
      })
    }

    const user = await getAuthenticatedUser(event)
    const serverSupabase = createServerSupabaseClient()

    const { error } = await serverSupabase
      .from('pages')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Supabase pages delete error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '페이지 삭제 중 오류가 발생했습니다.'
      })
    }

    return {
      success: true
    }
  } catch (err: unknown) {
    handleApiError(err, 'Delete pages API error:')
  }
})
