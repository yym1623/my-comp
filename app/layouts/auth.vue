<template>
  <div class="min-h-screen flex bg-surface-ground overflow-hidden">
    <!-- 왼쪽: 일러스트 영역 (슬라이드 애니메이션) -->
    <Transition name="slide">
      <div
        v-show="showLeftPanel"
        class="w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-cyan-500 flex-shrink-0"
      >
        <!-- 배경 패턴 -->
        <div class="absolute inset-0 opacity-10">
          <div class="grid-pattern"></div>
        </div>

        <!-- 컴포넌트 빌더 일러스트 -->
        <div class="relative z-10 flex flex-col justify-center items-center w-full h-full p-12">

          <!-- 메인 일러스트: 컴포넌트 빌더 미리보기 -->
          <div class="w-full max-w-md space-y-4">
            <!-- 브라우저 프레임 -->
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <!-- 브라우저 헤더 -->
              <div class="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-400"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div class="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div class="flex-1 mx-4">
                  <div class="bg-white/10 rounded-lg px-3 py-1.5 text-white/60 text-xs">
                    app.mycomp.dev/dashboard
                  </div>
                </div>
              </div>

              <!-- 컴포넌트 미리보기 콘텐츠 -->
              <div class="p-6 space-y-4">
                <!-- 카드 컴포넌트 -->
                <div class="bg-white/10 rounded-xl p-4 border border-white/10">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-300 to-primary-500"></div>
                    <div class="flex-1">
                      <div class="h-3 bg-white/30 rounded w-24 mb-1.5"></div>
                      <div class="h-2 bg-white/20 rounded w-16"></div>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <i class="pi pi-ellipsis-h text-white/60 text-sm"></i>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="h-2 bg-white/20 rounded w-full"></div>
                    <div class="h-2 bg-white/20 rounded w-4/5"></div>
                  </div>
                </div>

                <!-- 버튼 컴포넌트들 -->
                <div class="flex gap-2">
                  <div class="flex-1 h-10 rounded-lg bg-white/90 flex items-center justify-center">
                    <span class="text-primary font-medium text-sm">Primary</span>
                  </div>
                  <div class="flex-1 h-10 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
                    <span class="text-white/80 font-medium text-sm">Secondary</span>
                  </div>
                </div>

                <!-- 인풋 컴포넌트 -->
                <div class="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-3 border border-white/20">
                  <i class="pi pi-search text-white/40"></i>
                  <span class="text-white/40 text-sm">Search components...</span>
                </div>

                <!-- 통계 카드들 -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-white/10 rounded-lg p-3 text-center">
                    <div class="text-white font-bold text-lg">128</div>
                    <div class="text-white/50 text-xs">Components</div>
                  </div>
                  <div class="bg-white/10 rounded-lg p-3 text-center">
                    <div class="text-white font-bold text-lg">24</div>
                    <div class="text-white/50 text-xs">Templates</div>
                  </div>
                  <div class="bg-white/10 rounded-lg p-3 text-center">
                    <div class="text-white font-bold text-lg">∞</div>
                    <div class="text-white/50 text-xs">Possibilities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 텍스트 -->
          <div class="mt-8 text-center">
            <h2 class="text-white text-2xl font-bold mb-2">Build Faster, Ship Smarter</h2>
            <p class="text-white/70">컴포넌트 기반 개발로 생산성을 높이세요</p>
          </div>
        </div>

        <!-- 장식 요소들 -->
        <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -top-20 -left-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl"></div>
      </div>
    </Transition>

    <!-- 오른쪽: 페이지 컨텐츠 -->
    <div 
      class="flex items-center justify-center p-8 transition-all duration-400 ease-out"
      :class="showLeftPanel ? 'w-1/2' : 'w-full'"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// 반응형 브레이크포인트 감지
const showLeftPanel = ref(true)
const lgBreakpoint = 1024

const checkBreakpoint = () => {
  if (import.meta.client) {
    showLeftPanel.value = window.innerWidth >= lgBreakpoint
  }
}

onMounted(() => {
  checkBreakpoint()
  window.addEventListener('resize', checkBreakpoint)
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', checkBreakpoint)
  }
})
</script>

<style lang="scss" scoped>
// 슬라이드 애니메이션
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease-out;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

// 커스텀 duration
.duration-400 {
  transition-duration: 400ms;
}

// PrimeVue 테마 변수 사용
.bg-surface-ground {
  background-color: var(--p-surface-ground);
}

// 그리드 패턴 배경
.grid-pattern {
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>
