<template>
  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    :closable="false"
    :dismissableMask="true"
    :style="isMobile ? 'width: 100vw; height: 100vh; max-width: 100vw; max-height: 100vh; margin: 0;' : 'width: 600px; max-width: calc(100vw - 2rem)'"
    :class="isMobile ? 'search-dialog-mobile' : 'search-dialog'"
    @hide="onHide"
  >
    <template #header>
      <div class="flex items-center gap-3 w-full">
        <div class="flex items-center gap-3 flex-1 relative px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-0 dark:bg-surface-800">
          <i class="pi pi-search text-surface-400 text-lg" />
          <InputText
            ref="searchInputRef"
            v-model="searchQuery"
            placeholder="Currently being prepared..."
            class="flex-1 border-0 focus:ring-0 text-lg bg-transparent placeholder:text-surface-400"
            @keydown.down.prevent="navigateDown"
            @keydown.up.prevent="navigateUp"
            disabled
            @keydown.enter.prevent="selectResult"
            @keydown.esc="close"
            @input="selectedIndex = -1"
          />
        </div>
        <Button
          v-if="isMobile"
          icon="pi pi-times"
          severity="secondary"
          text
          rounded
          size="large"
          class="!w-12 !h-12 !p-0 flex-shrink-0"
          @click="close"
        />
      </div>
    </template>

    <div class="flex flex-col overflow-hidden" :style="isMobile ? 'height: calc(100vh - 80px); max-height: calc(100vh - 80px);' : 'height: 400px; max-height: 400px;'">
      <div v-if="searchQuery.trim() && isLoading" class="flex-1 overflow-y-auto">
        <Skeletons type="searchPages" />
      </div>
      <!-- 검색 결과 영역 -->
      <div v-else-if="searchQuery.trim() && !hasNoResults" class="flex-1 overflow-y-auto">
        <!-- 검색 결과 그룹 -->
        <template v-for="(group, groupIndex) in groupedResults" :key="groupIndex">
          <div v-if="group.results.length > 0" class="mb-4">
            <div class="px-3 py-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">
              {{ group.title }}
            </div>
            <div>
              <div
                v-for="(result, index) in group.results"
                :key="`${groupIndex}-${index}`"
                :ref="el => setResultRef(el, groupIndex, index)"
                class="px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 mb-2 flex items-center gap-3 group"
                :class="isSelected(groupIndex, index) 
                  ? 'bg-primary-50 dark:bg-primary-900/20 shadow-sm' 
                  : 'hover:bg-surface-100 dark:hover:bg-surface-800 hover:shadow-sm'"
                @click="handleResultClick(result)"
                @mouseenter="selectedIndex = getResultIndex(groupIndex, index)"
                @mouseleave="selectedIndex = -1"
              >
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  :class="isSelected(groupIndex, index) 
                    ? 'bg-primary-200 dark:bg-primary-900/50' 
                    : 'bg-surface-200 dark:bg-surface-600'"
                >
                  <i 
                    :class="[
                      result.icon,
                      'text-lg',
                      isSelected(groupIndex, index) 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-surface-500'
                    ]"
                  />
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                  <div 
                    class="text-sm font-semibold mb-0.5"
                    :class="isSelected(groupIndex, index) 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-surface-700 dark:text-surface-200'"
                  >
                    <span v-html="highlightText(result.title, searchQuery)"></span>
                  </div>
                  <div 
                    class="text-xs"
                    :class="isSelected(groupIndex, index) 
                      ? 'text-primary-500 dark:text-primary-500' 
                      : 'text-surface-400'"
                  >
                    {{ result.description }}
                  </div>
                </div>
                <i 
                  v-if="isSelected(groupIndex, index)"
                  class="pi pi-arrow-right text-primary-600 dark:text-primary-400 shrink-0"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 검색어 없을 때 / 검색 결과 없을 때 -->
      <div v-else-if="!searchQuery.trim() || hasNoResults" class="flex flex-col items-center justify-center text-center flex-1 min-h-0">
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          :class="hasNoResults 
            ? 'bg-surface-100 dark:bg-surface-800' 
            : 'bg-primary-50 dark:bg-primary-900/20'"
        >
          <i 
            :class="hasNoResults ? 'pi pi-inbox text-2xl text-surface-400' : 'pi pi-search text-2xl text-primary-500'"
          />
        </div>
        <p class="text-sm text-surface-600 dark:text-surface-400 mb-2">
          {{ hasNoResults ? '검색 결과가 없습니다' : '검색어를 입력하세요' }}
        </p>
        <p class="text-xs text-surface-500 dark:text-surface-500 leading-relaxed">
          {{ hasNoResults ? '&nbsp;' : '페이지, 컴포넌트, 기능 등을 검색할 수 있습니다' }}
        </p>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import type { SearchResult, ResultGroup } from '~/types/search'
import type { Page } from '~/types/component'
import { highlightText } from '~/utils/string'
import { isMac } from '~/utils/device'

const visible = defineModel<boolean>('visible', { default: false })
const { isMobile } = useResponsive()
const searchInputRef = ref<HTMLElement>()
const searchQuery = ref<string>('')
const selectedIndex = ref<number>(-1)
const resultRefs = ref<Map<string, HTMLElement>>(new Map())

// 페이지 데이터 가져오기
const { pages, isLoading } = usePages()

const allResults = computed<SearchResult[]>(() => {
  return pages.value.map((page: Page) => ({
    title: page.name,
    description: page.description || '페이지',
    icon: 'pi pi-file',
    category: '페이지',
    page: page,
    action: () => {
      visible.value = false
    }
  }))
})

// 검색 결과 필터링 및 그룹화
const groupedResults = computed<ResultGroup[]>(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase()
  const filtered = allResults.value.filter(result => 
    result.title.toLowerCase().includes(query) || 
    result.description.toLowerCase().includes(query) ||
    result.category.toLowerCase().includes(query)
  )
  
  // 카테고리별로 그룹화
  const groups = new Map<string, SearchResult[]>()
  filtered.forEach(result => {
    if (!groups.has(result.category)) {
      groups.set(result.category, [])
    }
    groups.get(result.category)!.push(result)
  })
  
  // 그룹을 배열로 변환
  return Array.from(groups.entries()).map(([title, results]) => ({
    title,
    results
  }))
})

// 전체 결과 배열 (네비게이션용)
const flatResults = computed(() => {
  return groupedResults.value.flatMap((group, groupIndex) =>
    group.results.map((result, index) => ({
      result,
      groupIndex,
      index
    }))
  )
})

const hasNoResults = computed(() => {
  return searchQuery.value.trim() && groupedResults.value.every(g => g.results.length === 0)
})

// 결과 인덱스 계산
function getResultIndex(groupIndex: number, resultIndex: number): number {
  let index = 0
  for (let i = 0; i < groupIndex; i++) {
    const group = groupedResults.value[i]
    if (group) {
      index += group.results.length
    }
  }
  return index + resultIndex
}

// 선택 여부 확인
function isSelected(groupIndex: number, resultIndex: number): boolean {
  return selectedIndex.value === getResultIndex(groupIndex, resultIndex)
}

// 결과 ref 설정
function setResultRef(el: any, groupIndex: number, resultIndex: number) {
  if (el) {
    const key = `${groupIndex}-${resultIndex}`
    resultRefs.value.set(key, el)
  }
}

// 네비게이션: 아래로
function navigateDown() {
  if (flatResults.value.length === 0) return
  selectedIndex.value = (selectedIndex.value + 1) % flatResults.value.length
  scrollToSelected()
}

// 네비게이션: 위로
function navigateUp() {
  if (flatResults.value.length === 0) return
  selectedIndex.value = selectedIndex.value <= 0 
    ? flatResults.value.length - 1 
    : selectedIndex.value - 1
  scrollToSelected()
}

// 선택된 항목으로 스크롤
function scrollToSelected() {
  nextTick(() => {
    const selected = flatResults.value[selectedIndex.value]
    if (selected) {
      const key = `${selected.groupIndex}-${selected.index}`
      const element = resultRefs.value.get(key)
      if (element) {
        element.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  })
}

// 결과 선택
function selectResult() {
  if (selectedIndex.value >= 0 && selectedIndex.value < flatResults.value.length) {
    const selected = flatResults.value[selectedIndex.value]
    if (selected) {
      handleResultClick(selected.result)
    }
  }
}

// InputText 포커스 헬퍼 함수
function focusInput(): void {
  nextTick(() => {
    if (searchInputRef.value) {
      const input = searchInputRef.value as any
      if (input.$el?.querySelector) {
        const inputElement = input.$el.querySelector('input') || input.$el
        inputElement.focus({ preventScroll: true })
      } else {
        input.focus?.({ preventScroll: true })
      }
    }
  })
}

// 결과 클릭 처리
function handleResultClick(result: SearchResult) {
  // [개발예정] 검색 페이지 매칭 기능은 추후 구현 예정
}

// 닫기
function close() {
  visible.value = false
}

// 숨김 처리
function onHide() {
  searchQuery.value = ''
  selectedIndex.value = -1
  resultRefs.value.clear()
}

// 모달이 열릴 때 포커스
watch(visible, (newVal) => {
  if (newVal) {
    focusInput()
  } else {
    searchQuery.value = ''
    selectedIndex.value = -1
  }
})

// 키보드 단축키 핸들러
const handleKeyDown = (e: KeyboardEvent): void => {
  if (!visible.value) {
    const isMacKey = isMac()
    const isCtrlOrCmd = isMacKey ? e.metaKey : e.ctrlKey
    
    if (isCtrlOrCmd && e.key === 'k') {
      e.preventDefault()
      visible.value = true
      focusInput()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})


</script>

<style lang="scss" scoped>
:deep(.p-dialog) {
  margin: 1rem;
  
  @media (min-width: 640px) {
    margin: 0;
  }
  
  .p-dialog-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgb(var(--surface-200));
  }
  
  .p-dialog-header-close {
    display: none;
  }
}

:deep(.search-dialog-mobile) {
  .p-dialog {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
    position: fixed;
    top: 0 !important;
    left: 0 !important;
    transform: none !important;
  }
  
  .p-dialog-content {
    height: calc(100vh - 80px);
    padding: 0;
  }
  
  .p-dialog-header {
    border-radius: 0;
    padding: 1rem;
  }
}

.dark :deep(.p-dialog-header) {
  border-bottom-color: rgb(var(--surface-700));
}

kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.6875rem;
}

// 검색 결과 스크롤바 스타일
:deep(.overflow-y-auto) {
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgb(var(--surface-300));
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--surface-400));
  }
}

.dark :deep(.overflow-y-auto) {
  &::-webkit-scrollbar-thumb {
    background: rgb(var(--surface-600));
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--surface-500));
  }
}
</style>