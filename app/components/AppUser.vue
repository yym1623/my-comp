<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-40"
        @click="close"
      />
    </Transition>
    <Transition name="slide-down">
      <div
        v-if="visible"
        ref="panelRef"
        class="absolute z-50 w-80 p-4 bg-white dark:bg-[rgb(55,55,60)] rounded-2xl shadow-lg dark:shadow-xl"
        :style="panelStyle"
      >
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-user text-xl text-primary-600 dark:text-primary-400" />
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-base font-semibold text-surface-900 dark:text-surface-100 truncate">
                {{ userData.name }}
              </span>
              <span class="text-sm text-surface-600 dark:text-surface-400 truncate">
                {{ userData.email }}
              </span>
            </div>
          </div>

          <div class="h-px bg-surface-200 dark:bg-surface-700" />

          <div class="flex flex-col gap-2.5">
            <div class="flex justify-between items-center">
              <span class="text-sm text-surface-600 dark:text-surface-400">User ID</span>
              <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
                {{ userData.id }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-surface-600 dark:text-surface-400">Role</span>
              <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
                {{ userData.role }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-surface-600 dark:text-surface-400">Joined</span>
              <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
                {{ userData.joinedDate }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
interface UserData {
  id: string
  name: string
  email: string
  role: string
  joinedDate: string
}

// 목데이터
const userData: UserData = {
  id: 'USR-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Member',
  joinedDate: '2024-01-15'
}

const visible = ref(false)
const panelRef = ref<HTMLElement>()
const buttonElement = ref<HTMLElement>()
const panelStyle = ref({ top: '0px', right: '0px' })

function updatePosition(buttonEl: HTMLElement) {
  if (!buttonEl) return
  
  const rect = buttonEl.getBoundingClientRect()
  const gap = 8
  
  panelStyle.value = {
    top: `${rect.bottom + gap}px`,
    right: `${window.innerWidth - rect.right}px`
  }
}

function toggle(event: Event) {
  const target = event.currentTarget as HTMLElement
  buttonElement.value = target
  
  if (visible.value) {
    visible.value = false
  } else {
    // 위치를 먼저 계산 (visible을 true로 설정하기 전에)
    const rect = target.getBoundingClientRect()
    const gap = 8
    panelStyle.value = {
      top: `${rect.bottom + gap}px`,
      right: `${window.innerWidth - rect.right}px`
    }
    
    // 위치 설정 후 visible을 true로 설정
    visible.value = true
    
    // DOM이 마운트된 후 정확한 위치로 조정
    nextTick(() => {
      if (buttonElement.value) {
        updatePosition(buttonElement.value)
      }
    })
  }
}

function close() {
  visible.value = false
}

// 윈도우 리사이즈 시 위치 업데이트
onMounted(() => {
  window.addEventListener('resize', () => {
    if (visible.value && buttonElement.value) {
      updatePosition(buttonElement.value)
    }
  })
})

defineExpose({
  toggle
})
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from {
  opacity: 0;
}

.slide-down-leave-to {
  opacity: 0;
}
</style>

