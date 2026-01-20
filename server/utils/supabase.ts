import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

export const createServerSupabaseClient = (): SupabaseClient => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.supabaseUrl || config.public.supabaseUrl
  const supabaseAnonKey = config.supabaseAnonKey || config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and ANON key must be provided in server environment')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}