<template>
  <Dialog
    :visible="modelValue"
    modal
    position="top"
    style="width: 420px; margin-top: 1.5rem"
    :closable="false"
    :header="header"
    @update:visible="(val) => $emit('update:modelValue', val)"
  >
    <div class="flex flex-col gap-3 py-1">
      <p class="text-sm text-surface-700 dark:text-surface-200">
        {{ message }}
      </p>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <Button
          label="취소"
          severity="secondary"
          outlined
          size="small"
          @click="$emit('update:modelValue', false)"
        />
        <Button
          :label="actionLabel"
          :severity="actionSeverity"
          size="small"
          @click="handleConfirm"
        />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    header: string
    message: string
    actionType?: 'delete' | 'create' | 'update' | 'save' | 'success'
    to?: string
  }>(),
  {
  actionType: 'delete'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const actionLabel = computed(() => {
  switch (props.actionType) {
    case 'delete':
      return '삭제'
    case 'create':
      return '생성'
    case 'update':
      return '수정'
    case 'save':
      return '저장'
    case 'success':
      return '확인'
    default:
      return '확인'
  }
})

const actionSeverity = computed(() => {
  switch (props.actionType) {
    case 'delete':
      return 'danger'
    case 'success':
      return 'success'
    default:
      return 'primary'
  }
})

const handleConfirm = () => {
  emit('confirm')
  if (props.to) {
    navigateTo(props.to)
  }
}
</script>
