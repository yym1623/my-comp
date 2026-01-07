import { createClient } from '@supabase/supabase-js'

export const createServerSupabaseClient = () => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.supabaseUrl
  const supabaseServiceRoleKey = config.supabaseServiceRoleKey

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL and Service Role Key must be provided in server environment')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * 클라이언트에서 전달받은 세션을 사용하는 Supabase 클라이언트
 * 사용자 인증이 필요한 경우 사용
 */
export const createServerSupabaseClientWithSession = (accessToken: string) => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.supabaseUrl
  const supabaseAnonKey = config.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided in server environment')
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  })

  return supabase
}

