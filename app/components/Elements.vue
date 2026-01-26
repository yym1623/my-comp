<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="px-3 py-2.5 border-b border-surface-200 dark:border-surface-700">
        <div class="relative">
        <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs z-10" />
        <InputText
          v-model="searchQuery"
          placeholder="컴포넌트 검색..."
            :disabled="props.isPreviewMode"
            class="w-full pl-8 pr-3 py-2 text-sm bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-3 space-y-4">
      <!-- Field 그룹 -->
      <section v-if="fieldComponents.length">
        <h3 class="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wide">
          Field
        </h3>
        <div class="grid gap-2">
          <div
            v-for="comp in fieldComponents"
            :key="comp.id"
            class="flex items-center gap-3 p-3 rounded-xl transition-all border relative overflow-hidden"
            :class="[
              comp.ready === false
                ? 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 cursor-not-allowed'
                : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm group cursor-pointer',
              props.isPreviewMode && 'opacity-50 pointer-events-none'
            ]"
            :draggable="comp.ready !== false && !props.isPreviewMode"
            @dragstart="comp.ready !== false && !props.isPreviewMode && handleDragStart(comp)"
            @click="comp.ready !== false && !props.isPreviewMode && handleAdd(comp)"
          >
            <!-- 준비중 오버레이 -->
            <Ready v-if="comp.ready === false" />
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
              :class="comp.ready === false
                ? 'bg-surface-100 dark:bg-surface-700 opacity-50'
                : 'bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50'"
            >
                <template v-if="comp.type === 'heading1'">
                  <H1Icon 
                    :class="comp.ready === false
                      ? 'w-5 h-5 text-surface-400 dark:text-surface-500'
                      : 'w-5 h-5 text-primary-600 dark:text-primary-400'"
                  />
                </template>
                <template v-else-if="comp.type === 'heading2'">
                  <H2Icon 
                    :class="comp.ready === false
                      ? 'w-5 h-5 text-surface-400 dark:text-surface-500'
                      : 'w-5 h-5 text-primary-600 dark:text-primary-400'"
                  />
                </template>
                <template v-else-if="comp.type === 'heading3'">
                  <H3Icon 
                    :class="comp.ready === false
                      ? 'w-5 h-5 text-surface-400 dark:text-surface-500'
                      : 'w-5 h-5 text-primary-600 dark:text-primary-400'"
                  />
                </template>
                <i
                  v-else
                  :class="[
                    comp.icon,
                    'text-lg',
                    comp.ready === false
                      ? 'text-surface-400 dark:text-surface-500'
                      : 'text-primary-600 dark:text-primary-400'
                  ]"
                />
            </div>
            <div class="flex flex-col min-w-0">
              <span 
                class="text-sm font-semibold"
                :class="comp.ready === false
                  ? 'text-surface-400 dark:text-surface-500'
                  : 'text-surface-700 dark:text-surface-200'"
              >{{ comp.name }}</span>
              <span 
                class="text-xs truncate"
                :class="comp.ready === false
                  ? 'text-surface-400 dark:text-surface-500'
                  : 'text-surface-400'"
              >{{ comp.description }}</span>
            </div>
          </div>
        </div>
      </section>
      <!-- Form 그룹 -->
      <section v-if="formComponents.length">
        <h3 class="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wide">
          Form
        </h3>
        <div class="grid gap-2">
          <div
            v-for="comp in formComponents"
            :key="comp.id"
            class="flex items-center gap-3 p-3 rounded-xl transition-all border relative overflow-hidden"
            :class="[
              comp.ready === false
                ? 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 cursor-not-allowed'
                : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm group cursor-pointer',
              props.isPreviewMode && 'opacity-50 pointer-events-none'
            ]"
            :draggable="comp.ready !== false && !props.isPreviewMode"
            @dragstart="comp.ready !== false && !props.isPreviewMode && handleDragStart(comp)"
            @click="comp.ready !== false && !props.isPreviewMode && handleAdd(comp)"
          >
            <!-- 준비중 오버레이 -->
            <Ready v-if="comp.ready === false" />
            <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            :class="comp.ready === false
              ? 'bg-surface-100 dark:bg-surface-700 opacity-50'
              : 'bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50'"
          >
              <template v-if="comp.type === 'heading1'">
                <H1Icon 
                  :class="comp.ready === false
                    ? 'w-5 h-5 text-surface-400 dark:text-surface-500'
                    : 'w-5 h-5 text-primary-600 dark:text-primary-400'"
                />
              </template>
              <template v-else-if="comp.type === 'heading2'">
                <H2Icon 
                  :class="comp.ready === false
                    ? 'w-5 h-5 text-surface-400 dark:text-surface-500'
                    : 'w-5 h-5 text-primary-600 dark:text-primary-400'"
                />
              </template>
              <template v-else-if="comp.type === 'heading3'">
                <H3Icon 
                  :class="comp.ready === false
                    ? 'w-5 h-5 text-surface-400 dark:text-surface-500'
                    : 'w-5 h-5 text-primary-600 dark:text-primary-400'"
                />
              </template>
              <i
                v-else
                :class="[
                  comp.icon,
                  'text-lg',
                  comp.ready === false
                    ? 'text-surface-400 dark:text-surface-500'
                    : 'text-primary-600 dark:text-primary-400'
                ]"
              />
            </div>
            <div class="flex flex-col min-w-0">
              <span 
                class="text-sm font-semibold"
                :class="comp.ready === false
                  ? 'text-surface-400 dark:text-surface-500'
                  : 'text-surface-700 dark:text-surface-200'"
              >{{ comp.name }}</span>
              <span 
                class="text-xs truncate"
                :class="comp.ready === false
                  ? 'text-surface-400 dark:text-surface-500'
                  : 'text-surface-400'"
              >{{ comp.description }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { H1Icon, H2Icon, H3Icon } from '@heroicons/vue/24/outline'
import type { ComponentDef } from '~/types/component'

import type { Page, CanvasItem } from '~/types/component'
import { getComponentDefaults } from '~/utils/component'
import { createEmptyGridCells } from '~/utils/array'

interface ElementsProps {
  isPreviewMode?: boolean
  variant?: 'desktop' | 'mobile'
  currentPage?: Page | null
  canvasItems?: CanvasItem[]
}

interface ElementsEmits {
  (e: 'update:canvasItems', items: CanvasItem[]): void
  (e: 'dragStart', comp: ComponentDef): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<ElementsProps>(), {
  variant: 'desktop',
  canvasItems: () => []
})

const emit = defineEmits<ElementsEmits>()

const searchQuery = ref<string>('')

const { fieldComponents: allFieldComponents, formComponents: allFormComponents, generateUid } = useElements()
const { getDefaultProps } = useElementOptions()
const { showSuccess } = useAppToast()

const fieldComponents = computed(() => filterComponents(allFieldComponents))
const formComponents = computed(() => filterComponents(allFormComponents))

const filterComponents = (components: ComponentDef[]) => {
  if (!searchQuery.value.trim()) {
    return components
  }
  const query = searchQuery.value.toLowerCase()
  return components.filter(comp => 
    comp.name.toLowerCase().includes(query) ||
    comp.description.toLowerCase().includes(query)
  )
}

// 컴포넌트 추가 로직 (내부에서 처리)
const handleAdd = (comp: ComponentDef) => {
  if (!props.currentPage) {
    showSuccess('페이지 선택 필요', '컴포넌트를 추가하려면 먼저 페이지를 선택해주세요.')
    return
  }

  const defaultStylesFromComposable = getDefaultProps().styles
  const componentDefaults = getComponentDefaults(comp.type)
  
  // data 병합 (component.ts 기본값 우선, 컴포넌트 정의로 덮어쓰기)
  const mergedData: Record<string, any> = {
    ...componentDefaults.data,
    ...(comp.defaultProps.data || {})
  }
  
  // styles 병합 (component.ts 기본값 우선, 공통 기본값, 컴포넌트 정의 순서)
  const mergedStyles: Record<string, any> = {
    // 1. component.ts의 타입별 기본값 (width, height, fontSize 등)
    ...componentDefaults.styles,
    // 2. 공통 기본값 (position, appearance 등)
    ...defaultStylesFromComposable,
    // 3. 컴포넌트 정의의 styles (덮어쓰기)
    ...(comp.defaultProps.styles || {}),
    // position, appearance는 중첩 객체이므로 별도 병합
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
  
  if (comp.type === 'grid' && newItem.props.data?.columns) {
    newItem.props.items = createEmptyGridCells(newItem.props.data.columns)
  }
  
  if (comp.type === 'table' && newItem.props.data?.columns) {
    if (!newItem.props.data.rows) {
      newItem.props.data.rows = [newItem.props.data.columns.map(() => '데이터')]
    }
  }
  
  const updatedItems = [...props.canvasItems, newItem]
  emit('update:canvasItems', updatedItems)
  
  if (props.variant === 'mobile') {
    emit('close')
  }
}

// 드래그 시작 처리
const handleDragStart = (comp: ComponentDef) => {
  emit('dragStart', comp)
}
</script>