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
              :is-preview-mode="isPreviewMode"
              :is-loading="isPagesLoading"
              @update:pages="handleUpdatePages"
              @select="handleSelectPage"
              @create="openCreatePageModal"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <!-- 최상단 버튼 바 (데스크탑만) -->
      <div v-if="!isMobile" class="absolute top-2 -right-[52px] flex flex-col z-20 button-group-container">
        <Button
          icon="pi pi-pencil"
          :severity="!isPreviewMode ? 'primary' : 'secondary'"
          text
          size="small"
          class="button-group-top !w-9 !h-9 shadow-sm"
          :class="!isPreviewMode 
            ? 'bg-primary-500 dark:bg-primary-600 text-white' 
            : 'bg-surface-0 dark:bg-surface-800'"
          v-tooltip.right="'편집 모드'"
          @click="isPreviewMode = false"
        />
        <Button
          icon="pi pi-eye"
          :severity="isPreviewMode ? 'primary' : 'secondary'"
          text
          size="small"
          :disabled="!currentPage"
          class="button-group-bottom !w-9 !h-9 shadow-sm"
          :class="isPreviewMode 
            ? 'bg-primary-500 dark:bg-primary-600 text-white' 
            : 'bg-surface-0 dark:bg-surface-800'"
          v-tooltip.right="currentPage ? '미리보기' : '페이지를 선택해주세요'"
          @click="isPreviewMode = true"
        />
      </div>
      
      <!-- 최하단 버튼 바 (데스크탑만) -->
      <div v-if="!isMobile" class="absolute bottom-2 -right-[52px] flex flex-col gap-2 z-20">
        <Button
          icon="pi pi-refresh"
          severity="secondary"
          text
          
          size="small"
          class="!w-9 !h-9 shadow-sm"
          :class="'bg-surface-0 dark:bg-surface-800'"
          v-tooltip.right="'컴포넌트 초기화'"
          :disabled="!currentPage || canvasItems.length === 0"
          @click="onResetPageClick"
        />
      </div>
    </aside>

    <!-- 중앙: 프리뷰 영역 -->
    <Preview
      :canvas-items="canvasItems"
      :selected-index="selectedIndex"
      :is-preview-mode="isPreviewMode"
      :is-mobile="isMobile"
      :preview-path="currentPage ? `/preview/${currentPage.id}` : ''"
      :is-loading="isPageLoading"
      :current-page="currentPage"
      @update:canvas-items="handleUpdateCanvasItems"
      @select="selectItem"
      @delete="deleteItem"
      @copy="copyItem"
      @drop="onDrop"
      @deselect="selectedIndex = null"
      @grid-drop="handleGridDrop"
      @group-drop="handleGroupDrop"
      @toggle-preview="isPreviewMode = !isPreviewMode"
    />

    <!-- 오른쪽: 트리 + 속성 패널 -->
    <aside class="relative">
      <Options
        v-model:is-open="isRightPanelOpen"
        :is-mobile="isMobile"
        :is-preview-mode="isPreviewMode"
        :current-page="currentPage"
        :canvas-items="canvasItems"
        :selected-index="selectedIndex"
        :selected-item="selectedItem ?? null"
        :is-responsive-change="isResponsiveChange"
        :saved-pages-data="savedPagesData"
        :pages="pages"
        :is-saving="isSaving"
        :is-deleting="isDeleting"
        :is-page-loading="isPageLoading"
        :show-tree-view="showTreeView"
        @update:canvas-items="handleUpdateCanvasItems"
        @select-item="selectItem"
        @copy-item="copyItem"
        @delete-item="deleteItem"
        @save-page="handleSavePageClick"
        @delete-page="onDeletePageClick"
        @close-options="selectedIndex = null"
        @update-page-name="handleUpdatePageName"
        @edit-page="handleEditPage"
        @update:show-tree-view="showTreeView = $event"
      />
      
      <!-- 최상단 버튼 바 (데스크탑만) -->
      <div v-if="!isMobile" class="absolute top-2 -left-[52px] flex flex-col z-20 button-group-container">
        <Button
          icon="pi pi-list"
          :severity="!showTreeView ? 'primary' : 'secondary'"
          text
          size="small"
          class="button-group-top !w-9 !h-9 shadow-sm"
          :class="!showTreeView 
            ? 'bg-primary-500 dark:bg-primary-600 text-white' 
            : 'bg-surface-0 dark:bg-surface-800'"
          v-tooltip.left="'옵션 편집 모드'"
          @click="showTreeView = false"
        />
        <Button
          icon="pi pi-sitemap"
          :severity="showTreeView ? 'primary' : 'secondary'"
          text
          size="small"
          class="button-group-bottom !w-9 !h-9 shadow-sm"
          :class="showTreeView 
            ? 'bg-primary-500 dark:bg-primary-600 text-white' 
            : 'bg-surface-0 dark:bg-surface-800'"
          :disabled="!currentPage || canvasItems.length === 0 || (selectedIndex !== null && selectedItem !== null)"
          v-tooltip.left="currentPage ? '트리 뷰' : '페이지를 선택해주세요'"
          @click="showTreeView = true"
        />
      </div>
    </aside>

    <!-- 페이지 생성 모달 -->
    <ModalsCreatePage
      v-model="isCreatePageModalOpen"
      mode="create"
      title="새 페이지 생성"
      description="페이지 이름과 설명을 입력하세요"
      button-label="생성"
      @create="handleCreatePage"
    />
    
    <!-- 페이지 수정 모달 -->
    <ModalsCreatePage
      v-model="isEditPageModalOpen"
      mode="edit"
      :page-id="editingPage?.id"
      :initial-name="editingPage?.name"
      :initial-description="editingPage?.description"
      title="새 페이지 수정"
      description="페이지 이름과 설명을 입력하세요"
      button-label="수정"
      @update="handleUpdatePage"
    />

    <!-- 페이지 삭제 확인 모달 -->
    <ModalsConfirm
      v-model="isDeletePageConfirmOpen"
      header="페이지 삭제"
      message="현재 페이지의 컴포넌트 구성을 삭제하시겠어요?"
      action-type="delete"
      @confirm="confirmDeletePage"
    />

    <!-- 페이지 저장 확인 모달 -->
    <ModalsConfirm
      v-model="isSavePageConfirmOpen"
      header="페이지 저장"
      message="현재 페이지의 컴포넌트 구성을 저장하시겠어요?"
      action-type="save"
      @confirm="confirmSavePage"
    />

    <!-- 페이지 전환 확인 모달 (저장되지 않은 컴포넌트가 있을 때) -->
    <ModalsConfirm
      v-model="isChangePageConfirmOpen"
      header="페이지 이동"
      message="저장되지 않은 컴포넌트가 있습니다. 페이지를 이동하시겠어요?"
      action-type="success"
      @confirm="confirmChangePage"
    />

    <!-- 컴포넌트 초기화 확인 모달 -->
    <ModalsConfirm
      v-model="isResetPageConfirmOpen"
      header="컴포넌트 초기화"
      message="저장되지 않은 내용은 모두 사라집니다."
      action-type="success"
      @confirm="confirmResetPage"
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
      :is-pages-loading="isPagesLoading"
      :saved-pages-data="savedPagesData"
      :pages="pages"
      :is-saving="isSaving"
      :is-deleting="isDeleting"
      :is-page-loading="isPageLoading"
      @close="panelStore.closeMobileMenu()"
      @open-panel="(panel: string) => panelStore.openPanel(panel as 'elements' | 'pages' | 'options')"
      @close-panel="panelStore.closePanel()"
      @update:pages="handleUpdatePages"
      @add-component="addComponent"
      @select-page="handleSelectPage"
      @create-page="openCreatePageModal"
      @update:canvas-items="handleUpdateCanvasItems"
      @select-item="selectItem"
      @clear-selection="selectedIndex = null"
      @copy-item="copyItem"
      @delete-item="deleteItem"
      @save-page="handleSavePageClick"
      @delete-page="onDeletePageClick"
      @update-page-name="handleUpdatePageName"
      @edit-page="handleEditPage"
    />

    <!-- 전역 Toast -->
    <Toast />

    <!-- 활동 타임아웃 모달 -->
    <ModalsActivityTimeout
      :visible="activityTimeout.isModalVisible.value"
      :countdown="activityTimeout.countdown.value"
      @stay="activityTimeout.handleStay"
      @logout="activityTimeout.handleLogout"
    />

  </div>
</template>

<script lang="ts" setup>
import { usePanelStore } from '@/stores/panel'
import type { ComponentDef, CanvasItem, Page } from '~/types/component'
import { getComponentDefaults } from '~/utils/component'
import { createEmptyGridCells, compareArrayIds, findIndexById } from '~/utils/array'

useSeoMeta({
  title: 'MyComp',
  description: '컴포넌트를 쉽게 만들고 관리하세요. 실시간 미리보기와 직관적인 편집 도구를 제공합니다.',
  ogTitle: 'MyComp',
  ogDescription: '컴포넌트를 쉽게 만들고 관리하세요',
  ogType: 'website',
  ogImage: '/og.svg',
  ogImageWidth: 1200,
  ogImageHeight: 630
})

const route = useRoute()
const panelStore = usePanelStore()

const { generateUid } = useElements()
const { cloneCanvasItems } = useCanvas()
const { isMobile, checkScreenSize } = useResponsive()
const { pages, isLoading: isPagesLoading, loadPages, createPage, updatePage, deletePage, loadPageData } = usePages()
const { getDefaultProps } = useElementOptions()

const leftTab = ref<string>('elements')

const initialMobile = import.meta.client ? window.innerWidth < 1024 : false
const isLeftPanelOpen = ref<boolean>(!initialMobile)
const isRightPanelOpen = ref<boolean>(!initialMobile)
const isPreviewMode = ref<boolean>(false)
const isResponsiveChange = ref<boolean>(false)
const isInitialized = ref<boolean>(false)
const showTreeView = ref<boolean>(false)

const isChangePageConfirmOpen = ref<boolean>(false)
const isResetPageConfirmOpen = ref<boolean>(false)
const pendingTargetPage = ref<Page | null>(null)

// 페이지 목록 및 데이터 로드 (최초 한 번만)
async function ensurePagesLoaded(): Promise<void> {
  if (pages.value.length > 0) return

  await loadPages()

  for (const page of pages.value) {
    const elements = await loadPageData(page.id)
    savedPagesData.value[page.id] = elements || []
    pagesData.value[page.id] = cloneCanvasItems(elements || [])
  }
}

// 현재 페이지의 컴포넌트 초기화
const resetPageComponents = (): void => {
  if (!currentPage.value) return
  pagesData.value[currentPage.value.id] = []
  selectedIndex.value = null
}

const currentPage = ref<Page | null>(null)
const isCreatePageModalOpen = ref<boolean>(false)
const isEditPageModalOpen = ref<boolean>(false)
const editingPage = ref<Page | null>(null)
const isDeletePageConfirmOpen = ref<boolean>(false)
const isSavePageConfirmOpen = ref<boolean>(false)
const isSaving = ref<boolean>(false)
const isDeleting = ref<boolean>(false)

const savedPagesData = ref<Record<string, CanvasItem[]>>({})
const pagesData = ref<Record<string, CanvasItem[]>>({})


const { showSuccess, showError } = useAppToast()
const activityTimeout = useActivityTimeout()


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

function handleUpdateCanvasItems(items: CanvasItem[]): void {
  canvasItems.value = items
}

const selectedIndex = ref<number | null>(null)
const draggedComponent = ref<ComponentDef | null>(null)

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

// 현재 페이지의 아이템 배열 가져오기
function getCurrentPageItems(): CanvasItem[] | null {
  if (!currentPage.value) return null
  const pageId = currentPage.value.id
  const pageItems = pagesData.value[pageId]
  return pageItems || null
}

// 드래그된 컴포넌트로 새 아이템 생성
function createItemFromDraggedComponent(): CanvasItem | null {
  if (!draggedComponent.value) return null
  return {
    id: generateUid(),
    type: draggedComponent.value.type,
    props: { ...draggedComponent.value.defaultProps }
  }
}

// 패널 상태 업데이트
function updatePanelState(mobile: boolean): void {
  isLeftPanelOpen.value = !mobile
  isRightPanelOpen.value = !mobile
}

// 반응형 변경 플래그 해제 (이중 requestAnimationFrame)
function resetResponsiveChangeFlag(): void {
  if (import.meta.client) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isResponsiveChange.value = false
      })
    })
  } else {
    isResponsiveChange.value = false
  }
}

// 현재 페이지에 저장되지 않은 컴포넌트가 있는지 확인
function hasUnsavedComponentsForCurrentPage(): boolean {
  const page = currentPage.value
  if (!page) return false

  const saved = savedPagesData.value[page.id] || []
  const current = pagesData.value[page.id] || []

  return !compareArrayIds(saved, current)
}

// 페이지 선택 처리 (저장되지 않은 변경사항 확인)
function handleSelectPage(page: Page): void {
  if (currentPage.value?.id === page.id) return

  if (hasUnsavedComponentsForCurrentPage()) {
    pendingTargetPage.value = page
    isChangePageConfirmOpen.value = true
    return
  }

  selectPage(page)
}

// 페이지 전환 확인 처리
function confirmChangePage(): void {
  if (pendingTargetPage.value) {
    selectPage(pendingTargetPage.value)
    pendingTargetPage.value = null
  }
  isChangePageConfirmOpen.value = false
}

// 컴포넌트 초기화 확인 모달 열기
function onResetPageClick(): void {
  if (!currentPage.value || !pagesData.value[currentPage.value.id]?.length) return
  isResetPageConfirmOpen.value = true
}

// 컴포넌트 초기화 확인 처리
function confirmResetPage(): void {
  resetPageComponents()
  isResetPageConfirmOpen.value = false
}

// 페이지 목록 업데이트
function handleUpdatePages(updatedPages: Page[]): void {
  pages.value = updatedPages
}

const isPageLoading = ref<boolean>(false)

// 페이지 선택 및 데이터 로드
async function selectPage(page: Page): Promise<void> {
  isPageLoading.value = true
  
  await nextTick()
  
  const previousPage = currentPage.value
  if (previousPage) {
    currentPage.value = null
    selectedIndex.value = null
  }
  
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 150))
  
  try {
    const loadedElements = await loadPageData(page.id)
    savedPagesData.value[page.id] = loadedElements || []
    pagesData.value[page.id] = cloneCanvasItems(loadedElements || [])

    currentPage.value = page
    selectedIndex.value = null
  } finally {
    isPageLoading.value = false
  }
}

function openCreatePageModal(): void {
  isCreatePageModalOpen.value = true
}

// 페이지 생성 처리
async function handleCreatePage(data: { name: string; description: string }): Promise<void> {
  await nextTick()
  
  const newPage = pages.value.find((p: Page) => p.name === data.name)
  if (newPage) {
    pagesData.value[newPage.id] = []
    savedPagesData.value[newPage.id] = []
  }
}

// 페이지 이름 업데이트 (로컬 상태만)
function handleUpdatePageName(name: string): void {
  if (!currentPage.value) return
  
  const pageIndex = findIndexById(pages.value, currentPage.value.id)
    if (pageIndex !== -1 && pages.value[pageIndex]) {
      pages.value[pageIndex].name = name
      currentPage.value.name = name
  }
}

// 페이지 수정 모달 열기
function handleEditPage(page: Page): void {
  editingPage.value = page
  isEditPageModalOpen.value = true
}

// 페이지 수정 처리 (로컬 상태만)
async function handleUpdatePage(data: { name: string; description: string }): Promise<void> {
  if (!editingPage.value) return
  
  const pageIndex = findIndexById(pages.value, editingPage.value.id)
  if (pageIndex !== -1 && pages.value[pageIndex]) {
    pages.value[pageIndex].name = data.name
    pages.value[pageIndex].description = data.description
  }
  
  if (currentPage.value && currentPage.value.id === editingPage.value.id) {
    currentPage.value.name = data.name
    currentPage.value.description = data.description
  }
  
  isEditPageModalOpen.value = false
  editingPage.value = null
}

// 현재 페이지 상태 초기화
function clearCurrentPage(): void {
  currentPage.value = null
  selectedIndex.value = null
}

// 페이지 삭제 확인 모달 열기
function onDeletePageClick(): void {
  if (!currentPage.value) return
  isDeletePageConfirmOpen.value = true
}

// 페이지 삭제 확인 처리
async function confirmDeletePage(): Promise<void> {
  if (!currentPage.value) return
  
  isDeletePageConfirmOpen.value = false
  await deleteCurrentPage()
}

// 페이지 삭제 실행
async function deleteCurrentPage(): Promise<void> {
  if (!currentPage.value) return
  
  isDeleting.value = true
  try {
    await deletePage(currentPage.value.id)
    
    delete pagesData.value[currentPage.value.id]
    delete savedPagesData.value[currentPage.value.id]
    
    clearCurrentPage()
    
    showSuccess('페이지 삭제', '페이지가 삭제되었습니다.')
  } catch (error: any) {
    showError('페이지 삭제 실패', error.message || '페이지 삭제 중 오류가 발생했습니다.')
  } finally {
    isDeleting.value = false
  }
}

// 페이지 저장 확인 모달 열기
function handleSavePageClick(): void {
  isSavePageConfirmOpen.value = true
}

// 페이지 저장 확인 처리
async function confirmSavePage(): Promise<void> {
  isSavePageConfirmOpen.value = false
  await saveCurrentPage()
}

// 페이지 저장 실행
async function saveCurrentPage(): Promise<void> {
  if (!currentPage.value) return
  const items = pagesData.value[currentPage.value.id] || []
  
  isSaving.value = true
  try {
    await updatePage(
      currentPage.value.id,
      {
        name: currentPage.value.name,
        description: currentPage.value.description
      },
      items
    )
    
    savedPagesData.value[currentPage.value.id] = cloneCanvasItems(items)

    showSuccess('페이지 저장', `"${currentPage.value.name}" 페이지 구성이 저장되었습니다.`)
  } catch (error: any) {
    showError('페이지 저장 실패', error.message || '페이지 저장 중 오류가 발생했습니다.')
  } finally {
    isSaving.value = false
  }
}

// 컴포넌트 추가
function addComponent(comp: ComponentDef): void {
  if (!currentPage.value) {
    showSuccess('페이지 선택 필요', '컴포넌트를 추가하려면 먼저 페이지를 선택해주세요.')
    return
  }

  const defaultStylesFromComposable = getDefaultProps().styles
  const componentDefaults = getComponentDefaults(comp.type)
  
  // data 병합 (컴포넌트 정의의 data + 기본값의 data)
  const mergedData: Record<string, any> = {
    ...componentDefaults.data,
    ...(comp.defaultProps.data || {}),
    // styles가 아닌 다른 필드들도 data로 이동 (예: text, placeholder, label 등)
    ...Object.fromEntries(
      Object.entries(comp.defaultProps).filter(([key]) => key !== 'styles' && key !== 'data')
    )
  }
  
  // styles 병합 (통합된 구조)
  const mergedStyles: Record<string, any> = {
    ...defaultStylesFromComposable,
    // 기본값의 styles (width, height, fontSize 등)
    ...componentDefaults.styles,
    // 컴포넌트 정의의 styles
    ...(comp.defaultProps.styles || {}),
    // position, appearance는 기존 구조 유지
    position: {
      ...defaultStylesFromComposable.position,
      ...(comp.defaultProps.styles?.position || {})
    },
    appearance: {
      ...defaultStylesFromComposable.appearance,
      ...(comp.defaultProps.styles?.appearance || {})
    }
  }
  
  const mergedProps: Record<string, any> = {
    data: mergedData,
    styles: mergedStyles
  }

  const newItem: CanvasItem = {
    id: generateUid(),
    type: comp.type,
    props: mergedProps
  }
  
  if (comp.type === 'grid' && newItem.props.columns) {
    newItem.props.items = createEmptyGridCells(newItem.props.columns)
  }
  
  if (comp.type === 'table' && newItem.props.columns) {
    if (!newItem.props.rows) {
      newItem.props.rows = [newItem.props.columns.map(() => '데이터')]
    }
  }
  
  const pageId = currentPage.value.id
  if (!pagesData.value[pageId]) {
    pagesData.value[pageId] = []
  }
  const pageItems = pagesData.value[pageId]
  pageItems.push(newItem)
}

// 드래그 시작 처리
function onDragStart(comp: ComponentDef): void {
  draggedComponent.value = comp
}

// 드롭 처리
function onDrop(): void {
  if (draggedComponent.value) {
    addComponent(draggedComponent.value)
    draggedComponent.value = null
  }
}

// 컴포넌트 선택
function selectItem(index: number): void {
  selectedIndex.value = index
  
  if (isMobile.value) {
    panelStore.openMobileMenu()
    panelStore.openPanel('options')
  }
}

// 컴포넌트 삭제
function deleteItem(index: number): void {
  const pageItems = getCurrentPageItems()
  if (!pageItems) return
  
  pageItems.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = null
  } else if (selectedIndex.value !== null && selectedIndex.value > index) {
    selectedIndex.value--
  }
}

// 컴포넌트 복사
function copyItem(index: number): void {
  const pageItems = getCurrentPageItems()
  if (!pageItems || !pageItems[index]) return
  
  const originalItem = pageItems[index]
  const copiedItems = cloneCanvasItems([originalItem])
  
  if (!copiedItems || copiedItems.length === 0) return
  
  const copiedItem = copiedItems[0]
  if (!copiedItem) return
  
  copiedItem.id = generateUid()
  pageItems.splice(index + 1, 0, copiedItem)
}

// 그리드에 컴포넌트 드롭 처리
function handleGridDrop(data: { gridElement: CanvasItem; cellIndex: number; event: DragEvent }): void {
  const pageItems = getCurrentPageItems()
  if (!draggedComponent.value || !pageItems) return
  
  const gridIndex = findIndexById(pageItems, data.gridElement.id)
  if (gridIndex === -1) return
  
  const gridItem = pageItems[gridIndex]
  if (!gridItem) return
  
  if (!gridItem.props.items) {
    gridItem.props.items = createEmptyGridCells(gridItem.props.columns || 2)
  }
  
  const newItem = createItemFromDraggedComponent()
  if (!newItem) return
  
  if (!gridItem.props.items[data.cellIndex]) {
    gridItem.props.items[data.cellIndex] = []
  }
  gridItem.props.items[data.cellIndex] = [newItem]
  
  draggedComponent.value = null
}

// 그룹에 컴포넌트 드롭 처리
function handleGroupDrop(data: { groupElement: CanvasItem; event: DragEvent }): void {
  const pageItems = getCurrentPageItems()
  if (!draggedComponent.value || !pageItems) return
  
  const groupIndex = findIndexById(pageItems, data.groupElement.id)
  if (groupIndex === -1) return
  
  const groupItem = pageItems[groupIndex]
  if (!groupItem) return
  
  if (!groupItem.props.items) {
    groupItem.props.items = []
  }
  
  const newItem = createItemFromDraggedComponent()
  if (!newItem) return
  
  groupItem.props.items = [newItem]
  
  draggedComponent.value = null
}

watch(isMobile, (mobile) => {
  if (!isInitialized.value) return
  
  isResponsiveChange.value = true
  updatePanelState(mobile)
  resetResponsiveChangeFlag()
})

watch(leftTab, async (tab) => {
  if (tab === 'pages') {
    await ensurePagesLoaded()
  }
})

watch(
  () => panelStore.activeMobilePanel,
  async (panel) => {
    if (panel === 'pages') {
      await ensurePagesLoaded()
    }
  }
)

onMounted(async () => {
  if (import.meta.client) {
    const status = route.query.status as string | undefined
    if (status === 'logged_in') {
      showSuccess('로그인 완료', '로그인되었습니다.')
    } else if (status === 'guest') {
      showSuccess('게스트 모드로 접속', '게스트로 로그인되었습니다.')
    }
    if (status) {
      const query = { ...route.query }
      delete query.status
      navigateTo({ query })
    }

    const mobile = checkScreenSize()
    isResponsiveChange.value = true
    
    if (mobile !== initialMobile) {
      updatePanelState(mobile)
    }
    
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isResponsiveChange.value = false
          isInitialized.value = true
        })
      })
    })

    activityTimeout.start()
  }
})

onBeforeUnmount(() => {
  activityTimeout.stop()
})
</script>

<style lang="scss" scoped>
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

<style lang="scss">
.p-toast {
  z-index: 1300 !important;
}
</style>