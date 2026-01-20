// Supabase Auth 에러 메시지를 사용자 친화적인 메시지로 변환
export const parseSupabaseAuthError = (error: any): string => {
  if (!error?.message) {
    return '오류가 발생했습니다'
  }

  const message = error.message.toLowerCase()

  if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다'
  }

  if (message.includes('email not confirmed')) {
    return '이메일을 확인해주세요'
  }

  if (message.includes('user already registered')) {
    return '이미 가입된 이메일입니다'
  }

  if (message.includes('password')) {
    return '비밀번호 관련 오류가 발생했습니다'
  }

  return error.message || '오류가 발생했습니다'
}
