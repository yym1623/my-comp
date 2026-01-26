<template>
  <Dialog
    :visible="modelValue"
    modal
    :draggable="false"
    :dismissableMask="true"
    style="width: 520px"
    :breakpoints="{ '960px': '90vw', '640px': '94vw' }"
    :closable="true"
    class="create-page-dialog"
    @update:visible="(val) => $emit('update:modelValue', val)"
    @hide="$emit('update:modelValue', false)"
  >
    <template #header>
      <div class="flex gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <i :class="props.mode === 'edit' ? 'pi pi-pencil text-lg text-primary-600 dark:text-primary-400' : 'pi pi-file-plus text-lg text-primary-600 dark:text-primary-400'" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100 m-0">{{ props.title }}</h3>
          <p class="text-xs text-surface-500 dark:text-surface-500 m-0 mt-0.5">{{ props.description }}</p>
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
          @keyup.enter="!isPageNameDuplicate && (props.mode === 'edit' ? handleUpdate() : handleCreate())"
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
          ref="createButtonRef"
          severity="primary"
          :disabled="!localPageName.trim() || isPageNameDuplicate || isCreating"
          :style="isCreating && buttonMinWidth !== 'auto' ? { minWidth: buttonMinWidth, width: buttonMinWidth } : {}"
          @click="props.mode === 'edit' ? handleUpdate() : handleCreate()"
        >
          <i v-if="isCreating" class="pi pi-spin pi-spinner text-sm" />
          <span v-else>{{ props.buttonLabel }}</span>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
  mode?: 'create' | 'edit'
  title?: string
  description?: string
  buttonLabel?: string
  initialName?: string
  initialDescription?: string
  pageId?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'create', page: { name: string; description: string }): void
  (e: 'update', page: { name: string; description: string }): void
}>()

// composable에서 페이지 데이터 직접 가져오기
const { pages, createPage } = usePages()
const { showSuccess, showError } = useAppToast()

const localPageName = ref<string>('')
const localPageDescription = ref<string>('')
const isCreating = ref<boolean>(false)
const createButtonRef = ref<any>()
const buttonMinWidth = ref<string>('auto')

const isPageNameDuplicate = computed(() => {
  if (!localPageName.value.trim()) return false
  const trimmedName = localPageName.value.trim()
  // 수정 모드일 때는 현재 페이지 이름과 같으면 중복으로 간주하지 않음
  if (props.mode === 'edit' && props.pageId) {
    return pages.value.some(page => 
      page.id !== props.pageId && 
      page.name.toLowerCase() === trimmedName.toLowerCase()
    )
  }
  return pages.value.some(page => page.name.toLowerCase() === trimmedName.toLowerCase())
})

// 버튼 너비 측정 함수
const measureButtonWidth = () => {
  nextTick(() => {
    setTimeout(() => {
      if (createButtonRef.value) {
        // PrimeVue Button 컴포넌트의 실제 DOM 요소 찾기
        const buttonElement = createButtonRef.value.$el || createButtonRef.value
        if (buttonElement && buttonElement.offsetWidth > 0) {
          buttonMinWidth.value = `${buttonElement.offsetWidth}px`
        }
      }
    }, 100)
  })
}


watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // 수정 모드일 때는 초기값 설정, 생성 모드일 때는 빈 값
    if (props.mode === 'edit') {
      localPageName.value = props.initialName || ''
      localPageDescription.value = props.initialDescription || ''
    } else {
    localPageName.value = ''
    localPageDescription.value = ''
    }
    isCreating.value = false
    // 모달이 열릴 때 버튼 너비 측정
    measureButtonWidth()
  }
})


// 로딩 상태가 변경될 때 너비 재측정 (로딩 전에)
watch(() => isCreating.value, (newVal) => {
  if (!newVal) {
    // 로딩이 끝나면 너비 재측정
    measureButtonWidth()
  } else {
    // 로딩 시작 전에 현재 너비 저장
    measureButtonWidth()
  }
})

const handleCreate = async () => {
  if (!localPageName.value.trim() || isPageNameDuplicate.value || isCreating.value) return
  
  // 로딩 시작 전에 버튼 너비 측정 및 저장
  if (createButtonRef.value) {
    const buttonElement = createButtonRef.value.$el || createButtonRef.value
    if (buttonElement && buttonElement.offsetWidth > 0) {
      buttonMinWidth.value = `${buttonElement.offsetWidth}px`
    }
  }
  
  isCreating.value = true
  try {
    // DB에 페이지 생성
    const newPage = await createPage({
      name: localPageName.value.trim(),
      description: localPageDescription.value.trim() || undefined
    }, [])
    
    // 생성 완료 이벤트 emit (index.vue에서 pagesData 초기화 등 처리)
    emit('create', {
      name: newPage.name,
      description: newPage.description || ''
    })
    
    // 성공 토스트
    showSuccess('페이지 생성', `${newPage.name} 페이지가 생성되었습니다.`)
    
    // 생성 완료 후 모달 닫기
    emit('update:modelValue', false)
  } catch (error: any) {
    // 에러 토스트
    showError('페이지 생성 실패', error.message || '페이지 생성 중 오류가 발생했습니다.')
  } finally {
    isCreating.value = false
  }
}

const handleUpdate = () => {
  if (!localPageName.value.trim() || isPageNameDuplicate.value || !props.pageId) return
  
  // 로컬 상태만 업데이트 (DB 저장은 저장 버튼에서 처리)
  // 수정 완료 이벤트 emit
  emit('update', {
    name: localPageName.value.trim(),
    description: localPageDescription.value.trim() || ''
  })
  
  // 수정 완료 후 모달 닫기
  emit('update:modelValue', false)
}

// 버튼이 마운트된 후 너비 측정
onMounted(() => {
  measureButtonWidth()
})
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

