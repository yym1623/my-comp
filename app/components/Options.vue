<template>
  <aside 
    class="h-full bg-surface-0 dark:bg-surface-800 border-l border-surface-200 dark:border-surface-700 flex flex-col shrink-0"
    :class="[
      !props.isResponsiveChange && 'transition-all duration-300',
      isMobile 
        ? (isOpen ? 'fixed top-0 bottom-0 right-0 z-50 w-full overflow-hidden' : 'fixed top-0 bottom-0 -right-full z-50 w-full') 
        : (isOpen ? 'relative w-[300px] min-w-[300px] overflow-visible' : 'relative w-0 min-w-0 border-l-0 overflow-visible')
    ]"
  >
    <!-- 최상단 버튼 바 (데스크탑만) -->
    <div v-if="!isMobile" class="absolute top-2 -left-[52px] flex flex-col gap-2 z-20">
      <Button
        icon="pi pi-list"
        :severity="!showTreeView ? 'primary' : 'secondary'"
        text
        rounded
        size="small"
        class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border shadow-sm"
        :class="!showTreeView 
          ? 'border-primary-500 dark:border-primary-400' 
          : 'border-surface-200 dark:border-surface-700'"
        v-tooltip.left="'옵션 편집 모드'"
        @click="showTreeView = false"
      />
      <Button
        icon="pi pi-sitemap"
        :severity="showTreeView ? 'primary' : 'secondary'"
        text
        rounded
        size="small"
        class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border shadow-sm"
        :class="showTreeView 
          ? 'border-primary-500 dark:border-primary-400' 
          : 'border-surface-200 dark:border-surface-700'"
        :disabled="!currentPage || !canvasItems || canvasItems.length === 0"
        v-tooltip.left="'트리 뷰'"
        @click="showTreeView = true"
      />
    </div>

    <!-- 메인 패널: 페이지 + 트리 + 옵션 -->
    <div class="flex flex-col h-full overflow-hidden relative">
      <!-- 트리 뷰일 때: 전체 트리 표시 -->
      <div v-if="showTreeView && pages && pages.length > 0" class="flex-1 overflow-y-auto p-4 relative">
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
            <div class="flex items_center gap-2 py-1">
              <!-- 페이지 노드가 아닌 경우에만 아이콘 표시 -->
              <div v-if="slotProps.node.data?.type !== 'page'" class="w-5 h-5 rounded bg-surface-200 dark:bg-surface-600 flex items-center justify-center shrink-0">
                <template v-if="slotProps.node.data?.item?.type === 'heading1'">
                  <H1Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                </template>
                <template v-else-if="slotProps.node.data?.item?.type === 'heading2'">
                  <H2Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                </template>
                <template v-else-if="slotProps.node.data?.item?.type === 'heading3'">
                  <H3Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                </template>
                <i v-else-if="slotProps.node.data?.type" :class="getComponentIcon(slotProps.node.data.type)" class="text-xs text-surface-600 dark:text-surface-300" />
              </div>
              <span class="text-sm text-surface-700 dark:text-surface-200">{{ slotProps.node.label }}</span>
            </div>
          </template>
        </Tree>
      </div>
      
      <!-- 일반 뷰일 때: 페이지 헤더 + 트리 영역 -->
      <template v-else>
        <!-- 현재 페이지 헤더 -->
        <div v-if="currentPage" class="px-4 py-3 text-sm border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
          <i class="pi pi-file text-primary-500" />
          <InputText
            v-if="isEditingPageName"
            v-model="editingPageName"
            class="flex-1 text-sm font-semibold border-primary-300 dark:border-primary-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @blur="handleSavePageName"
            @keyup.enter="handleSavePageName"
            @keyup.esc="handleCancelEditPageName"
            autofocus
          />
          <span v-else class="text-sm font-semibold text-surface-700 dark:text-surface-200 flex-1">{{ currentPage?.name }}</span>
          <Button
            :icon="isEditingPageName ? 'pi pi-check' : 'pi pi-pencil'"
            :severity="isEditingPageName ? 'success' : 'secondary'"
            text
            rounded
            size="small"
            class="w-6 h-6 !p-0 shrink-0"
            :disabled="isPreviewMode"
            @mousedown.prevent
           
            @click.stop="isEditingPageName ? handleSavePageName() : handleStartEditPageName()"
          />
          
          <Button
            icon="pi pi-save"
            severity="secondary"
            text
            rounded
            size="small"
            class="w-6 h-6 !p-0 shrink-0"
            :disabled="isPreviewMode || !currentPage || canvasItems.length === 0"
        
            @click="$emit('savePage')"
          />
          
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            size="small"
            class="w-6 h-6 !p-0 shrink-0"
            :disabled="isPreviewMode"
            
            @click="$emit('deletePage')"
          />
        </div>
        
        <!-- 트리 영역 -->
        <div class="flex-1 overflow-y-auto p-2 relative">
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
              :disabled="isPreviewMode"
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
                    class="relative flex items-center gap-2 pl-8 pr-3 rounded-lg transition-all text-surface-700 dark:text-surface-300 group cursor-pointer" :class="isPreviewMode ? 'opacity-50 pointer-events-none' : ''"
                    
                  >
                    <!-- 트리 가로선 -->
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-surface-200 dark:bg-surface-700" />
                    <!-- 컴포넌트 아이콘 배경 -->
                    <div class="relative z-10 w-6 h-6 rounded bg-surface-200 dark:bg-surface-600 flex items-center justify-center shrink-0">
                      <template v-if="element.type === 'heading1'">
                        <H1Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                      </template>
                      <template v-else-if="element.type === 'heading2'">
                        <H2Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                      </template>
                      <template v-else-if="element.type === 'heading3'">
                        <H3Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                      </template>
                      <i v-else :class="getComponentIcon(element.type)" class="text-xs text-surface-600 dark:text-surface-300" />
                    </div>
                    <span class="text-sm flex-1 truncate">{{ getComponentLabel(element) }}</span>
                    <Button
                      icon="pi pi-pencil"
                      severity="secondary"
                      text
                      rounded
                      size="small"
                      class="w-6 h-6 !p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      @click.stop="$emit('selectItem', index)"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      size="small"
                      class="w-6 h-6 !p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      @click.stop="$emit('deleteItem', index)"
                    />
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
        </div>
        
      </template>
    </div>

    <!-- 옵션 패널 (선택된 아이템이 있을 때만 표시) -->
    <ElementOptions
      @update="$emit('update:canvasItems', [...canvasItems])"
      :current-page="currentPage"
      :selected-index="selectedIndex"
      :selected-item="selectedItem"
      @close-options="$emit('closeOptions')"
    />
  </aside>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import type { OptionsProps, OptionsEmits } from '~/types/options'
import { useElements } from '~/composables/useElements'
import { H1Icon, H2Icon, H3Icon } from '@heroicons/vue/24/outline'
import draggable from 'vuedraggable'

const Draggable = draggable

type Props = OptionsProps
type Emits = OptionsEmits

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getComponentIcon, getComponentLabel } = useElements()

const isEditingPageName = ref(false)
const editingPageName = ref('')
const showTreeView = ref(false) // 기본값: 옵션 편집 모드

// 트리 뷰 활성화 조건: 저장된 데이터가 있거나 현재 페이지에 컴포넌트가 있으면
const hasSavedData = computed(() => {
  if (!props.pages) return false
  
  // 모든 페이지 중 하나라도 저장된 데이터가 있는지 확인
  const hasAnySavedData = props.savedPagesData && props.pages.some(page => {
    const savedItems = props.savedPagesData?.[page.id]
    return savedItems && savedItems.length > 0
  })
  
  // 현재 페이지에 컴포넌트가 있는지 확인
  const hasCurrentPageData = props.currentPage && props.canvasItems && props.canvasItems.length > 0
  
  return hasAnySavedData || hasCurrentPageData
})

// 항상 기본은 옵션 편집 모드가 되도록 여러 상황에서 showTreeView를 초기화
onMounted(() => {
  showTreeView.value = false
})

// 패널이 열릴 때마다 옵션 편집 모드를 기본으로
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      showTreeView.value = false
    }
  }
)

// 페이지 변경 시에도 옵션 편집 모드 유지 (트리뷰로 자동 전환하지 않음)
watch(
  () => props.currentPage?.id,
  () => {
    showTreeView.value = false
  }
)

// 모든 페이지의 저장된 컴포넌트 + 현재 편집 중인 컴포넌트를 Tree 형식으로 변환
const treeNodes = computed(() => {
  if (!props.pages) return []
  
  // 모든 페이지를 트리 노드로 변환
  return props.pages.map((page) => {
    // 저장된 데이터
    const savedItems = props.savedPagesData?.[page.id] || []
    
    // 현재 편집 중인 데이터 (현재 선택된 페이지인 경우)
    const isCurrentPage = props.currentPage?.id === page.id
    const currentItems = isCurrentPage ? (props.canvasItems || []) : []
    
    // 저장된 데이터와 현재 편집 중인 데이터 중 더 최신 것 사용
    // 현재 페이지면 편집 중인 데이터를, 아니면 저장된 데이터를 사용
    const itemsToShow = isCurrentPage && currentItems.length > 0 ? currentItems : savedItems
    
    // 컴포넌트가 있는 경우에만 children 추가
    const children = itemsToShow.length > 0 ? itemsToShow.map((item, index) => {
      const node: any = {
        key: item.uid,
        label: getComponentLabel(item),
        icon: '', // PrimeVue 기본 아이콘 방지 (커스텀 템플릿에서 직접 렌더링)
        data: { item, index, pageId: page.id, type: item.type } // 타입 정보를 data에 저장
      }
      
      // group이나 grid의 경우 children 추가
      if ((item.type === 'group' || item.type === 'grid') && item.props.items) {
        if (item.type === 'group') {
          // group: items는 배열
          node.children = item.props.items.map((child: any, childIndex: number) => ({
            key: child.uid,
            label: getComponentLabel(child),
            icon: '', // PrimeVue 기본 아이콘 방지
            data: { item: child, index: childIndex, parentIndex: index, pageId: page.id, type: child.type }
          }))
        } else if (item.type === 'grid') {
          // grid: items는 배열의 배열 (각 셀)
          node.children = item.props.items
            .map((cellItems: any[], cellIndex: number) => {
              if (!cellItems || cellItems.length === 0) return null
              const cellItem = cellItems[0] // 각 셀에는 하나만
              return {
                key: `${item.uid}-cell-${cellIndex}`,
                label: `셀 ${cellIndex + 1}: ${getComponentLabel(cellItem)}`,
                icon: '', // PrimeVue 기본 아이콘 방지
                data: { item: cellItem, cellIndex, parentIndex: index, pageId: page.id, type: cellItem.type }
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
    
    return {
      key: page.id,
      label: page.name,
      icon: '',
      data: { type: 'page', page },
      children
    }
  }).filter((node): node is NonNullable<typeof node> => node !== null) // null 제거
})

const handleTreeNodeSelect = (event: any) => {
  if (event.node?.data) {
    // 페이지 노드는 선택하지 않음 (보기 전용)
    if (event.node.data.type === 'page') {
      return
    }
    
    // group이나 grid 내부의 아이템인 경우
    if (event.node.data.parentIndex !== undefined) {
      // 부모의 인덱스를 전달 (실제로는 부모를 선택)
      // 하지만 다른 페이지의 컴포넌트인 경우 현재 페이지로 전환 필요
      if (event.node.data.pageId && props.currentPage?.id !== event.node.data.pageId) {
        // 다른 페이지의 컴포넌트는 선택만 하고 페이지 전환은 하지 않음 (보기 전용)
        return
      }
      emit('selectItem', event.node.data.parentIndex)
    } else if (event.node.data.index !== undefined) {
      // 일반 컴포넌트인 경우
      // 다른 페이지의 컴포넌트는 선택하지 않음 (보기 전용)
      if (event.node.data.pageId && props.currentPage?.id !== event.node.data.pageId) {
        return
      }
      emit('selectItem', event.node.data.index)
    }
  }
}

const handleStartEditPageName = () => {
  if (!props.currentPage) return
  editingPageName.value = props.currentPage.name
  isEditingPageName.value = true
}

const handleSavePageName = () => {
  if (!props.currentPage) return
  const trimmedName = editingPageName.value.trim()
  if (trimmedName) {
    emit('updatePageName', trimmedName)
  }
  isEditingPageName.value = false
}

const handleCancelEditPageName = () => {
  isEditingPageName.value = false
  editingPageName.value = ''
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


// PrimeVue Tree 기본 스타일 오버라이드
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
  }
  
  // Tree 기본 아이콘 숨기기 (커스텀 아이콘만 표시)
  .p-treenode-content {
    .p-treenode-icon {
      display: none !important;
    }
  }
}
</style>

