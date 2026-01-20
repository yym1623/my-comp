import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

// Supabase 클라이언트 인스턴스 생성 및 반환 (싱글톤)
export const useSupabase = () => {
  if (supabaseClient) {
    return { supabase: supabaseClient }
  }

  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    // SSR 중이거나 환경 변수가 없을 때 더미 클라이언트 반환
    if (import.meta.server) {
      console.warn('Supabase URL and Anon Key are not configured. Using dummy client for SSR.')
      supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key', {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }) as SupabaseClient
      return { supabase: supabaseClient }
    }
    throw new Error('Supabase URL and Anon Key must be provided. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.')
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  return { supabase: supabaseClient }
}

// Supabase 클라이언트만 반환하는 헬퍼 함수
export const useSupabaseClient = () => {
  const { supabase } = useSupabase()
  return supabase
}