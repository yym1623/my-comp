<template>
  <Transition name="slide">
    <div
      v-if="currentPage && selectedIndex !== null && selectedItem"
      class="absolute inset-0 bg-surface-0 dark:bg-surface-800 flex flex-col z-10"
    >
      <!-- 속성 패널 헤더 -->
      <div class="px-3 py-2.5 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 shrink-0">
        <Button
          icon="pi pi-arrow-left"
          severity="secondary"
          text
          rounded
          size="small"
          @click="$emit('closeOptions')"
        />
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <template v-if="selectedItem.type === 'heading1'">
            <H1Icon class="text-base text-surface-500 dark:text-surface-400 shrink-0 w-4 h-4" />
          </template>
          <template v-else-if="selectedItem.type === 'heading2'">
            <H2Icon class="text-base text-surface-500 dark:text-surface-400 shrink-0 w-4 h-4" />
          </template>
          <template v-else-if="selectedItem.type === 'heading3'">
            <H3Icon class="text-base text-surface-500 dark:text-surface-400 shrink-0 w-4 h-4" />
          </template>
          <i 
            v-else
            :class="getComponentIcon(selectedItem.type || '')" 
            class="text-base text-surface-500 dark:text-surface-400 shrink-0" 
          />
          <div class="flex flex-col min-w-0 flex-1">
            <span class="text-sm font-semibold text-surface-700 dark:text-surface-200 truncate">
              {{ getComponentName(selectedItem.type || '') }}
            </span>
          </div>
        </div>
      </div>
      <!-- 속성 편집 영역 -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <template v-if="selectedIndex !== null && selectedItem">
          <div class="px-3 py-2.5 w-full min-w-0 space-y-4">
            <!-- Position 섹션 -->
            <div class="relative">
              <Ready v-if="sectionReady.Position === false" />
              <div class="flex items-center gap-2 pb-1.5">
                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  Position
                </span>
              </div>
              <div class="space-y-2">
                <!-- X/Y -->
                <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">X</label>
                    <InputNumber
                      :model-value="getFieldValue('position.x')"
                      :min="0"
                      :disabled="getFieldDisabled('position.x')"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('position.x', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Y</label>
                    <InputNumber
                      :model-value="getFieldValue('position.y')"
                      :min="0"
                      :disabled="getFieldDisabled('position.y')"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('position.y', $event)"
                    />
                  </div>
                </div>
                <!-- Rotation -->
                <div class="space-y-0.5">
                  <label class="figma-label">Rotation</label>
                  <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                    <InputNumber
                      :model-value="getFieldValue('position.rotation')"
                      :min="-360"
                      :max="360"
                      :disabled="getFieldDisabled('position.rotation')"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('position.rotation', $event)"
                    />
                    <ButtonGroup class="w-full min-w-0">
                      <Button
                        icon="pi pi-refresh"
                        severity="secondary"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.rotation', 0)"
                      />
                      <Button
                        icon="pi pi-arrows-h"
                        severity="secondary"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.rotation', (getFieldValue('position.rotation') || 0) + 90)"
                      />
                      <Button
                        icon="pi pi-arrows-v"
                        severity="secondary"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.rotation', (getFieldValue('position.rotation') || 0) - 90)"
                      />
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            
            <!-- Layout 섹션 -->
            <div class="relative">
              <Ready v-if="sectionReady.Layout === false" />
              <div class="flex items-center gap-2 pb-1.5">
                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  Layout
                </span>
              </div>
              <div class="space-y-2">
                <!-- W/H -->
                <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">W</label>
                    <InputGroup class="w-full input-group-width-height">
                      <InputNumber
                        :model-value="getWidthValue()"
                        :min="0"
                        :disabled="getFieldDisabled('styles.width') || props.selectedItem?.type === 'spacer'"
                        class="figma-input w-[40%]"
                        @update:model-value="handleWidthChange($event)"
                      />
                      <Select
                        :model-value="getWidthUnit()"
                        :options="[{ label: 'px', value: 'px' }, { label: '%', value: '%' }]"
                        optionLabel="label"
                        optionValue="value"
                        :disabled="getFieldDisabled('styles.width') || props.selectedItem?.type === 'spacer'"
                        class="figma-input w-[60%]"
                        @update:model-value="handleWidthUnitChange($event)"
                      />
                    </InputGroup>
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">H</label>
                    <InputGroup class="w-full input-group-width-height">
                      <InputNumber
                        :model-value="getHeightValue()"
                        :min="0"
                        :disabled="getFieldDisabled('styles.height')"
                        class="figma-input w-[40%]"
                        @update:model-value="handleHeightChange($event)"
                      />
                      <Select
                        :model-value="getHeightUnit()"
                        :options="[{ label: 'px', value: 'px' }, { label: '%', value: '%' }]"
                        optionLabel="label"
                        optionValue="value"
                        :disabled="getFieldDisabled('styles.height')"
                        class="figma-input w-[60%]"
                        @update:model-value="handleHeightUnitChange($event)"
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            
            <!-- Appearance 섹션 -->
            <div class="relative">
              <Ready v-if="sectionReady.Appearance === false" />
              <div class="flex items-center gap-2 pb-1.5">
                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  Appearance
                </span>
              </div>
              <div class="space-y-2">
                <!-- Opacity / Corner Radius -->
                <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Opacity</label>
                    <InputNumber
                      :model-value="getFieldValue('appearance.opacity')"
                      :min="0"
                      :max="100"
                      :disabled="getFieldDisabled('appearance.opacity')"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('appearance.opacity', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Border radius</label>
                    <InputNumber
                      :model-value="getFieldValue('appearance.cornerRadius')"
                      :min="0"
                      :disabled="getFieldDisabled('appearance.cornerRadius') || isBorderDisabled"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('appearance.cornerRadius', $event)"
                    />
                  </div>
                </div>
                <!-- Border Style / Border Position -->
                <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Border Style</label>
                    <Select
                      :model-value="getFieldValue('appearance.borderStyle')"
                      :options="borderStyleOptions"
                      optionLabel="label"
                      optionValue="value"
                      :disabled="getFieldDisabled('appearance.borderStyle')"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('appearance.borderStyle', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Border Position</label>
                    <Select
                      :model-value="getFieldValue('appearance.borderPosition')"
                      :options="borderPositionOptions"
                      optionLabel="label"
                      optionValue="value"
                      :disabled="getFieldDisabled('appearance.borderPosition') || isBorderDisabled"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('appearance.borderPosition', $event)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider />
            
            <!-- Typography 섹션 -->
            <div class="relative">
              <Ready v-if="sectionReady.Typography === false" />
              <div class="flex items-center gap-2 pb-1.5">
                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  Typography
                </span>
              </div>
              <div class="space-y-2">
                <!-- Font Size / Text Align -->
                <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Font Size</label>
                    <InputNumber
                      :model-value="getFieldValue('styles.fontSize')"
                      :min="8"
                      :max="72"
                      :disabled="getFieldDisabled('styles.fontSize')"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('styles.fontSize', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Font Align</label>
                    <ButtonGroup class="w-full min-w-0">
                      <Button
                        icon="pi pi-align-left"
                        :severity="(getFieldValue('styles.textAlign') || 'left') === 'left' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('styles.textAlign', 'left')"
                      />
                      <Button
                        icon="pi pi-align-center"
                        :severity="(getFieldValue('styles.textAlign') || 'left') === 'center' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('styles.textAlign', 'center')"
                      />
                      <Button
                        icon="pi pi-align-right"
                        :severity="(getFieldValue('styles.textAlign') || 'left') === 'right' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('styles.textAlign', 'right')"
                      />
                    </ButtonGroup>
                  </div>
                </div>
                <!-- Font Family / Font Weight -->
                <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Font Family</label>
                    <Select
                      :model-value="getFieldValue('styles.fontFamily')"
                      :options="fontFamilyOptions"
                      optionLabel="label"
                      optionValue="value"
                      :disabled="getFieldDisabled('typography.fontFamily')"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('styles.fontFamily', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Font Weight</label>
                    <Select
                      :model-value="getFieldValue('styles.fontWeight')"
                      :options="fontWeightOptions"
                      optionLabel="label"
                      optionValue="value"
                      :disabled="getFieldDisabled('typography.fontWeight')"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('styles.fontWeight', $event)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
          <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-3 shrink-0">
            <i class="pi pi-info-circle text-xl text-surface-400" />
          </div>
          <h4 class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1 whitespace-nowrap">편집할 요소를 선택하세요</h4>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>

import { H1Icon, H2Icon, H3Icon } from '@heroicons/vue/24/outline'
import { parseSizeValue, formatSizeValue } from '~/utils/string'
import type { Page, CanvasItem } from '~/types/component'

interface ElementOptionsProps {
  currentPage: Page | null
  selectedIndex: number | null
  selectedItem: CanvasItem | null
  canvasItems: CanvasItem[]
}

interface ElementOptionsEmits {
  (e: 'closeOptions'): void
  (e: 'update', updatedItem: CanvasItem): void
}

const props = defineProps<ElementOptionsProps>()
const emit = defineEmits<ElementOptionsEmits>()

const { getComponentName, getComponentIcon } = useElements()
const { getOptionsForType, getSectionReady } = useElementOptions()
const { cloneCanvasItems } = useCanvas()

// 섹션별 ready 상태 (스타일 객체 기준으로 Typography 판단)
const sectionReady = computed(() => {
  const currentItem = getCurrentSelectedItem()
  if (!currentItem) return { Layout: false, Typography: false, Appearance: false }
  
  const styles = currentItem.styles
  return getSectionReady(currentItem.type || '', styles)
})

// 옵션 가져오기
const options = computed(() => getOptionsForType(props.selectedItem?.type || ''))

// 공통 옵션 추출 유틸
const getOptionsFor = (key: string) => {
  const field = options.value.find(opt => opt.key === key)
  return Array.isArray(field?.componentProps?.options)
    ? field.componentProps.options
    : []
}

// Font Family 옵션
const fontFamilyOptions = computed(() => getOptionsFor('typography.fontFamily'))

// Font Weight 옵션
const fontWeightOptions = computed(() => getOptionsFor('typography.fontWeight'))

// Border Style 옵션
const borderStyleOptions = computed(() => getOptionsFor('appearance.borderStyle'))

// Border Style이 'none'인지 확인
const isBorderDisabled = computed(() => {
  const borderStyleField = options.value.find(opt => opt.key === 'appearance.borderStyle')
  const defaultValue = borderStyleField?.defaultValue || 'none'
  const borderStyle = getFieldValue('appearance.borderStyle') || defaultValue
  return borderStyle === 'none'
})

// Border Position 옵션
const borderPositionOptions = computed(() => getOptionsFor('appearance.borderPosition'))

// 필드 값 가져오기/설정 관련 내부 유틸
const parseKey = (key: string) => {
  if (!key.includes('.')) return null
  const parts = key.split('.')
  if (parts.length !== 2) return null
  const [objKey, propKey] = parts
  if (!objKey || !propKey) return null
  return { objKey, propKey }
}

const getDefaultValue = (key: string) => {
  const field = options.value.find(opt => opt.key === key)
  return field?.defaultValue
}

// 현재 선택된 아이템을 canvasItems에서 id로 찾기
const getCurrentSelectedItem = (): CanvasItem | null => {
  if (!props.selectedItem?.id) return null
  return props.canvasItems.find(item => item.id === props.selectedItem?.id) || null
}

const getFromStyles = (objKey: string, propKey: string) => {
  const currentItem = getCurrentSelectedItem()
  if (!currentItem) return undefined
  
  const styles = (currentItem as any).styles
  if (!styles) return undefined
  
  // styles가 직접 키를 가지고 있는 경우 (예: styles.width, styles.fontSize)
  if (objKey === 'styles' && propKey) {
    return styles[propKey]
  }
  
  // 기존 구조 지원 (예: styles.position.x, styles.layout.width)
  const obj = styles[objKey]
  if (!obj || typeof obj !== 'object') return undefined
  return obj[propKey]
}

const getFromLegacyProps = (objKey: string, propKey: string) => {
  const currentItem = getCurrentSelectedItem()
  if (!currentItem) return undefined
  
  const selectedItem = currentItem as any
  const obj = selectedItem[objKey]
  if (!obj || typeof obj !== 'object') return undefined
  return obj[propKey]
}

// 필드 값 가져오기 (객체 경로 지원: 'position.x', 'layout.width' 등, styles 객체 사용)
const getFieldValue = (key: string) => {
  const currentItem = getCurrentSelectedItem()
  if (!currentItem) return undefined

  const parsed = parseKey(key)
  if (parsed) {
    const { objKey, propKey } = parsed

    // styles 객체에서 가져오기
    const styleValue = getFromStyles(objKey, propKey)
    if (styleValue !== undefined && styleValue !== null) {
      return styleValue
    }

    // 기존 구조 지원 (하위 호환성)
    const legacyValue = getFromLegacyProps(objKey, propKey)
    if (legacyValue !== undefined && legacyValue !== null) {
      return legacyValue
    }

    // 값이 없으면 컴포저블의 기본값 반환
    return getDefaultValue(key)
  }

  // 일반 필드 (styles 객체가 아닌 경우)
  const value = (currentItem as any)[key]
  if (value === undefined || value === null) {
    return getDefaultValue(key)
  }
  return value
}

// 필드 disabled 상태 가져오기
const getFieldDisabled = (key: string) => {
  const field = options.value.find(opt => opt.key === key)
  return field?.disabled || false
}


// ensureStylesObject는 더 이상 사용하지 않음 (updateFieldValue에서 직접 처리)
const ensureStylesObject = (objKey: string) => {
  // 이 함수는 updateFieldValue에서 직접 처리하므로 사용하지 않음
  return {}
}

// 필드 값 업데이트 (객체 경로 지원: 'position.x', 'styles.width' 등, styles 객체 사용)
const updateFieldValue = (key: string, value: any) => {
  if (!props.selectedItem) return

  // id를 사용하여 canvasItems에서 특정 아이템 찾기
  const itemIndex = props.canvasItems.findIndex(item => item.id === props.selectedItem?.id)
  if (itemIndex === -1) return

  // 아이템을 깊은 복사하여 수정 (원본 참조 문제 방지)
  const sourceItem = props.canvasItems[itemIndex]
  if (!sourceItem) return
  const clonedItems = cloneCanvasItems([sourceItem])
  if (clonedItems.length === 0) return
  const itemToUpdate = clonedItems[0]
  if (!itemToUpdate) return

  const parsed = parseKey(key)
  const selectedItem = itemToUpdate as any

  if (parsed) {
    const { objKey, propKey } = parsed

    // styles가 직접 키를 가지고 있는 경우 (예: styles.width, styles.fontSize)
    if (objKey === 'styles') {
      if (!selectedItem.styles) {
        selectedItem.styles = {}
      }
      if (typeof value === 'number') {
        selectedItem.styles[propKey] = value
      } else {
        selectedItem.styles[propKey] = value ?? ''
      }
    } else {
      // 기존 구조 지원 (예: position.x, layout.width)
      if (!selectedItem.styles) {
        selectedItem.styles = {}
      }
      if (!selectedItem.styles[objKey]) {
        selectedItem.styles[objKey] = {}
      }
      if (typeof value === 'number') {
        selectedItem.styles[objKey][propKey] = value
      } else {
        selectedItem.styles[objKey][propKey] = value ?? ''
      }
    }
  } else {
    // 일반 필드 처리 (styles 객체가 아닌 경우)
    if (typeof value === 'number') {
      selectedItem[key] = value
    } else {
      selectedItem[key] = value ?? ''
    }
  }

  // 변경사항 알림 (업데이트된 아이템 전달)
  emit('update', itemToUpdate as CanvasItem)
}

// width 값 가져오기 (숫자만)
const getWidthValue = (): number | undefined => {
  const currentItem = getCurrentSelectedItem()
  if (!currentItem) return undefined
  
  const width = (currentItem as any)?.styles?.width
  if (!width) return undefined
  const parsed = parseSizeValue(width)
  return parsed?.value
}

// width 단위 가져오기
const getWidthUnit = (): string => {
  const currentItem = getCurrentSelectedItem()
  if (!currentItem) return 'px'
  
  const width = (currentItem as any)?.styles?.width
  if (!width) return 'px'
  const parsed = parseSizeValue(width)
  return parsed?.unit || 'px'
}

// height 값 가져오기 (숫자만)
const getHeightValue = (): number | undefined => {
  const currentItem = getCurrentSelectedItem()
  if (!currentItem) return undefined
  
  const height = (currentItem as any)?.styles?.height
  if (!height) return undefined
  const parsed = parseSizeValue(height)
  return parsed?.value
}

// height 단위 가져오기
const getHeightUnit = (): string => {
  const currentItem = getCurrentSelectedItem()
  if (!currentItem) return 'px'
  
  const height = (currentItem as any)?.styles?.height
  if (!height) return 'px'
  const parsed = parseSizeValue(height)
  return parsed?.unit || 'px'
}

// width 값 변경 핸들러
const handleWidthChange = (value: number | null) => {
  if (!props.selectedItem || value === null) return
  // id를 사용하여 canvasItems에서 특정 아이템 찾기
  const itemIndex = props.canvasItems.findIndex(item => item.id === props.selectedItem?.id)
  if (itemIndex === -1) return
  // 아이템을 깊은 복사하여 수정 (원본 참조 문제 방지)
  const sourceItem = props.canvasItems[itemIndex]
  if (!sourceItem) return
  const clonedItems = cloneCanvasItems([sourceItem])
  if (clonedItems.length === 0) return
  const itemToUpdate = clonedItems[0]
  if (!itemToUpdate) return
  const selectedItem = itemToUpdate as any
  if (!selectedItem.styles) {
    selectedItem.styles = {}
  }
  const currentUnit = getWidthUnit()
  selectedItem.styles.width = formatSizeValue(value, currentUnit)
  emit('update', itemToUpdate as CanvasItem)
}

// width 단위 변경 핸들러 (%로 변경 시 값이 100 초과하면 100으로 제한)
const handleWidthUnitChange = (newUnit: string) => {
  if (!props.selectedItem) return
  // id를 사용하여 canvasItems에서 특정 아이템 찾기
  const itemIndex = props.canvasItems.findIndex(item => item.id === props.selectedItem?.id)
  if (itemIndex === -1) return
  // 아이템을 깊은 복사하여 수정 (원본 참조 문제 방지)
  const sourceItem = props.canvasItems[itemIndex]
  if (!sourceItem) return
  const clonedItems = cloneCanvasItems([sourceItem])
  if (clonedItems.length === 0) return
  const itemToUpdate = clonedItems[0]
  if (!itemToUpdate) return
  const selectedItem = itemToUpdate as any
  if (!selectedItem.styles) {
    selectedItem.styles = {}
  }
  const currentValue = getWidthValue() || 0
  let finalValue = currentValue
  
  // %로 변경되고 현재 값이 100을 초과하면 100으로 제한
  if (newUnit === '%' && currentValue > 100) {
    finalValue = 100
  }
  
  selectedItem.styles.width = formatSizeValue(finalValue, newUnit)
  emit('update', itemToUpdate)
}

// height 값 변경 핸들러
const handleHeightChange = (value: number | null) => {
  if (!props.selectedItem || value === null) return
  // id를 사용하여 canvasItems에서 특정 아이템 찾기
  const itemIndex = props.canvasItems.findIndex(item => item.id === props.selectedItem?.id)
  if (itemIndex === -1) return
  // 아이템을 깊은 복사하여 수정 (원본 참조 문제 방지)
  const sourceItem = props.canvasItems[itemIndex]
  if (!sourceItem) return
  const clonedItems = cloneCanvasItems([sourceItem])
  if (clonedItems.length === 0) return
  const itemToUpdate = clonedItems[0]
  if (!itemToUpdate) return
  const selectedItem = itemToUpdate as any
  if (!selectedItem.styles) {
    selectedItem.styles = {}
  }
  const currentUnit = getHeightUnit()
  selectedItem.styles.height = formatSizeValue(value, currentUnit)
  emit('update', itemToUpdate)
}

// height 단위 변경 핸들러 (%로 변경 시 값이 100 초과하면 100으로 제한)
const handleHeightUnitChange = (newUnit: string) => {
  if (!props.selectedItem) return
  // id를 사용하여 canvasItems에서 특정 아이템 찾기
  const itemIndex = props.canvasItems.findIndex(item => item.id === props.selectedItem?.id)
  if (itemIndex === -1) return
  // 아이템을 깊은 복사하여 수정 (원본 참조 문제 방지)
  const sourceItem = props.canvasItems[itemIndex]
  if (!sourceItem) return
  const clonedItems = cloneCanvasItems([sourceItem])
  if (clonedItems.length === 0) return
  const itemToUpdate = clonedItems[0]
  if (!itemToUpdate) return
  const selectedItem = itemToUpdate as any
  if (!selectedItem.styles) {
    selectedItem.styles = {}
  }
  const currentValue = getHeightValue() || 0
  let finalValue = currentValue
  
  // %로 변경되고 현재 값이 100을 초과하면 100으로 제한
  if (newUnit === '%' && currentValue > 100) {
    finalValue = 100
  }
  
  selectedItem.styles.height = formatSizeValue(finalValue, newUnit)
  emit('update', itemToUpdate)
}
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

.figma-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--p-surface-500, #6b7280);
}

:deep(.p-divider) {
  border-color: var(--p-surface-200, #e5e7eb) !important;
  margin: 0.5rem 0 !important;
}

:deep(.dark .p-divider) {
  border-color: var(--p-surface-700, #374151) !important;
}

:deep(.p-buttongroup) {
  width: 100% !important;
  max-width: 100% !important;
  display: flex !important;
  min-width: 0 !important;

  .p-button,
  :deep(.p-button) {
    flex: 1 1 0 !important;
    min-width: 0 !important;
    max-width: 100% !important;
    padding: 4px 8px !important;

    font-size: 11px !important;
    border-radius: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    transition: all 0.2s !important;
    background-color: transparent !important;
    color: var(--p-surface-500, #6b7280) !important;
    border-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
    
    &:hover {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: var(--p-surface-300, #d1d5db) !important;
    }
    
    &.p-button-primary {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: var(--p-surface-200, #e5e7eb) !important;
      
      &:hover {
        background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
        color: var(--p-surface-700, #374151) !important;
        border-color: var(--p-surface-200, #e5e7eb) !important;
      }
    }
    
    &.p-button-secondary {
      background-color: transparent !important;
      color: var(--p-surface-500, #6b7280) !important;
      border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
      
      &:hover {
        background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
        color: var(--p-surface-700, #374151) !important;
        border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
      }
    }
    
    &:first-child {
      border-top-left-radius: 4px !important;
      border-bottom-left-radius: 4px !important;
    }
    
    &:last-child {
      border-top-right-radius: 4px !important;
      border-bottom-right-radius: 4px !important;
    }
  }
}

:deep(.dark .p-buttongroup .p-button) {
  background-color: transparent !important;
  color: var(--p-surface-500, #6b7280) !important;
  border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  
  &:hover {
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    color: var(--p-surface-200, #e5e7eb) !important;
    border-color: var(--p-surface-500, #6b7280) !important;
  }
}

:deep(.dark .p-buttongroup .p-button-primary) {
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  color: var(--p-surface-200, #e5e7eb) !important;
  border-color: var(--p-surface-600, #4b5563) !important;
  
  &:hover {
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    color: var(--p-surface-200, #e5e7eb) !important;
    border-color: var(--p-surface-600, #4b5563) !important;
  }
}

:deep(.dark .p-buttongroup .p-button-secondary) {
  background-color: transparent !important;
  color: var(--p-surface-500, #6b7280) !important;
  border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  
  &:hover {
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    color: var(--p-surface-200, #e5e7eb) !important;
    border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  }
}


.input-group-width-height {
  :deep(.p-inputgroup),
  &.p-inputgroup {
    width: 100% !important;
    display: flex !important;
    border: 1px solid var(--p-surface-600, #4b5563) !important;
    border-radius: 4px !important;
    
    .p-inputnumber,
    .p-inputnumber-input-wrapper {
      flex: 0 0 40% !important;
      width: 40% !important;
      min-width: 0 !important;
    }
    
    .p-inputgroup-addon {
      flex: 0 0 60% !important;
      width: 60% !important;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
      display: flex !important;
      align-items: stretch !important;
    }
    
    .p-inputnumber-input,
    .p-inputnumber .p-inputnumber-input {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border: none !important;
    }
    
    .p-select,
    .p-select.p-component,
    .p-select.p-inputwrapper,
    .p-select.p-inputwrapper-filled,
    .p-select.p-inputwrapper-focus {
      width: 100% !important;
    }
  }
  
  .figma-input {
    :deep(.p-inputnumber-input) {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border: none !important;
    }
  }
  
  :deep(.dark .p-inputgroup) {
    .p-inputnumber-input,
    .p-inputnumber .p-inputnumber-input {
      border: none !important;
    }
    
    .p-select,
    .p-select.p-component,
    .p-select.p-inputwrapper,
    .p-select.p-inputwrapper-filled,
    .p-select.p-inputwrapper-focus {
      background-color: var(--p-surface-700, #374151) !important;
      color: var(--p-surface-400, #9ca3af) !important;
    }
    
    .p-select-label,
    .p-select .p-select-label,
    .p-inputwrapper .p-select-label {
      background-color: var(--p-surface-700, #374151) !important;
      color: var(--p-surface-400, #9ca3af) !important;
    }
  }
  
  .dark & {
    .figma-input {
      :deep(.p-inputnumber-input) {
        border: none !important;
      }
      
      :deep(.p-select),
      :deep(.p-select.p-component),
      :deep(.p-select.p-inputwrapper),
      :deep(.p-select.p-inputwrapper-filled),
      :deep(.p-select.p-inputwrapper-focus) {
        border: 1px solid var(--p-surface-600, #4b5563) !important;
      }
    }
  }
}

.figma-input {
  :deep(.p-inputtext),
  :deep(.p-inputnumber-input) {
    height: 26px !important;
    min-height: 26px !important;
    padding: 4px 8px !important;
    font-size: 11px !important;
    line-height: 1.2 !important;
    background-color: var(--p-surface-50, #f9fafb) !important;
    border: 1px solid var(--p-surface-200, #e5e7eb) !important;
    border-radius: 4px !important;
    color: var(--p-text-color, #1f2937) !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }

  :deep(.p-select),
  :deep(.p-select.p-component),
  :deep(.p-select.p-inputwrapper),
  :deep(.p-select.p-inputwrapper-filled),
  :deep(.p-select.p-inputwrapper-focus) {
    height: 26px !important;
    min-height: 26px !important;
    max-height: 26px !important;
    padding: 0 !important;
    font-size: 11px !important;
    line-height: 1.2 !important;
    background-color: var(--p-surface-50, #f9fafb) !important;
    border: 1px solid var(--p-surface-200, #e5e7eb) !important;
    border-radius: 4px !important;
    color: var(--p-text-color, #1f2937) !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }

  :deep(.p-inputtext:focus),
  :deep(.p-inputnumber-input:focus),
  :deep(.p-select:focus),
  :deep(.p-select.p-inputwrapper-focus) {
    border-color: var(--p-primary-500, #3b82f6) !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
    outline: none !important;
  }

  :deep(.p-inputtext:focus),
  :deep(.p-inputnumber-input:focus) {
    background-color: var(--p-surface-0, #ffffff) !important;
  }

  :deep(.p-select-label),
  :deep(.p-select .p-select-label),
  :deep(.p-select .p-select-label.p-inputtext),
  :deep(.p-inputwrapper .p-select-label) {
    padding: 4px 8px !important;
    font-size: 11px !important;
    height: 26px !important;
    min-height: 26px !important;
    max-height: 26px !important;
    line-height: 1.2 !important;
    background-color: var(--p-surface-50, #f9fafb) !important;
    color: var(--p-text-color, #1f2937) !important;
  }

  :deep(.p-select-trigger) {
    width: 20px !important;
  }

  .dark & {
    :deep(.p-inputtext),
    :deep(.p-inputnumber-input) {
      background-color: var(--p-surface-700, #374151) !important;
      border-color: var(--p-surface-600, #4b5563) !important;
      color: var(--p-text-color, #f3f4f6) !important;
    }

    :deep(.p-select),
    :deep(.p-select.p-component),
    :deep(.p-select.p-inputwrapper),
    :deep(.p-select.p-inputwrapper-filled),
    :deep(.p-select.p-inputwrapper-focus) {
      height: 26px !important;
      min-height: 26px !important;
      max-height: 26px !important;
      background-color: var(--p-surface-700, #374151) !important;
      border: 1px solid var(--p-surface-600, #4b5563) !important;
      color: var(--p-surface-400, #9ca3af) !important;
    }

    :deep(.p-select .p-select-label),
    :deep(.p-select-label),
    :deep(.p-inputwrapper .p-select-label) {
      height: 26px !important;
      min-height: 26px !important;
      max-height: 26px !important;
      background-color: var(--p-surface-700, #374151) !important;
      color: var(--p-surface-400, #9ca3af) !important;
    }

    :deep(.p-inputtext:focus),
    :deep(.p-inputnumber-input:focus) {
      background-color: var(--p-surface-800, #1f2937) !important;
      border-color: var(--p-primary-400, #60a5fa) !important;
    }
  }
}

</style>

<style lang="scss">
.p-buttongroup {
  width: 100% !important;
  max-width: 100% !important;
  display: flex !important;
  min-width: 0 !important;
  
  .p-button,
  .p-button-sm,
  .p-button.p-button-sm {
    flex: 1 1 0 !important;
    min-width: 0 !important;
    max-width: 100% !important;
    padding: 4px 8px !important;
    font-size: 11px !important;
    border-radius: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    transition: all 0.2s !important;
    background-color: transparent !important;
    color: var(--p-surface-500, #6b7280) !important;
    border-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
    border-width: 1px !important;
    
    &:hover {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: var(--p-surface-300, #d1d5db) !important;
    }
    
    &.p-button-primary {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      
      &:hover {
        background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
        color: var(--p-surface-700, #374151) !important;
        border-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      }
    }
    
    &.p-button-secondary {
      background-color: transparent !important;
      color: var(--p-surface-500, #6b7280) !important;
      border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
      
      &:hover {
        background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
        color: var(--p-surface-700, #374151) !important;
        border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
      }
    }
    
    &:first-child {
      border-top-left-radius: 4px !important;
      border-bottom-left-radius: 4px !important;
    }
    
    &:last-child {
      border-top-right-radius: 4px !important;
      border-bottom-right-radius: 4px !important;
    }
  }
}

.dark .p-buttongroup .p-button {
  background-color: transparent !important;
  color: var(--p-surface-500, #6b7280) !important;
  border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  
  &:hover {
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    color: var(--p-surface-200, #e5e7eb) !important;
    border-color: var(--p-surface-500, #6b7280) !important;
  }
}

.dark .p-buttongroup .p-button-primary {
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  color: var(--p-surface-200, #e5e7eb) !important;
  border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  
  &:hover {
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    color: var(--p-surface-200, #e5e7eb) !important;
    border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  }
}

.dark .p-buttongroup .p-button-secondary {
  background-color: transparent !important;
  color: var(--p-surface-500, #6b7280) !important;
  border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  
  &:hover {
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    color: var(--p-surface-200, #e5e7eb) !important;
    border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  }
}

.p-select,
.p-select.p-component,
.p-select.p-inputwrapper,
.p-select.p-inputwrapper-filled,
.p-select.p-inputwrapper-focus {
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
}

.p-select .p-select-label,
.p-select-label,
.p-select .p-select-label.p-inputtext,
.p-inputwrapper .p-select-label {
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
}

.dark .p-select,
.dark .p-select.p-component,
.dark .p-select.p-inputwrapper,
.dark .p-select.p-inputwrapper-filled,
.dark .p-select.p-inputwrapper-focus {
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
}

.dark .p-select .p-select-label,
.dark .p-select-label,
.dark .p-select .p-select-label.p-inputtext,
.dark .p-inputwrapper .p-select-label {
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
}
</style>