import type { H3Event } from 'h3'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// 인증 헤더에서 사용자 정보 가져오기
export const getAuthenticatedUser = async (event: H3Event): Promise<User> => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: '인증이 필요합니다.'
    })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = config.supabaseUrl || config.public.supabaseUrl
  const supabaseAnonKey = config.supabaseAnonKey || config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase 설정이 올바르지 않습니다.'
    })
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader
      }
    }
  })

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: '인증에 실패했습니다.'
    })
  }

  return user
}

// 에러 핸들링 헬퍼
export const handleApiError = (err: unknown, defaultMessage: string): never => {
  if (err && typeof err === 'object' && 'statusCode' in err) {
    throw err
  }
  console.error(defaultMessage, err)
  throw createError({
    statusCode: 500,
    statusMessage: '서버 오류가 발생했습니다.'
  })
}
