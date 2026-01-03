<template>
  <Teleport to="body">
    <!-- 로그아웃 확인 모달 -->
    <ModalsConfirm
      v-model="isLogoutConfirmOpen"
      header="로그아웃"
      message="로그아웃 하시겠어요?"
      action-type="delete"
      to="/auth"
      @confirm="close"
    />

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
        class="z-50 w-80 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        :class="isMobile ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'absolute'"
        :style="isMobile ? {} : panelStyle"
      >
        <!-- 헤더 섹션 -->
        <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 px-5 pt-5 pb-4 border-b border-surface-200 dark:border-surface-700 relative">
          <!-- X 버튼 (모바일일 때만 표시) -->
          <button
            v-if="isMobile"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            @click.stop="close"
          >
            <i class="pi pi-times text-surface-600 dark:text-surface-400"></i>
          </button>
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
              :disabled="menu.action !== 'logout'"
              class="w-full px-5 py-3 flex items-center gap-3 text-left transition-colors relative overflow-hidden"
              :class="menu.action !== 'logout' 
                ? 'cursor-not-allowed' 
                : 'hover:bg-surface-100 dark:hover:bg-surface-700 group'"
              @click="menu.action === 'logout' ? isLogoutConfirmOpen = true : menu.action && handleMenuClick(menu.action)"
            >
              <!-- 준비중 오버레이 (비활성화된 메뉴만, 수평/수직 중앙) -->
              <Ready v-if="menu.action !== 'logout'" />
              
              <div 
                class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                :class="menu.isDanger 
                  ? 'bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30' 
                  : menu.action !== 'logout'
                    ? 'bg-surface-100 dark:bg-surface-700 opacity-50'
                    : 'bg-surface-100 dark:bg-surface-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'"
              >
                <i 
                  :class="[
                    menu.icon,
                    'text-sm',
                    menu.isDanger 
                      ? 'text-red-600 dark:text-red-400' 
                      : menu.action !== 'logout'
                        ? 'text-surface-400 dark:text-surface-500'
                        : 'text-surface-600 dark:text-surface-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                  ]"
                ></i>
              </div>
              <div class="flex flex-col flex-1 min-w-0">
                <span 
                  class="text-sm font-medium"
                  :class="menu.isDanger 
                    ? 'text-red-600 dark:text-red-400' 
                    : menu.action !== 'logout'
                      ? 'text-surface-400 dark:text-surface-500'
                      : 'text-surface-900 dark:text-surface-100'"
                >{{ menu.title }}</span>
                <span 
                  class="text-xs"
                  :class="menu.action !== 'logout'
                    ? 'text-surface-400 dark:text-surface-500'
                    : 'text-surface-500 dark:text-surface-500'"
                >{{ menu.description }}</span>
              </div>
              <i 
                v-if="!menu.isDanger && menu.action === 'logout'"
                class="pi pi-angle-right text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300 flex-shrink-0"
              ></i>
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { UserData, MenuItem } from '~/types/user'
import { useResponsive } from '~/composables/useResponsive'

const { isMobile } = useResponsive()

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
const isLogoutConfirmOpen = ref(false)

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')} 가입`
}

function handleMenuClick(action: string) {
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
    // 모바일이 아닐 때만 위치 계산
    if (!isMobile.value) {
      const rect = target.getBoundingClientRect()
      const gap = 8
      panelStyle.value = {
        top: `${rect.bottom + gap}px`,
        right: `${window.innerWidth - rect.right}px`
      }
    }
    
    // 위치 설정 후 visible을 true로 설정
    visible.value = true
    
    // DOM이 마운트된 후 정확한 위치로 조정 (모바일이 아닐 때만)
    if (!isMobile.value) {
      nextTick(() => {
        if (buttonElement.value) {
          updatePosition(buttonElement.value)
        }
      })
    }
  }
}

function close() {
  visible.value = false
}

// 윈도우 리사이즈 시 위치 업데이트 (모바일이 아닐 때만)
onMounted(() => {
  window.addEventListener('resize', () => {
    if (visible.value && buttonElement.value && !isMobile.value) {
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

// 모바일일 때 중앙 정렬 애니메이션
@media (max-width: 1023px) {
  .slide-down-enter-active,
  .slide-down-leave-active {
    transform-origin: center center;
  }
  
  .slide-down-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  
  .slide-down-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
}
</style>

