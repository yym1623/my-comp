<template>
  <main class="flex-1 h-full flex items-center justify-center px-2.5 md:px-10 py-10 overflow-hidden relative preview-root">
    <!-- 프리뷰 모드 표시 배지 -->
    <div 
      v-if="isPreviewMode" 
      class="absolute top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center gap-2 shadow-lg z-10"
    >
      <i class="pi pi-eye text-xs" />
      미리보기 모드 
    </div>
    <div
      class="preview-card w-[min(660px,calc(100%-20px))] md:w-[min(660px,calc(100%-40px))] h-[min(700px,calc(100%-10px))] bg-surface-0 dark:bg-surface-800 rounded-2xl overflow-hidden flex flex-col shadow-lg relative"
      :class="{ 'ring-2 ring-primary-500': isPreviewMode, 'preview-mode': isPreviewMode }"
      @dragover.prevent="!isPreviewMode"
      @drop="!isPreviewMode && $emit('drop')"
      @click="!isPreviewMode && $emit('deselect')"
    >
      <!-- QR 플립 버튼 (프리뷰 카드 오른쪽 끝에 ㄷ자 모양으로 붙는 형태) -->
      <button
        v-if="qrUrl && isPreviewMode"
        class="absolute top-5 -right-[1px] w-10 h-8 rounded-l-md rounded-r-none bg-surface-0 dark:bg-surface-900 border border-l-surface-200 border-y-surface-200 border-r-transparent dark:border-l-surface-600 dark:border-y-surface-600 dark:border-r-transparent shadow-md flex items-center justify-center text-surface-600 dark:text-surface-200 hover:text-primary-500 hover:border-l-primary-500 hover:border-y-primary-500 dark:hover:border-l-primary-400 dark:hover:border-y-primary-400 transition-all z-20"
       
        @click.stop="toggleQrPanel"
      >
        <i :class="[showQrPanel ? 'pi pi-arrow-left' : 'pi pi-qrcode', 'text-sm']" />
      </button>

      <!-- 플립 컨테이너 (앞/뒤 양면) -->
      <div class="preview-flip-container" :class="{ 'is-flipped': showQrPanel }">
        <!-- 앞면: 기존 캔버스 -->
        <div class="preview-face preview-front">
          <!-- 기본 캔버스 영역 -->
          <Transition name="fade" mode="out-in">
            <div v-if="canvasItems.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div class="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4 shrink-0">
            <i class="pi pi-objects-column text-2xl text-primary-500" />
          </div>
          <h3 class="text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1 whitespace-nowrap">컴포넌트 추가</h3>
          <div class="flex flex-col items-center">
            <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap">{{ isMobile ? '메뉴' : '왼쪽' }}에서 컴포넌트를 드래그하거나</p>
            <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap mt-1">클릭하여 추가하세요</p>

          </div>
          <div class="flex items-center gap-2 mt-4 text-xs text-surface-400 shrink-0">
            <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded whitespace-nowrap">드래그</span>
            <span class="whitespace-nowrap">또는</span>
            <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded whitespace-nowrap">클릭</span>
          </div>
            </div>
          </Transition>
          <Transition name="fade" mode="out-in">
            <Draggable
              v-if="canvasItems.length > 0"
              :model-value="canvasItems"
              item-key="uid"
              :disabled="isPreviewMode"
              @update:model-value="$emit('update:canvasItems', $event)"
            >
              <template #item="{ element, index }">
            <div
              class="canvas-item group relative"
              :class="{ selected: selectedIndex === index && !isPreviewMode }"
              @click.stop="!isPreviewMode && $emit('select', index)"
            >
                <!-- 복사/삭제 버튼 -->
                <div 
                  v-if="!isPreviewMode" 
                  class="absolute -top-5 right-0 flex items-center gap-1 z-10 transition-opacity"
                  :class="selectedIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                >
                  <button
                    class="w-5 h-5 flex items-center justify-center bg-white dark:bg-surface-800 border border-primary-500 dark:border-primary-500 shadow-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    @click.stop="$emit('copy', index)"
                  >
                    <i class="pi pi-copy text-xs text-primary-500 dark:text-primary-400" />
                  </button>
                  <button
                    class="w-5 h-5 flex items-center justify-center bg-white dark:bg-surface-800 border border-primary-500 dark:border-primary-500 shadow-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    @click.stop="$emit('delete', index)"
                  >
                    <i class="pi pi-trash text-xs text-primary-500 dark:text-primary-400" />
                  </button>
                </div>
              <!-- Heading 1 -->
              <h1
                v-if="element.type === 'heading1'"
                class="font-bold text-surface-800 dark:text-surface-100 m-0"
                :style="{ ...getElementStyle(element), ...getTypographyStyle(element) }"
              >
                {{ element.props.text }}
              </h1>
              <!-- Heading 2 -->
              <h2
                v-if="element.type === 'heading2'"
                class="font-semibold text-surface-800 dark:text-surface-100 m-0"
                :style="{ ...getElementStyle(element), ...getTypographyStyle(element) }"
              >
                {{ element.props.text }}
              </h2>
              <!-- Heading 3 -->
              <h3
                v-if="element.type === 'heading3'"
                class="font-semibold text-surface-800 dark:text-surface-100 m-0"
                :style="{ ...getElementStyle(element), ...getTypographyStyle(element) }"
              >
                {{ element.props.text }}
              </h3>
              <!-- Spacer -->
              <div
                v-if="element.type === 'spacer'"
                :style="getElementStyle(element)"
              />
              <!-- Divider -->
              <Divider
                v-if="element.type === 'divider'"
                class="divider-default"
                :style="getElementStyle(element)"
              />
              <!-- Image -->
              <div
                v-if="element.type === 'image'"
                class="rounded-lg overflow-hidden"
                :style="getElementStyle(element)"
              >
                <Image
                  v-if="element.props.src"
                  :src="element.props.src"
                  :alt="element.props.alt || '이미지'"
                  class="w-full"
                  :preview="isPreviewMode"
                />
                <div
                  v-else
                  class="bg-surface-100 dark:bg-surface-800 p-6 rounded-lg flex items-center justify-center text-surface-400 "
                >
                  <div class="flex flex-col items-center gap-2">
                    <i class="pi pi-image text-3xl" />
                    <span class="text-xs">이미지 URL을 입력하세요</span>
                  </div>
                </div>
              </div>
              <!-- 텍스트 입력 (여러 줄) -->
              <div
                v-if="element.type === 'textarea'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <Textarea
                  :key="`textarea-${element.uid}-${index}`"
                  :model-value="element.props.content || ''"
                  :rows="4"
                  placeholder="설명 내용을 입력하세요."
                  :style="{ minHeight: '6rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }"
                  :readonly="!isPreviewMode"
                  :class="{ 'edit-mode': !isPreviewMode }"
                />
              </div>
              
              <!-- 나머지 컴포넌트들 -->
              <div
                v-if="element.type === 'inputText'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-text-${element.uid}-${index}`"
                  type="text"
                  :model-value="''"
                  :placeholder="element.props.placeholder || '입력하세요...'"
                  :readonly="!isPreviewMode"
                  :class="[{ 'edit-mode': !isPreviewMode }]"
                  :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }"
                />
              </div>
              <!-- 비밀번호 입력 -->
              <div
                v-if="element.type === 'inputPassword'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-password-${element.uid}-${index}`"
                  type="password"
                  :model-value="''"
                  :placeholder="element.props.placeholder || '비밀번호를 입력하세요'"
                  :readonly="!isPreviewMode"
                  :class="[{ 'edit-mode': !isPreviewMode }]"
                  :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }"
                />
              </div>
              <!-- 이메일 입력 -->
              <div
                v-if="element.type === 'inputEmail'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-email-${element.uid}-${index}`"
                  type="email"
                  :model-value="''"
                  :placeholder="element.props.placeholder || 'example@email.com'"
                  :readonly="!isPreviewMode"
                  :class="[{ 'edit-mode': !isPreviewMode }]"
                  :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }"
                />
              </div>
              <!-- 날짜 선택 -->
              <div
                v-if="element.type === 'inputDate'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <DatePicker
                  :key="`input-date-${element.uid}-${index}`"
                  :model-value="null"
                  :placeholder="element.props.placeholder || '날짜를 선택하세요'"
                  dateFormat="yy.mm.dd"
                  :readonly="!isPreviewMode"
                  :class="[{ 'edit-mode': !isPreviewMode }]"
                  :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }"
                />
              </div>
              <!-- 시간 선택 -->
              <div
                v-if="element.type === 'inputTime'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <DatePicker
                  :key="`input-time-${element.uid}-${index}`"
                  :model-value="null"
                  :placeholder="element.props.placeholder || '시간을 선택하세요'"
                  timeOnly
                  hourFormat="24"
                  :readonly="!isPreviewMode"
                  :class="[{ 'edit-mode': !isPreviewMode }]"
                  :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }"
                />
              </div>
              <!-- 선택 상자 -->
              <div
                v-if="element.type === 'select'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <Select
                  :key="`select-${element.uid}-${index}`"
                  :model-value="null"
                  :options="element.props.options || []"
                  :placeholder="element.props.placeholder || '선택하세요'"
                  :readonly="!isPreviewMode"
                  :class="[{ 'edit-mode': !isPreviewMode }]"
                  :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }"
                />
              </div>
              <!-- URL 입력 -->
              <div
                v-if="element.type === 'inputUrl'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <InputText
                  :key="`input-url-${element.uid}-${index}`"
                  type="url"
                  :model-value="''"
                  :placeholder="element.props.placeholder || 'https://example.com'"
                  :readonly="!isPreviewMode"
                  :class="[{ 'edit-mode': !isPreviewMode }]"
                  :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }"
                />
              </div>
              <!-- 체크박스 -->
              <div
                v-if="element.type === 'checkbox'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <div class="flex items-center gap-2" :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }">
                  <Checkbox
                    :key="`checkbox-${element.uid}-${index}`"
                    :model-value="element.props.checked || false"
                    :binary="true"
                    :readonly="!isPreviewMode"
                    :class="{ 'edit-mode': !isPreviewMode }"
                  />
                  <span class="text-sm text-surface-700 dark:text-surface-200">{{ element.props.label }}</span>
                </div>
              </div>
              <!-- 라디오 버튼 -->
              <div
                v-if="element.type === 'radio'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <div class="flex flex-col gap-2" :style="{ minHeight: '2.5rem', ...getTypographyStyle(element) }">
                  <div
                    v-for="(option, optIndex) in (element.props.options || [])"
                    :key="`radio-${element.uid}-${index}-${optIndex}`"
                    class="flex items-center gap-2"
                    :style="getFormInputStyle(element)"
                  >
                    <RadioButton
                      :model-value="element.props.selected || element.props.options?.[0]"
                      :value="option"
                      :name="`radio-${element.uid}`"
                      :readonly="!isPreviewMode"
                      :class="{ 'edit-mode': !isPreviewMode }"
                    />
                    <label class="text-sm text-surface-700 dark:text-surface-200 cursor-pointer">{{ option }}</label>
                  </div>
                </div>
              </div>
              <!-- 토글 스위치 -->
              <div
                v-if="element.type === 'toggleSwitch'"
                class="flex flex-col gap-1 form-field-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getElementStyle(element)"
              >
                <label v-if="element.props.label" class="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {{ element.props.label }}
                </label>
                <div class="flex items-center gap-2" :style="{ minHeight: '2.5rem', ...getTypographyStyle(element), ...getFormInputStyle(element) }">
                  <ToggleSwitch
                    :key="`toggle-${element.uid}-${index}`"
                    :model-value="element.props.checked || false"
                    :readonly="!isPreviewMode"
                    :class="{ 'edit-mode': !isPreviewMode }"
                  />
                  <span class="text-sm text-surface-700 dark:text-surface-200">{{ element.props.checked ? '켜짐' : '꺼짐' }}</span>
                </div>
              </div>
              <!-- 버튼 (Field 스타일 - primary 기본) -->
              <div
                v-if="element.type === 'button'"
                class="flex items-center button-wrapper"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getButtonWrapperStyle(element)"
              >
                <Button
                  :key="`button-${element.uid}-${index}`"
                  :label="element.props.text || '버튼'"
                  severity="primary"
                  :outlined="element.props.outlined || false"
                  :readonly="!isPreviewMode"
                  :class="['button-element', { 'edit-mode': !isPreviewMode }]"
                  :style="{ ...getTypographyStyle(element), ...getButtonStyle(element) }"
                />
              </div>
              <!-- 이전/다음 네비게이션 -->
              <div
                v-if="element.type === 'prevNext'"
                class="flex items-center justify-between gap-4"
                :class="{ 'edit-mode': !isPreviewMode }"
                :style="getPrevNextWrapperStyle(element)"
              >
                <Button
                  :label="element.props.prevText"
                  severity="secondary"
                  outlined
                  :readonly="!isPreviewMode"
                  :class="['prevnext-button', { 'edit-mode': !isPreviewMode }]"
                  :style="{ ...getTypographyStyle(element), ...getPrevNextButtonStyle(element) }"
                />
                <Button
                  :label="element.props.nextText"
                  severity="primary"
                  :readonly="!isPreviewMode"
                  :class="['prevnext-button', { 'edit-mode': !isPreviewMode }]"
                  :style="{ ...getTypographyStyle(element), ...getPrevNextButtonStyle(element) }"
                />
              </div>
              <!-- 그리드 섹션 -->
              <div
                v-if="element.type === 'grid'"
                class="grid"
                :style="{ gridTemplateColumns: `repeat(${element.props.columns || 2}, minmax(0, 1fr))`, gap: element.props.gap || '1rem', ...getElementStyle(element) }"
              >
                <div
                  v-for="(cellItems, cellIndex) in (element.props.items && element.props.items.length > 0 ? element.props.items : Array(element.props.columns || 2).fill([]))"
                  :key="cellIndex"
                  class="min-h-[60px] border border-dashed border-surface-300 dark:border-surface-600 rounded-md bg-surface-50 dark:bg-surface-900/30 p-2 transition-all"
                  :class="{ 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDraggingOverGrid === `${element.uid}-${cellIndex}` }"
                  @dragover.prevent="!isPreviewMode && handleGridDragOver($event, element, Number(cellIndex))"
                  @dragleave="!isPreviewMode && handleGridDragLeave(element, Number(cellIndex))"
                  @drop="!isPreviewMode && handleGridDrop($event, element, Number(cellIndex))"
                >
                  <div v-if="!cellItems || cellItems.length === 0" class="h-full flex items-center justify-center text-xs text-surface-400">
                    드래그하여 추가
                  </div>
                  <div v-else>
                    <!-- 그리드 셀 안의 컴포넌트 렌더링 (하나만) -->
                    <ComponentRenderer
                      v-if="cellItems[0]"
                      :key="cellItems[0].uid"
                      :item="cellItems[0]"
                    />
                  </div>
                </div>
              </div>
              <!-- 그룹 (카드 형식, 레이블 없음) -->
              <div
                v-if="element.type === 'group'"
                class="border border-dashed border-surface-300 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-900/30 overflow-hidden transition-all"
                :class="{ 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDraggingOverGroup === element.uid }"
                :style="getElementStyle(element)"
                @dragover.prevent="!isPreviewMode && handleGroupDragOver($event, element)"
                @dragleave="!isPreviewMode && handleGroupDragLeave(element)"
                @drop="!isPreviewMode && handleGroupDrop($event, element)"
              >
                <div
                  class="p-4 h-full"
                >
                  <div v-if="!element.props.items || element.props.items.length === 0" class="h-full flex items-center justify-center text-xs text-surface-400">
                    드래그하여 추가
                  </div>
                  <div v-else>
                    <!-- 그룹 안의 컴포넌트 렌더링 (하나만) -->
                    <ComponentRenderer
                      v-if="element.props.items[0]"
                      :item="element.props.items[0]"
                    />
                  </div>
                </div>
              </div>
              <!-- 테이블 -->
              <div
                v-if="element.type === 'table'"
                class="overflow-x-auto rounded-md border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900/20"
                :style="getElementStyle(element)"
              >
                <table class="min-w-full text-left text-xs">
                  <thead class="bg-surface-50 dark:bg-surface-800/60">
                    <tr>
                      <th
                        v-for="(col, i) in (element.props.columns || [])"
                        :key="i"
                        class="px-3 py-2 font-semibold text-surface-600 dark:text-surface-200 border-b border-surface-200 dark:border-surface-700"
                      >
                        <InputText
                          v-if="!isPreviewMode && editingTable === `${element.uid}-header-${i}`"
                          :model-value="col"
                          @blur="handleTableHeaderBlur(element, Number(i), $event)"
                          @keyup.enter="handleTableHeaderBlur(element, Number(i), $event)"
                          class="w-full text-xs font-semibold bg-transparent border-none p-0 h-auto"
                          @click.stop
                        />
                        <span
                          v-else
                          class="cursor-pointer"
                          :class="{ 'hover:text-primary-500': !isPreviewMode }"
                          @click.stop="!isPreviewMode && (editingTable = `${element.uid}-header-${i}`)"
                        >
                          {{ col }}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, rowIndex) in (element.props.rows || [['데이터 1', '데이터 2', '데이터 3']])"
                      :key="rowIndex"
                    >
                      <td
                        v-for="(cell, cellIndex) in row"
                        :key="cellIndex"
                        class="px-3 py-2 text-surface-500 dark:text-surface-400 border-b border-surface-100 dark:border-surface-800"
                      >
                        <InputText
                          v-if="!isPreviewMode && editingTable === `${element.uid}-cell-${rowIndex}-${cellIndex}`"
                          :model-value="cell"
                          @blur="handleTableCellBlur(element, Number(rowIndex), Number(cellIndex), $event)"
                          @keyup.enter="handleTableCellBlur(element, Number(rowIndex), Number(cellIndex), $event)"
                          class="w-full text-xs bg-transparent border-none p-0 h-auto"
                          @click.stop
                        />
                        <span
                          v-else
                          class="cursor-pointer"
                          :class="{ 'hover:text-primary-500': !isPreviewMode }"
                          @click.stop="!isPreviewMode && (editingTable = `${element.uid}-cell-${rowIndex}-${cellIndex}`)"
                        >
                          {{ cell }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="!isPreviewMode"
                  class="px-3 py-1 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/60 flex items-center justify-center"
                >
                  <button
                    class="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    @click.stop="handleAddTableRow(element)"
                  >
                    <i class="pi pi-plus text-xs" />
                    <span>행 추가</span>
                  </button>
                </div>
              </div>
                </div>
              </template>
            </Draggable>
          </Transition>
        </div>

        <!-- 뒷면: QR 패널 -->
        <div class="preview-face preview-back">
          <div class="w-full h-full flex flex-col items-center justify-center px-6">
            <!-- QR 코드 -->
            <div class="w-full flex justify-center mb-6">
              <QrcodeVue v-if="qrUrl" :value="qrUrl" :size="160" :level="'M'" />
            </div>


            <!-- URL 정보 -->
            <div class="w-full flex flex-col gap-3 mt-2">
              <div class="flex flex-col gap-1 items-center">
                <span class="text-xs font-medium text-surface-500 dark:text-surface-400">전체 URL</span>
                <span class="text-xs text-surface-700 dark:text-surface-200 text-center break-all">
                  {{ qrUrl }}
                </span>
              </div>
              <div class="flex flex-col gap-1 items-center">
                <span class="text-xs font-medium text-surface-500 dark:text-surface-400">경로</span>
                <span class="text-xs text-surface-700 dark:text-surface-200 text-center break-all">
                  {{ previewPath }}
                </span>
              </div>
            </div>

            <!-- 안내 텍스트 -->
            <p class="mt-6 text-[11px] text-surface-400 dark:text-surface-500 text-center">
              QR 코드를 스캔하면 현재 페이지의 미리보기 화면으로 이동합니다.
            </p>

    
          </div>
        </div>
      </div>


    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRequestURL } from '#app'
import QrcodeVue from 'qrcode.vue'
import type { PreviewProps, PreviewEmits } from '~/types/preview'
import type { CanvasItem } from '~/types/component'
import draggable from 'vuedraggable'
import ComponentRenderer from './ComponentRenderer.vue'
import Divider from 'primevue/divider'

const Draggable = draggable

type Props = PreviewProps
type Emits = PreviewEmits

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getComponentLabel } = useElements()

// QR 플립 패널 상태
const showQrPanel = ref(false)

// 현재 페이지의 프리뷰 URL (전체 URL)
const requestURL = useRequestURL()
const qrUrl = computed(() => {
  if (!props.previewPath) return ''
  return `${requestURL.origin}${props.previewPath}`
})

const toggleQrPanel = () => {
  if (!qrUrl.value) return
  showQrPanel.value = !showQrPanel.value
}

// 요소의 스타일 계산 함수 (form 컴포넌트 제외)
const getElementStyle = (element: CanvasItem) => {
  const styles = element.props.styles || {}
  const style: Record<string, string> = {}
  
  // Position
  if (styles.position) {
    // x, y가 정의되어 있고 0이 아닐 때만 적용
    const hasX = styles.position.x !== undefined && styles.position.x !== null && styles.position.x !== 0
    const hasY = styles.position.y !== undefined && styles.position.y !== null && styles.position.y !== 0
    
    if (hasX) {
      style.position = 'relative'
      style.left = `${styles.position.x}px`
    }
    if (hasY) {
      if (!style.position) {
        style.position = 'relative'
      }
      style.top = `${styles.position.y}px`
    }
    // rotation이 0이 아니면 적용
    if (styles.position.rotation !== undefined && styles.position.rotation !== null && styles.position.rotation !== 0) {
      style.transform = `rotate(${styles.position.rotation}deg)`
    }
  }
  
  // Layout (form 컴포넌트는 제외)
  const formTypes = ['inputText', 'inputPassword', 'inputEmail', 'inputDate', 'inputTime', 'select', 'textarea', 'inputUrl', 'checkbox', 'radio', 'toggleSwitch']
  if (styles.layout && !formTypes.includes(element.type)) {
    // width가 정의되어 있고 0보다 크면 적용
    if (styles.layout.width !== undefined && styles.layout.width !== null && styles.layout.width > 0) {
      const widthUnit = styles.layout.widthUnit || '%'
      style.width = `${styles.layout.width}${widthUnit}`
    }
    // height가 정의되어 있고 0보다 크면 적용
    if (styles.layout.height !== undefined && styles.layout.height !== null && styles.layout.height > 0) {
      const heightUnit = styles.layout.heightUnit || 'px'
      style.height = `${styles.layout.height}${heightUnit}`
    }
  }
  
  // Appearance
  if (styles.appearance) {
    if (styles.appearance.opacity !== undefined && styles.appearance.opacity !== null) {
      style.opacity = `${styles.appearance.opacity / 100}`
    }
    if (styles.appearance.cornerRadius !== undefined && styles.appearance.cornerRadius !== null) {
      style.borderRadius = `${styles.appearance.cornerRadius}px`
    }
    if (styles.appearance.borderStyle && styles.appearance.borderStyle !== 'none') {
      const borderPosition = styles.appearance.borderPosition || 'none'
      const borderWidth = '1px'
      
      if (borderPosition === 'none') {
        // 전체 보더 적용
        style.border = `${borderWidth} ${styles.appearance.borderStyle}`
      } else {
        // 특정 위치 보더 적용
        const borderKey = `border${borderPosition.charAt(0).toUpperCase() + borderPosition.slice(1)}`
        style[borderKey] = `${borderWidth} ${styles.appearance.borderStyle}`
      }
    }
  }
  
  return style
}

// 요소의 Typography 스타일 계산 함수
const getTypographyStyle = (element: CanvasItem) => {
  const styles = element.props.styles || {}
  const typography = styles.typography || {}
  const style: Record<string, string> = {}
  
  if (typography.fontSize !== undefined) {
    style.fontSize = `${typography.fontSize}px`
  }
  if (typography.fontFamily) {
    style.fontFamily = typography.fontFamily
  }
  if (typography.fontWeight) {
    style.fontWeight = typography.fontWeight
  }
  if (typography.textAlign) {
    style.textAlign = typography.textAlign
  }
  
  return style
}

// Form 컴포넌트의 input 요소에만 적용할 Layout 스타일 계산 함수
const getFormInputStyle = (element: CanvasItem) => {
  const styles = element.props.styles || {}
  const style: Record<string, string> = {}
  
  // Layout (form 컴포넌트의 input 요소에만 적용)
  if (styles.layout) {
    // width가 정의되어 있고 0보다 크면 적용
    if (styles.layout.width !== undefined && styles.layout.width !== null && styles.layout.width > 0) {
      const widthUnit = styles.layout.widthUnit || '%'
      style.width = `${styles.layout.width}${widthUnit}`
    }
    // height가 정의되어 있고 0보다 크면 적용
    if (styles.layout.height !== undefined && styles.layout.height !== null && styles.layout.height > 0) {
      const heightUnit = styles.layout.heightUnit || 'px'
      style.height = `${styles.layout.height}${heightUnit}`
    }
  }
  
  return style
}

// 이전/다음 버튼의 각 버튼에 적용할 Layout 스타일 계산 함수
const getPrevNextButtonStyle = (element: CanvasItem) => {
  const styles = element.props.styles || {}
  const style: Record<string, string> = {}
  
  // Layout (각 버튼에 적용)
  if (styles.layout) {
    // width가 정의되어 있고 0보다 크면 적용
    if (styles.layout.width !== undefined && styles.layout.width !== null && styles.layout.width > 0) {
      const widthUnit = styles.layout.widthUnit || '%'
      style.width = `${styles.layout.width}${widthUnit}`
    }
    // height가 정의되어 있고 0보다 크면 적용
    if (styles.layout.height !== undefined && styles.layout.height !== null && styles.layout.height > 0) {
      const heightUnit = styles.layout.heightUnit || 'px'
      style.height = `${styles.layout.height}${heightUnit}`
    }
  }
  
  return style
}

// 이전/다음 버튼의 wrapper에 적용할 스타일 (Position만)
const getPrevNextWrapperStyle = (element: CanvasItem) => {
  const styles = element.props.styles || {}
  const style: Record<string, string> = {}
  
  // Position만 적용 (Layout은 각 버튼에 적용)
  if (styles.position) {
    // x, y가 정의되어 있고 0이 아닐 때만 적용
    const hasX = styles.position.x !== undefined && styles.position.x !== null && styles.position.x !== 0
    const hasY = styles.position.y !== undefined && styles.position.y !== null && styles.position.y !== 0
    
    if (hasX) {
      style.position = 'relative'
      style.left = `${styles.position.x}px`
    }
    if (hasY) {
      if (!style.position) {
        style.position = 'relative'
      }
      style.top = `${styles.position.y}px`
    }
    // rotation이 0이 아니면 적용
    if (styles.position.rotation !== undefined && styles.position.rotation !== null && styles.position.rotation !== 0) {
      style.transform = `rotate(${styles.position.rotation}deg)`
    }
  }
  
  // Appearance (wrapper에 적용)
  if (styles.appearance) {
    if (styles.appearance.opacity !== undefined && styles.appearance.opacity !== null) {
      style.opacity = `${styles.appearance.opacity / 100}`
    }
  }
  
  return style
}

// 일반 버튼에 적용할 Layout 스타일 계산 함수
const getButtonStyle = (element: CanvasItem) => {
  const styles = element.props.styles || {}
  const style: Record<string, string> = {}
  
  // Layout (버튼에 적용)
  if (styles.layout) {
    // width가 정의되어 있고 0보다 크면 적용
    if (styles.layout.width !== undefined && styles.layout.width !== null && styles.layout.width > 0) {
      const widthUnit = styles.layout.widthUnit || '%'
      style.width = `${styles.layout.width}${widthUnit}`
    }
    // height가 정의되어 있고 0보다 크면 적용
    if (styles.layout.height !== undefined && styles.layout.height !== null && styles.layout.height > 0) {
      const heightUnit = styles.layout.heightUnit || 'px'
      style.height = `${styles.layout.height}${heightUnit}`
    }
  }
  
  return style
}

// 일반 버튼의 wrapper에 적용할 스타일 (Position만)
const getButtonWrapperStyle = (element: CanvasItem) => {
  const styles = element.props.styles || {}
  const style: Record<string, string> = {}
  
  // Position만 적용 (Layout은 버튼에 적용)
  if (styles.position) {
    // x, y가 정의되어 있고 0이 아닐 때만 적용
    const hasX = styles.position.x !== undefined && styles.position.x !== null && styles.position.x !== 0
    const hasY = styles.position.y !== undefined && styles.position.y !== null && styles.position.y !== 0
    
    if (hasX) {
      style.position = 'relative'
      style.left = `${styles.position.x}px`
    }
    if (hasY) {
      if (!style.position) {
        style.position = 'relative'
      }
      style.top = `${styles.position.y}px`
    }
    // rotation이 0이 아니면 적용
    if (styles.position.rotation !== undefined && styles.position.rotation !== null && styles.position.rotation !== 0) {
      style.transform = `rotate(${styles.position.rotation}deg)`
    }
  }
  
  // Appearance (wrapper에 적용)
  if (styles.appearance) {
    if (styles.appearance.opacity !== undefined && styles.appearance.opacity !== null) {
      style.opacity = `${styles.appearance.opacity / 100}`
    }
  }
  
  return style
}

// 드래그 오버 상태 관리
const isDraggingOverGrid = ref<string | null>(null)
const isDraggingOverGroup = ref<string | null>(null)

function handleGridDragOver(event: DragEvent, gridElement: CanvasItem, cellIndex: number) {
  isDraggingOverGrid.value = `${gridElement.uid}-${cellIndex}`
}

function handleGridDragLeave(gridElement: CanvasItem, cellIndex: number) {
  // 실제로 영역을 벗어났는지 확인
  setTimeout(() => {
    if (isDraggingOverGrid.value === `${gridElement.uid}-${cellIndex}`) {
      isDraggingOverGrid.value = null
    }
  }, 50)
}

function handleGridDrop(event: DragEvent, gridElement: CanvasItem, cellIndex: number) {
  isDraggingOverGrid.value = null
  emit('grid-drop', { gridElement, cellIndex, event })
}

function handleGroupDragOver(event: DragEvent, groupElement: CanvasItem) {
  isDraggingOverGroup.value = groupElement.uid
}

function handleGroupDragLeave(groupElement: CanvasItem) {
  // 실제로 영역을 벗어났는지 확인
  setTimeout(() => {
    if (isDraggingOverGroup.value === groupElement.uid) {
      isDraggingOverGroup.value = null
    }
  }, 50)
}

function handleGroupDrop(event: DragEvent, groupElement: CanvasItem) {
  isDraggingOverGroup.value = null
  emit('group-drop', { groupElement, event })
}

// 테이블 편집 상태 관리
const editingTable = ref<string | null>(null)

function handleTableHeaderBlur(element: CanvasItem, colIndex: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (!element.props.columns) return
  element.props.columns[colIndex] = target.value || `컬럼 ${colIndex + 1}`
  editingTable.value = null
  emit('update:canvasItems', [...props.canvasItems])
}

function handleTableCellBlur(element: CanvasItem, rowIndex: number, cellIndex: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (!element.props.rows) return
  if (!element.props.rows[rowIndex]) {
    element.props.rows[rowIndex] = []
  }
  element.props.rows[rowIndex][cellIndex] = target.value || '데이터'
  editingTable.value = null
  emit('update:canvasItems', [...props.canvasItems])
}

function handleAddTableRow(element: CanvasItem) {
  if (!element.props.columns) return
  if (!element.props.rows) {
    element.props.rows = []
  }
  const newRow = element.props.columns.map(() => '데이터')
  element.props.rows.push(newRow)
  emit('update:canvasItems', [...props.canvasItems])
}
</script>

<style lang="scss" scoped>
.preview-card {
  perspective: 1200px;
}

.preview-flip-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.preview-flip-container.is-flipped {
  transform: rotateY(180deg);
}

.preview-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

.preview-front {
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-back {
  transform: rotateY(180deg);
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.canvas-item {
  @apply p-4 border border-transparent transition-all cursor-pointer;

  &:hover {
    @apply border-primary-500;
  }

  &.selected {
    @apply border-primary-500;
  }
}

// 미리보기 모드에서는 canvas-item 호버 시 보더 변경 차단 (최고 우선순위로 오버라이드)
// 미리보기 모드에서는 canvas-item 호버 시 보더 변경 차단 (최고 우선순위로 오버라이드)
.preview-mode .canvas-item:hover {
  // Tailwind의 color-mix를 완전히 오버라이드
  border-color: transparent !important;
  --tw-border-opacity: 0 !important;
  border: 1px solid transparent !important;
  // 모든 가능한 보더 속성 오버라이드
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  border-left-color: transparent !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Field 버튼 스타일 - PrimeVue 기본 스타일 강제 적용
// 버튼이 텍스트만 보이는 문제 해결을 위해 PrimeVue 스타일 명시적 보장
:deep(.p-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

:deep(.p-button.p-button-primary) {
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  border-color: var(--p-primary-color);
}

:deep(.p-button.p-button-primary:hover) {
  background: var(--p-primary-hover-color);
  border-color: var(--p-primary-hover-color);
}

:deep(.p-button.p-button-secondary.p-button-outlined) {
  background: transparent;
  color: var(--p-secondary-color);
  border-color: var(--p-secondary-color);
}

:deep(.p-button.p-button-secondary.p-button-outlined:hover) {
  background: var(--p-secondary-hover-color);
  color: var(--p-secondary-contrast-color);
}

// 폼 필드 초기 렌더링 스타일 강제 적용
.form-field-wrapper {
  :deep(.p-inputtext),
  :deep(.p-textarea),
  :deep(.p-dropdown),
  :deep(.p-button),
  :deep(.p-datepicker) {
    min-height: 2.5rem;
    height: auto;
    box-sizing: border-box;
  }

  :deep(.p-inputtext) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  :deep(.p-textarea) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
  }





}

// Divider 배경 스타일 (다크모드/라이트모드 대응)
:deep(.divider-default) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
}

:deep(.divider-default hr) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
  height: 100% !important;
}

:deep(.divider-default.p-divider) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
}

:deep(.divider-default.p-divider-horizontal) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
  border-top: none !important;
  margin: 0 !important;
}

:deep(.divider-default.p-divider-vertical) {
  background-color: var(--p-surface-200, #e5e7eb) !important;
  border: none !important;
  border-left: none !important;
}

// 다크 모드
:deep(.dark .divider-default) {
  background-color: var(--p-surface-700, #374151) !important;
}

:deep(.dark .divider-default hr) {
  background-color: var(--p-surface-700, #374151) !important;
}

:deep(.dark .divider-default.p-divider) {
  background-color: var(--p-surface-700, #374151) !important;
}

:deep(.dark .divider-default.p-divider-horizontal) {
  background-color: var(--p-surface-700, #374151) !important;
  margin: 0 !important;
}

:deep(.dark .divider-default.p-divider-vertical) {
  background-color: var(--p-surface-700, #374151) !important;
}

// 버튼 width/height 적용 (인라인 스타일 우선순위 높임)
.button-wrapper {
  :deep(.button-element.p-button),
  :deep(.button-element.p-button.p-component),
  :deep(.button-element.p-button.p-button-primary),
  :deep(.button-element.p-button.p-button-secondary),
  :deep(.button-element.p-button.p-button-outlined),
  :deep(.button-element.p-button.p-button-text),
  :deep(.button-element.p-button.p-button-sm) {
    // PrimeVue의 기본 min-width 제거하여 인라인 스타일이 적용되도록
    min-width: 0 !important;
    max-width: none !important;
    flex-shrink: 1 !important;
  }
}

// 이전/다음 버튼 width/height 적용 (인라인 스타일 우선순위 높임)
:deep(.prevnext-button.p-button),
:deep(.prevnext-button.p-button.p-component),
:deep(.prevnext-button.p-button.p-button-primary),
:deep(.prevnext-button.p-button.p-button-secondary),
:deep(.prevnext-button.p-button.p-button-outlined),
:deep(.prevnext-button.p-button.p-button-text),
:deep(.prevnext-button.p-button.p-button-sm) {
  // PrimeVue의 기본 min-width 제거하여 인라인 스타일이 적용되도록
  min-width: 0 !important;
  max-width: none !important;
  flex-shrink: 1 !important;
}
</style>