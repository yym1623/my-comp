<template>
  <main class="flex-1 h-full flex items-center justify-center p-10 overflow-hidden relative">
    <!-- 프리뷰 모드 표시 배지 -->
    <div 
      v-if="isPreviewMode" 
      class="absolute top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center gap-2 shadow-lg z-10"
    >
      <i class="pi pi-eye text-xs" />
      미리보기 모드
    </div>
    <div
      class="w-[min(660px,calc(100%-40px))] h-[min(700px,calc(100%-10px))] bg-surface-0 dark:bg-surface-800 rounded-2xl overflow-y-auto flex flex-col gap-2 p-6 shadow-lg relative"
      :class="{ 'ring-2 ring-primary-500': isPreviewMode }"
      @dragover.prevent="!isPreviewMode"
      @drop="!isPreviewMode && $emit('drop')"
      @click="!isPreviewMode && $emit('deselect')"
    >
      <Transition name="fade">
        <div v-if="canvasItems.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div class="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4 shrink-0">
            <i class="pi pi-objects-column text-2xl text-primary-500" />
          </div>
          <h3 class="text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1 whitespace-nowrap">컴포넌트 추가</h3>
          <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap">{{ isMobile ? '메뉴' : '왼쪽' }}에서 컴포넌트를 드래그하거나 클릭하여 추가하세요</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-surface-400 shrink-0">
            <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded whitespace-nowrap">드래그</span>
            <span class="whitespace-nowrap">또는</span>
            <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded whitespace-nowrap">클릭</span>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <Draggable
          v-if="canvasItems.length > 0"
          :model-value="canvasItems"
          item-key="uid"
          :disabled="isPreviewMode"
          @update:model-value="$emit('update:canvasItems', $event)"
        >
          <template #item="{ element, index }">
            <div
              class="canvas-item group relative"
              :class="{ selected: selectedIndex === index && !isPreviewMode, 'pointer-events-none': isPreviewMode }"
              @click.stop="!isPreviewMode && $emit('select', index)"
            >
              <!-- 수정/삭제 버튼 (호버/선택 시 표시, 보더 밖 오른쪽 상단) -->
              <div 
                v-if="!isPreviewMode" 
                class="absolute -top-5 right-0 flex items-center gap-1 z-10 transition-opacity"
                :class="selectedIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
              >
                <button
                  class="w-5 h-5 flex items-center justify-center bg-white dark:bg-surface-800 border border-primary-500 dark:border-primary-500 shadow-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  @click.stop="$emit('select', index)"
                >
                  <i class="pi pi-pencil text-xs text-primary-500 dark:text-primary-400" />
                </button>
                <button
                  class="w-5 h-5 flex items-center justify-center bg-white dark:bg-surface-800 border border-primary-500 dark:border-primary-500 shadow-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  @click.stop="$emit('delete', index)"
                >
                  <i class="pi pi-trash text-xs text-primary-500 dark:text-primary-400" />
                </button>
              </div>
              <!-- Heading 1 -->
              <h1
                v-if="element.type === 'heading1'"
                class="text-2xl font-bold text-surface-800 dark:text-surface-100 m-0"
              >
                {{ element.props.text }}
              </h1>
              <!-- Heading 2 -->
              <h2
                v-else-if="element.type === 'heading2'"
                class="text-xl font-semibold text-surface-800 dark:text-surface-100 m-0"
              >
                {{ element.props.text }}
              </h2>
              <!-- Heading 3 -->
              <h3
                v-else-if="element.type === 'heading3'"
                class="text-lg font-semibold text-surface-800 dark:text-surface-100 m-0"
              >
                {{ element.props.text }}
              </h3>
              <!-- Spacer -->
              <div
                v-else-if="element.type === 'spacer'"
                :style="{ height: element.props.height || '1rem' }"
              />
              <!-- Divider -->
              <hr
                v-else-if="element.type === 'divider'"
                class="border-t border-surface-200 dark:border-surface-700 my-2"
              />
              <!-- 텍스트 입력 (한 줄) -->
              <div
                v-else-if="element.type === 'inputTextSmall'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
              <InputText
                  :key="`input-text-small-${element.uid}-${index}`"
                  type="text"
                  :model-value="''"
                  :placeholder="element.props.placeholder || '입력하세요...'"
                  class="w-full"
                  style="min-height: 2.5rem;"
                />
              </div>
              <!-- 텍스트 입력 (여러 줄) -->
              <div
                v-else-if="element.type === 'textarea'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <Textarea
                  :key="`textarea-${element.uid}-${index}`"
                  :model-value="element.props.content || ''"
                  :rows="4"
                class="w-full"
                  style="min-height: 6rem;"
                  readonly
              />
              </div>
              <!-- Image -->
              <div
                v-else-if="element.type === 'image'"
                class="bg-surface-100 dark:bg-surface-800 p-6 rounded-lg flex items-center justify-start text-surface-400"
              >
                <i class="pi pi-image text-2xl" />
              </div>
              <!-- 텍스트 입력 -->
              <div
                v-else-if="element.type === 'inputText'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-text-${element.uid}-${index}`"
                  type="text"
                  :model-value="''"
                  :placeholder="element.props.placeholder || '입력하세요...'"
                  class="w-full"
                  style="min-height: 2.5rem;"
                />
              </div>
              <!-- 비밀번호 입력 -->
              <div
                v-else-if="element.type === 'inputPassword'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-password-${element.uid}-${index}`"
                  type="password"
                  :model-value="''"
                  :placeholder="element.props.placeholder || '비밀번호를 입력하세요'"
                  class="w-full"
                  style="min-height: 2.5rem;"
                />
              </div>
              <!-- 이메일 입력 -->
              <div
                v-else-if="element.type === 'inputEmail'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-email-${element.uid}-${index}`"
                  type="email"
                  :model-value="''"
                  :placeholder="element.props.placeholder || 'example@email.com'"
                  class="w-full"
                  style="min-height: 2.5rem;"
                />
              </div>
              <!-- 날짜 선택 -->
              <div
                v-else-if="element.type === 'inputDate'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-date-${element.uid}-${index}`"
                  type="text"
                  :model-value="''"
                  :placeholder="element.props.placeholder || 'yy.mm.dd'"
                  class="w-full"
                  style="min-height: 2.5rem;"
                />
              </div>
              <!-- 시간 선택 -->
              <div
                v-else-if="element.type === 'inputTime'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-time-${element.uid}-${index}`"
                  type="text"
                  :model-value="''"
                  :placeholder="element.props.placeholder || 'hh:ss'"
                  class="w-full"
                  style="min-height: 2.5rem;"
                />
              </div>
              <!-- 선택 상자 -->
              <div
                v-else-if="element.type === 'select'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <Dropdown
                  :key="`select-${element.uid}-${index}`"
                  :model-value="null"
                  :options="element.props.options || []"
                  :placeholder="element.props.placeholder || '선택하세요'"
                  class="w-full"
                  style="min-height: 2.5rem;"
                />
              </div>
              <!-- URL 입력 -->
              <div
                v-else-if="element.type === 'inputUrl'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-url-${element.uid}-${index}`"
                  type="url"
                  :model-value="''"
                  :placeholder="element.props.placeholder || 'https://example.com'"
                  class="w-full"
                  style="min-height: 2.5rem;"
                />
              </div>
              <!-- 체크박스 -->
              <div
                v-else-if="element.type === 'checkbox'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <div class="flex items-center gap-2" style="min-height: 2.5rem;">
                  <Checkbox
                    :key="`checkbox-${element.uid}-${index}`"
                    :model-value="element.props.checked || false"
                    :binary="true"
                  />
                  <span class="text-sm text-surface-700 dark:text-surface-200">{{ element.props.label }}</span>
                </div>
              </div>
              <!-- 라디오 버튼 -->
              <div
                v-else-if="element.type === 'radio'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <div class="flex flex-col gap-2" style="min-height: 2.5rem;">
                  <div
                    v-for="(option, optIndex) in (element.props.options || [])"
                    :key="`radio-${element.uid}-${index}-${optIndex}`"
                    class="flex items-center gap-2"
                  >
                    <RadioButton
                      :model-value="element.props.selected || element.props.options?.[0]"
                      :value="option"
                      :name="`radio-${element.uid}`"
                    />
                    <label class="text-sm text-surface-700 dark:text-surface-200 cursor-pointer">{{ option }}</label>
                  </div>
                </div>
              </div>
              <!-- 토글 스위치 -->
              <div
                v-else-if="element.type === 'toggleSwitch'"
                class="flex flex-col gap-1 form-field-wrapper"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <div class="flex items-center gap-2" style="min-height: 2.5rem;">
                  <ToggleSwitch
                    :key="`toggle-${element.uid}-${index}`"
                    :model-value="element.props.checked || false"
                  />
                  <span class="text-sm text-surface-700 dark:text-surface-200">{{ element.props.checked ? '켜짐' : '꺼짐' }}</span>
                </div>
              </div>
              <!-- 버튼 (Field 스타일 - primary 기본) -->
              <div
                v-else-if="element.type === 'button'"
                class="flex items-center"
              >
                <Button
                  :key="`button-${element.uid}-${index}`"
                  :label="element.props.text || '버튼'"
                  severity="primary"
                  :outlined="element.props.outlined || false"
                  class="!w-auto"
                />
              </div>
              <!-- 이전/다음 네비게이션 -->
              <div
                v-else-if="element.type === 'prevNext'"
                class="flex items-center justify-between gap-4"
              >
                <Button
                  :label="element.props.prevText"
                  severity="secondary"
                  outlined
                  class="!w-auto"
                />
                <Button
                  :label="element.props.nextText"
                  severity="primary"
                  class="!w-auto"
                />
              </div>
              <!-- 그리드 섹션 -->
              <div
                v-else-if="element.type === 'grid'"
                class="grid"
                :style="{ gridTemplateColumns: `repeat(${element.props.columns || 2}, minmax(0, 1fr))`, gap: element.props.gap || '1rem' }"
              >
                <div
                  v-for="(cellItems, cellIndex) in (element.props.items && element.props.items.length > 0 ? element.props.items : Array(element.props.columns || 2).fill([]))"
                  :key="cellIndex"
                  class="min-h-[60px] border border-dashed border-surface-300 dark:border-surface-600 rounded-md bg-surface-50 dark:bg-surface-900/30 p-2 transition-all"
                  :class="{ 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDraggingOverGrid === `${element.uid}-${cellIndex}` }"
                  @dragover.prevent="!isPreviewMode && handleGridDragOver($event, element, Number(cellIndex))"
                  @dragleave="!isPreviewMode && handleGridDragLeave(element, Number(cellIndex))"
                  @drop="!isPreviewMode && handleGridDrop($event, element, Number(cellIndex))"
                >
                  <div v-if="!cellItems || cellItems.length === 0" class="h-full flex items-center justify-center text-xs text-surface-400">
                    드래그하여 추가
                  </div>
                  <div v-else>
                    <!-- 그리드 셀 안의 컴포넌트 렌더링 (하나만) -->
                    <ComponentRenderer
                      v-if="cellItems[0]"
                      :key="cellItems[0].uid"
                      :item="cellItems[0]"
                    />
                  </div>
                </div>
              </div>
              <!-- 그룹 (카드 형식, 레이블 없음) -->
              <div
                v-else-if="element.type === 'group'"
                class="border border-dashed border-surface-300 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-900/30 overflow-hidden transition-all min-h-[60px]"
                :class="{ 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDraggingOverGroup === element.uid }"
                @dragover.prevent="!isPreviewMode && handleGroupDragOver($event, element)"
                @dragleave="!isPreviewMode && handleGroupDragLeave(element)"
                @drop="!isPreviewMode && handleGroupDrop($event, element)"
              >
                <div
                  class="p-4 h-full"
                >
                  <div v-if="!element.props.items || element.props.items.length === 0" class="h-full flex items-center justify-center text-xs text-surface-400">
                    드래그하여 추가
                  </div>
                  <div v-else>
                    <!-- 그룹 안의 컴포넌트 렌더링 (하나만) -->
                    <ComponentRenderer
                      v-if="element.props.items[0]"
                      :item="element.props.items[0]"
                    />
                  </div>
                </div>
              </div>
              <!-- 테이블 -->
              <div
                v-else-if="element.type === 'table'"
                class="overflow-x-auto rounded-md border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900/20"
              >
                <table class="min-w-full text-left text-xs">
                  <thead class="bg-surface-50 dark:bg-surface-800/60">
                    <tr>
                      <th
                        v-for="(col, i) in (element.props.columns || [])"
                        :key="i"
                        class="px-3 py-2 font-semibold text-surface-600 dark:text-surface-200 border-b border-surface-200 dark:border-surface-700"
                      >
                        <InputText
                          v-if="!isPreviewMode && editingTable === `${element.uid}-header-${i}`"
                          :model-value="col"
                          @blur="handleTableHeaderBlur(element, Number(i), $event)"
                          @keyup.enter="handleTableHeaderBlur(element, Number(i), $event)"
                          class="w-full text-xs font-semibold bg-transparent border-none p-0 h-auto"
                          @click.stop
                        />
                        <span
                          v-else
                          class="cursor-pointer"
                          :class="{ 'hover:text-primary-500': !isPreviewMode }"
                          @click.stop="!isPreviewMode && (editingTable = `${element.uid}-header-${i}`)"
                        >
                          {{ col }}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, rowIndex) in (element.props.rows || [['데이터 1', '데이터 2', '데이터 3']])"
                      :key="rowIndex"
                    >
                      <td
                        v-for="(cell, cellIndex) in row"
                        :key="cellIndex"
                        class="px-3 py-2 text-surface-500 dark:text-surface-400 border-b border-surface-100 dark:border-surface-800"
                      >
                        <InputText
                          v-if="!isPreviewMode && editingTable === `${element.uid}-cell-${rowIndex}-${cellIndex}`"
                          :model-value="cell"
                          @blur="handleTableCellBlur(element, Number(rowIndex), Number(cellIndex), $event)"
                          @keyup.enter="handleTableCellBlur(element, Number(rowIndex), Number(cellIndex), $event)"
                          class="w-full text-xs bg-transparent border-none p-0 h-auto"
                          @click.stop
                        />
                        <span
                          v-else
                          class="cursor-pointer"
                          :class="{ 'hover:text-primary-500': !isPreviewMode }"
                          @click.stop="!isPreviewMode && (editingTable = `${element.uid}-cell-${rowIndex}-${cellIndex}`)"
                        >
                          {{ cell }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="!isPreviewMode"
                  class="px-3 py-1 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/60 flex items-center justify-center"
                >
                  <button
                    class="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    @click.stop="handleAddTableRow(element)"
                  >
                    <i class="pi pi-plus text-xs" />
                    <span>행 추가</span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </Draggable>
      </Transition>
    </div>
  </main>
</template>

<script lang="ts" setup>
import type { PreviewProps, PreviewEmits } from '~/types/preview'
import type { CanvasItem } from '~/types/component'
import draggable from 'vuedraggable'
import Calendar from 'primevue/calendar'
import ComponentRenderer from './ComponentRenderer.vue'
import { useElements } from '~/composables/useElements'

const Draggable = draggable

type Props = PreviewProps
type Emits = PreviewEmits

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getComponentLabel } = useElements()

// 드래그 오버 상태 관리
const isDraggingOverGrid = ref<string | null>(null)
const isDraggingOverGroup = ref<string | null>(null)

function handleGridDragOver(event: DragEvent, gridElement: CanvasItem, cellIndex: number) {
  isDraggingOverGrid.value = `${gridElement.uid}-${cellIndex}`
}

function handleGridDragLeave(gridElement: CanvasItem, cellIndex: number) {
  // 실제로 영역을 벗어났는지 확인
  setTimeout(() => {
    if (isDraggingOverGrid.value === `${gridElement.uid}-${cellIndex}`) {
      isDraggingOverGrid.value = null
    }
  }, 50)
}

function handleGridDrop(event: DragEvent, gridElement: CanvasItem, cellIndex: number) {
  isDraggingOverGrid.value = null
  emit('grid-drop', { gridElement, cellIndex, event })
}

function handleGroupDragOver(event: DragEvent, groupElement: CanvasItem) {
  isDraggingOverGroup.value = groupElement.uid
}

function handleGroupDragLeave(groupElement: CanvasItem) {
  // 실제로 영역을 벗어났는지 확인
  setTimeout(() => {
    if (isDraggingOverGroup.value === groupElement.uid) {
      isDraggingOverGroup.value = null
    }
  }, 50)
}

function handleGroupDrop(event: DragEvent, groupElement: CanvasItem) {
  isDraggingOverGroup.value = null
  emit('group-drop', { groupElement, event })
}

// 테이블 편집 상태 관리
const editingTable = ref<string | null>(null)

function handleTableHeaderBlur(element: CanvasItem, colIndex: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (!element.props.columns) return
  element.props.columns[colIndex] = target.value || `컬럼 ${colIndex + 1}`
  editingTable.value = null
  emit('update:canvasItems', [...props.canvasItems])
}

function handleTableCellBlur(element: CanvasItem, rowIndex: number, cellIndex: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (!element.props.rows) return
  if (!element.props.rows[rowIndex]) {
    element.props.rows[rowIndex] = []
  }
  element.props.rows[rowIndex][cellIndex] = target.value || '데이터'
  editingTable.value = null
  emit('update:canvasItems', [...props.canvasItems])
}

function handleAddTableRow(element: CanvasItem) {
  if (!element.props.columns) return
  if (!element.props.rows) {
    element.props.rows = []
  }
  const newRow = element.props.columns.map(() => '데이터')
  element.props.rows.push(newRow)
  emit('update:canvasItems', [...props.canvasItems])
}
</script>

<style lang="scss" scoped>
.canvas-item {
  @apply p-2 border border-transparent transition-all cursor-pointer;

  &.selected {
    @apply border-primary-500;
  }
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
// 버튼이 텍스트만 보이는 문제 해결을 위해 PrimeVue 스타일 명시적 보장
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
  :deep(.p-calendar) {
    min-height: 2.5rem;
    height: auto;
    box-sizing: border-box;
  }

  :deep(.p-inputtext) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--p-input-border-color, #d1d5db);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  :deep(.p-textarea) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--p-input-border-color, #d1d5db);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
  }

  :deep(.p-dropdown) {
    width: 100%;
    
    .p-dropdown-label {
      padding: 0.5rem 0.75rem;
      min-height: 2.5rem;
    }
  }

  :deep(.p-button) {
    min-height: 2.5rem;
    padding: 0.5rem 1rem;
  }

  :deep(.p-calendar) {
    width: 100%;

    .p-inputtext {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--p-input-border-color, #d1d5db);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      line-height: 1.5;
      min-height: 2.5rem;
    }
  }
}
</style>