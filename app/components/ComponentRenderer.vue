<template>
  <!-- Heading 1 -->
  <h1
    v-if="item.type === 'heading1'"
    class="text-2xl font-bold text-surface-800 dark:text-surface-100 m-0"
  >
    {{ item.props.text }}
  </h1>
  <!-- Heading 2 -->
  <h2
    v-else-if="item.type === 'heading2'"
    class="text-xl font-semibold text-surface-800 dark:text-surface-100 m-0"
  >
    {{ item.props.text }}
  </h2>
  <!-- Heading 3 -->
  <h3
    v-else-if="item.type === 'heading3'"
    class="text-lg font-semibold text-surface-800 dark:text-surface-100 m-0"
  >
    {{ item.props.text }}
  </h3>
  <!-- Spacer -->
  <div
    v-else-if="item.type === 'spacer'"
    :style="{ height: item.props.height || '1rem' }"
  />
  <!-- Divider -->
  <hr
    v-else-if="item.type === 'divider'"
    class="border-t border-surface-200 dark:border-surface-700 my-2"
  />
  <!-- Image -->
  <div
    v-else-if="item.type === 'image'"
    class="bg-surface-100 dark:bg-surface-800 p-6 rounded-lg flex items-center justify-start text-surface-400"
  >
    <i class="pi pi-image text-2xl" />
  </div>
  <!-- 텍스트 입력 (한 줄) -->
  <div
    v-else-if="item.type === 'inputTextSmall'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <InputText
      :key="`input-text-small-${item.uid}`"
      type="text"
      :model-value="''"
      :placeholder="item.props.placeholder || '입력하세요...'"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 텍스트 입력 (여러 줄) -->
  <div
    v-else-if="item.type === 'textarea'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <Textarea
      :key="`textarea-${item.uid}`"
      :model-value="item.props.content || ''"
      :rows="4"
      class="w-full"
      style="min-height: 6rem;"
      readonly
    />
  </div>
  <!-- 텍스트 입력 -->
  <div
    v-else-if="item.type === 'inputText'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <InputText
      :key="`input-text-${item.uid}`"
      type="text"
      :model-value="''"
      :placeholder="item.props.placeholder || '입력하세요...'"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 비밀번호 입력 -->
  <div
    v-else-if="item.type === 'inputPassword'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <InputText
      :key="`input-password-${item.uid}`"
      type="password"
      :model-value="''"
      :placeholder="item.props.placeholder || '비밀번호를 입력하세요'"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 이메일 입력 -->
  <div
    v-else-if="item.type === 'inputEmail'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <InputText
      :key="`input-email-${item.uid}`"
      type="email"
      :model-value="''"
      :placeholder="item.props.placeholder || 'example@email.com'"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 날짜 선택 -->
  <div
    v-else-if="item.type === 'inputDate'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <InputText
      :key="`input-date-${item.uid}`"
      type="text"
      :model-value="''"
      :placeholder="item.props.placeholder || 'yy.mm.dd'"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 시간 선택 -->
  <div
    v-else-if="item.type === 'inputTime'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <InputText
      :key="`input-time-${item.uid}`"
      type="text"
      :model-value="''"
      :placeholder="item.props.placeholder || 'hh:ss'"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 선택 상자 -->
  <div
    v-else-if="item.type === 'select'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <Dropdown
      :key="`select-${item.uid}`"
      :model-value="null"
      :options="item.props.options || []"
      :placeholder="item.props.placeholder || '선택하세요'"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- URL 입력 -->
  <div
    v-else-if="item.type === 'inputUrl'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <InputText
      :key="`input-url-${item.uid}`"
      type="url"
      :model-value="''"
      :placeholder="item.props.placeholder || 'https://example.com'"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 체크박스 -->
  <div
    v-else-if="item.type === 'checkbox'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <div class="flex items-center gap-2" style="min-height: 2.5rem;">
      <Checkbox
        :key="`checkbox-${item.uid}`"
        :model-value="item.props.checked || false"
        :binary="true"
      />
      <span class="text-sm text-surface-700 dark:text-surface-200">{{ item.props.label }}</span>
    </div>
  </div>
  <!-- 라디오 버튼 -->
  <div
    v-else-if="item.type === 'radio'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <div class="flex flex-col gap-2" style="min-height: 2.5rem;">
      <div
        v-for="(option, optIndex) in (item.props.options || [])"
        :key="`radio-${item.uid}-${optIndex}`"
        class="flex items-center gap-2"
      >
        <RadioButton
          :model-value="item.props.selected || item.props.options?.[0]"
          :value="option"
          :name="`radio-${item.uid}`"
        />
        <label class="text-sm text-surface-700 dark:text-surface-200 cursor-pointer">{{ option }}</label>
      </div>
    </div>
  </div>
  <!-- 토글 스위치 -->
  <div
    v-else-if="item.type === 'toggleSwitch'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <div class="flex items-center gap-2" style="min-height: 2.5rem;">
      <ToggleSwitch
        :key="`toggle-${item.uid}`"
        :model-value="item.props.checked || false"
      />
      <span class="text-sm text-surface-700 dark:text-surface-200">{{ item.props.checked ? '켜짐' : '꺼짐' }}</span>
    </div>
  </div>
  <!-- 버튼 -->
  <div
    v-else-if="item.type === 'button'"
    class="flex items-center"
  >
    <Button
      :key="`button-${item.uid}`"
      :label="item.props.text || '버튼'"
      severity="primary"
      :outlined="item.props.outlined || false"
      class="!w-auto"
    />
  </div>
  <!-- 이전/다음 네비게이션 -->
  <div
    v-else-if="item.type === 'prevNext'"
    class="flex items-center justify-between gap-4"
  >
    <Button
      :label="item.props.prevText"
      severity="secondary"
      outlined
      class="!w-auto"
    />
    <Button
      :label="item.props.nextText"
      severity="primary"
      class="!w-auto"
    />
  </div>
</template>

<script lang="ts" setup>
import type { CanvasItem } from '~/types/component'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import InputSwitch from 'primevue/inputswitch'

defineProps<{
  item: CanvasItem
}>()
</script>

