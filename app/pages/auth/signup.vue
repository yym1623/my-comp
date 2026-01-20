<template>
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-color">Sign Up</h1>
    </div>

    <form @submit.prevent="handleSignup" class="space-y-6">
      <div class="flex flex-col gap-2">
        <IconField>
          <InputText
            id="name"
            v-model="name"
            type="text"
            placeholder="이름"
            class="w-full !py-3 !pl-4 !text-sm"
            :invalid="!!errors.name"
            @input="errors.name = ''"
          />
        </IconField>
        <small v-if="errors.name" class="text-red-500 pl-1">{{ errors.name }}</small>
      </div>

      <!-- 이메일 -->
      <div class="flex flex-col gap-2">
        <IconField>
          <InputText
            id="email"
            v-model="email"
            type="email"
            placeholder="이메일"
            class="w-full !py-3 !pl-4 !text-sm"
            :invalid="!!errors.email"
            @input="handleEmailInput"
          />
        </IconField>
        <small v-if="errors.email" class="text-red-500 pl-1">{{ errors.email }}</small>
      </div>

      <!-- 비밀번호 -->
      <div class="flex flex-col gap-2">
        <Password
          id="password"
          v-model="password"
          placeholder="비밀번호"
          :feedback="false"
          toggleMask
          class="w-full password-field"
          inputClass="w-full !py-3 !pl-4 !text-sm"
          :invalid="!!errors.password"
          @input="handlePasswordInput"
          @focus="isPasswordFocused = true"
          @blur="isPasswordFocused = false"
        />
        <!-- 비밀번호 강도 표시 -->
        <div v-if="password && (passwordStrength.level !== 'strong' || isPasswordFocused)" class="mt-1 pl-1">
          <div class="flex items-center gap-2 mb-1">
            <div class="flex-1 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300 rounded-full"
                :class="{
                  'bg-red-500': passwordStrength.level === 'weak',
                  'bg-amber-500': passwordStrength.level === 'medium',
                  'bg-green-500': passwordStrength.level === 'strong'
                }"
                :style="{ width: `${passwordStrength.percentage}%` }"
              />
            </div>
            <span
              class="text-xs font-medium"
              :class="{
                'text-red-500': passwordStrength.level === 'weak',
                'text-amber-500': passwordStrength.level === 'medium',
                'text-green-500': passwordStrength.level === 'strong'
              }"
            >
              {{ passwordStrength.label }}
            </span>
          </div>
        </div>
        <small v-if="errors.password" class="text-red-500 pl-1">{{ errors.password }}</small>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="flex flex-col gap-2">
        <Password
          id="passwordConfirm"
          v-model="passwordConfirm"
          placeholder="비밀번호 확인"
          :feedback="false"
          toggleMask
          class="w-full"
          inputClass="w-full !py-3 !pl-4 !text-sm"
          :invalid="!!errors.passwordConfirm"
          @input="handlePasswordConfirmInput"
        />
        <small v-if="errors.passwordConfirm" class="text-red-500 pl-1">{{ errors.passwordConfirm }}</small>
      </div>

      <div class="pt-4">
        <Button
          type="submit"
          label="회원가입"
          :loading="isLoading"
          class="w-full !bg-primary !border-primary hover:!bg-primary/90 !py-3"
        />
      </div>

      <!-- 로그인 링크 -->
      <p class="text-center text-muted-color text-sm mt-8">
        이미 계정이 있으신가요?
        <NuxtLink to="/auth" class="text-primary font-medium hover:underline">
          로그인
        </NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { isValidEmail, validatePasswordStrength, calculatePasswordStrength } from '~/utils/validation'
useSeoMeta({
  title: 'MyComp - 회원가입',
  description: '회원가입하여 컴포넌트 빌더를 시작하세요. 무료로 시작할 수 있습니다.',
  ogTitle: 'MyComp - 회원가입',
  ogDescription: '회원가입하여 컴포넌트 빌더를 시작하세요',
  ogType: 'website',
  ogImage: '/og.svg',
  ogImageWidth: 1200,
  ogImageHeight: 630
})

definePageMeta({
  layout: 'auth'
})

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const isPasswordFocused = ref<boolean>(false)

const { errors, clearError, clearAllErrors, setError } = useFormErrors({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const { isLoading, execute } = useAsyncOperation()

// 에러 메시지 상수
const ERROR_MESSAGES = {
  NAME_REQUIRED: '이름을 입력해주세요',
  EMAIL_REQUIRED: '이메일을 입력해주세요',
  EMAIL_INVALID: '올바른 이메일 형식이 아닙니다',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요',
  PASSWORD_INVALID: '영문자(대,소문자), 숫자, 특수문자를 포함하여 최소 8자 이상 작성 해야 합니다',
  PASSWORD_CONFIRM_REQUIRED: '비밀번호 확인을 입력해주세요',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다'
} as const

// 비밀번호 강도 검증 통과 여부 확인
const isPasswordValid = (pwd: string): boolean => {
  const checks = validatePasswordStrength(pwd)
  return checks.length && checks.hasUpperCase && checks.hasLowerCase && checks.hasNumber && checks.hasSpecialChar
}

// 비밀번호 일치 여부 확인 및 에러 처리
const checkPasswordMatch = (): void => {
  const hasPassword = !!password.value
  const hasPasswordConfirm = !!passwordConfirm.value
  const passwordsMatch = password.value === passwordConfirm.value
  
  if (!hasPassword || !hasPasswordConfirm) {
    if (errors.password === ERROR_MESSAGES.PASSWORD_MISMATCH) {
      clearError('password')
    }
    if (errors.passwordConfirm === ERROR_MESSAGES.PASSWORD_MISMATCH) {
      clearError('passwordConfirm')
    }
    return
  }
  
  if (!passwordsMatch) {
    if (isPasswordValid(password.value)) {
      setError('password', ERROR_MESSAGES.PASSWORD_MISMATCH)
      setError('passwordConfirm', ERROR_MESSAGES.PASSWORD_MISMATCH)
    }
  } else {
    if (errors.password === ERROR_MESSAGES.PASSWORD_MISMATCH) {
      clearError('password')
    }
    if (errors.passwordConfirm === ERROR_MESSAGES.PASSWORD_MISMATCH) {
      clearError('passwordConfirm')
    }
  }
}

// 비밀번호 강도 계산
const passwordStrength = computed(() => {
  return calculatePasswordStrength(password.value)
})

// 이메일 입력 처리
const handleEmailInput = (): void => {
  clearError('email')
  if (email.value && !isValidEmail(email.value)) {
    setError('email', ERROR_MESSAGES.EMAIL_INVALID)
  }
}

// 비밀번호 입력 처리
const handlePasswordInput = (): void => {
  clearError('password')
  
  if (password.value) {
    if (!isPasswordValid(password.value)) {
      setError('password', ERROR_MESSAGES.PASSWORD_INVALID)
    } else {
      checkPasswordMatch()
    }
  } else {
    checkPasswordMatch()
  }
}

// 비밀번호 확인 입력 처리
const handlePasswordConfirmInput = (): void => {
  clearError('passwordConfirm')
  checkPasswordMatch()
}

// 폼 유효성 검사
const validate = (): boolean => {
  clearAllErrors()

  if (!name.value) {
    setError('name', ERROR_MESSAGES.NAME_REQUIRED)
  }

  if (!email.value) {
    setError('email', ERROR_MESSAGES.EMAIL_REQUIRED)
  } else if (!isValidEmail(email.value)) {
    setError('email', ERROR_MESSAGES.EMAIL_INVALID)
  }

  if (!password.value) {
    setError('password', ERROR_MESSAGES.PASSWORD_REQUIRED)
  } else {
    if (!isPasswordValid(password.value)) {
      setError('password', ERROR_MESSAGES.PASSWORD_INVALID)
    } else if (passwordConfirm.value && password.value !== passwordConfirm.value) {
      setError('password', ERROR_MESSAGES.PASSWORD_MISMATCH)
      setError('passwordConfirm', ERROR_MESSAGES.PASSWORD_MISMATCH)
    }
  }

  if (!passwordConfirm.value) {
    setError('passwordConfirm', ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED)
  } else if (password.value && password.value !== passwordConfirm.value && isPasswordValid(password.value)) {
    setError('password', ERROR_MESSAGES.PASSWORD_MISMATCH)
    setError('passwordConfirm', ERROR_MESSAGES.PASSWORD_MISMATCH)
  }

  return !errors.name && !errors.email && !errors.password && !errors.passwordConfirm
}

// 회원가입 처리
const handleSignup = async (): Promise<void> => {
  if (!validate()) return

  await execute(async () => {
    const { supabase } = useSupabase()
    const config = useRuntimeConfig()
    
    const host = config.public.host || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    const redirectUrl = `${host}/auth/success`
    
    await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name.value
        }
      }
    })

    await navigateTo('/auth/message')
    
    return null
  }, {
    onError: () => {
      navigateTo('/auth/message')
    }
  })
}
</script>

<style lang="scss" scoped>
.text-color {
  color: var(--p-text-color);
}

.text-muted-color {
  color: var(--p-text-muted-color);
}

:deep(.password-field) {
  .p-password-panel {
    padding: 1rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e5e7eb);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin-top: 0.5rem;
    
    .p-password-meter {
      background: var(--p-surface-200, #e5e7eb);
      border-radius: 0.25rem;
      height: 0.5rem;
      margin-bottom: 0.75rem;
      
      .p-password-strength {
        border-radius: 0.25rem;
        transition: all 0.3s ease;
        
        &.weak {
          background: #ef4444;
          width: 33.33%;
        }
        
        &.medium {
          background: #f59e0b;
          width: 66.66%;
        }
        
        &.strong {
          background: #10b981;
          width: 100%;
        }
      }
    }
    
    .p-password-info {
      font-size: 0.75rem;
      color: var(--p-text-color-secondary, #6b7280);
      margin-top: 0.5rem;
      line-height: 1.5;
      
      &::before {
        content: '💡 ';
        margin-right: 0.25rem;
      }
    }
  }
  
  .dark & {
    .p-password-panel {
      background: var(--p-surface-900, #111827);
      border-color: var(--p-surface-700, #374151);
      
      .p-password-meter {
        background: var(--p-surface-700, #374151);
      }
      
      .p-password-info {
        color: var(--p-text-color-secondary, #9ca3af);
      }
    }
  }
}
</style>