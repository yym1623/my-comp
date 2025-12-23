<template>
  <Transition name="slide-left">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-[100] bg-surface-0 dark:bg-surface-800 flex flex-col"
    >
      <!-- 메뉴 헤더 -->
      <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
        <span class="text-lg font-bold text-surface-800 dark:text-surface-100">메뉴</span>
        <Button
          icon="pi pi-times"
          severity="secondary"
          text
          rounded
          @click="$emit('close')"
        />
      </div>

      <!-- 메뉴 버튼들 또는 패널 내용 -->
      <div class="flex-1 overflow-hidden">
        <!-- 메뉴 선택 화면 -->
        <Transition name="slide-left" mode="out-in">
          <div v-if="!activePanel" key="menu" class="p-4 flex flex-col gap-3">
            <button
              class="flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
              @click="$emit('openPanel', 'elements')"
            >
              <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <i class="pi pi-th-large text-xl text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div class="font-semibold text-surface-800 dark:text-surface-100">Elements</div>
                <div class="text-sm text-surface-500">컴포넌트 추가</div>
              </div>
              <i class="pi pi-angle-right ml-auto text-surface-400" />
            </button>

            <button
              class="flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
              @click="$emit('openPanel', 'pages')"
            >
              <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <i class="pi pi-file text-xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div class="font-semibold text-surface-800 dark:text-surface-100">Page</div>
                <div class="text-sm text-surface-500">페이지 선택</div>
              </div>
              <i class="pi pi-angle-right ml-auto text-surface-400" />
            </button>

            <button
              class="flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
              @click="$emit('openPanel', 'options')"
            >
              <div class="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <i class="pi pi-cog text-xl text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div class="font-semibold text-surface-800 dark:text-surface-100">Options</div>
                <div class="text-sm text-surface-500">속성 편집</div>
              </div>
              <i class="pi pi-angle-right ml-auto text-surface-400" />
            </button>
          </div>

          <!-- Elements 패널 -->
          <div v-else-if="activePanel === 'elements'" key="elements" class="h-full flex flex-col">
            <div class="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
              <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="$emit('closePanel')" />
              <span class="font-semibold text-surface-700 dark:text-surface-200">Elements</span>
            </div>
            <Elements
              :is-preview-mode="isPreviewMode"
              variant="mobile"
              @add="$emit('addComponent', $event)"
              @close="$emit('close')"
            />
          </div>

          <!-- Pages 패널 -->
          <div v-else-if="activePanel === 'pages'" key="pages" class="h-full flex flex-col overflow-hidden">
            <div class="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 shrink-0">
              <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="$emit('closePanel')" />
              <span class="font-semibold text-surface-700 dark:text-surface-200">Page</span>
            </div>
            <Pages
              :current-page-id="currentPageId"
              variant="mobile"
              @update:pages="$emit('update:pages', $event)"
              @select="$emit('selectPage', $event)"
              @create="$emit('createPage')"
              @close-panel="$emit('closePanel')"
            />
          </div>

          <!-- Options 패널 -->
          <div v-else-if="activePanel === 'options'" key="options" class="h-full flex flex-col overflow-hidden">
            <!-- 현재 페이지 헤더 -->
            <div v-if="currentPage" class="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 shrink-0">
              <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="$emit('closePanel')" />
              <i class="pi pi-file text-primary-500" />
              <span class="text-sm font-semibold text-surface-700 dark:text-surface-200 flex-1">{{ currentPage?.name }}</span>
            </div>
            <div v-else class="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 shrink-0">
              <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="$emit('closePanel')" />
              <span class="font-semibold text-surface-700 dark:text-surface-200">Options</span>
            </div>

            <!-- 트리 + 옵션 편집 영역 -->
            <div class="flex-1 overflow-hidden flex flex-col">
              <!-- 트리 영역 -->
              <div v-if="currentPage" class="flex-1 overflow-y-auto p-2 border-b border-surface-200 dark:border-surface-700 min-h-0 relative">
                <Transition name="fade">
                  <Draggable
                    v-if="canvasItems.length > 0"
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
                  <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-center text-surface-400">
                    <i class="pi pi-sitemap text-2xl mb-2" />
                    <p class="text-sm">컴포넌트가 없습니다</p>
                  </div>
                </Transition>
              </div>

              <!-- 옵션 편집 영역 -->
              <div class="flex-1 overflow-y-auto p-4 min-h-0 relative">
                <template v-if="selectedIndex !== null && selectedItem">
     
                  <!-- Header 속성 -->
                  <template v-if="selectedItem.type === 'header'">
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">제목</label>
                      <InputText v-model="selectedItem.props.title" class="w-full" />
                    </div>
                  </template>
                  <!-- Button 속성 -->
                  <template v-else-if="selectedItem.type === 'button'">
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">라벨</label>
                      <InputText v-model="selectedItem.props.label" class="w-full" />
                    </div>
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">스타일</label>
                      <Select v-model="selectedItem.props.severity" :options="severityOptions" class="w-full" />
                    </div>
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">아웃라인</label>
                      <ToggleSwitch v-model="selectedItem.props.outlined" />
                    </div>
                  </template>
                  <!-- Input 속성 -->
                  <template v-else-if="selectedItem.type === 'input'">
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">Placeholder</label>
                      <InputText v-model="selectedItem.props.placeholder" class="w-full" />
                    </div>
                  </template>
                  <!-- Text 속성 -->
                  <template v-else-if="selectedItem.type === 'text'">
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">내용</label>
                      <Textarea v-model="selectedItem.props.content" rows="4" class="w-full" />
                    </div>
                  </template>
                  <!-- Image 속성 -->
                  <template v-else-if="selectedItem.type === 'image'">
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">Alt 텍스트</label>
                      <InputText v-model="selectedItem.props.alt" class="w-full" />
                    </div>
                  </template>
                  <!-- Card 속성 -->
                  <template v-else-if="selectedItem.type === 'card'">
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">제목</label>
                      <InputText v-model="selectedItem.props.title" class="w-full" />
                    </div>
                    <div class="mb-4">
                      <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">내용</label>
                      <Textarea v-model="selectedItem.props.content" rows="3" class="w-full" />
                    </div>
                  </template>
                </template>
                <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-center text-surface-400">
                  <i class="pi pi-info-circle text-2xl mb-2" />
                  <p class="text-sm">편집할 요소를 선택하세요</p>
                </div>
              </div>
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
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import type { MobileMenuProps, MobileMenuEmits } from '~/types/mobilemenu'
import { useComponents } from '~/composables/useComponents'
import draggable from 'vuedraggable'

const Draggable = draggable

type Props = MobileMenuProps
type Emits = MobileMenuEmits

const props = defineProps<Props>()
defineEmits<Emits>()

const { getComponentIcon, getComponentLabel, getComponentName, severityOptions } = useComponents()
</script>

<style lang="scss" scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(-100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
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