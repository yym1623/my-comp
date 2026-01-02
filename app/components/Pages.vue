<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="px-3">
      <div class="py-2.5 border-b border-surface-200 dark:border-surface-700 shrink-0">
        <div class="relative">
          <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs z-10" />
          <InputText
            v-model="searchQuery"
            placeholder="페이지 검색..."
            class="w-full pl-8 pr-3 py-2 text-sm bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>
      <div class="mt-2.5">
        <button
          class="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg border transition-all bg-surface-0 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-200 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 active:scale-[0.98]"
          @click="$emit('create')"
        >
          <i class="pi pi-plus text-sm"></i>
          <span>페이지 추가</span>
        </button>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-3 min-h-0">
      <Draggable
        :model-value="filteredPages"
        item-key="id"
        class="grid gap-2"
        @update:model-value="handleUpdatePages($event)"
      >
        <template #item="{ element: page }">
          <div
            class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border"
            :class="[
              currentPageId === page.id 
                ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600',
              props.isPreviewMode && 'opacity-50 pointer-events-none'
            ]"
            @click="handleSelect(page)"
          >
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
              :class="currentPageId === page.id 
                ? 'bg-primary-200 dark:bg-primary-900/50' 
                : 'bg-surface-200 dark:bg-surface-600'"
            >
              <i class="pi pi-file text-lg" :class="currentPageId === page.id ? 'text-primary-600 dark:text-primary-400' : 'text-surface-500'" />
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-semibold" :class="currentPageId === page.id ? 'text-primary-600 dark:text-primary-400' : 'text-surface-700 dark:text-surface-200'">{{ page.name }}</span>
              <span class="text-xs text-surface-400">{{ page.description || '페이지' }}</span>
            </div>
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Page } from '~/types/component'
import type { PagesProps, PagesEmits } from '~/types/pages'
import { usePages } from '~/composables/usePages'
import draggable from 'vuedraggable'

const Draggable = draggable

type Props = PagesProps
type Emits = PagesEmits

const props = withDefaults(defineProps<Props>(), {
  variant: 'desktop'
})

const emit = defineEmits<Emits>()

// composable에서 페이지 데이터 직접 가져오기
const { pages } = usePages()

const handleSelect = (page: Page) => {
  emit('select', page)
  if (props.variant === 'mobile') {
    emit('closePanel')
  }
}

const searchQuery = ref('')

const filteredPages = computed(() => {
  if (!searchQuery.value.trim()) {
    return pages.value
  }
  const query = searchQuery.value.toLowerCase()
  return pages.value.filter(page => 
    page.name.toLowerCase().includes(query) ||
    (page.description && page.description.toLowerCase().includes(query))
  )
})

const handleUpdatePages = (updatedPages: Page[]) => {
  pages.value = updatedPages
  emit('update:pages', updatedPages)
}
</script>

