<template>
  <main class="flex-1 h-full overflow-hidden relative preview-root" :class="props.isMobile ? 'w-full h-full flex' : (props.simple ? 'flex items-center justify-center px-2.5 md:px-10 py-10' : 'flex items-center justify-center px-2.5 md:px-10 py-10')">
    <!-- 데스크탑용 미리보기 배지 -->
    <div 
      v-if="isPreviewMode && !props.simple && !props.isMobile" 
      class="absolute top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center gap-2 shadow-lg z-10"
    >
      <i class="pi pi-eye text-xs" />
      미리보기 모드
    </div>
    <!-- 모바일용 미리보기 배지 -->
    <div
      v-if="isPreviewMode && !props.simple && props.isMobile"
      class="absolute top-16 -right-[1px] w-10 h-8 rounded-l-md rounded-r-none bg-primary-500 dark:bg-primary-600 border border-l-primary-500 border-y-primary-500 border-r-transparent dark:border-l-primary-600 dark:border-y-primary-600 dark:border-r-transparent shadow-md flex items-center justify-center text-white z-20"
    >
      <i class="pi pi-eye text-sm" />
    </div>
    
    <div
      class="preview-card bg-surface-0 dark:bg-surface-800 overflow-hidden flex flex-col relative"
      :class="[
        props.isMobile 
          ? 'w-full h-full rounded-none shadow-none'
          : (props.simple 
            ? 'w-[min(660px,calc(100%-20px))] md:w-[min(660px,calc(100%-40px))] h-[min(700px,calc(100%-10px))] rounded-2xl shadow-lg'
            : 'w-[min(660px,calc(100%-20px))] md:w-[min(660px,calc(100%-40px))] h-[min(700px,calc(100%-10px))] rounded-2xl shadow-lg'),
        { 
          'ring-2 ring-primary-500 highlight-border': isPreviewMode && !props.simple, 
          'preview-mode': isPreviewMode,
          'highlight-border': !isPreviewMode
        }
      ]"
      @dragover.prevent="!isPreviewMode"
      @drop="!isPreviewMode && handleDrop"
      @click="!isPreviewMode && handleDeselect"
    >
      <!-- QR 플립 버튼 (프리뷰 카드 오른쪽 끝에 ㄷ자 모양으로 붙는 형태, 단순 프리뷰 페이지에서는 숨김, 미리보기 모드일 때만 표시) -->
      <button
        v-if="qrUrl && !props.simple && props.isPreviewMode"
        class="absolute top-5 -right-[1px] w-10 h-8 rounded-l-md rounded-r-none bg-surface-0 dark:bg-surface-900 border border-l-surface-200 border-y-surface-200 border-r-transparent dark:border-l-surface-600 dark:border-y-surface-600 dark:border-r-transparent shadow-md flex items-center justify-center text-surface-600 dark:text-surface-200 hover:text-primary-500 hover:border-l-primary-500 hover:border-y-primary-500 dark:hover:border-l-primary-400 dark:hover:border-y-primary-400 transition-all z-20"
       
        @click.stop="toggleQrPanel"
      >
        <i :class="[showQrPanel ? 'pi pi-arrow-left' : 'pi pi-qrcode', 'text-sm']" />
      </button>

      <!-- 플립 컨테이너 (앞/뒤 양면) -->
      <div class="preview-flip-container" :class="{ 'is-flipped': showQrPanel }">
        <!-- 앞면: 기존 캔버스 -->
        <div class="preview-face preview-front">
          <!-- 기본 캔버스 영역 -->
          <!-- 로딩 중일 때 스켈레톤 표시 -->
          <Skeletons v-if="props.isLoading" type="preview" />
          <template v-else>
            <Transition name="fade" mode="out-in">
              <!-- 로딩 끝 + 컴포넌트 없음: 빈 상태 메시지 -->
              <div
                v-if="props.canvasItems.length === 0"
                class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
              >
                <!-- 일반 모드: 컴포넌트 추가 안내 -->
                <template v-if="!props.simple">
                  <div class="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4 shrink-0">
                    <i class="pi pi-objects-column text-2xl text-primary-500" />
                  </div>
                  <h3 class="text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1 whitespace-nowrap">컴포넌트 추가</h3>
                  <div class="flex flex-col items-center">
                    <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap">{{ isMobile ? '메뉴' : '왼쪽' }}에서 컴포넌트를 드래그하거나</p>
                    <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap mt-1">클릭하여 추가하세요</p>
                  </div>
                  <div class="flex items-center gap-2 mt-4 text-xs text-surface-400 shrink-0">
                    <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded whitespace-nowrap">드래그</span>
                    <span class="whitespace-nowrap">또는</span>
                    <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded whitespace-nowrap">클릭</span>
                  </div>
                </template>

                <!-- Simple 모드: 페이지 없음 또는 콘텐츠 없음 안내 -->
                <template v-else>
                  <!-- 페이지가 존재하지 않음 -->
                  <template v-if="props.pageNotFound">
                    <div class="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 shrink-0">
                      <i class="pi pi-exclamation-triangle text-2xl text-red-500 dark:text-red-400" />
                    </div>
                    <h3 class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1 whitespace-nowrap">페이지를 찾을 수 없습니다</h3>
                    <div class="flex flex-col items-center">
                      <p class="text-xs text-surface-500 dark:text-surface-400 leading-relaxed whitespace-nowrap">요청하신 페이지가 존재하지 않거나</p>
                      <p class="text-xs text-surface-500 dark:text-surface-400 leading-relaxed whitespace-nowrap mt-1">삭제되었을 수 있습니다</p>
                    </div>
                  </template>
                  <!-- 페이지는 있지만 컴포넌트가 없음 -->
                  <template v-else>
                    <div class="w-16 h-16 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mb-4 shrink-0">
                      <i class="pi pi-exclamation-triangle text-2xl text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <h3 class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1 whitespace-nowrap">콘텐츠가 없습니다</h3>
                    <div class="flex flex-col items-center">
                      <p class="text-xs text-surface-500 dark:text-surface-400 leading-relaxed whitespace-nowrap">이 페이지에는 표시할 컴포넌트가</p>
                      <p class="text-xs text-surface-500 dark:text-surface-400 leading-relaxed whitespace-nowrap mt-1">존재하지 않습니다</p>
                    </div>
                  </template>
                </template>
              </div>

              <!-- 로딩 끝 + 데이터 있음: Draggable 렌더링 -->
              <Draggable
                v-else
                :model-value="props.canvasItems"
                item-key="uid"
                :disabled="isPreviewMode"
                @update:model-value="$emit('update:canvasItems', $event)"
              >
              <template #item="{ element, index }">
                <div
                  class="canvas-item group relative"
                  :class="{ selected: selectedIndex === index && !isPreviewMode }"
                      @click.stop="!isPreviewMode && handleSelect(index)"
                >
                <!-- 복사/삭제 버튼 -->
              <div 
                v-if="!isPreviewMode" 
                class="absolute -top-5 right-0 flex items-center gap-1 z-10 transition-opacity"
                :class="selectedIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
              >
                <button
                  class="w-5 h-5 flex items-center justify-center bg-white dark:bg-surface-800 border border-primary-500 dark:border-primary-500 shadow-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                              @click.stop="handleCopy(index)"
                >
                    <i class="pi pi-copy text-xs text-primary-500 dark:text-primary-400" />
                </button>
                <button
                  class="w-5 h-5 flex items-center justify-center bg-white dark:bg-surface-800 border border-primary-500 dark:border-primary-500 shadow-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                              @click.stop="handleDelete(index)"
                >
                  <i class="pi pi-trash text-xs text-primary-500 dark:text-primary-400" />
                </button>
              </div>
                    <!-- 모든 컴포넌트 (ComponentRenderer 사용) -->
                    <ComponentRenderer
                      :item="element"
                      :is-preview-mode="isPreviewMode"
                      :get-element-style="getElementStyle"
                      :get-typography-style="getTypographyStyle"
                      :get-form-input-style="getFormInputStyle"
                      :get-button-style="getButtonStyle"
                      :get-button-wrapper-style="getButtonWrapperStyle"
                      :get-prev-next-button-style="getPrevNextButtonStyle"
                      :get-prev-next-wrapper-style="getPrevNextWrapperStyle"
                      :is-dragging-over-grid="isDraggingOverGrid"
                      :is-dragging-over-group="isDraggingOverGroup"
                      :on-grid-drag-over="handleGridDragOver"
                      :on-grid-drag-leave="handleGridDragLeave"
                      :on-grid-drop="handleGridDrop"
                      :on-group-drag-over="handleGroupDragOver"
                      :on-group-drag-leave="handleGroupDragLeave"
                      :on-group-drop="handleGroupDrop"
                      :editing-table="editingTable as any"
                      :on-table-header-blur="handleTableHeaderBlur"
                      :on-table-cell-blur="handleTableCellBlur"
                      :on-add-table-row="handleAddTableRow"
                      :on-update-canvas-items="() => emit('update:canvasItems', [...props.canvasItems])"
                    />
            </div>
          </template>
        </Draggable>
            </Transition>
          </template>
        </div>

        <!-- 뒷면: QR 패널 -->
        <div class="preview-face preview-back">
          <div class="w-full h-full flex flex-col items-center justify-center px-6">
            <!-- QR 코드 -->
            <div class="w-full flex justify-center mb-6">
              <QrcodeVue v-if="qrUrl" :value="qrUrl" :size="160" :level="'M'" />
            </div>


            <!-- URL 정보 -->
            <div class="w-full flex flex-col gap-3 mt-2">
              <div class="flex flex-col gap-1 items-center">
                <span class="text-xs font-medium text-surface-500 dark:text-surface-400">전체 URL</span>
                <span class="text-xs text-surface-700 dark:text-surface-200 text-center break-all">
                  {{ qrUrl }}
                </span>
              </div>
              <div class="flex flex-col gap-1 items-center">
                <span class="text-xs font-medium text-surface-500 dark:text-surface-400">경로</span>
                <span class="text-xs text-surface-700 dark:text-surface-200 text-center break-all">
                  {{ previewPath }}
                </span>
              </div>
            </div>

            <!-- 안내 텍스트 -->
            <p class="mt-6 text-[11px] text-surface-400 dark:text-surface-500 text-center">
              QR 코드를 스캔하면 현재 페이지의 미리보기 화면으로 이동합니다.
            </p>
          </div>
        </div>
      </div>


    </div>

    <!-- 모바일에서만 표시되는 미리보기 버튼 -->
    <Button
      v-if="props.isMobile"
      :icon="props.isPreviewMode ? 'pi pi-pencil' : 'pi pi-eye'"
      :severity="props.isPreviewMode ? 'primary' : 'secondary'"
      text
      size="small"
      :disabled="!props.currentPage"
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 !w-9 !h-9 shadow-sm z-50 bg-primary-500 dark:bg-primary-600 text-white"

      v-tooltip.left="props.currentPage ? (props.isPreviewMode ? '편집 모드' : '미리보기') : '페이지를 선택해주세요'"
      @click="$emit('toggle-preview')"
    />
  </main>
</template>

<script lang="ts" setup>
import QrcodeVue from 'qrcode.vue'
import type { CanvasItem, Page } from '~/types/component'
import draggable from 'vuedraggable'
import ComponentRenderer from '~/components/ComponentRenderer.vue'
import { applySizeStyle, applyPositionStyle, applyAppearanceOpacityStyle } from '~/utils/style'

const Draggable = draggable

import type { ComponentDef } from '~/types/component'
import { createEmptyGridCells } from '~/utils/array'
import { findIndexById } from '~/utils/array'

interface PreviewProps {
  canvasItems: CanvasItem[]
  selectedIndex: number | null
  isPreviewMode: boolean
  isMobile: boolean
  previewPath?: string
  simple?: boolean // 간단 모드 (카드 디자인 없이 컴포넌트만 렌더링)
  pageNotFound?: boolean // 페이지가 존재하지 않음
  isLoading?: boolean // 데이터 로딩 중
  currentPage?: Page | null // 현재 페이지 (모바일 미리보기 버튼용)
  draggedComponent?: ComponentDef | null // 드래그 중인 컴포넌트
}

interface PreviewEmits {
  (e: 'update:canvasItems', items: CanvasItem[]): void
  (e: 'update:selectedIndex', index: number | null): void
  (e: 'update:draggedComponent', comp: ComponentDef | null): void
  (e: 'toggle-preview'): void // 미리보기 모드 토글
}

const props = defineProps<PreviewProps>()
const emit = defineEmits<PreviewEmits>()

// QR 플립 패널 상태
const showQrPanel = ref<boolean>(false)

// 현재 페이지의 프리뷰 URL (전체 URL)
const requestURL = useRequestURL()
const qrUrl = computed(() => {
  if (!props.previewPath) return ''
  return `${requestURL.origin}${props.previewPath}`
})

const toggleQrPanel = () => {
  if (!qrUrl.value) return
  showQrPanel.value = !showQrPanel.value
}

// 요소의 스타일 계산 함수 (form 컴포넌트 제외)
const getElementStyle = (element: CanvasItem) => {
  // 저장된 값과 기본값 병합 (component.ts 기본값 우선)
  const defaultStylesFromComposable = getDefaultProps().styles
  const componentDefaults = getComponentDefaults(element.type || '')
  const savedStyles = element.styles || {}
  
  // 기본값 우선, 저장된 값으로 덮어쓰기
  const styles: Record<string, any> = {
    // 1. component.ts의 타입별 기본값 (width, height, fontSize 등)
    ...componentDefaults.styles,
    // 2. 공통 기본값 (position, appearance 등)
    ...defaultStylesFromComposable,
    // 3. 저장된 값 (사용자가 수정한 값)
    ...savedStyles,
    // position, appearance는 중첩 객체이므로 별도 병합
    position: {
      ...defaultStylesFromComposable.position,
      ...savedStyles.position
    },
    appearance: {
      ...defaultStylesFromComposable.appearance,
      ...savedStyles.appearance
    }
  }
  
  const style: Record<string, string> = {}
  
  // Position
  applyPositionStyle(style, styles)
  
  // Layout (form 컴포넌트는 제외)
  const formTypes = ['inputText', 'inputPassword', 'inputEmail', 'inputDate', 'inputTime', 'select', 'textarea', 'inputUrl', 'checkbox', 'radio', 'toggleSwitch']
  if (element.type && !formTypes.includes(element.type)) {
    applySizeStyle(style, styles, 'width')
    applySizeStyle(style, styles, 'height')
  }
  
  // Appearance
  if (styles.appearance) {
    if (styles.appearance.opacity !== undefined && styles.appearance.opacity !== null) {
      style.opacity = `${styles.appearance.opacity / 100}`
    }
    if (styles.appearance.cornerRadius !== undefined && styles.appearance.cornerRadius !== null) {
      style.borderRadius = `${styles.appearance.cornerRadius}px`
    }
    if (styles.appearance.borderStyle && styles.appearance.borderStyle !== 'none') {
      const borderPosition = styles.appearance.borderPosition || 'none'
      const borderWidth = '1px'
      
      if (borderPosition === 'none') {
        // 전체 보더 적용
        style.border = `${borderWidth} ${styles.appearance.borderStyle}`
      } else {
        // 특정 위치 보더 적용
        const borderKey = `border${borderPosition.charAt(0).toUpperCase() + borderPosition.slice(1)}`
        style[borderKey] = `${borderWidth} ${styles.appearance.borderStyle}`
      }
    }
  }
  
  return style
}

// 요소의 Typography 스타일 계산 함수
const getTypographyStyle = (element: CanvasItem) => {
  // 저장된 값과 기본값 병합
  const componentDefaults = getComponentDefaults(element.type || '')
  const savedStyles = element.styles || {}
  
  // 기본값 우선, 저장된 값으로 덮어쓰기
  const styles: Record<string, any> = {
    ...componentDefaults.styles,
    ...savedStyles
  }
  
  const style: Record<string, string> = {}
  
  // styles에서 직접 Typography 관련 키 확인
  if (styles.fontSize !== undefined && styles.fontSize !== null) {
    if (typeof styles.fontSize === 'string') {
      style.fontSize = styles.fontSize
    } else if (typeof styles.fontSize === 'number') {
      style.fontSize = `${styles.fontSize}px`
    }
  }
  if (styles.fontFamily) {
    style.fontFamily = styles.fontFamily
  }
  if (styles.fontWeight) {
    style.fontWeight = styles.fontWeight
  }
  if (styles.textAlign) {
    style.textAlign = styles.textAlign
  }
  
  return style
}

// Form 컴포넌트의 input 요소에만 적용할 Layout 스타일 계산 함수
const getFormInputStyle = (element: CanvasItem) => {
  // 저장된 값과 기본값 병합
  const componentDefaults = getComponentDefaults(element.type || '')
  const savedStyles = element.styles || {}
  
  // 기본값 우선, 저장된 값으로 덮어쓰기
  const styles: Record<string, any> = {
    ...componentDefaults.styles,
    ...savedStyles
  }
  
  const style: Record<string, string> = {}
  
  // Layout (form 컴포넌트의 input 요소에만 적용)
  applySizeStyle(style, styles, 'width')
  applySizeStyle(style, styles, 'height')
  
  return style
}

// 이전/다음 버튼의 각 버튼에 적용할 Layout 스타일 계산 함수
const getPrevNextButtonStyle = (element: CanvasItem) => {
  // 저장된 값과 기본값 병합
  const componentDefaults = getComponentDefaults(element.type || '')
  const savedStyles = element.styles || {}
  
  // 기본값 우선, 저장된 값으로 덮어쓰기
  const styles: Record<string, any> = {
    ...componentDefaults.styles,
    ...savedStyles
  }
  
  const style: Record<string, string> = {}
  
  // Layout (각 버튼에 적용)
  applySizeStyle(style, styles, 'width')
  applySizeStyle(style, styles, 'height')
  
  return style
}

// 이전/다음 버튼의 wrapper에 적용할 스타일 (Position만)
const getPrevNextWrapperStyle = (element: CanvasItem) => {
  // 저장된 값과 기본값 병합 (component.ts 기본값 우선)
  const defaultStylesFromComposable = getDefaultProps().styles
  const componentDefaults = getComponentDefaults(element.type || '')
  const savedStyles = element.styles || {}
  
  // 기본값 우선, 저장된 값으로 덮어쓰기
  const styles: Record<string, any> = {
    // 1. component.ts의 타입별 기본값 (width, height, fontSize 등)
    ...componentDefaults.styles,
    // 2. 공통 기본값 (position, appearance 등)
    ...defaultStylesFromComposable,
    // 3. 저장된 값 (사용자가 수정한 값)
    ...savedStyles,
    // position, appearance는 중첩 객체이므로 별도 병합
    position: {
      ...defaultStylesFromComposable.position,
      ...savedStyles.position
    },
    appearance: {
      ...defaultStylesFromComposable.appearance,
      ...savedStyles.appearance
    }
  }
  
  const style: Record<string, string> = {}
  
  // Position만 적용 (Layout은 각 버튼에 적용)
  applyPositionStyle(style, styles)
  
  // Appearance (wrapper에 적용)
  applyAppearanceOpacityStyle(style, styles)
  
  return style
}

// 일반 버튼에 적용할 Layout 스타일 계산 함수
const getButtonStyle = (element: CanvasItem) => {
  // 저장된 값과 기본값 병합
  const componentDefaults = getComponentDefaults(element.type || '')
  const savedStyles = element.styles || {}
  
  // 기본값 우선, 저장된 값으로 덮어쓰기
  const styles: Record<string, any> = {
    ...componentDefaults.styles,
    ...savedStyles
  }
  
  const style: Record<string, string> = {}
  
  // Layout (버튼에 적용)
  applySizeStyle(style, styles, 'width')
  applySizeStyle(style, styles, 'height')
  
  return style
}

// 일반 버튼의 wrapper에 적용할 스타일 (Position만)
const getButtonWrapperStyle = (element: CanvasItem) => {
  // 저장된 값과 기본값 병합 (component.ts 기본값 우선)
  const defaultStylesFromComposable = getDefaultProps().styles
  const componentDefaults = getComponentDefaults(element.type || '')
  const savedStyles = element.styles || {}
  
  // 기본값 우선, 저장된 값으로 덮어쓰기
  const styles: Record<string, any> = {
    // 1. component.ts의 타입별 기본값 (width, height, fontSize 등)
    ...componentDefaults.styles,
    // 2. 공통 기본값 (position, appearance 등)
    ...defaultStylesFromComposable,
    // 3. 저장된 값 (사용자가 수정한 값)
    ...savedStyles,
    // position, appearance는 중첩 객체이므로 별도 병합
    position: {
      ...defaultStylesFromComposable.position,
      ...savedStyles.position
    },
    appearance: {
      ...defaultStylesFromComposable.appearance,
      ...savedStyles.appearance
    }
  }
  
  const style: Record<string, string> = {}
  
  // Position만 적용 (Layout은 버튼에 적용)
  applyPositionStyle(style, styles)
  
  // Appearance (wrapper에 적용)
  applyAppearanceOpacityStyle(style, styles)
  
  return style
}

// 드래그 오버 상태 관리
const isDraggingOverGrid = ref<string | null>(null)
const isDraggingOverGroup = ref<string | null>(null)

function handleGridDragOver(event: DragEvent, gridElement: CanvasItem, cellIndex: number) {
  isDraggingOverGrid.value = `${gridElement.id}-${cellIndex}`
}

function handleGridDragLeave(gridElement: CanvasItem, cellIndex: number) {
  // 실제로 영역을 벗어났는지 확인
  setTimeout(() => {
    if (isDraggingOverGrid.value === `${gridElement.id}-${cellIndex}`) {
      isDraggingOverGrid.value = null
    }
  }, 50)
}

const { generateUid, getComponentDefaults } = useElements()
const { cloneCanvasItems } = useCanvas()
const { getDefaultProps } = useElementOptions()

// 드래그된 컴포넌트로 새 아이템 생성 (Elements.vue의 handleAdd와 동일한 로직)
function createItemFromDraggedComponent(): CanvasItem | null {
  if (!props.draggedComponent) return null
  
  const comp = props.draggedComponent
  
  // uniq id할당
  const uniqueId = generateUid()
  
  const newItem: CanvasItem = {
    ...comp.defaultProps,
    id: uniqueId
  }
  
  return newItem
}

// 드롭 처리 (내부에서 처리)
function handleDrop() {
  if (!props.draggedComponent) return
  
  const newItem = createItemFromDraggedComponent()
  if (!newItem) return
  
  const updatedItems = [...props.canvasItems, newItem]
  emit('update:canvasItems', updatedItems)
  emit('update:draggedComponent', null)
}

// 컴포넌트 선택 (내부에서 처리)
function handleSelect(index: number) {
  emit('update:selectedIndex', index)
}

// 컴포넌트 삭제 (내부에서 처리)
function handleDelete(index: number) {
  const updatedItems = [...props.canvasItems]
  updatedItems.splice(index, 1)
  emit('update:canvasItems', updatedItems)
  
  if (props.selectedIndex === index) {
    emit('update:selectedIndex', null)
  } else if (props.selectedIndex !== null && props.selectedIndex > index) {
    emit('update:selectedIndex', props.selectedIndex - 1)
  }
}

// 컴포넌트 복사 (내부에서 처리)
function handleCopy(index: number) {
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

// 선택 해제 (내부에서 처리)
function handleDeselect() {
  emit('update:selectedIndex', null)
}

function handleGridDrop(event: DragEvent, gridElement: CanvasItem, cellIndex: number) {
  isDraggingOverGrid.value = null
  
  if (!props.draggedComponent) return
  
  const gridIndex = findIndexById(props.canvasItems, gridElement.id)
  if (gridIndex === -1) return
  
  const gridItem = props.canvasItems[gridIndex]
  if (!gridItem) return
  
  if (!gridItem.items) {
    gridItem.items = createEmptyGridCells<CanvasItem[]>(gridItem.data?.columns || gridItem.columns || 2) as unknown as CanvasItem[][]
  }
  
  const newItem = createItemFromDraggedComponent()
  if (!newItem) return
  
  const gridItems = gridItem.items as CanvasItem[][]
  if (!gridItems[cellIndex]) {
    gridItems[cellIndex] = []
  }
  gridItems[cellIndex] = [newItem]
  
  const updatedItems = [...props.canvasItems]
  updatedItems[gridIndex] = gridItem
  emit('update:canvasItems', updatedItems)
  emit('update:draggedComponent', null)
}

function handleGroupDragOver(event: DragEvent, groupElement: CanvasItem) {
  isDraggingOverGroup.value = groupElement.id
}

function handleGroupDragLeave(groupElement: CanvasItem) {
  // 실제로 영역을 벗어났는지 확인
  setTimeout(() => {
    if (isDraggingOverGroup.value === groupElement.id) {
      isDraggingOverGroup.value = null
    }
  }, 50)
}

function handleGroupDrop(event: DragEvent, groupElement: CanvasItem) {
  isDraggingOverGroup.value = null
  
  if (!props.draggedComponent) return
  
  const groupIndex = findIndexById(props.canvasItems, groupElement.id)
  if (groupIndex === -1) return
  
  const groupItem = props.canvasItems[groupIndex]
  if (!groupItem) return
  
  if (!groupItem.items) {
    groupItem.items = []
  }
  
  const newItem = createItemFromDraggedComponent()
  if (!newItem) return
  
  groupItem.items = [newItem]
  
  const updatedItems = [...props.canvasItems]
  updatedItems[groupIndex] = groupItem
  emit('update:canvasItems', updatedItems)
  emit('update:draggedComponent', null)
}

// 테이블 편집 상태 관리
const editingTable = ref<string | null>(null)

function handleTableHeaderBlur(element: CanvasItem, colIndex: number, event: Event) {
  const target = event.target as HTMLInputElement
  const columns = element.data?.columns ?? element.columns
  if (!columns) return
  if (!element.data) {
    element.data = {}
  }
  element.data.columns = element.data.columns ?? columns
  element.data.columns[colIndex] = target.value || `컬럼 ${colIndex + 1}`
  editingTable.value = null
  emit('update:canvasItems', [...props.canvasItems])
}

function handleTableCellBlur(element: CanvasItem, rowIndex: number, cellIndex: number, event: Event) {
  const target = event.target as HTMLInputElement
  const rows = element.data?.rows ?? element.rows
  if (!rows) return
  if (!element.data) {
    element.data = {}
  }
  element.data.rows = element.data.rows ?? rows
  if (!element.data.rows[rowIndex]) {
    element.data.rows[rowIndex] = []
  }
  element.data.rows[rowIndex][cellIndex] = target.value || '데이터'
  editingTable.value = null
  emit('update:canvasItems', [...props.canvasItems])
}

function handleAddTableRow(element: CanvasItem) {
  const columns = element.data?.columns ?? element.columns
  if (!columns) return
  if (!element.data) {
    element.data = {}
  }
  if (!element.data.rows) {
    element.data.rows = element.rows ?? []
  }
  const newRow = columns.map(() => '데이터')
  element.data.rows.push(newRow)
  emit('update:canvasItems', [...props.canvasItems])
}
</script>

<style lang="scss" scoped>
.preview-card {
  perspective: 1200px;
}

.preview-flip-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.preview-flip-container.is-flipped {
  transform: rotateY(180deg);
}

.preview-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

.preview-front {
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-back {
  transform: rotateY(180deg);
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.canvas-item {
  @apply p-4 border border-transparent transition-all cursor-pointer;
  border-radius: 0 !important;
}

// 하이라이트 보더는 편집 화면에서만 사용 (preview/[id] 단순 프리뷰에서는 비적용)
.highlight-border .canvas-item:hover {
  @apply border-primary-500;
  border-radius: 0 !important;
}

.highlight-border .canvas-item.selected {
  @apply border-primary-500;
  border-radius: 0 !important;
}

// 미리보기 모드에서는 canvas-item 호버 시 보더 변경 차단 및 커서 기본값으로 변경
.preview-mode .canvas-item {
  cursor: default !important;
}

.preview-mode .canvas-item:hover {
  // Tailwind의 color-mix를 완전히 오버라이드
  border-color: transparent !important;
  --tw-border-opacity: 0 !important;
  border: 1px solid transparent !important;
  // 모든 가능한 보더 속성 오버라이드
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  border-left-color: transparent !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Field 버튼 스타일 - PrimeVue 기본 스타일 강제 적용
:deep(.p-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

:deep(.p-button.p-button-primary) {
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  border-color: var(--p-primary-color);
}

:deep(.p-button.p-button-primary:hover) {
  background: var(--p-primary-hover-color);
  border-color: var(--p-primary-hover-color);
}

:deep(.p-button.p-button-secondary.p-button-outlined) {
  background: transparent;
  color: var(--p-secondary-color);
  border-color: var(--p-secondary-color);
}

:deep(.p-button.p-button-secondary.p-button-outlined:hover) {
  background: var(--p-secondary-hover-color);
  color: var(--p-secondary-contrast-color);
}

// 폼 필드 초기 렌더링 스타일 강제 적용
.form-field-wrapper {
  :deep(.p-inputtext),
  :deep(.p-textarea),
  :deep(.p-dropdown),
  :deep(.p-button),
  :deep(.p-datepicker) {
    min-height: 2.5rem;
    height: auto;
    box-sizing: border-box;
  }
  :deep(.p-inputtext) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  :deep(.p-textarea) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
  }

}

// Divider 배경 스타일 (다크모드/라이트모드 대응)
:deep(.divider-default) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
}

:deep(.divider-default hr) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
  height: 100% !important;
}

:deep(.divider-default.p-divider) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
}

:deep(.divider-default.p-divider-horizontal) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
  border-top: none !important;
  margin: 0 !important;
  }

:deep(.divider-default.p-divider-vertical) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
  border-left: none !important;
}

// 다크 모드
:deep(.dark .divider-default) {
  background-color: var(--p-surface-700, #374151) !important;
  }

:deep(.dark .divider-default hr) {
  background-color: var(--p-surface-700, #374151) !important;
}

:deep(.dark .divider-default.p-divider) {
  background-color: var(--p-surface-700, #374151) !important;
}

:deep(.dark .divider-default.p-divider-horizontal) {
  background-color: var(--p-surface-700, #374151) !important;
  margin: 0 !important;
}

:deep(.dark .divider-default.p-divider-vertical) {
  background-color: var(--p-surface-700, #374151) !important;
}

// 버튼 width/height 적용 (인라인 스타일 우선순위 높임)
.button-wrapper {
  :deep(.button-element.p-button),
  :deep(.button-element.p-button.p-component),
  :deep(.button-element.p-button.p-button-primary),
  :deep(.button-element.p-button.p-button-secondary),
  :deep(.button-element.p-button.p-button-outlined),
  :deep(.button-element.p-button.p-button-text),
  :deep(.button-element.p-button.p-button-sm) {
    // PrimeVue의 기본 min-width 제거하여 인라인 스타일이 적용되도록
    min-width: 0 !important;
    max-width: none !important;
    flex-shrink: 1 !important;
  }
}

// 이전/다음 버튼 width/height 적용 (인라인 스타일 우선순위 높임)
:deep(.prevnext-button.p-button),
:deep(.prevnext-button.p-button.p-component),
:deep(.prevnext-button.p-button.p-button-primary),
:deep(.prevnext-button.p-button.p-button-secondary),
:deep(.prevnext-button.p-button.p-button-outlined),
:deep(.prevnext-button.p-button.p-button-text),
:deep(.prevnext-button.p-button.p-button-sm) {
  // PrimeVue의 기본 min-width 제거하여 인라인 스타일이 적용되도록
  min-width: 0 !important;
  max-width: none !important;
  flex-shrink: 1 !important;
}
</style>