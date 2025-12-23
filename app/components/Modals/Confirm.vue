<template>
  <Dialog
    :visible="modelValue"
    modal
    position="top"
    :style="{ width: '420px', marginTop: '1.5rem' }"
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
import type { ConfirmProps, ConfirmEmits } from '~/types/confirm'

type Props = ConfirmProps
type Emits = ConfirmEmits

const props = withDefaults(defineProps<Props>(), {
  actionType: 'delete'
})

const emit = defineEmits<Emits>()

const actionLabel = computed(() => {
  switch (props.actionType) {
    case 'delete':
      return '삭제'
    case 'create':
      return '생성'
    case 'update':
      return '수정'
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

const { go } = useNavigation()

const handleConfirm = () => {
  emit('confirm')
  if (props.to) {
    go(props.to)
  }
}
</script>

