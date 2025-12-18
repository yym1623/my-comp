<template>
  <div class="w-full max-w-md">
    <!-- 타이틀 -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-color">Sign Up</h1>
    </div>

    <!-- 회원가입 폼 -->
    <form @submit.prevent="handleSignup" class="space-y-6">
      <!-- 이름 -->
      <div class="flex flex-col gap-2">
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="name"
            v-model="name"
            type="text"
            placeholder="이름"
            class="w-full !py-3 !pl-4 !text-sm"
            :invalid="!!errors.name"
          />
        </IconField>
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <!-- 이메일 -->
      <div class="flex flex-col gap-2">
        <IconField>
          <InputIcon class="pi pi-envelope" />
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
          :feedback="true"
          toggleMask
          class="w-full"
          inputClass="w-full !py-3 !pl-4 !text-sm"
          :invalid="!!errors.password"
        />
        <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
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
        />
        <small v-if="errors.passwordConfirm" class="text-red-500">{{ errors.passwordConfirm }}</small>
      </div>

      <!-- 회원가입 버튼 -->
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
definePageMeta({
  layout: 'auth'
})

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isLoading = ref(false)

const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const validate = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.passwordConfirm = ''

  if (!name.value) {
    errors.name = '이름을 입력해주세요'
  }

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

  if (!passwordConfirm.value) {
    errors.passwordConfirm = '비밀번호 확인을 입력해주세요'
  } else if (password.value !== passwordConfirm.value) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다'
  }

  return !errors.name && !errors.email && !errors.password && !errors.passwordConfirm
}

const handleSignup = async () => {
  if (!validate()) return

  isLoading.value = true

  try {
    console.log('Signup:', { name: name.value, email: email.value })
    await new Promise(resolve => setTimeout(resolve, 1500))
    await navigateTo('/auth')
  } catch (error) {
    console.error('Signup failed:', error)
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
