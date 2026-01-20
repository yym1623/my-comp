import { createServerSupabaseClient } from '@server/utils/supabase'
import { getAuthenticatedUser, handleApiError } from '@server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthenticatedUser(event)
    const serverSupabase = createServerSupabaseClient()

    const { data: pagesData, error } = await serverSupabase
      .from('pages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Supabase pages query error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '페이지 조회 중 오류가 발생했습니다.'
      })
    }

    return {
      pages: pagesData || []
    }
  } catch (err: unknown) {
    handleApiError(err, 'Get pages API error:')
  }
})
