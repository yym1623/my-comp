export type ComponentOptionField = {
  key: string
  label: string
  component: 'InputNumber' | 'Select'
  componentProps?: Record<string, unknown>
  section?: string
  defaultValue?: unknown
  disabled?: boolean
}

export type SectionReady = {
  Position?: boolean
  Layout?: boolean
  Appearance?: boolean
  Typography?: boolean
}
