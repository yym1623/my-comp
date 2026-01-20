import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Supabase 설정 가져오기 (공통 로직)
const getSupabaseConfig = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.supabaseUrl || config.public.supabaseUrl
  return { config, supabaseUrl }
}

// Service Role 키로 Supabase 클라이언트 생성 (RLS 우회)
export const createServerSupabaseClient = (): SupabaseClient => {
  const { config, supabaseUrl } = getSupabaseConfig()
  // 우선순위: SERVICE_ROLE_KEY > ANON_KEY > public.anonKey
  const supabaseServiceRoleKey = config.supabaseServiceRoleKey || config.supabaseAnonKey || config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL and key(SERVICE_ROLE or ANON) must be provided in server environment')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}