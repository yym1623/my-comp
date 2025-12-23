export interface CreatePageProps {
  modelValue: boolean
}

export interface CreatePageEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'create', page: { name: string; description: string }): void
}

