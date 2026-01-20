<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-surface-0 dark:bg-surface-800 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-700 p-6 max-w-md w-full mx-4">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <i class="pi pi-clock text-3xl text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">
            세션이 곧 만료됩니다
          </h3>
          <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
            {{ countdown }}초 후 자동으로 로그아웃됩니다.
          </p>
          
          <div class="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mb-4">
            <div
              class="h-full bg-amber-500 transition-all duration-1000 ease-linear rounded-full"
              :style="{ width: `${(countdown / 10) * 100}%` }"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <Button
            label="로그아웃"
            severity="secondary"
            outlined
            class="flex-1"
            @click="handleLogout"
          />
          <Button
            label="세션 유지"
            severity="primary"
            class="flex-1"
            @click="handleStay"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  countdown: number
}>()

const emit = defineEmits<{
  (e: 'stay'): void
  (e: 'logout'): void
}>()

const handleStay = () => {
  emit('stay')
}

const handleLogout = () => {
  emit('logout')
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

