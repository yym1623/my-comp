<template>
  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    :closable="false"
    :dismissableMask="true"
    :style="{ width: '600px', maxWidth: 'calc(100vw - 2rem)' }"
    class="search-dialog"
    @hide="onHide"
  >
    <template #header>
      <div class="flex items-center gap-3 w-full relative px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-0 dark:bg-surface-800">
        <i class="pi pi-search text-surface-400 text-lg" />
        <InputText
          ref="searchInputRef"
          v-model="searchQuery"
          placeholder="Search..."
          class="flex-1 border-0 focus:ring-0 text-lg bg-transparent placeholder:text-surface-400"
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter.prevent="selectResult"
          @keydown.esc="close"
          @input="selectedIndex = -1"
        />
        <Button
          v-if="searchQuery"
          icon="pi pi-times"
          severity="secondary"
          text
          rounded
          size="small"
          class="!w-6 !h-6 !p-0"
          @click="clearSearch"
        />
      </div>
    </template>

    <div class="flex flex-col min-h-[400px] max-h-[500px]">
      <!-- 검색 결과 영역 -->
      <div v-if="searchQuery.trim() && !hasNoResults" class="flex-1 overflow-y-auto">
        <!-- 검색 결과 그룹 -->
        <template v-for="(group, groupIndex) in groupedResults" :key="groupIndex">
          <div v-if="group.results.length > 0" class="mb-4">
            <div class="px-4 py-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">
              {{ group.title }}
            </div>
            <div class="px-2">
              <div
                v-for="(result, index) in group.results"
                :key="`${groupIndex}-${index}`"
                :ref="el => setResultRef(el, groupIndex, index)"
                class="px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 mb-1 flex items-start gap-3 group"
                :class="isSelected(groupIndex, index) 
                  ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-sm' 
                  : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-900 dark:text-surface-100 hover:shadow-sm'"
                @click="handleResultClick(result)"
                @mouseenter="selectedIndex = getResultIndex(groupIndex, index)"
              >
                <i 
                  :class="[
                    result.icon,
                    'mt-0.5 shrink-0',
                    isSelected(groupIndex, index) 
                      ? 'text-white' 
                      : 'text-primary-500 dark:text-primary-400'
                  ]"
                />
                <div class="flex-1 min-w-0">
                  <div 
                    class="font-semibold text-sm mb-0.5"
                    :class="isSelected(groupIndex, index) 
                      ? 'text-white' 
                      : 'text-surface-900 dark:text-surface-100'"
                  >
                    <span v-html="highlightText(result.title, searchQuery)"></span>
                  </div>
                  <div 
                    class="text-xs leading-relaxed line-clamp-2"
                    :class="isSelected(groupIndex, index) 
                      ? 'text-white/80' 
                      : 'text-surface-600 dark:text-surface-400'"
                  >
                    {{ result.description }}
                  </div>
                </div>
                <i 
                  v-if="isSelected(groupIndex, index)"
                  class="pi pi-arrow-left rotate-90 text-white mt-0.5 shrink-0"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 검색어 없을 때 / 검색 결과 없을 때 -->
      <div v-if="!searchQuery.trim() || hasNoResults" class="flex flex-col items-center justify-center text-center flex-1">
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

const visible = defineModel<boolean>('visible', { default: false })
const searchInputRef = ref<HTMLElement>()
const searchQuery = ref('')
const selectedIndex = ref(-1)
const resultRefs = ref<Map<string, HTMLElement>>(new Map())

// Mac 감지
const isMac = ref(false)

// 검색 결과 데이터
// ex) [{ title: '페이지 1', description: '페이지 1 설명', icon: 'pi pi-file', category: '페이지' }]
const allResults: SearchResult[] = []

// 검색 결과 필터링 및 그룹화
const groupedResults = computed<ResultGroup[]>(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase()
  const filtered = allResults.filter(result => 
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

// 텍스트 하이라이트
function highlightText(text: string, query: string): string {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<u>$1</u>')
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

// 검색어 클리어
function clearSearch() {
  searchQuery.value = ''
  selectedIndex.value = -1
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
  if (result.action) {
    result.action()
  }
  close()
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

// 키보드 단축키 설정
onMounted(() => {
  // Mac 감지
  isMac.value = /Mac|iPhone|iPod|iPad/i.test(navigator.platform) || 
                /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
  
  const handleKeyDown = (e: KeyboardEvent) => {
    // 모달이 열려있을 때만 처리
    if (!visible.value) {
      const isMacKey = isMac.value
      const isCtrlOrCmd = isMacKey ? e.metaKey : e.ctrlKey
      
      if (isCtrlOrCmd && e.key === 'k') {
        e.preventDefault()
        visible.value = true
        
        // 모달이 열릴 때 검색 입력창에 포커스
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
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})

// 모달이 열릴 때 포커스
watch(visible, (newVal) => {
  if (newVal) {
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
  } else {
    searchQuery.value = ''
    selectedIndex.value = -1
  }
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
  
  .p-dialog-content {
    padding: 0;
    overflow: hidden;
  }
  
  // 모바일에서 입력 필드 포커스 시 스크롤 방지
  @media (max-width: 640px) {
    position: fixed;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin: 0 !important;
  }
  
  .p-dialog-header-close {
    display: none;
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

