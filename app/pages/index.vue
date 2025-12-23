<template>
  <div class="flex h-screen w-full bg-surface-50 dark:bg-surface-900 overflow-hidden">
    <!-- 왼쪽: Elements / Page 탭 -->
    <aside 
      class="h-full bg-surface-0 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col shrink-0"
      :class="[
        !isResponsiveChange && 'transition-all duration-300',
        isMobile 
          ? (isLeftPanelOpen ? 'fixed top-0 bottom-0 left-0 z-50 w-full overflow-hidden' : 'fixed top-0 bottom-0 -left-full z-50 w-full') 
          : (isLeftPanelOpen ? 'relative w-[300px] min-w-[300px] overflow-visible' : 'relative w-0 min-w-0 border-r-0 overflow-visible')
      ]"
    >
      <Tabs v-model:value="leftTab" class="flex flex-col h-full overflow-hidden">
        <TabList class="border-b border-surface-200 dark:border-surface-700">
          <Tab value="elements" class="flex-1 px-4 py-3 text-sm data-[p-active=true]:!bg-surface-100 dark:data-[p-active=true]:!bg-surface-700">Elements</Tab>
          <Tab value="pages" class="flex-1 px-4 py-3 text-sm !border-l !border-surface-200 dark:!border-surface-700 data-[p-active=true]:!bg-surface-100 dark:data-[p-active=true]:!bg-surface-700">Page</Tab>
        </TabList>
        <TabPanels class="flex-1 overflow-hidden">
          <TabPanel value="elements" class="h-full flex flex-col overflow-hidden">
            <Elements
              :is-preview-mode="isPreviewMode"
              @add="addComponent"
              @drag-start="onDragStart"
            />
          </TabPanel>
          <TabPanel value="pages" class="h-full flex flex-col overflow-hidden">
            <Pages
              :current-page-id="currentPage?.id"
              @update:pages="handleUpdatePages"
              @select="handleSelectPage"
              @create="openCreatePageModal"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <!-- 최상단 버튼 바 (데스크탑만) -->
      <div v-if="!isMobile" class="absolute top-2 -right-[52px] flex flex-col gap-2 z-20">
        <Button
          icon="pi pi-pencil"
          :severity="!isPreviewMode ? 'primary' : 'secondary'"
          text
          rounded
          size="small"
          class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border shadow-sm"
          :class="!isPreviewMode 
            ? 'border-primary-500 dark:border-primary-400' 
            : 'border-surface-200 dark:border-surface-700'"
          v-tooltip.right="'편집 모드'"
          @click="setEditMode"
        />
        <Button
          icon="pi pi-eye"
          :severity="isPreviewMode ? 'primary' : 'secondary'"
          text
          rounded
          size="small"
          class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border shadow-sm"
          :class="isPreviewMode 
            ? 'border-primary-500 dark:border-primary-400' 
            : 'border-surface-200 dark:border-surface-700'"
          v-tooltip.right="'미리보기'"
          @click="setPreviewMode"
        />
      </div>
      
      <!-- 최하단 버튼 바 (데스크탑만) -->
      <div v-if="!isMobile" class="absolute bottom-2 -right-[52px] flex flex-col gap-2 z-20">
        <Button
          icon="pi pi-refresh"
          severity="secondary"
          text
          rounded
          size="small"
          class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm"
          v-tooltip.right="'컴포넌트 초기화'"
          :disabled="!currentPage || canvasItems.length === 0"
          @click="resetPageComponents"
        />
        <Button
          :icon="isLeftPanelOpen ? 'pi pi-angle-left' : 'pi pi-angle-right'"
          severity="secondary"
          text
          rounded
          size="small"
          class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm"
          v-tooltip.right="isLeftPanelOpen ? '패널 닫기' : '패널 열기'"
          @click="isLeftPanelOpen = !isLeftPanelOpen"
        />
      </div>

      <!-- 모바일 닫기 버튼 -->
      <div v-if="isMobile && isLeftPanelOpen" class="absolute top-1 right-3 z-10 flex gap-2">
        <Button
          icon="pi pi-times"
          severity="secondary"
          text
          rounded
          size="small"
          class="!w-9 !h-9"
          @click="isLeftPanelOpen = false"
        />
      </div>
    </aside>

    <!-- 중앙: 프리뷰 영역 -->
    <Preview
      :canvas-items="canvasItems"
      :selected-index="selectedIndex"
      :is-preview-mode="isPreviewMode"
      :is-mobile="isMobile"
      @update:canvas-items="handleUpdateCanvasItems"
      @select="selectItem"
      @delete="deleteItem"
      @drop="onDrop"
      @deselect="selectedIndex = null"
      @grid-drop="handleGridDrop"
      @group-drop="handleGroupDrop"
    />

    <!-- 오른쪽: 트리 + 속성 패널 -->
    <Options
      v-model:is-open="isRightPanelOpen"
      :is-mobile="isMobile"
      :is-preview-mode="isPreviewMode"
      :current-page="currentPage"
      :canvas-items="canvasItems"
      :selected-index="selectedIndex"
      :selected-item="selectedItem ?? null"
      :is-responsive-change="isResponsiveChange"
      @update:canvas-items="handleUpdateCanvasItems"
      @select-item="selectItem"
      @delete-item="deleteItem"
      @save-page="saveCurrentPage"
      @delete-page="onDeletePageClick"
      @close-options="selectedIndex = null"
      @update-page-name="handleUpdatePageName"
    />

    <!-- 페이지 생성 모달 -->
    <ModalsCreatePage
      v-model="isCreatePageModalOpen"
      @create="handleCreatePage"
    />

    <!-- 페이지 삭제 확인 모달 -->
    <ModalsConfirm
      v-model="isDeletePageConfirmOpen"
      header="페이지 삭제"
      message="현재 페이지의 컴포넌트 구성을 삭제하시겠어요?"
      action-type="delete"
      @confirm="confirmDeletePage"
    />

    <!-- 모바일 메뉴 -->
    <MobileMenu
      :is-open="panelStore.isMobileMenuOpen"
      :active-panel="panelStore.activeMobilePanel"
      :current-page="currentPage"
      :current-page-id="currentPage?.id"
      :canvas-items="canvasItems"
      :selected-index="selectedIndex"
      :selected-item="selectedItem ?? null"
      :is-preview-mode="isPreviewMode"
      @close="panelStore.closeMobileMenu()"
      @open-panel="(panel: string) => panelStore.openPanel(panel as 'elements' | 'pages' | 'options')"
      @close-panel="panelStore.closePanel()"
      @update:pages="handleUpdatePages"
      @add-component="addComponent"
      @select-page="handleSelectPage"
      @create-page="openCreatePageModal"
      @update:canvas-items="handleUpdateCanvasItems"
      @select-item="selectItem"
      @delete-item="deleteItem"
      @save-page="saveCurrentPage"
    />

    <!-- 전역 Toast -->
    <Toast />
  </div>
</template>

<script lang="ts" setup>
import { usePanelStore } from '@/stores/panel'
import type { ComponentDef, CanvasItem, Page } from '~/types/component'
import { useElements } from '~/composables/useElements'
import { useCanvas } from '~/composables/useCanvas'
import { useResponsive } from '~/composables/useResponsive'
import { usePages } from '~/composables/usePages'

// Pinia store
const panelStore = usePanelStore()

// Composables
const { generateUid } = useElements()
const { cloneCanvasItems } = useCanvas()
const { isMobile, checkScreenSize } = useResponsive()
const { pages } = usePages()

// 왼쪽 탭 상태
const leftTab = ref('elements')

// 패널 상태 - 초기값을 화면 크기에 맞게 설정
// 클라이언트 사이드에서 즉시 화면 크기 확인
// SSR에서는 PC로 가정 (패널 열림)하여 PC에서 깜빡임 방지
const initialMobile = process.client ? window.innerWidth < 1024 : false
const isLeftPanelOpen = ref(!initialMobile)
const isRightPanelOpen = ref(!initialMobile)
const isPreviewMode = ref(false)
const isResponsiveChange = ref(false) // 화면 크기 변경으로 인한 패널 변경인지 구분
const isInitialized = ref(false) // 초기화 완료 여부

// 편집 모드/미리보기 모드 전환 함수
const setEditMode = () => {
  if (!isPreviewMode.value) return
  isPreviewMode.value = false
}

const setPreviewMode = () => {
  if (isPreviewMode.value) return
  isPreviewMode.value = true
}

// 페이지 컴포넌트 초기화
const resetPageComponents = () => {
  if (!currentPage.value) return
  pagesData.value[currentPage.value.id] = []
  selectedIndex.value = null
}

const currentPage = ref<Page | null>(null)
const isCreatePageModalOpen = ref(false)
const isDeletePageConfirmOpen = ref(false)

// 페이지별 컴포넌트 저장 (목업 데이터)
// savedPagesData: 실제 저장된 상태
// pagesData: 현재 편집 중인 상태 (저장 버튼 누를 때만 savedPagesData에 반영)
const savedPagesData = ref<Record<string, CanvasItem[]>>({
  '1': [],
  '2': [],
  '3': []
})

const pagesData = ref<Record<string, CanvasItem[]>>({
  '1': [],
  '2': [],
  '3': []
})

const canvasItems = computed({
  get: () => {
    if (!currentPage.value) return []
    return pagesData.value[currentPage.value.id] || []
  },
  set: (value) => {
    if (!currentPage.value) return
    pagesData.value[currentPage.value.id] = value
  }
})

function handleUpdateCanvasItems(items: CanvasItem[]) {
  canvasItems.value = items
}

const selectedIndex = ref<number | null>(null)
const draggedComponent = ref<ComponentDef | null>(null)

// 프리뷰 모드 전환 시 선택 해제
watch(isPreviewMode, (preview) => {
  if (preview) {
    selectedIndex.value = null
  }
})

const selectedItem = computed(() => {
  if (selectedIndex.value === null || !currentPage.value) return null
  const pageItems = pagesData.value[currentPage.value.id]
  if (!pageItems || selectedIndex.value >= pageItems.length) return null
  return pageItems[selectedIndex.value]
})

// Toast 인스턴스
const toast = useToast()

// 초기화: 클라이언트 사이드에서 화면 크기 확인 후 패널 상태 동기화
onMounted(() => {
  if (process.client) {
    const mobile = checkScreenSize()
    isResponsiveChange.value = true
    
    // 초기값과 실제 값이 다르면 업데이트 (애니메이션 없이)
    if (mobile !== initialMobile) {
      if (mobile) {
        isLeftPanelOpen.value = false
        isRightPanelOpen.value = false
      } else {
        isLeftPanelOpen.value = true
        isRightPanelOpen.value = true
      }
    }
    
    // 초기화 완료 후 플래그 해제 (다음 틱에서)
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isResponsiveChange.value = false
          isInitialized.value = true
        })
      })
    })
  }
})

// 반응형 처리 (초기화 후 화면 크기 변경 시에만 실행)
watch(isMobile, (mobile) => {
  // 초기화 전에는 실행하지 않음
  if (!isInitialized.value) return
  
  // 화면 크기 변경으로 인한 패널 변경임을 표시 (슬라이드 애니메이션 제거)
  isResponsiveChange.value = true
  
  if (mobile) {
    isLeftPanelOpen.value = false
    isRightPanelOpen.value = false
  } else {
    isLeftPanelOpen.value = true
    isRightPanelOpen.value = true
  }
  
  if (process.client) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isResponsiveChange.value = false
      })
    })
  } else {
    // SSR 환경에서는 즉시 플래그 해제
    isResponsiveChange.value = false
  }
})

function handleSelectPage(page: Page) {
  if (currentPage.value?.id === page.id) return
  selectPage(page)
}

function handleUpdatePages(updatedPages: Page[]) {
  pages.value = updatedPages
}

function selectPage(page: Page) {
  // 페이지 전환 시: 저장된 데이터 기준으로 편집용 데이터를 초기화
  if (!savedPagesData.value[page.id]) {
    savedPagesData.value[page.id] = []
  }
  pagesData.value[page.id] = cloneCanvasItems(savedPagesData.value[page.id] || [])

  currentPage.value = page
  selectedIndex.value = null
}

function openCreatePageModal() {
  isCreatePageModalOpen.value = true
}

function handleCreatePage(data: { name: string; description: string }) {
  const newPage: Page = {
    id: Date.now().toString(),
    name: data.name,
    description: data.description || undefined
  }
  
  pages.value.push(newPage)
  pagesData.value[newPage.id] = []
  
  toast.add({
    severity: 'success',
    summary: '페이지 생성',
    detail: `"${newPage.name}" 페이지가 생성되었습니다.`,
    life: 3000
  })
}

function handleUpdatePageName(name: string) {
  if (!currentPage.value) return
  const pageIndex = pages.value.findIndex((p: Page) => p.id === currentPage.value!.id)
  if (pageIndex !== -1 && pages.value[pageIndex]) {
    pages.value[pageIndex].name = name
    currentPage.value.name = name
  }
}

// 페이지 삭제 (선택 해제)
function deletePage() {
  currentPage.value = null
  selectedIndex.value = null
}

function onDeletePageClick() {
  if (!currentPage.value) return
  const items = pagesData.value[currentPage.value.id] || []

  // 컴포넌트가 없으면 바로 삭제
  if (!items.length) {
    deletePage()
    return
  }

  // 컴포넌트가 하나라도 있으면 확인 모달 표시
  isDeletePageConfirmOpen.value = true
}

function confirmDeletePage() {
  deletePage()
  isDeletePageConfirmOpen.value = false
}

function saveCurrentPage() {
  if (!currentPage.value) return
  const items = pagesData.value[currentPage.value.id] || []
  if (!items.length) return

  savedPagesData.value[currentPage.value.id] = cloneCanvasItems(items)

  toast.add({
    severity: 'success',
    summary: '페이지 저장',
    detail: `"${currentPage.value.name}" 페이지 구성이 저장되었습니다.`,
    life: 2500
  })
}

function addComponent(comp: ComponentDef) {
  // 페이지가 선택되지 않았으면 Toast 메시지 표시
  if (!currentPage.value) {
    toast.add({
      severity: 'secondary',
      summary: '페이지 선택 필요',
      detail: '컴포넌트를 추가하려면 먼저 페이지를 선택해주세요.',
      life: 3000
    })
    return
  }

  const newItem: CanvasItem = {
    uid: generateUid(),
    type: comp.type,
    props: { ...comp.defaultProps }
  }
  
  // 그리드 타입인 경우 items 배열 초기화 (columns 수만큼 빈 배열 생성)
  if (comp.type === 'grid' && newItem.props.columns) {
    newItem.props.items = Array(newItem.props.columns).fill([]).map(() => [])
  }
  
  // 테이블 타입인 경우 rows 배열 초기화
  if (comp.type === 'table' && newItem.props.columns) {
    if (!newItem.props.rows) {
      newItem.props.rows = [newItem.props.columns.map(() => '데이터')]
    }
  }
  
  // 현재 페이지의 컴포넌트 배열에 추가
  const pageId = currentPage.value.id
  if (!pagesData.value[pageId]) {
    pagesData.value[pageId] = []
  }
  const pageItems = pagesData.value[pageId]
  pageItems.push(newItem)
}

function onDragStart(comp: ComponentDef) {
  draggedComponent.value = comp
}

function onDrop() {
  if (draggedComponent.value) {
    addComponent(draggedComponent.value)
    draggedComponent.value = null
  }
}

function selectItem(index: number) {
  selectedIndex.value = index
}

function deleteItem(index: number) {
  if (!currentPage.value) return
  
  const pageId = currentPage.value.id
  const pageItems = pagesData.value[pageId]
  if (!pageItems) return
  
  pageItems.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = null
  } else if (selectedIndex.value !== null && selectedIndex.value > index) {
    selectedIndex.value--
  }
}

function handleGridDrop(data: { gridElement: CanvasItem; cellIndex: number; event: DragEvent }) {
  if (!draggedComponent.value || !currentPage.value) return
  
  const pageId = currentPage.value.id
  const pageItems = pagesData.value[pageId]
  if (!pageItems) return
  
  // 그리드 요소 찾기
  const gridIndex = pageItems.findIndex(item => item.uid === data.gridElement.uid)
  if (gridIndex === -1) return
  
  const gridItem = pageItems[gridIndex]
  if (!gridItem) return
  
  // items 배열 초기화 (없으면)
  if (!gridItem.props.items) {
    gridItem.props.items = Array(gridItem.props.columns || 2).fill([]).map(() => [])
  }
  
  // 새로운 컴포넌트 생성
  const newItem: CanvasItem = {
    uid: generateUid(),
    type: draggedComponent.value.type,
    props: { ...draggedComponent.value.defaultProps }
  }
  
  // 해당 셀에 추가 (하나만 가능, 기존 컴포넌트가 있으면 교체)
  if (!gridItem.props.items[data.cellIndex]) {
    gridItem.props.items[data.cellIndex] = []
  }
  gridItem.props.items[data.cellIndex] = [newItem] // 하나만 가능하도록 교체
  
  draggedComponent.value = null
}

function handleGroupDrop(data: { groupElement: CanvasItem; event: DragEvent }) {
  if (!draggedComponent.value || !currentPage.value) return
  
  const pageId = currentPage.value.id
  const pageItems = pagesData.value[pageId]
  if (!pageItems) return
  
  // 그룹 요소 찾기
  const groupIndex = pageItems.findIndex(item => item.uid === data.groupElement.uid)
  if (groupIndex === -1) return
  
  const groupItem = pageItems[groupIndex]
  if (!groupItem) return
  
  // items 배열 초기화 (없으면)
  if (!groupItem.props.items) {
    groupItem.props.items = []
  }
  
  // 새로운 컴포넌트 생성
  const newItem: CanvasItem = {
    uid: generateUid(),
    type: draggedComponent.value.type,
    props: { ...draggedComponent.value.defaultProps }
  }
  
  // 그룹에는 하나의 컴포넌트만 가능 (기존 컴포넌트가 있으면 교체)
  groupItem.props.items = [newItem]
  
  draggedComponent.value = null
}
</script>

<style lang="scss" scoped>
/* PrimeVue Tabs 배경 오버라이드 */
:deep(.p-tabs) {
  background: transparent !important;
}
:deep(.p-tablist) {
  background: transparent !important;
}
:deep(.p-tabpanels) {
  padding: 0;
  background: transparent !important;
}
:deep(.p-tab) {
  border: none !important;
  margin: 0 !important;
  transition: all 0.2s ease !important;
}
:deep(.p-tablist-tab-list) {
  border: none !important;
}
:deep(.p-tablist-active-bar) {
  display: none !important;
}
</style>