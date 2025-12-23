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
    <!-- 메인 패널: 페이지 + 트리 + 옵션 -->
    <div class="flex flex-col h-full overflow-hidden relative">
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
          @mousedown.prevent
          @click.stop="isEditingPageName ? handleSavePageName() : handleStartEditPageName()"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          size="small"
          class="w-6 h-6 !p-0 shrink-0"
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
                  
                  @click="$emit('selectItem', index)"
                >
                  <!-- 트리 가로선 -->
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-surface-200 dark:bg-surface-700" />
                  <!-- 컴포넌트 아이콘 배경 -->
                  <div class="relative z-10 w-6 h-6 rounded bg-surface-200 dark:bg-surface-600 flex items-center justify-center shrink-0">
                    <i :class="getComponentIcon(element.type)" class="text-xs text-surface-600 dark:text-surface-300" />
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
          <div v-else-if="currentPage" class="absolute inset-0 flex flex-col items-center justify-center text-center text-surface-400">
            <i class="pi pi-sitemap text-2xl mb-2" />
            <p class="text-sm">컴포넌트가 없습니다</p>
          </div>
        </Transition>
      </div>

      <!-- 페이지 저장 버튼 바 -->
      <div v-if="currentPage" class="px-3 py-2.5 border-t border-surface-200 dark:border-surface-700 shrink-0 bg-surface-0 dark:bg-surface-800">
        <Button
          icon="pi pi-save"
          label="페이지 저장"
          severity="secondary"
          outlined
          size="small"
          class="w-full text-xs font-medium flex items-center justify-center gap-2"
          :disabled="!currentPage || canvasItems.length === 0"
          @click="$emit('savePage')"
        />
      </div>
    </div>

    <!-- 모바일 닫기 버튼 -->
    <div v-if="isMobile && isOpen" class="absolute top-1 right-3 z-10">
      <Button
        icon="pi pi-times"
        severity="secondary"
        text
        rounded
        size="small"
        class="!w-9 !h-9"
        @click="$emit('update:isOpen', false)"
      />
    </div>
    <!-- 최하단 패널 닫기/열기 버튼 (데스크탑만) -->
    <div v-if="!isMobile" class="absolute bottom-2 -left-[52px] z-20">
      <Button
        :icon="isOpen ? 'pi pi-angle-right' : 'pi pi-angle-left'"
        severity="secondary"
        text
        rounded
        size="small"
        class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm"
        v-tooltip.left="isOpen ? '패널 닫기' : '패널 열기'"
        @click="$emit('update:isOpen', !isOpen)"
      />
    </div>

    <!-- 옵션 패널 (선택된 아이템이 있을 때만 표시) -->
    <Transition name="slide">
      <div
        v-if="currentPage && selectedIndex !== null && selectedItem"
        class="absolute inset-0 bg-surface-0 dark:bg-surface-800 flex flex-col z-10"
      >
        <!-- 속성 패널 헤더 -->
        <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
          <Button
            icon="pi pi-arrow-left"
            severity="secondary"
            text
            rounded
            size="small"
            @click="$emit('closeOptions')"
          />
          <span class="text-sm font-semibold text-surface-700 dark:text-surface-200" v-if="selectedItem">
            {{ getComponentName(selectedItem.type) }} 편집
          </span>
        </div>
        <!-- 속성 편집 영역 -->
        <div class="flex-1 overflow-y-auto p-4 min-h-0 relative">
          <template v-if="selectedIndex !== null && selectedItem">
            <div
              v-for="field in getOptionsForType(selectedItem.type)"
              :key="field.key"
              class="mb-4"
            >
              <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
                {{ field.label }}
              </label>
              <component
                :is="field.component"
                v-model="selectedItem.props[field.key]"
                v-bind="field.componentProps"
                class="w-full"
              />
              </div>
          </template>
          <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-center text-surface-400">
            <i class="pi pi-info-circle text-2xl mb-2" />
            <p class="text-sm">편집할 요소를 선택하세요</p>
          </div>
        </div>
      </div>
    </Transition>
  </aside>
</template>

<script lang="ts" setup>
import type { OptionsProps, OptionsEmits } from '~/types/options'
import { useElements } from '~/composables/useElements'
import { useElementOptions } from '~/composables/useElementOptions'
import draggable from 'vuedraggable'

const Draggable = draggable

type Props = OptionsProps
type Emits = OptionsEmits

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getComponentIcon, getComponentLabel, getComponentName } = useElements()
const { getOptionsForType } = useElementOptions()

const isEditingPageName = ref(false)
const editingPageName = ref('')

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
</style>

