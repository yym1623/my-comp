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
            :class="getComponentIcon(selectedItem.type)" 
            class="text-base text-surface-500 dark:text-surface-400 shrink-0" 
          />
          <div class="flex flex-col min-w-0 flex-1">
            <span class="text-sm font-semibold text-surface-700 dark:text-surface-200 truncate">
              {{ getComponentName(selectedItem.type) }}
            </span>
          </div>
        </div>
      </div>
      <!-- 속성 편집 영역 -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <template v-if="selectedIndex !== null && selectedItem">
          <div class="px-3 py-2.5 w-full min-w-0 space-y-4">
            <!-- Position 섹션 -->
            <div>
              <div class="flex items-center gap-2 pb-1.5">
                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  Position
                </span>
              </div>
              <div class="space-y-2">
                <!-- Alignment -->
                <div class="space-y-0.5">
                  <label class="figma-label">Alignment</label>
                  <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                    <ButtonGroup class="w-full min-w-0">
                      <Button
                        icon="pi pi-align-left"
                        :severity="(getFieldValue('position.alignmentHorizontal') || 'left') === 'left' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.alignmentHorizontal', 'left')"
                      />
                      <Button
                        icon="pi pi-align-center"
                        :severity="(getFieldValue('position.alignmentHorizontal') || 'left') === 'center' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.alignmentHorizontal', 'center')"
                      />
                      <Button
                        icon="pi pi-align-right"
                        :severity="(getFieldValue('position.alignmentHorizontal') || 'left') === 'right' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.alignmentHorizontal', 'right')"
                      />
                    </ButtonGroup>
                    <ButtonGroup class="w-full min-w-0">
                      <Button
                        icon="pi pi-arrow-up"
                        :severity="(getFieldValue('position.alignmentVertical') || 'top') === 'top' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.alignmentVertical', 'top')"
                      />
                      <Button
                        icon="pi pi-minus"
                        :severity="(getFieldValue('position.alignmentVertical') || 'top') === 'middle' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.alignmentVertical', 'middle')"
                      />
                      <Button
                        icon="pi pi-arrow-down"
                        :severity="(getFieldValue('position.alignmentVertical') || 'top') === 'bottom' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('position.alignmentVertical', 'bottom')"
                      />
                    </ButtonGroup>
                  </div>
                </div>
                <!-- X/Y -->
                <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">X</label>
                    <InputNumber
                      :model-value="getFieldValue('position.x') ?? 0"
                      :min="0"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('position.x', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Y</label>
                    <InputNumber
                      :model-value="getFieldValue('position.y') ?? 0"
                      :min="0"
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
                      :model-value="getFieldValue('position.rotation') ?? 0"
                      :min="-360"
                      :max="360"
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
            <div>
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
                    <InputNumber
                      :model-value="getFieldValue('layout.width') ?? 0"
                      :min="0"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('layout.width', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">H</label>
                    <InputNumber
                      :model-value="getFieldValue('layout.height') ?? 0"
                      :min="0"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('layout.height', $event)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            
            <!-- Appearance 섹션 -->
            <div>
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
                      :model-value="getFieldValue('appearance.opacity') ?? 100"
                      :min="0"
                      :max="100"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('appearance.opacity', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Corner radius</label>
                    <InputNumber
                      :model-value="getFieldValue('appearance.cornerRadius') ?? 0"
                      :min="0"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('appearance.cornerRadius', $event)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            
            <!-- Typography 섹션 -->
            <div>
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
                      :model-value="getFieldValue('typography.fontSize') ?? 14"
                      :min="8"
                      :max="72"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('typography.fontSize', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Text Align</label>
                    <ButtonGroup class="w-full min-w-0">
                      <Button
                        icon="pi pi-align-left"
                        :severity="(getFieldValue('typography.textAlign') || 'left') === 'left' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('typography.textAlign', 'left')"
                      />
                      <Button
                        icon="pi pi-align-center"
                        :severity="(getFieldValue('typography.textAlign') || 'left') === 'center' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('typography.textAlign', 'center')"
                      />
                      <Button
                        icon="pi pi-align-right"
                        :severity="(getFieldValue('typography.textAlign') || 'left') === 'right' ? 'primary' : 'secondary'"
                        text
                        size="small"
                        class="flex-1"
                        @click="updateFieldValue('typography.textAlign', 'right')"
                      />
                    </ButtonGroup>
                  </div>
                </div>
                <!-- Font Family / Font Weight -->
                <div class="grid grid-cols-[1fr_1fr] gap-2 w-full min-w-0">
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Font Family</label>
                    <Select
                      :model-value="getFieldValue('typography.fontFamily') || fontFamilyOptions[0]?.value"
                      :options="fontFamilyOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('typography.fontFamily', $event)"
                    />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <label class="figma-label">Font Weight</label>
                    <Select
                      :model-value="getFieldValue('typography.fontWeight') || fontWeightOptions[0]?.value"
                      :options="fontWeightOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="figma-input w-full"
                      @update:model-value="updateFieldValue('typography.fontWeight', $event)"
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
import type { Page, CanvasItem } from '~/types/component'
import { H1Icon, H2Icon, H3Icon } from '@heroicons/vue/24/outline'

interface Props {
  currentPage: Page | null
  selectedIndex: number | null
  selectedItem: CanvasItem | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  closeOptions: []
  update: []
}>()

const { getComponentName, getComponentIcon } = useElements()
const { getOptionsForType } = useElementOptions()

// Font Family 옵션
const fontFamilyOptions = computed(() => {
  const options = getOptionsForType(props.selectedItem?.type || '')
  const fontFamilyField = options.find(opt => opt.key === 'typography.fontFamily')
  return Array.isArray(fontFamilyField?.componentProps?.options) 
    ? fontFamilyField.componentProps.options 
    : []
})

// Font Weight 옵션
const fontWeightOptions = computed(() => {
  const options = getOptionsForType(props.selectedItem?.type || '')
  const fontWeightField = options.find(opt => opt.key === 'typography.fontWeight')
  return Array.isArray(fontWeightField?.componentProps?.options) 
    ? fontWeightField.componentProps.options 
    : []
})

// 필드 값 가져오기 (객체 경로 지원: 'position.x', 'layout.width' 등)
const getFieldValue = (key: string) => {
  if (!props.selectedItem) return undefined
  
  // 객체 경로 처리 (예: 'position.x' -> props.position.x)
  if (key.includes('.')) {
    const parts = key.split('.')
    if (parts.length !== 2) return undefined
    
    const [objKey, propKey] = parts
    if (!objKey || !propKey) return undefined
    
    if (!props.selectedItem.props[objKey]) {
      return undefined
    }
    return props.selectedItem.props[objKey][propKey]
  }
  
  return props.selectedItem.props[key]
}


// 필드 값 업데이트 (객체 경로 지원: 'position.x', 'layout.width' 등)
const updateFieldValue = (key: string, value: any) => {
  if (!props.selectedItem) return
  
  // 객체 경로 처리 (예: 'position.x' -> props.position.x)
  if (key.includes('.')) {
    const parts = key.split('.')
    if (parts.length !== 2) return
    
    const [objKey, propKey] = parts
    if (!objKey || !propKey) return
    
    // 객체가 없으면 생성
    if (!props.selectedItem.props[objKey]) {
      props.selectedItem.props[objKey] = {}
    }
    
    // 값 설정
    if (typeof value === 'number') {
      props.selectedItem.props[objKey][propKey] = value
    } else {
      props.selectedItem.props[objKey][propKey] = value ?? ''
    }
  } else {
    // 일반 필드 처리
    if (typeof value === 'number') {
      props.selectedItem.props[key] = value
    } else {
      props.selectedItem.props[key] = value ?? ''
    }
  }
  
  // 변경사항 알림
  emit('update')
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

// 피그마 스타일
.figma-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--p-surface-500, #6b7280);
}

// Divider 스타일
:deep(.p-divider) {
  border-color: var(--p-surface-200, #e5e7eb) !important;
  margin: 0.5rem 0 !important;
}

:deep(.dark .p-divider) {
  border-color: var(--p-surface-700, #374151) !important;
}

// ButtonGroup 스타일 (한 줄 다 채우기)
:deep(.p-buttongroup),
.p-buttongroup {
  width: 100% !important;
  max-width: 100% !important;
  display: flex !important;
  min-width: 0 !important;

  .p-button,
  :deep(.p-button),
  .p-button-sm,
  :deep(.p-button-sm),
  .p-button.p-button-sm,
  :deep(.p-button.p-button-sm),
  .p-buttongroup .p-button,
  :deep(.p-buttongroup .p-button),
  .p-buttongroup .p-button-sm,
  :deep(.p-buttongroup .p-button-sm) {
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
    
    // 기본 상태 (선택 안됨) - 연한 색
    background-color: transparent !important;
    color: var(--p-surface-500, #6b7280) !important;
    border-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
    
    // 호버 상태 - color-mix 사용
    &:hover {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: var(--p-surface-300, #d1d5db) !important;
    }
    
    // Primary 버튼 (액티브 상태) - color-mix 사용
    &.p-button-primary {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: var(--p-surface-200, #e5e7eb) !important;
    }
    
    // Primary 버튼 호버
    &.p-button-primary:hover {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: var(--p-surface-200, #e5e7eb) !important;
    }
    
    // Secondary 버튼 (비활성 상태) - 연한 색
    &.p-button-secondary {
      background-color: transparent !important;
      color: var(--p-surface-500, #6b7280) !important;
      border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    }
    
    // Secondary 버튼 호버
    &.p-button-secondary:hover {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
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

// 다크 모드에서 ButtonGroup 버튼 스타일
:deep(.dark .p-buttongroup .p-button) {
  // 기본 상태 (선택 안됨) - 연한 색
  background-color: transparent !important;
  color: var(--p-surface-500, #6b7280) !important;
  border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  
  // 호버 상태 - color-mix 사용
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
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    border: 1px solid var(--p-surface-200, #e5e7eb) !important;
    border-radius: 4px !important;
    color: var(--p-text-color, #1f2937) !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }

  :deep(.p-select .p-select-label),
  :deep(.p-select-label),
  :deep(.p-select .p-select-label.p-inputtext),
  :deep(.p-inputwrapper .p-select-label) {
    height: 26px !important;
    min-height: 26px !important;
    max-height: 26px !important;
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  }

  :deep(.p-inputtext:focus),
  :deep(.p-inputnumber-input:focus) {
    background-color: var(--p-surface-0, #ffffff) !important;
    border-color: var(--p-primary-500, #3b82f6) !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
    outline: none !important;
  }

  :deep(.p-select:focus),
  :deep(.p-select.p-inputwrapper-focus) {
    border-color: var(--p-primary-500, #3b82f6) !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
    outline: none !important;
  }

  :deep(.p-select-label),
  :deep(.p-select .p-select-label),
  :deep(.p-inputwrapper .p-select-label) {
    padding: 4px 8px !important;
    font-size: 11px !important;
    height: 26px !important;
    min-height: 26px !important;
    max-height: 26px !important;
    line-height: 1.2 !important;
    background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  }

  :deep(.p-select-trigger) {
    width: 20px !important;
  }

  // 다크 모드
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
      background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
      background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
      border-color: var(--p-surface-600, #4b5563) !important;
      color: var(--p-text-color, #f3f4f6) !important;
    }

    :deep(.p-select .p-select-label),
    :deep(.p-select-label),
    :deep(.p-inputwrapper .p-select-label) {
      height: 26px !important;
      min-height: 26px !important;
      max-height: 26px !important;
      background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
      background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
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
// ButtonGroup 전역 스타일
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
    
    // 기본 상태 (선택 안됨) - 연한 색
    background-color: transparent !important;
    color: var(--p-surface-500, #6b7280) !important;
    border-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
    border-width: 1px !important;
    
    // 호버 상태 - color-mix 사용
    &:hover {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: var(--p-surface-300, #d1d5db) !important;
    }
    
    // Primary 버튼 (액티브 상태) - color-mix 사용
    &.p-button-primary {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
    }
    
    // Primary 버튼 호버
    &.p-button-primary:hover {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
    }
    
    // Secondary 버튼 (비활성 상태) - 연한 색
    &.p-button-secondary {
      background-color: transparent !important;
      color: var(--p-surface-500, #6b7280) !important;
      border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
    }
    
    // Secondary 버튼 호버
    &.p-button-secondary:hover {
      background-color: color-mix(in srgb, var(--p-surface-100, #f3f4f6) calc(100% * 0.5), transparent) !important;
      color: var(--p-surface-700, #374151) !important;
      border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
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

// 다크 모드에서 ButtonGroup 버튼 스타일
.dark .p-buttongroup .p-button {
  // 기본 상태 (선택 안됨) - 연한 색
  background-color: transparent !important;
  color: var(--p-surface-500, #6b7280) !important;
  border-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  
  // 호버 상태 - color-mix 사용
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

// Select 배경색 강제 적용 (전역 스타일)
.p-select,
.p-select.p-component,
.p-select.p-inputwrapper,
.p-select.p-inputwrapper-filled,
.p-select.p-inputwrapper-focus {
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
}

.p-select .p-select-label,
.p-select-label,
.p-select .p-select-label.p-inputtext,
.p-inputwrapper .p-select-label {
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
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
  background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
}

.dark .p-select .p-select-label,
.dark .p-select-label,
.dark .p-select .p-select-label.p-inputtext,
.dark .p-inputwrapper .p-select-label {
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  background-color: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
  background: color-mix(in srgb, var(--p-surface-700, #374151) calc(100% * 0.5), transparent) !important;
}
</style>
