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
              <!-- Header -->
              <div v-if="element.type === 'header'" class="bg-surface-100 dark:bg-surface-800 py-3 px-4 rounded-md font-semibold text-sm">
                <span>{{ element.props.title }}</span>
              </div>
              <!-- Button -->
              <Button
                v-else-if="element.type === 'button'"
                :label="element.props.label"
                :severity="element.props.severity"
                :outlined="element.props.outlined"
                class="w-full"
              />
              <!-- Input -->
              <InputText
                v-else-if="element.type === 'input'"
                :placeholder="element.props.placeholder"
                class="w-full"
              />
              <!-- Text -->
              <p v-else-if="element.type === 'text'" class="text-sm text-surface-600 dark:text-surface-400 m-0 leading-relaxed">
                {{ element.props.content }}
              </p>
              <!-- Image -->
              <div v-else-if="element.type === 'image'" class="bg-surface-100 dark:bg-surface-800 p-8 rounded-lg flex flex-col items-center gap-2 text-surface-400">
                <i class="pi pi-image text-2xl" />
                <span class="text-xs">{{ element.props.alt }}</span>
              </div>
              <!-- Card -->
              <Card v-else-if="element.type === 'card'">
                <template #title>{{ element.props.title }}</template>
                <template #content>{{ element.props.content }}</template>
              </Card>
            </div>
          </template>
        </Draggable>
      </Transition>
    </div>
  </main>
</template>

<script lang="ts" setup>
import type { PreviewProps, PreviewEmits } from '~/types/preview'
import draggable from 'vuedraggable'

const Draggable = draggable

type Props = PreviewProps
type Emits = PreviewEmits

defineProps<Props>()
defineEmits<Emits>()
</script>

<style lang="scss" scoped>
.canvas-item {
  @apply p-2 border border-transparent transition-all cursor-pointer;

  &:hover {
    @apply border-primary-500;
  }

  &.selected {
    @apply border-primary-500 bg-primary-500/5;
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
</style>

