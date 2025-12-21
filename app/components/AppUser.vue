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
        class="absolute z-50 w-80 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        :style="panelStyle"
      >
        <!-- 헤더 섹션 -->
        <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 px-5 pt-5 pb-4 border-b border-surface-200 dark:border-surface-700">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <i class="pi pi-user text-2xl text-white" />
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-base font-bold text-surface-900 dark:text-surface-100 truncate">
                {{ userData.name }}
              </span>
              <span class="text-sm text-surface-600 dark:text-surface-400 truncate">
                {{ userData.email }}
              </span>
            </div>
          </div>
        </div>

        <!-- 메뉴 섹션 -->
        <div>
          <template v-for="(menu, index) in menuItems" :key="menu.id">
            <div v-if="menu.divider" class="h-px bg-surface-200 dark:bg-surface-700 my-1" />
            <button
              v-else
              class="w-full px-5 py-3 flex items-center gap-3 text-left hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors group"
              @click="menu.action && handleMenuClick(menu.action)"
            >
              <div 
                class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                :class="menu.isDanger 
                  ? 'bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30' 
                  : 'bg-surface-100 dark:bg-surface-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'"
              >
                <i 
                  :class="[
                    menu.icon,
                    'text-sm',
                    menu.isDanger 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-surface-600 dark:text-surface-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                  ]"
                ></i>
              </div>
              <div class="flex flex-col flex-1 min-w-0">
                <span 
                  class="text-sm font-medium"
                  :class="menu.isDanger 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-surface-900 dark:text-surface-100'"
                >{{ menu.title }}</span>
                <span class="text-xs text-surface-500 dark:text-surface-500">{{ menu.description }}</span>
              </div>
              <i 
                v-if="!menu.isDanger"
                class="pi pi-angle-right text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300"
              ></i>
            </button>
          </template>
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

interface MenuItem {
  id: string
  title?: string
  description?: string
  icon?: string
  action?: string
  isDanger?: boolean
  divider?: boolean
}

// 목데이터
const userData: UserData = {
  id: 'USR-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Member',
  joinedDate: '2024-01-15'
}

// 메뉴 아이템 데이터
const menuItems: MenuItem[] = [
  {
    id: 'profile',
    title: '프로필',
    description: '내 정보 수정',
    icon: 'pi pi-user',
    action: 'profile'
  },
  {
    id: 'settings',
    title: '설정',
    description: '계정 설정',
    icon: 'pi pi-cog',
    action: 'settings'
  },
  {
    id: 'logout',
    title: '로그아웃',
    description: '계정에서 로그아웃',
    icon: 'pi pi-sign-out',
    action: 'logout',
    isDanger: true
  }
]

const visible = ref(false)
const panelRef = ref<HTMLElement>()
const buttonElement = ref<HTMLElement>()
const panelStyle = ref({ top: '0px', right: '0px' })

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')} 가입`
}

function handleMenuClick(action: string) {
  if (action === 'logout') {
    // 로그아웃 처리 - auth 페이지로 이동
    navigateTo('/auth')
    close()
    return
  }
  
  // 다른 메뉴 액션은 나중에 구현
  console.log(`Menu clicked: ${action}`)
  close()
}

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
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
