<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="px-3 py-2.5 border-b border-surface-200 dark:border-surface-700">
      <div class="relative">
        <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs z-10" />
        <InputText
          v-model="searchQuery"
          placeholder="컴포넌트 검색..."
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
          class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm group"
          :class="{ 'opacity-50 pointer-events-none': isPreviewMode }"
          draggable="true"
          @dragstart="$emit('dragStart', comp)"
          @click="handleAdd(comp)"
        >
          <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
              <template v-if="comp.type === 'heading1'">
                <H1Icon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </template>
              <template v-else-if="comp.type === 'heading2'">
                <H2Icon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </template>
              <template v-else-if="comp.type === 'heading3'">
                <H3Icon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </template>
              <i
                v-else
                :class="comp.icon"
                class="text-lg text-primary-600 dark:text-primary-400"
              />
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ comp.name }}</span>
            <span class="text-xs text-surface-400 truncate">{{ comp.description }}</span>
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
            class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm group"
            :class="{ 'opacity-50 pointer-events-none': isPreviewMode }"
            draggable="true"
            @dragstart="$emit('dragStart', comp)"
            @click="handleAdd(comp)"
          >
            <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
              <template v-if="comp.type === 'heading1'">
                <H1Icon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </template>
              <template v-else-if="comp.type === 'heading2'">
                <H2Icon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </template>
              <template v-else-if="comp.type === 'heading3'">
                <H3Icon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </template>
              <i
                v-else
                :class="comp.icon"
                class="text-lg text-primary-600 dark:text-primary-400"
              />
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ comp.name }}</span>
              <span class="text-xs text-surface-400 truncate">{{ comp.description }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ComponentDef } from '~/types/component'
import type { ElementsProps, ElementsEmits } from '~/types/elements'
import { useElements } from '~/composables/useElements'
import { H1Icon, H2Icon, H3Icon } from '@heroicons/vue/24/outline'

type Props = ElementsProps
type Emits = ElementsEmits

const props = withDefaults(defineProps<Props>(), {
  variant: 'desktop'
})

const emit = defineEmits<Emits>()

// composable에서 컴포넌트 데이터 직접 가져오기
const { components } = useElements()

const handleAdd = (comp: ComponentDef) => {
  emit('add', comp)
  if (props.variant === 'mobile') {
    emit('close')
  }
}

const searchQuery = ref('')

const filteredComponents = computed(() => {
  if (!searchQuery.value.trim()) {
    return components
  }
  const query = searchQuery.value.toLowerCase()
  return components.filter(comp => 
    comp.name.toLowerCase().includes(query) ||
    comp.description.toLowerCase().includes(query)
  )
})

const formTypes = ['inputText', 'inputPassword', 'inputEmail', 'inputDate', 'inputTime', 'select', 'inputTextSmall', 'textarea', 'inputUrl', 'checkbox', 'radio', 'toggleSwitch']

const fieldComponents = computed(() =>
  filteredComponents.value.filter(comp => !formTypes.includes(comp.type))
)

const formComponents = computed(() =>
  filteredComponents.value.filter(comp => formTypes.includes(comp.type))
)
</script>

