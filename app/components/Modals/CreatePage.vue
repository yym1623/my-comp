<template>
  <Dialog
    :visible="modelValue"
    modal
    :draggable="false"
    :dismissableMask="true"
    :style="{ width: '520px' }"
    :breakpoints="{ '960px': '90vw', '640px': '94vw' }"
    :closable="true"
    class="create-page-dialog"
    @update:visible="(val) => $emit('update:modelValue', val)"
    @hide="$emit('update:modelValue', false)"
  >
    <template #header>
      <div class="flex gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <i class="pi pi-file-plus text-lg text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100 m-0">새 페이지 만들기</h3>
          <p class="text-xs text-surface-500 dark:text-surface-500 m-0 mt-0.5">페이지 이름과 설명을 입력하세요</p>
        </div>
      </div>
    </template>
    
    <div class="flex flex-col gap-6 py-1">
      <div class="flex flex-col gap-3">
        <label class="flex items-center gap-2 text-sm font-semibold text-surface-800 dark:text-surface-200">
          <div class="w-5 h-5 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <i class="pi pi-file text-xs text-primary-600 dark:text-primary-400" />
          </div>
          <span class="leading-none align-middle">페이지 이름</span>
        </label>
        <InputText
          v-model="localPageName"
          placeholder="예: 홈페이지, 로그인 페이지..."
          :class="[
            'w-full pl-3 pr-3 py-2 text-sm bg-surface-50 dark:bg-surface-700/50 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            isPageNameDuplicate 
              ? 'border-red-500 dark:border-red-500' 
              : 'border-surface-200 dark:border-surface-600'
          ]"
          autofocus
          @keyup.enter="!isPageNameDuplicate && handleCreate()"
        />
        <p v-if="isPageNameDuplicate" class="text-xs text-red-500 dark:text-red-400 leading-relaxed flex items-center gap-1">
          <i class="pi pi-exclamation-circle text-xs" />
          동일한 이름의 페이지가 이미 존재합니다
        </p>
      </div>
      
      <div class="flex flex-col gap-3">
        <label class="flex items-center gap-2 text-sm font-semibold text-surface-800 dark:text-surface-200">
          <div class="w-5 h-5 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <i class="pi pi-info-circle text-xs text-primary-600 dark:text-primary-400" />
          </div>
          <span>설명</span>
        </label>
        <Textarea
          v-model="localPageDescription"
          placeholder="페이지에 대한 간단한 설명을 입력하세요"
          rows="3"
          class="w-full pl-3 pr-3 py-2 text-sm bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          @keyup.enter.ctrl="handleCreate"
        />
      </div>
    </div>
    
    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button
          label="취소"
          severity="secondary"
          outlined
          @click="$emit('update:modelValue', false)"
        />
        <Button
          label="생성"
          severity="primary"
          :disabled="!localPageName.trim() || isPageNameDuplicate"
          @click="handleCreate"
        />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { CreatePageProps, CreatePageEmits } from '~/types/createpage'
import { usePages } from '~/composables/usePages'

type Props = CreatePageProps
type Emits = CreatePageEmits

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// composable에서 페이지 데이터 직접 가져오기
const { pages } = usePages()

const localPageName = ref('')
const localPageDescription = ref('')

const isPageNameDuplicate = computed(() => {
  if (!localPageName.value.trim()) return false
  const trimmedName = localPageName.value.trim()
  return pages.value.some(page => page.name.toLowerCase() === trimmedName.toLowerCase())
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    localPageName.value = ''
    localPageDescription.value = ''
  }
})

const handleCreate = () => {
  if (!localPageName.value.trim() || isPageNameDuplicate.value) return
  emit('create', {
    name: localPageName.value.trim(),
    description: localPageDescription.value.trim()
  })
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
:deep(.create-page-dialog) {
  .p-dialog-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid rgb(var(--surface-200));
  }
  
  .p-dialog-content {
    padding: 0 1.5rem;
  }
  
  .p-dialog-footer {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid rgb(var(--surface-200));
  }
}

.dark :deep(.create-page-dialog) {
  .p-dialog-header {
    border-bottom-color: rgb(var(--surface-700));
  }
  
  .p-dialog-footer {
    border-top-color: rgb(var(--surface-700));
  }
}
</style>

