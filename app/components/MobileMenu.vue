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
          @click="handleClose"
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
              @click="handleOpenOptions"
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
              :current-page="currentPage"
              :canvas-items="canvasItems"
              @update:canvas-items="$emit('update:canvasItems', $event)"
              @close="$emit('closePanel')"
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
              :is-preview-mode="isPreviewMode"
              :is-loading="isPagesLoading"
              @update:pages="$emit('update:pages', $event)"
              @update:current-page="(page) => page && $emit('selectPage', page)"
              @create="$emit('createPage')"
              @close-panel="$emit('closePanel')"
            />
          </div>

          <!-- Options 패널 -->
          <div v-else-if="activePanel === 'options'" key="options" class="h-full flex flex-col overflow-hidden">
            <!-- 현재 페이지 헤더 -->
            <div v-if="currentPage" class="px-4 py-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 shrink-0">
              <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="handleClosePanel" />
              <i class="pi pi-file text-primary-500 shrink-0" />
              <div class="flex-1 min-w-0">
                <span
                  class="block w-full text-sm font-semibold text-surface-700 dark:text-surface-200 truncate px-2"
                >
                  {{ currentPage?.name }}
                </span>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  class="w-6 h-6 !p-0"
                  :disabled="isPreviewMode"
                  @mousedown.prevent
                  @click.stop="handleOpenEditPageModal"
                />
                <Button
                  :icon="props.isSaving ? undefined : 'pi pi-save'"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  class="w-6 h-6 !p-0"
                  :disabled="!currentPage || canvasItems.length === 0 || props.isSaving"
                  @click="$emit('savePage')"
                >
                  <i v-if="props.isSaving" class="pi pi-spin pi-spinner text-xs" />
                </Button>
                <Button
                  :icon="props.isDeleting ? undefined : 'pi pi-trash'"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  class="w-6 h-6 !p-0"
                  :disabled="!currentPage || props.isDeleting"
                  @click="$emit('deletePage')"
                >
                  <i v-if="props.isDeleting" class="pi pi-spin pi-spinner text-xs" />
                </Button>
              </div>
            </div>
            <div v-else class="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 shrink-0">
              <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="handleClosePanel" />
              <span class="font-semibold text-surface-700 dark:text-surface-200">Options</span>
            </div>

            <!-- 트리 + 옵션 편집 영역 -->
            <div class="flex-1 overflow-hidden flex flex-col">
              <!-- 트리 영역 -->
              <div class="flex-1 overflow-y-auto p-2 border-b border-surface-200 dark:border-surface-700 min-h-0 relative" style="flex: 0 0 40%;">
                <!-- 로딩 중일 때 스켈레톤 표시 -->
                <Skeletons v-if="props.isPageLoading" type="options" />
                <template v-else>
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
                    <!-- 기존 Draggable 뷰 -->
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
                            class="relative flex items-center gap-2 pl-8 pr-3 rounded-lg transition-all text-surface-700 dark:text-surface-300 group cursor-pointer"
                            :class="isPreviewMode ? 'opacity-50 pointer-events-none' : ''"
                          >
                            <!-- 트리 가로선 -->
                            <div class="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-surface-200 dark:bg-surface-700" />
                            <!-- 컴포넌트 아이콘 배경 -->
                            <div class="relative z-10 w-6 h-6 rounded bg-surface-200 dark:bg-surface-600 flex items-center justify-center shrink-0">
                              <template v-if="element.type === 'heading1'">
                                <H1Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                              </template>
                              <template v-else-if="element.type === 'heading2'">
                                <H2Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                              </template>
                              <template v-else-if="element.type === 'heading3'">
                                <H3Icon class="w-3 h-3 text-surface-600 dark:text-surface-300" />
                              </template>
                              <i v-else :class="getComponentIcon(element.type)" class="text-xs text-surface-600 dark:text-surface-300" />
                            </div>
                            <span
                              class="text-sm flex-1 truncate"
                              @click="$emit('selectItem', index)"
                            >
                              {{ getComponentLabel(element) }}
                            </span>
                            <div class="flex items-center gap-1" @click.stop>
                              <Button
                                icon="pi pi-copy"
                                severity="secondary"
                                text
                                rounded
                                size="small"
                                class="w-6 h-6 !p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                @click="$emit('copyItem', index)"
                              />
                              <Button
                                icon="pi pi-trash"
                                severity="danger"
                                text
                                rounded
                                size="small"
                                class="w-6 h-6 !p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                @click="$emit('deleteItem', index)"
                              />
                            </div>
                          </div>
                        </div>
                      </template>
                    </Draggable>
                    <div v-else-if="currentPage" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                      <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-3 shrink-0">
                        <i class="pi pi-sitemap text-xl text-surface-400" />
                      </div>
                      <h4 class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1 whitespace-nowrap">컴포넌트가 없습니다</h4>
                    </div>
                  </Transition>
                </template>
              </div>

              <!-- 옵션 패널 (선택된 아이템이 있을 때만 표시) -->
              <div class="flex-1 overflow-hidden relative" style="flex: 0 0 60%;">
                <div class="element-options-mobile h-full">
                  <ElementOptions
                    @update="$emit('update:canvasItems', [...canvasItems])"
                    :current-page="currentPage"
                    :selected-index="selectedIndex"
                    :selected-item="selectedItem ?? null"
                    @close-options="handleCloseOptions"
                  />
                </div>
                <!-- 선택된 아이템이 없을 때 빈 상태 -->
                <div v-if="selectedIndex === null || !selectedItem" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                  <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-3 shrink-0">
                    <i class="pi pi-info-circle text-xl text-surface-400" />
                  </div>
                  <h4 class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1 whitespace-nowrap">편집할 요소를 선택하세요</h4>
                  <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap">컴포넌트를 선택하면 여기에 표시됩니다</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { H1Icon, H2Icon, H3Icon } from '@heroicons/vue/24/outline'
import draggable from 'vuedraggable'
import type { ComponentDef, Page, CanvasItem } from '~/types/component'

interface MobileMenuProps {
  isOpen: boolean
  activePanel: string | null
  currentPage: Page | null
  currentPageId?: string | null
  canvasItems: CanvasItem[]
  selectedIndex: number | null
  selectedItem: CanvasItem | null
  isPreviewMode: boolean
  isPagesLoading?: boolean
  savedPagesData?: Record<string, CanvasItem[]>
  pages?: Page[]
  isSaving?: boolean
  isDeleting?: boolean
  isPageLoading?: boolean
}

interface MobileMenuEmits {
  (e: 'close'): void
  (e: 'openPanel', panel: string): void
  (e: 'closePanel'): void
  (e: 'update:pages', pages: Page[]): void
  (e: 'addComponent', comp: ComponentDef): void
  (e: 'selectPage', page: Page): void
  (e: 'createPage'): void
  (e: 'update:canvasItems', items: CanvasItem[]): void
  (e: 'selectItem', index: number): void
  (e: 'clearSelection'): void
  (e: 'copyItem', index: number): void
  (e: 'deleteItem', index: number): void
  (e: 'savePage'): void
  (e: 'deletePage'): void
  (e: 'updatePageName', name: string): void
  (e: 'editPage', page: Page): void
}

const Draggable = draggable

const props = defineProps<MobileMenuProps>()
const emit = defineEmits<MobileMenuEmits>()

const { getComponentIcon, getComponentLabel } = useElements()

const clearSelection = () => {
  emit('clearSelection')
}

const handleOpenEditPageModal = () => {
  if (!props.currentPage) return
  emit('editPage', props.currentPage)
}

const handleOpenOptions = () => {
  clearSelection()
  emit('openPanel', 'options')
}

const handleClose = () => {
  clearSelection()
  emit('close')
}

const handleClosePanel = () => {
  clearSelection()
  emit('closePanel')
}

const handleCloseOptions = () => {
  clearSelection()
}
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

// 모바일에서 ElementOptions를 일반 레이아웃으로 표시
:deep(.element-options-mobile) {
  > div {
    position: relative !important;
    inset: auto !important;
    height: 100% !important;
    z-index: auto !important;
  }
}
</style>