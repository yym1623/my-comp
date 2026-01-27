<template>
  <!-- Heading 1 -->
  <h1
    v-if="item.type === 'heading1'"
    class="font-bold text-surface-800 dark:text-surface-100 m-0"
    :style="{ ...getElementStyle(item), ...getTypographyStyle(item) }"
  >
    {{ item.data?.text ?? item.text ?? '' }}
  </h1>
  <!-- Heading 2 -->
  <h2
    v-if="item.type === 'heading2'"
    class="font-semibold text-surface-800 dark:text-surface-100 m-0"
    :style="{ ...getElementStyle(item), ...getTypographyStyle(item) }"
  >
    {{ item.data?.text ?? item.text ?? '' }}
  </h2>
  <!-- Heading 3 -->
  <h3
    v-if="item.type === 'heading3'"
    class="font-semibold text-surface-800 dark:text-surface-100 m-0"
    :style="{ ...getElementStyle(item), ...getTypographyStyle(item) }"
  >
    {{ item.data?.text ?? item.text ?? '' }}
  </h3>
  <!-- Spacer -->
  <div
    v-if="item.type === 'spacer'"
    :style="getElementStyle(item)"
  />
  <!-- Divider -->
  <Divider
    v-if="item.type === 'divider'"
    class="divider-default"
    :style="getElementStyle(item)"
  />
  <!-- Image -->
  <div
    v-if="item.type === 'image'"
    class="rounded-lg overflow-hidden"
    :style="getElementStyle(item)"
  >
    <Image
      v-if="item.data?.src ?? item.src"
      :src="item.data?.src ?? item.src"
      :alt="item.data?.alt ?? item.alt ?? '이미지'"
      class="w-full"
      :preview="isPreviewMode"
    />
    <div
      v-else
      class="bg-surface-100 dark:bg-surface-800 p-6 rounded-lg flex items-center justify-center text-surface-400"
    >
      <div class="flex flex-col items-center gap-2">
        <i class="pi pi-image text-3xl" />
        <span class="text-xs">이미지 URL을 입력하세요</span>
      </div>
    </div>
  </div>
  <!-- Textarea -->
  <div
    v-if="item.type === 'textarea'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <Textarea
      :key="`textarea-${item.id}`"
      :model-value="item.data?.content ?? item.content ?? ''"
      :rows="4"
      placeholder="설명 내용을 입력하세요."
      :style="{ minHeight: '6rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }"
      :readonly="!isPreviewMode"
      :class="{ 'edit-mode': !isPreviewMode }"
    />
  </div>
  <!-- input(text) -->
  <div
    v-if="item.type === 'inputText'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <InputText
      :key="`input-text-${item.id}`"
      type="text"
      :model-value="''"
      :placeholder="item.data?.placeholder ?? item.placeholder ?? '입력하세요...'"
      :readonly="!isPreviewMode"
      :class="[{ 'edit-mode': !isPreviewMode }]"
      :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }"
    />
  </div>
  <!-- input(password) -->
  <div
    v-if="item.type === 'inputPassword'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <InputText
      :key="`input-password-${item.id}`"
      type="password"
      :model-value="''"
      :placeholder="item.data?.placeholder ?? item.placeholder ?? '비밀번호를 입력하세요'"
      :readonly="!isPreviewMode"
      :class="[{ 'edit-mode': !isPreviewMode }]"
      :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }"
    />
  </div>
  <!-- input(email) -->
  <div
    v-if="item.type === 'inputEmail'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <InputText
      :key="`input-email-${item.id}`"
      type="email"
      :model-value="''"
      :placeholder="item.data?.placeholder ?? item.placeholder ?? 'example@email.com'"
      :readonly="!isPreviewMode"
      :class="[{ 'edit-mode': !isPreviewMode }]"
      :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }"
    />
  </div>
  <!-- input(date) -->
  <div
    v-if="item.type === 'inputDate'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <DatePicker
      :key="`input-date-${item.id}`"
      :model-value="null"
      :placeholder="item.data?.placeholder ?? item.placeholder ?? '날짜를 선택하세요'"
      dateFormat="yy.mm.dd"
      :readonly="!isPreviewMode"
      :class="[{ 'edit-mode': !isPreviewMode }]"
      :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }"
    />
  </div>
  <!-- input(time) -->
  <div
    v-if="item.type === 'inputTime'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <DatePicker
      :key="`input-time-${item.id}`"
      :model-value="null"
      :placeholder="item.data?.placeholder ?? item.placeholder ?? '시간을 선택하세요'"
      timeOnly
      hourFormat="24"
      :readonly="!isPreviewMode"
      :class="[{ 'edit-mode': !isPreviewMode }]"
      :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }"
    />
  </div>
  <!-- input(select) -->
  <div
    v-if="item.type === 'select'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <Select
      :key="`select-${item.id}`"
      :model-value="null"
      :options="item.data?.options ?? item.options ?? []"
      :placeholder="item.data?.placeholder ?? item.placeholder ?? '선택하세요'"
      :readonly="!isPreviewMode"
      :class="[{ 'edit-mode': !isPreviewMode }]"
      :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }"
    />
  </div>
  <!-- input(url) -->
  <div
    v-if="item.type === 'inputUrl'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <InputText
      :key="`input-url-${item.id}`"
      type="url"
      :model-value="''"
      :placeholder="item.data?.placeholder ?? item.placeholder ?? 'https://example.com'"
      :readonly="!isPreviewMode"
      :class="[{ 'edit-mode': !isPreviewMode }]"
      :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }"
    />
  </div>
  <!-- input(checkbox) -->
  <div
    v-if="item.type === 'checkbox'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <div class="flex items-center gap-2" :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }">
      <Checkbox
        :key="`checkbox-${item.id}`"
        :model-value="item.data?.checked ?? item.checked ?? false"
        :binary="true"
        :readonly="!isPreviewMode"
        :class="{ 'edit-mode': !isPreviewMode }"
      />
      <span class="text-sm text-surface-700 dark:text-surface-200">{{ item.data?.label ?? item.label }}</span>
    </div>
  </div>
  <!-- input(radio) -->
  <div
    v-if="item.type === 'radio'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <div class="flex flex-col gap-2" :style="{ minHeight: '2.5rem', ...getTypographyStyle(item) }">
      <div
        v-for="(option, optIndex) in (item.data?.options ?? item.options ?? [])"
        :key="`radio-${item.id}-${optIndex}`"
        class="flex items-center gap-2"
        :style="getFormInputStyle(item)"
      >
        <RadioButton
          :model-value="item.data?.selected ?? item.selected ?? (item.data?.options ?? item.options)?.[0]"
          :value="option"
          :name="`radio-${item.id}`"
          :readonly="!isPreviewMode"
          :class="{ 'edit-mode': !isPreviewMode }"
        />
        <label class="text-sm text-surface-700 dark:text-surface-200 cursor-pointer">{{ option }}</label>
      </div>
    </div>
  </div>
  <!-- toggle -->
  <div
    v-if="item.type === 'toggleSwitch'"
    class="flex flex-col gap-1 form-field-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getElementStyle(item)"
  >
    <label v-if="item.data?.label ?? item.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.data?.label ?? item.label }}
    </label>
    <div class="flex items-center gap-2" :style="{ minHeight: '2.5rem', ...getTypographyStyle(item), ...getFormInputStyle(item) }">
      <ToggleSwitch
        :key="`toggle-${item.id}`"
        :model-value="item.data?.checked ?? item.checked ?? false"
        :readonly="!isPreviewMode"
        :class="{ 'edit-mode': !isPreviewMode }"
      />
      <span class="text-sm text-surface-700 dark:text-surface-200">{{ (item.data?.checked ?? item.checked) ? '켜짐' : '꺼짐' }}</span>
    </div>
  </div>
  <!-- button(default) -->
  <div
    v-if="item.type === 'button'"
    class="flex items-center button-wrapper"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getButtonWrapperStyle(item)"
  >
    <Button
      :key="`button-${item.id}`"
      :label="item.data?.text ?? item.text ?? '버튼'"
      severity="primary"
      :outlined="item.data?.outlined ?? item.outlined ?? false"
      :readonly="!isPreviewMode"
      :class="['button-element', { 'edit-mode': !isPreviewMode }]"
      :style="{ ...getTypographyStyle(item), ...getButtonStyle(item) }"
    />
  </div>
  <!-- button(prevNext) -->
  <div
    v-if="item.type === 'prevNext'"
    class="flex items-center justify-between gap-4"
    :class="{ 'edit-mode': !isPreviewMode }"
    :style="getPrevNextWrapperStyle(item)"
  >
    <Button
      :label="item.data?.prevText ?? item.prevText"
      severity="secondary"
      outlined
      :readonly="!isPreviewMode"
      :class="['prevnext-button', { 'edit-mode': !isPreviewMode }]"
      :style="{ ...getTypographyStyle(item), ...getPrevNextButtonStyle(item) }"
    />
    <Button
      :label="item.data?.nextText ?? item.nextText"
      severity="primary"
      :readonly="!isPreviewMode"
      :class="['prevnext-button', { 'edit-mode': !isPreviewMode }]"
      :style="{ ...getTypographyStyle(item), ...getPrevNextButtonStyle(item) }"
    />
  </div>
  <!-- 그리드 섹션 -->
  <div
    v-if="item.type === 'grid'"
    class="grid"
    :style="{ gridTemplateColumns: `repeat(${item.data?.columns ?? item.columns ?? 2}, minmax(0, 1fr))`, gap: item.data?.gap ?? item.gap ?? '1rem', ...getElementStyle(item) }"
  >
    <div
      v-for="(cellItems, cellIndex) in (item.items && item.items.length > 0 ? item.items : Array(item.data?.columns ?? item.columns ?? 2).fill([]))"
      :key="cellIndex"
      class="min-h-[60px] border border-dashed border-surface-300 dark:border-surface-600 rounded-md bg-surface-50 dark:bg-surface-900/30 p-2 transition-all"
      :class="{ 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDraggingOverGrid === `${item.id}-${cellIndex}` }"
      @dragover.prevent="!isPreviewMode && onGridDragOver && onGridDragOver($event, item, Number(cellIndex))"
      @dragleave="!isPreviewMode && onGridDragLeave && onGridDragLeave(item, Number(cellIndex))"
      @drop="!isPreviewMode && onGridDrop && onGridDrop($event, item, Number(cellIndex))"
    >
      <div v-if="!cellItems || cellItems.length === 0" class="h-full flex items-center justify-center text-xs text-surface-400">
        드래그하여 추가
      </div>
      <div v-else>
        <!-- 그리드 셀 안의 컴포넌트 렌더링 (하나만) -->
        <ComponentRenderer
          v-if="cellItems[0]"
          :key="cellItems[0].id"
          :item="cellItems[0]"
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
          :on-grid-drag-over="onGridDragOver"
          :on-grid-drag-leave="onGridDragLeave"
          :on-grid-drop="onGridDrop"
          :on-group-drag-over="onGroupDragOver"
          :on-group-drag-leave="onGroupDragLeave"
          :on-group-drop="onGroupDrop"
          :editing-table="editingTable"
          :on-table-header-blur="onTableHeaderBlur"
          :on-table-cell-blur="onTableCellBlur"
          :on-add-table-row="onAddTableRow"
          :on-update-canvas-items="onUpdateCanvasItems"
        />
      </div>
    </div>
  </div>
  <!-- 그룹 (카드 형식, 레이블 없음) -->
  <div
    v-if="item.type === 'group'"
    class="border border-dashed border-surface-300 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-900/30 overflow-hidden transition-all"
    :class="{ 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDraggingOverGroup === item.id }"
    :style="getElementStyle(item)"
    @dragover.prevent="!isPreviewMode && onGroupDragOver && onGroupDragOver($event, item)"
    @dragleave="!isPreviewMode && onGroupDragLeave && onGroupDragLeave(item)"
    @drop="!isPreviewMode && onGroupDrop && onGroupDrop($event, item)"
  >
    <div class="p-4 h-full">
      <div v-if="!item.items || item.items.length === 0" class="h-full flex items-center justify-center text-xs text-surface-400">
        드래그하여 추가
      </div>
      <div v-else>
        <!-- 그룹 안의 컴포넌트 렌더링 (하나만) -->
        <ComponentRenderer
          v-if="item.items[0]"
          :item="item.items[0]"
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
          :on-grid-drag-over="onGridDragOver"
          :on-grid-drag-leave="onGridDragLeave"
          :on-grid-drop="onGridDrop"
          :on-group-drag-over="onGroupDragOver"
          :on-group-drag-leave="onGroupDragLeave"
          :on-group-drop="onGroupDrop"
          :editing-table="editingTable"
          :on-table-header-blur="onTableHeaderBlur"
          :on-table-cell-blur="onTableCellBlur"
          :on-add-table-row="onAddTableRow"
          :on-update-canvas-items="onUpdateCanvasItems"
        />
      </div>
    </div>
  </div>
  <!-- 테이블 -->
  <div
    v-if="item.type === 'table'"
    class="overflow-x-auto rounded-md border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900/20"
    :style="getElementStyle(item)"
  >
    <table class="min-w-full text-left text-xs">
      <thead class="bg-surface-50 dark:bg-surface-800/60">
        <tr>
          <th
            v-for="(col, i) in (item.data?.columns ?? item.columns ?? [])"
            :key="i"
            class="px-3 py-2 font-semibold text-surface-600 dark:text-surface-200 border-b border-surface-200 dark:border-surface-700"
          >
            <InputText
              v-if="!isPreviewMode && editingTable && editingTable.value === `${item.id}-header-${i}`"
              :model-value="col"
              @blur="onTableHeaderBlur && onTableHeaderBlur(item, Number(i), $event)"
              @keyup.enter="onTableHeaderBlur && onTableHeaderBlur(item, Number(i), $event)"
              class="w-full text-xs font-semibold bg-transparent border-none p-0 h-auto"
              @click.stop
            />
            <span
              v-else
              class="cursor-pointer"
              :class="{ 'hover:text-primary-500': !isPreviewMode }"
              @click.stop="!isPreviewMode && editingTable && (editingTable.value = `${item.id}-header-${i}`)"
            >
              {{ col }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in (item.data?.rows ?? item.rows ?? [['데이터 1', '데이터 2', '데이터 3']])"
          :key="rowIndex"
        >
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="px-3 py-2 text-surface-500 dark:text-surface-400 border-b border-surface-100 dark:border-surface-800"
          >
            <InputText
              v-if="!isPreviewMode && editingTable && editingTable.value === `${item.id}-cell-${rowIndex}-${cellIndex}`"
              :model-value="cell"
              @blur="onTableCellBlur && onTableCellBlur(item, Number(rowIndex), Number(cellIndex), $event)"
              @keyup.enter="onTableCellBlur && onTableCellBlur(item, Number(rowIndex), Number(cellIndex), $event)"
              class="w-full text-xs bg-transparent border-none p-0 h-auto"
              @click.stop
            />
            <span
              v-else
              class="cursor-pointer"
              :class="{ 'hover:text-primary-500': !isPreviewMode }"
              @click.stop="!isPreviewMode && editingTable && (editingTable.value = `${item.id}-cell-${rowIndex}-${cellIndex}`)"
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
        @click.stop="onAddTableRow && onAddTableRow(item)"
      >
        <i class="pi pi-plus text-xs" />
        <span>행 추가</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CanvasItem } from '~/types/component'
import type { Ref } from 'vue'
import Divider from 'primevue/divider'

interface ComponentRendererProps {
  item: CanvasItem
  isPreviewMode?: boolean
  getElementStyle?: (element: CanvasItem) => Record<string, string>
  getTypographyStyle?: (element: CanvasItem) => Record<string, string>
  getFormInputStyle?: (element: CanvasItem) => Record<string, string>
  getButtonStyle?: (element: CanvasItem) => Record<string, string>
  getButtonWrapperStyle?: (element: CanvasItem) => Record<string, string>
  getPrevNextButtonStyle?: (element: CanvasItem) => Record<string, string>
  getPrevNextWrapperStyle?: (element: CanvasItem) => Record<string, string>
  // 그리드/그룹 드래그 앤 드롭
  isDraggingOverGrid?: string | null
  isDraggingOverGroup?: string | null
  onGridDragOver?: (event: DragEvent, gridElement: CanvasItem, cellIndex: number) => void
  onGridDragLeave?: (gridElement: CanvasItem, cellIndex: number) => void
  onGridDrop?: (event: DragEvent, gridElement: CanvasItem, cellIndex: number) => void
  onGroupDragOver?: (event: DragEvent, groupElement: CanvasItem) => void
  onGroupDragLeave?: (groupElement: CanvasItem) => void
  onGroupDrop?: (event: DragEvent, groupElement: CanvasItem) => void
  // 테이블 편집
  editingTable?: Ref<string | null>
  onTableHeaderBlur?: (element: CanvasItem, colIndex: number, event: Event) => void
  onTableCellBlur?: (element: CanvasItem, rowIndex: number, cellIndex: number, event: Event) => void
  onAddTableRow?: (element: CanvasItem) => void
  onUpdateCanvasItems?: () => void
}

const props = withDefaults(defineProps<ComponentRendererProps>(), {
  isPreviewMode: true,
  getElementStyle: () => ({}),
  getTypographyStyle: () => ({}),
  getFormInputStyle: () => ({}),
  getButtonStyle: () => ({}),
  getButtonWrapperStyle: () => ({}),
  getPrevNextButtonStyle: () => ({}),
  getPrevNextWrapperStyle: () => ({}),
  isDraggingOverGrid: null,
  isDraggingOverGroup: null,
  onGridDragOver: undefined,
  onGridDragLeave: undefined,
  onGridDrop: undefined,
  onGroupDragOver: undefined,
  onGroupDragLeave: undefined,
  onGroupDrop: undefined,
  editingTable: undefined,
  onTableHeaderBlur: undefined,
  onTableCellBlur: undefined,
  onAddTableRow: undefined,
  onUpdateCanvasItems: undefined
})
</script>

