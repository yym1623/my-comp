export interface ConfirmProps {
  modelValue: boolean
  header: string
  message: string
  actionType?: 'delete' | 'create' | 'update' | 'success'
  to?: string
}

export interface ConfirmEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}

