<template>
  <Transition name="slide-down">
    <div
      v-if="visible"
      ref="modalRef"
      class="z-50 w-80 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
      :class="isMobile ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'fixed'"
      :style="isMobile ? {} : panelStyle"
    >
      <!-- 헤더 섹션 -->
      <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 px-5 pt-5 pb-4 border-b border-surface-200 dark:border-surface-700 relative">
        <button
          v-if="isMobile"
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          @click.stop="close"
        >
          <i class="pi pi-times text-surface-600 dark:text-surface-400"></i>
        </button>

        <Skeletons v-if="isLoading" type="user" />

        <div v-else class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <i class="pi pi-user text-2xl text-white" />
          </div>
          <div class="flex flex-col min-w-0 flex-1">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-base font-bold text-surface-900 dark:text-surface-100 truncate">
                {{ userData.name }}
              </span>

              <span
                v-if="userData.role === 'Guest'"
                class="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-surface-100 dark:bg-surface-700 text-primary-600 dark:text-primary-300 border border-primary-200 dark:border-primary-700 flex-shrink-0"
              >
                게스트 모드
              </span>
            </div>
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
            :disabled="menu.action !== 'logout' && menu.action !== 'login'"
            class="w-full px-5 py-3 flex items-center gap-3 text-left transition-colors relative overflow-hidden"
            :class="menu.action !== 'logout' && menu.action !== 'login'
              ? 'cursor-not-allowed' 
              : 'hover:bg-surface-100 dark:hover:bg-surface-700 group'"
            @click="menu.action === 'logout' ? isLogoutConfirmOpen = true : menu.action === 'login' ? handleMenuClick('login') : menu.action && handleMenuClick(menu.action)"
          >

            <Ready v-if="menu.action !== 'logout' && menu.action !== 'login'" />
            
            <div 
              class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
              :class="menu.isDanger 
                ? 'bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30' 
                : menu.action === 'login'
                  ? 'bg-primary-50 dark:bg-primary-900/20 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'
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
                    : menu.action === 'login'
                      ? 'text-primary-600 dark:text-primary-400'
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
                  : menu.action === 'login'
                    ? 'text-primary-600 dark:text-primary-400'
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

  <ModalsConfirm
    v-model="isLogoutConfirmOpen"
    header="로그아웃"
    message="로그아웃 하시겠어요?"
    action-type="success"
    to="/auth?status=logged_out"
    @confirm="handleLogout"
  />
</template>

<script lang="ts" setup>
import type { UserData, MenuItem } from '~/types/user'

const { isMobile } = useResponsive()

const isLoading = ref<boolean>(false)
const visible = ref<boolean>(false)
const buttonElement = ref<HTMLElement>()
const modalRef = ref<HTMLElement>()
const panelStyle = ref<{ top: string; right: string }>({ top: '0px', right: '0px' })
const isLogoutConfirmOpen = ref<boolean>(false)

// Supabase에서 사용자 정보 가져오기
const userData = ref<UserData>({
  id: '',
  name: '',
  email: '',
  role: 'Member',
  joinedDate: ''
})

// 사용자 정보 로드
const loadUserData = async () => {
  isLoading.value = true
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase.auth.getUser()
    
    // 세션이 없을 때: 게스트용 기본 정보 표시
    if (error || !data.user) {
      if (error && (error as any).name !== 'AuthSessionMissingError') {
        console.error('Failed to get user:', error)
      }
      userData.value = {
        id: 'guest',
        name: '게스트 사용자',
        email: 'guest@example.com',
        role: 'Guest',
        joinedDate: ''
      }
      return
    }
    
    const user = data.user
    if (user) {
      userData.value = {
        id: user.id ?? '',
        name: (user.user_metadata?.name as string) ?? (user.email?.split('@')[0] ?? 'User'),
        email: user.email ?? '',
        role: 'Member',
        joinedDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] ?? '' : ''
      }
    }
  } catch (error: any) {
    if (error?.name !== 'AuthSessionMissingError') {
      console.error('Error loading user data:', error)
    }
  } finally {
    isLoading.value = false
  }
}

const baseMenuItems: MenuItem[] = [
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
]

const menuItems = computed<MenuItem[]>(() => {
  const items = [...baseMenuItems]
  if (userData.value.role === 'Guest') {
    items.push({
      id: 'guest-login',
      title: '로그인',
      description: '계정으로 로그인',
      icon: 'pi pi-sign-in',
      action: 'login',
      isDanger: false
    })
  } else {
    items.push({
      id: 'logout',
      title: '로그아웃',
      description: '계정에서 로그아웃',
      icon: 'pi pi-sign-out',
      action: 'logout',
      isDanger: true
    })
  }
  return items
})


// 외부 클릭 감지
const handleClickOutside = (event: MouseEvent) => {
  if (!visible.value || !modalRef.value) return
  
  const target = event.target as HTMLElement
  // 모달 내부 클릭이거나 버튼 클릭이면 무시
  if (modalRef.value.contains(target) || buttonElement.value?.contains(target)) {
    return
  }
  
  close()
}

function handleMenuClick(action: string) {
  if (action === 'login') {
    close()
    navigateTo({ path: '/auth', query: { status: 'logged_out' } })
    return
  }
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

// 로그아웃 처리
async function handleLogout() {
  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
    }
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    close()
    isLogoutConfirmOpen.value = false
  }
}


defineExpose({
  toggle
})

// 모달 상태 감지 및 외부 클릭 감지
watch(visible, (isVisible) => {
  if (isVisible && !userData.value.id) {
    loadUserData()
  }
  
  if (isVisible) {
    nextTick(() => {
      document.addEventListener('click', handleClickOutside)
    })
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

// 윈도우 리사이즈 시 위치 업데이트 (모바일이 아닐 때만)
onMounted(() => {
  window.addEventListener('resize', () => {
    if (visible.value && buttonElement.value && !isMobile.value) {
      updatePosition(buttonElement.value)
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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


// 모바일
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

