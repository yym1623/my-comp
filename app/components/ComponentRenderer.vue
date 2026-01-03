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
    v-if="item.type === 'heading2'"
    class="text-xl font-semibold text-surface-800 dark:text-surface-100 m-0"
  >
    {{ item.props.text }}
  </h2>
  <!-- Heading 3 -->
  <h3
    v-if="item.type === 'heading3'"
    class="text-lg font-semibold text-surface-800 dark:text-surface-100 m-0"
  >
    {{ item.props.text }}
  </h3>
  <!-- Spacer -->
  <div
    v-if="item.type === 'spacer'"
    :style="{ height: item.props.height || '1rem' }"
  />
  <!-- Divider -->
  <hr
    v-if="item.type === 'divider'"
    class="border-t border-surface-200 dark:border-surface-700 my-2"
  />
  <!-- Image -->
  <div
    v-if="item.type === 'image'"
    class="rounded-lg overflow-hidden"
  >
    <Image
      v-if="item.props.src"
      :src="item.props.src"
      :alt="item.props.alt || '이미지'"
      class="w-full"
      preview
    />
    <div
      v-else
      class="bg-surface-100 dark:bg-surface-800 p-6 rounded-lg flex items-center justify-center text-surface-400 min-h-[200px]"
    >
      <div class="flex flex-col items-center gap-2">
        <i class="pi pi-image text-3xl" />
        <span class="text-xs">이미지 URL을 입력하세요</span>
      </div>
    </div>
  </div>
  <!-- 텍스트 입력 (여러 줄) -->
  <div
    v-if="item.type === 'textarea'"
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
    v-if="item.type === 'inputText'"
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
    v-if="item.type === 'inputPassword'"
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
    v-if="item.type === 'inputEmail'"
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
    v-if="item.type === 'inputDate'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <DatePicker
      :key="`input-date-${item.uid}`"
      :model-value="null"
      :placeholder="item.props.placeholder || '날짜를 선택하세요'"
      dateFormat="yy.mm.dd"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 시간 선택 -->
  <div
    v-if="item.type === 'inputTime'"
    class="flex flex-col gap-1 form-field-wrapper"
  >
    <label v-if="item.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
      {{ item.props.label }}
    </label>
    <DatePicker
      :key="`input-time-${item.uid}`"
      :model-value="null"
      :placeholder="item.props.placeholder || '시간을 선택하세요'"
      timeOnly
      hourFormat="24"
      class="w-full"
      style="min-height: 2.5rem;"
    />
  </div>
  <!-- 선택 상자 -->
  <div
    v-if="item.type === 'select'"
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
    v-if="item.type === 'inputUrl'"
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
    v-if="item.type === 'checkbox'"
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
    v-if="item.type === 'radio'"
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
    v-if="item.type === 'toggleSwitch'"
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
    v-if="item.type === 'button'"
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
    v-if="item.type === 'prevNext'"
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
import DatePicker from 'primevue/datepicker'
import Image from 'primevue/image'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import InputSwitch from 'primevue/inputswitch'

defineProps<{
  item: CanvasItem
}>()
</script>

