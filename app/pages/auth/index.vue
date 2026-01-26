<template>
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-color">Login</h1>
    </div>

    <Form @submit="handleLogin" class="space-y-6">
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
            @input="clearAllErrors"
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
          class="w-full"
          inputClass="w-full !py-3 !pl-4 !text-sm"
          :invalid="!!errors.password"
          @input="clearAllErrors"
        />
        <small v-if="errors.password" class="text-red-500 pl-1">{{ errors.password }}</small>
      </div>

      <div class="pt-4">
        <Button
          type="submit"
          label="로그인"
          :loading="isLoading"
          class="w-full !bg-primary !border-primary hover:!bg-primary/90 !py-3"
        />
      </div>

      <p class="text-center text-muted-color text-sm mt-8">
        계정이 없으신가요?
        <NuxtLink to="/auth/signup" class="text-primary font-medium hover:underline">
          회원가입
        </NuxtLink>
      </p>

      <!-- 구분선 -->
      <div class="flex items-center gap-3 my-6">
        <div class="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
        <span class="text-xs text-muted-color">또는</span>
        <div class="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
      </div>

      <!-- 소셜 / 게스트 로그인 버튼 -->
      <div class="flex flex-col gap-2">
        <!-- Google 로그인 -->
        <Button
          :loading="socialLoading === 'google'"
          class="w-full !justify-start !py-2.5 !px-3 rounded-lg bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          label="Google 계정으로 시작"
          @click="handleSocialLogin('google')"
        >
          <template #icon>
            <span class="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-white border border-surface-300 dark:border-surface-600 shadow-sm">
              <i class="pi pi-google text-sm text-[#4285F4]" />
            </span>
          </template>
        </Button>

        <!-- Kakao 로그인 -->
        <Button
          :loading="socialLoading === 'kakao'"
          class="w-full !justify-start !py-2.5 !px-3 rounded-lg bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          label="Kakao 계정으로 시작"
          @click="handleSocialLogin('kakao')"
        >
          <template #icon>
            <span class="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-[#FEE500] shadow-sm">
              <i class="pi pi-comment text-xs text-black" />
            </span>
          </template>
        </Button>

        <!-- Apple 로그인 -->
        <Button
          :loading="socialLoading === 'apple'"
          class="w-full !justify-start !py-2.5 !px-3 rounded-lg bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          label="Apple 계정으로 시작"
          @click="handleSocialLogin('apple')"
        >
          <template #icon>
            <span class="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-black shadow-sm">
              <i class="pi pi-apple text-xs text-white" />
            </span>
          </template>
        </Button>

        <!-- 게스트 로그인 -->
        <Button
          :loading="socialLoading === 'guest'"
          class="w-full !justify-start !py-2.5 !px-3 rounded-lg bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          label="게스트로 시작"
          @click="handleGuestLogin"
        >
          <template #icon>
            <span class="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-primary-50 dark:bg-primary-900/40 shadow-sm">
              <i class="pi pi-user text-xs text-primary-600 dark:text-primary-300" />
            </span>
          </template>
        </Button>
      </div>
    </Form>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { isValidEmail } from '~/utils/validation'
import { parseSupabaseAuthError } from '~/utils/error'

useSeoMeta({
  title: 'MyComp - 로그인',
  description: '로그인하여 컴포넌트 빌더를 시작하세요. 계정이 없으시다면 회원가입을 진행해주세요.',
  ogTitle: 'MyComp - 로그인',
  ogDescription: '로그인하여 컴포넌트 빌더를 시작하세요',
  ogType: 'website',
  ogImage: '/og.svg',
  ogImageWidth: 1200,
  ogImageHeight: 630
})

definePageMeta({
  layout: 'auth'
})

const { showSuccess } = useAppToast()
const route = useRoute()

const email = ref<string>('')
const password = ref<string>('')
const socialLoading = ref<'google' | 'kakao' | 'apple' | 'guest' | null>(null)

const { errors, clearAllErrors, setError } = useFormErrors({
  email: '',
  password: ''
})

const { isLoading, execute } = useAsyncOperation()

// 에러 메시지 상수
const ERROR_MESSAGES = {
  EMAIL_REQUIRED: '이메일을 입력해주세요',
  EMAIL_INVALID: '올바른 이메일 형식이 아닙니다',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요',
  PASSWORD_MIN_LENGTH: '비밀번호는 6자 이상이어야 합니다',
  LOGIN_ERROR: '로그인 중 오류가 발생했습니다'
} as const

// 폼 유효성 검사
const validate = (): boolean => {
  clearAllErrors()

  if (!email.value) {
    setError('email', ERROR_MESSAGES.EMAIL_REQUIRED)
  } else if (!isValidEmail(email.value)) {
    setError('email', ERROR_MESSAGES.EMAIL_INVALID)
  }

  if (!password.value) {
    setError('password', ERROR_MESSAGES.PASSWORD_REQUIRED)
  } else if (password.value.length < 6) {
    setError('password', ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
  }

  return !errors.email && !errors.password
}

// 로그인 처리
const handleLogin = async (): Promise<void> => {
  if (!validate()) return

  await execute(async () => {
    const supabase = useSupabaseClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      const errorMessage = parseSupabaseAuthError(error)
      setError('email', errorMessage)
      setError('password', errorMessage)
      return null
    }

    if (data.user) {
      await navigateTo({ path: '/', query: { status: 'logged_in' } })
    }

    return data
  }, {
    onError: () => {
      setError('email', ERROR_MESSAGES.LOGIN_ERROR)
    }
  })
}

// 소셜 로그인 처리 (미구현)
const handleSocialLogin = async (provider: 'google' | 'kakao' | 'apple'): Promise<void> => {
  return
}

// 게스트 로그인 처리
const handleGuestLogin = async (): Promise<void> => {
  socialLoading.value = 'guest'
  try {
    // 1초 로딩 표시
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const supabase = useSupabaseClient()
    // 기존 세션이 있다면 로그아웃 처리
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.auth.signOut()
    }
    // 홈페이지로 이동 (게스트 모드)
    await navigateTo({ path: '/', query: { status: 'guest' } })
  } catch (error) {
    console.error('Guest login error:', error)
  } finally {
    socialLoading.value = null
  }
}

onMounted(() => {
  const status = route.query.status as string | undefined
  if (!status) return

  if (status === 'logged_out') {
    showSuccess('로그아웃 완료', '로그아웃되었습니다.')
  }

  const query = { ...route.query }
  delete query.status
  navigateTo({ query })
})
</script>

<style lang="scss" scoped>
.text-color {
  color: var(--p-text-color);
}

.text-muted-color {
  color: var(--p-text-muted-color);
}

:deep(.p-button .p-button-loading-icon) {
  width: 20px;
  height: 20px;
  font-size: 0.5rem;
  margin-left: 0.1rem;
  margin-right: .9rem;
  flex-shrink: 0;
}
</style>