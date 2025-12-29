<template>
  <div class="w-full max-w-md">
    <!-- 타이틀 -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-color">Login</h1>
    </div>

    <!-- 로그인 폼 -->
    <form @submit.prevent="handleLogin" class="space-y-6">
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
          />
        </IconField>
        <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
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
        />
        <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
      </div>

      <!-- 로그인 버튼 -->
      <div class="pt-4">
        <Button
          type="submit"
          label="로그인"
          :loading="isLoading"
          class="w-full !bg-primary !border-primary hover:!bg-primary/90 !py-3"
        />
      </div>

      <!-- 회원가입 링크 -->
      <p class="text-center text-muted-color text-sm mt-8">
        계정이 없으신가요?
        <NuxtLink to="/auth/signup" class="text-primary font-medium hover:underline">
          회원가입
        </NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
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

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const errors = reactive({
  email: '',
  password: ''
})

const validate = () => {
  errors.email = ''
  errors.password = ''

  if (!email.value) {
    errors.email = '이메일을 입력해주세요'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = '올바른 이메일 형식이 아닙니다'
  }

  if (!password.value) {
    errors.password = '비밀번호를 입력해주세요'
  } else if (password.value.length < 6) {
    errors.password = '비밀번호는 6자 이상이어야 합니다'
  }

  return !errors.email && !errors.password
}

const handleLogin = async () => {
  if (!validate()) return

  isLoading.value = true

  try {
    console.log('Login:', { email: email.value })
    await new Promise(resolve => setTimeout(resolve, 1500))
    await navigateTo('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.text-color {
  color: var(--p-text-color);
}

.text-muted-color {
  color: var(--p-text-muted-color);
}
</style>
