<template>
  <div 
    class="h-full bg-surface-0 dark:bg-surface-800 border-l border-surface-200 dark:border-surface-700 flex flex-col shrink-0"
    :class="[
      !props.isResponsiveChange && 'transition-all duration-300',
      isMobile 
        ? (isOpen ? 'fixed top-0 bottom-0 right-0 z-50 w-full overflow-hidden' : 'fixed top-0 bottom-0 -right-full z-50 w-full') 
        : (isOpen ? 'relative w-[300px] min-w-[300px] overflow-visible' : 'relative w-0 min-w-0 border-l-0 overflow-visible')
    ]"
  >

    <!-- 메인 패널: 페이지 + 트리 + 옵션 -->
    <div class="flex flex-col h-full overflow-hidden relative">
      <!-- 트리 뷰일 때: 전체 트리 표시 -->
      <div v-if="props.showTreeView && pages && pages.length > 0" class="flex-1 overflow-y-auto p-4 relative">
        <!-- 로딩 중일 때 스켈레톤 표시 -->
        <Skeletons v-if="currentPage && props.isPageLoading" type="options" />
        <template v-else>
          <Transition name="fade">
            <div v-if="!currentPage" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
              <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-3 shrink-0">
                <i class="pi pi-sitemap text-xl text-surface-400" />
              </div>
              <h4 class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1 whitespace-nowrap">페이지 추가</h4>
              <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap">페이지를 선택하면 여기에 표시됩니다</p>
            </div>
          </Transition>
          <Tree 
            v-if="currentPage"
            :value="treeNodes" 
            class="w-full text-sm"
            selection-mode="single"
            :meta-key-selection="false"
            @node-select="handleTreeNodeSelect"
          >
          <template #default="slotProps">
            <div class="flex items-center gap-2 py-1">
              <!-- 페이지 노드가 아닌 경우에만 아이콘 표시 -->
              <div
                v-if="slotProps.node.data?.type !== 'page'"
                class="w-5 h-5 rounded bg-surface-200 dark:bg-surface-600 flex items-center justify-center shrink-0"
              >
                <component
                  v-if="renderHeadingIcon(slotProps.node.data?.item?.type)"
                  :is="renderHeadingIcon(slotProps.node.data?.item?.type)"
                  class="w-3 h-3 text-surface-600 dark:text-surface-300"
                />
                <i
                  v-else-if="slotProps.node.data?.type"
                  :class="getComponentIcon(slotProps.node.data.type)"
                  class="text-xs text-surface-600 dark:text-surface-300"
                />
              </div>
              <!-- 제목: 페이지/컴포넌트에 따라 색상 분기 -->
              <span
                class="text-sm flex-1"
                :class="slotProps.node.data?.type === 'page' && slotProps.node.data?.page?.id === currentPage?.id
                  ? 'text-primary-600 dark:text-primary-300 font-semibold'
                  : 'text-surface-700 dark:text-surface-200'"
              >
                {{ slotProps.node.label }}
              </span>
              <!-- 이 페이지에 DB에 없는(저장 안 된) 아이템이 하나라도 있으면 제목에 표시 -->
              <i
                v-if="slotProps.node.data?.type === 'page' && slotProps.node.data?.hasUnsavedItems"
                class="pi pi-circle-fill text-[0.5rem] text-warning-500 dark:text-warning-400 shrink-0"
                v-tooltip.top="'변경사항이 있습니다'"
              />

              <!-- 컴포넌트 중 DB에 저장되지 않은 아이템 표시 -->
              <i
                v-if="slotProps.node.data?.type !== 'page' && slotProps.node.data?.isSaved === false"
                class="pi pi-circle-fill text-[0.5rem] text-warning-500 dark:text-warning-400 shrink-0"
                v-tooltip.top="'변경사항이 있습니다'"
              />
            </div>
          </template>
        </Tree>
        </template>
      </div>
      
      <!-- 일반 뷰일 때: 페이지 헤더 + 트리 영역 -->
      <template v-else>
        <!-- 현재 페이지 헤더 -->
        <div v-if="currentPage" class="px-4 py-3 text-sm border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
          <i class="pi pi-file text-primary-500 shrink-0" />
          <div class="flex-1 min-w-0">
            <span
              class="block w-full text-sm font-semibold text-surface-700 dark:text-surface-200 truncate px-2"
            >
              {{ currentPage?.name }}
            </span>
          </div>
          <div class="flex items-center gap-1 shrink-0">
          <Button
            icon="pi pi-pencil"
            severity="secondary"
            text
            rounded
            size="small"
            class="w-6 h-6 !p-0"
            @mousedown.prevent
            @click.stop="handleOpenEditPageModal"
          />
          <Button
            :icon="props.isSaving ? undefined : 'pi pi-save'"
            severity="secondary"
            text
            rounded
            size="small"
            class="w-6 h-6 !p-0"
            :disabled="!currentPage || canvasItems.length === 0 || props.isSaving"
            @click="$emit('savePage')"
          >
            <i v-if="props.isSaving" class="pi pi-spin pi-spinner text-sm" />
          </Button>
          <Button
            :icon="props.isDeleting ? undefined : 'pi pi-trash'"
            severity="danger"
            text
            rounded
            size="small"
            class="w-6 h-6 !p-0"
            :disabled="!currentPage || props.isDeleting"
            @click="$emit('deletePage')"
          >
            <i v-if="props.isDeleting" class="pi pi-spin pi-spinner text-sm" />
          </Button>
          </div>
        </div>
        
        <!-- 트리 영역 -->
        <div class="flex-1 overflow-y-auto p-2 relative">
          <!-- 로딩 중일 때 스켈레톤 표시 -->
          <Skeletons v-if="props.isPageLoading" type="options" />
          <template v-else>
            <Transition name="fade">
              <div v-if="!currentPage" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-3 shrink-0">
                  <i class="pi pi-sitemap text-xl text-surface-400" />
                </div>
                <h4 class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1 whitespace-nowrap">페이지 추가</h4>
                <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap">페이지를 선택하면 여기에 표시됩니다</p>
              </div>
            </Transition>
            <Transition name="fade">
              <!-- 기존 Draggable 뷰 -->
              <Draggable
                v-if="currentPage && canvasItems.length > 0"
                :model-value="canvasItems"
                item-key="uid"
                @update:model-value="$emit('update:canvasItems', $event)"
              >
              <template #item="{ element, index }">
                <div class="py-1.5 relative">
                  <!-- 트리 세로선: 마지막 전까지는 전체, 마지막은 절반만 -->
                  <div
                    v-if="index < canvasItems.length - 1"
                    class="absolute left-4 top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-700"
                  />
                  <div
                    v-else
                    class="absolute left-4 top-0 w-px bg-surface-200 dark:bg-surface-700"
                    style="height: 50%;"
                  />
                  <div
                    class="relative flex items-center gap-2 pl-8 pr-3 rounded-lg transition-all text-surface-700 dark:text-surface-300 group cursor-pointer"
                  >
                    <!-- 트리 가로선 -->
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-surface-200 dark:bg-surface-700" />
                    <!-- 컴포넌트 아이콘 배경 -->
                    <div class="relative z-10 w-6 h-6 rounded bg-surface-200 dark:bg-surface-600 flex items-center justify-center shrink-0">
                      <component
                        v-if="renderHeadingIcon(element.type)"
                        :is="renderHeadingIcon(element.type)"
                        class="w-3 h-3 text-surface-600 dark:text-surface-300"
                      />
                      <i v-else :class="getComponentIcon(element.type)" class="text-xs text-surface-600 dark:text-surface-300" />
                    </div>
                    <span
                      class="text-sm flex-1 truncate"
                      @click="handleSelectItem(index)"
                    >
                      {{ getComponentLabel(element) }}
                    </span>
                    <div class="flex items-center gap-1" @click.stop>
                    <Button
                        icon="pi pi-copy"
                      severity="secondary"
                      text
                      rounded
                      size="small"
                      class="w-6 h-6 !p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="handleCopyItem(index)"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      size="small"
                      class="w-6 h-6 !p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="handleDeleteItem(index)"
                    />
                    </div>
                  </div>
                </div>
              </template>
            </Draggable>
              <div v-else-if="currentPage" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-3 shrink-0">
                  <i class="pi pi-sitemap text-xl text-surface-400" />
                </div>
                <h4 class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1 whitespace-nowrap">컴포넌트가 없습니다</h4>
              </div>
            </Transition>
          </template>
        </div>
        
      </template>
    </div>

    <!-- 옵션 패널 (선택된 아이템이 있을 때만 표시) -->
    <ElementOptions
      @update="(updatedItem) => handleOptionsUpdate(updatedItem)"
      :current-page="currentPage"
      :selected-index="selectedIndex"
      :selected-item="selectedItem"
      :canvas-items="canvasItems"
      @close-options="$emit('closeOptions')"
    />
  </div>
</template>

<script lang="ts" setup>

import { H1Icon, H2Icon, H3Icon } from '@heroicons/vue/24/outline'
import type { Page, CanvasItem } from '~/types/component'
import draggable from 'vuedraggable'
import { usePanelStore } from '@/stores/panel'

interface OptionsProps {
  isOpen: boolean
  isMobile: boolean
  isPreviewMode: boolean
  currentPage: Page | null
  canvasItems: CanvasItem[]
  selectedIndex: number | null
  selectedItem: CanvasItem | null
  isResponsiveChange?: boolean
  savedPagesData?: Record<string, CanvasItem[]>
  pages?: Page[]
  isSaving?: boolean
  isDeleting?: boolean
  isPageLoading?: boolean
  showTreeView: boolean
}

interface OptionsEmits {
  (e: 'update:isOpen', value: boolean): void
  (e: 'update:canvasItems', items: CanvasItem[]): void
  (e: 'update:selectedIndex', index: number | null): void
  (e: 'savePage'): void
  (e: 'deletePage'): void
  (e: 'closeOptions'): void
  (e: 'updatePageName', name: string): void
  (e: 'editPage', page: Page): void
  (e: 'update:showTreeView', value: boolean): void
}

const Draggable = draggable

const props = defineProps<OptionsProps>()
const emit = defineEmits<OptionsEmits>()

const panelStore = usePanelStore()
const { getComponentIcon, getComponentLabel, generateUid } = useElements()
const { isMobile: isMobileResponsive } = useResponsive()
const { cloneCanvasItems } = useCanvas()

// 컴포넌트 선택 로직 (내부에서 처리)
const handleSelectItem = (index: number) => {
  emit('update:selectedIndex', index)
  
  if (isMobileResponsive.value) {
    panelStore.openMobileMenu()
    panelStore.openPanel('options')
  }
}

// 컴포넌트 복사 로직 (내부에서 처리)
const handleCopyItem = (index: number) => {
  if (!props.canvasItems || !props.canvasItems[index]) return
  
  const originalItem = props.canvasItems[index]
  const copiedItems = cloneCanvasItems([originalItem])
  
  if (!copiedItems || copiedItems.length === 0) return
  
  const copiedItem = copiedItems[0]
  if (!copiedItem) return
  
  copiedItem.id = generateUid()
  const updatedItems = [...props.canvasItems]
  updatedItems.splice(index + 1, 0, copiedItem)
  emit('update:canvasItems', updatedItems)
}

// 옵션 업데이트 핸들러 (id 기반으로 특정 아이템만 업데이트)
const handleOptionsUpdate = (updatedItem: CanvasItem) => {
  if (!updatedItem || !updatedItem.id) return
  // 모든 아이템을 깊은 복사하여 참조 문제 방지
  const updatedItems = props.canvasItems.map((item: CanvasItem) => {
    if (item.id === updatedItem.id) {
      return updatedItem // 이미 깊은 복사된 아이템
    }
    // 나머지 아이템도 깊은 복사하여 참조 공유 방지
    const cloned = cloneCanvasItems([item])
    return cloned[0] || item
  })
  emit('update:canvasItems', updatedItems)
}

// 컴포넌트 삭제 로직 (내부에서 처리)
const handleDeleteItem = (index: number) => {
  if (!props.canvasItems) return
  
  const updatedItems = [...props.canvasItems]
  updatedItems.splice(index, 1)
  emit('update:canvasItems', updatedItems)
  
  // 선택된 인덱스 업데이트
  if (props.selectedIndex === index) {
    emit('update:selectedIndex', null)
  } else if (props.selectedIndex !== null && props.selectedIndex > index) {
    emit('update:selectedIndex', props.selectedIndex - 1)
  }
}

const renderHeadingIcon = (type: string) => {
  if (type === 'heading1') return H1Icon
  if (type === 'heading2') return H2Icon
  if (type === 'heading3') return H3Icon
  return null
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      emit('update:showTreeView', false)
    }
  }
)

watch(
  () => props.currentPage?.id,
  () => {
    emit('update:showTreeView', false)
  }
)

const treeNodes = computed(() => {
  if (!props.pages) return []

  // 모든 페이지를 트리 노드로 변환
  return props.pages.map((page) => {
    // DB에 저장된 데이터
    const savedItems = props.savedPagesData?.[page.id] || []

    // 현재 편집 중인 데이터 (현재 선택된 페이지인 경우)
    const isCurrentPage = props.currentPage?.id === page.id
    const currentItems = isCurrentPage ? (props.canvasItems || []) : []

    // 현재 트리에 보여줄 아이템 (현재 페이지면 편집 중, 아니면 저장된 데이터)
    const itemsToShow = isCurrentPage && currentItems.length > 0 ? currentItems : savedItems

    // 컴포넌트가 있는 경우에만 children 추가
    const children = itemsToShow.length > 0 ? itemsToShow.map((item, index) => {
      // 이 아이템이 DB에 저장된 아이템인지 확인
      const isSaved = savedItems.some((savedItem: any) => savedItem.id === item.id)

      const node: any = {
        key: item.id,
        label: getComponentLabel(item),
        icon: '', // PrimeVue 기본 아이콘 방지 (커스텀 템플릿에서 직접 렌더링)
        data: { item, index, pageId: page.id, type: item.type, isSaved } // 저장 여부 포함
      }

      // group이나 grid의 경우 children 추가
      if ((item.type === 'group' || item.type === 'grid') && item.items) {
        if (item.type === 'group') {
          // group: items는 배열
          const groupItems = (item.items as CanvasItem[]) || []
          node.children = groupItems.map((child: CanvasItem, childIndex: number) => {
            // group 내 자식이 DB에 저장되어 있는지 확인
            const savedGroup = savedItems.find((s: any) => s.id === item.id)
            const savedGroupItems = (savedGroup?.items as CanvasItem[]) || []
            const childIsSaved = !!savedGroupItems.some((savedChild: any) => savedChild.id === child.id)

            return {
              key: child.id,
              label: getComponentLabel(child),
              icon: '', // PrimeVue 기본 아이콘 방지
              data: { item: child, index: childIndex, parentIndex: index, pageId: page.id, type: child.type, isSaved: childIsSaved }
            }
          })
        } else if (item.type === 'grid') {
          // grid: items는 배열의 배열 (각 셀)
          const gridItems = (item.items as CanvasItem[][]) || []
          node.children = gridItems
            .map((cellItems: CanvasItem[], cellIndex: number) => {
              if (!cellItems || cellItems.length === 0) return null
              const cellItem = cellItems[0] // 각 셀에는 하나만
              if (!cellItem) return null

              // grid 셀 아이템이 DB에 저장되어 있는지 확인
              const savedGrid = savedItems.find((s: any) => s.id === item.id)
              const savedGridItems = (savedGrid?.items as CanvasItem[][]) || []
              const cellIsSaved = !!savedGridItems[cellIndex]?.some((savedCellItem: any) => savedCellItem.id === cellItem.id)

              return {
                key: `${item.id}-cell-${cellIndex}`,
                label: `셀 ${cellIndex + 1}: ${getComponentLabel(cellItem)}`,
                icon: '', // PrimeVue 기본 아이콘 방지
                data: { item: cellItem, cellIndex, parentIndex: index, pageId: page.id, type: cellItem.type || '', isSaved: cellIsSaved }
              }
            })
            .filter(Boolean)
        }
      }

      return node
    }) : []

    // 표시할 컴포넌트 개수 (저장된 것과 현재 편집 중인 것 중 더 큰 값)
    const displayCount = isCurrentPage && currentItems.length > 0
      ? currentItems.length
      : savedItems.length

    // 컴포넌트가 있는 페이지만 표시
    if (displayCount === 0) return null

    // 이 페이지에서 "DB에 없는(저장 안 된)" 아이템이 하나라도 있는지 여부
    const hasUnsavedItems =
      children.some((child: any) => child.data?.isSaved === false) ||
      children.some((child: any) =>
        Array.isArray(child.children) &&
        child.children.some((grandChild: any) => grandChild.data?.isSaved === false)
      )

    return {
      key: page.id,
      label: page.name,
      icon: '',
      data: { type: 'page', page, hasUnsavedItems },
      children
    }
  }).filter((node): node is NonNullable<typeof node> => node !== null) // null 제거
})

const handleTreeNodeSelect = (event: any) => {
  if (!event.node?.data) return
  
  if (event.node.data.type === 'page') return
  
  const isDifferentPage = event.node.data.pageId && props.currentPage?.id !== event.node.data.pageId
  if (isDifferentPage) return
  
  const index = event.node.data.parentIndex !== undefined 
    ? event.node.data.parentIndex 
    : event.node.data.index
    
  if (index !== undefined) {
    handleSelectItem(index)
  }
}

const handleOpenEditPageModal = () => {
  if (!props.currentPage) return
  emit('editPage', props.currentPage)
}
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

:deep(.p-tree) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  
  .p-tree-container {
    background: transparent !important;
    padding: 0 !important;
  }
  
  .p-treenode {
    background: transparent !important;
  }
  
  .p-treenode-content {
    background: transparent !important;
    padding: 0.25rem 0 !important;
    
    .p-treenode-icon {
      display: none !important;
    }
  }
}

.button-group-container {
  gap: 0;
  .button-group-top {
    border-radius: 0.375rem 0.375rem 0 0 !important;
  }
  .button-group-bottom {
    border-radius: 0 0 0.375rem 0.375rem !important;
  }
  :deep(.p-button) {
    border: none !important;
  }
}
</style>