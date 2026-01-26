// 비밀번호 강도 검증
interface PasswordStrengthChecks {
  length: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

// 비밀번호 강도 레벨 계산
interface PasswordStrength {
  level: 'weak' | 'medium' | 'strong'
  percentage: number
  label: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 이메일 유효성 검증
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}


const PASSWORD_REGEX = {
  UPPER_CASE: /[A-Z]/,
  LOWER_CASE: /[a-z]/,
  NUMBER: /[0-9]/,
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
} as const

const MIN_PASSWORD_LENGTH = 8

export const validatePasswordStrength = (password: string): PasswordStrengthChecks => {
  return {
    length: password.length >= MIN_PASSWORD_LENGTH,
    hasUpperCase: PASSWORD_REGEX.UPPER_CASE.test(password),
    hasLowerCase: PASSWORD_REGEX.LOWER_CASE.test(password),
    hasNumber: PASSWORD_REGEX.NUMBER.test(password),
    hasSpecialChar: PASSWORD_REGEX.SPECIAL_CHAR.test(password)
  }
}


const PASSWORD_STRENGTH_THRESHOLDS = {
  STRONG: 5,
  MEDIUM: 3
} as const

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { level: 'weak', percentage: 0, label: '' }
  }
  
  const checks = validatePasswordStrength(password)
  const passedChecks = [
    checks.length,
    checks.hasUpperCase,
    checks.hasLowerCase,
    checks.hasNumber,
    checks.hasSpecialChar
  ].filter(Boolean).length
  
  if (passedChecks === PASSWORD_STRENGTH_THRESHOLDS.STRONG) {
    return { level: 'strong', percentage: 100, label: '강함' }
  } else if (passedChecks >= PASSWORD_STRENGTH_THRESHOLDS.MEDIUM) {
    return { level: 'medium', percentage: 60, label: '보통' }
  } else {
    return { level: 'weak', percentage: 30, label: '약함' }
  }
}
