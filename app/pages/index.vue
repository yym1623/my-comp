<template>
  <div class="flex h-screen w-full bg-surface-50 dark:bg-surface-900 overflow-hidden">
    <!-- 왼쪽: Elements / Page 탭 -->
    <aside class="w-[300px] min-w-[300px] h-full bg-surface-0 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col shrink-0 overflow-hidden">
      <Tabs v-model:value="leftTab" class="flex flex-col h-full">
        <TabList class=" border-b border-surface-200 dark:border-surface-700">
          <Tab value="elements" class="flex-1 px-4 py-3 text-sm data-[p-active=true]:!bg-surface-100 dark:data-[p-active=true]:!bg-surface-700">Elements</Tab>
          <Tab value="pages" class="flex-1 px-4 py-3 text-sm !border-l !border-surface-200 dark:!border-surface-700 data-[p-active=true]:!bg-surface-100 dark:data-[p-active=true]:!bg-surface-700">Page</Tab>
        </TabList>
        <TabPanels class="flex-1 overflow-hidden">
          <!-- Elements 탭 -->
          <TabPanel value="elements" class="h-full overflow-y-auto">
            <div class="grid gap-2">
              <div
                v-for="comp in components"
                :key="comp.id"
                class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm group"
                draggable="true"
                @dragstart="onDragStart(comp)"
                @click="addComponent(comp)"
              >
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                  <i :class="comp.icon" class="text-lg text-primary-600 dark:text-primary-400" />
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ comp.name }}</span>
                  <span class="text-xs text-surface-400 truncate">{{ comp.description }}</span>
                </div>
              </div>
            </div>
          </TabPanel>
          <!-- Page 탭 -->
          <TabPanel value="pages" class="h-full overflow-y-auto">
            <div class="grid gap-2">
              <div
                v-for="page in pages"
                :key="page.id"
                class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border"
                :class="currentPage?.id === page.id 
                  ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600'"
                @click="selectPage(page)"
              >
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  :class="currentPage?.id === page.id 
                    ? 'bg-primary-200 dark:bg-primary-900/50' 
                    : 'bg-surface-200 dark:bg-surface-600'"
                >
                  <i class="pi pi-file text-lg" :class="currentPage?.id === page.id ? 'text-primary-600 dark:text-primary-400' : 'text-surface-500'" />
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-sm font-semibold" :class="currentPage?.id === page.id ? 'text-primary-600 dark:text-primary-400' : 'text-surface-700 dark:text-surface-200'">{{ page.name }}</span>
                  <span class="text-xs text-surface-400">페이지</span>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </aside>

    <!-- 중앙: 프리뷰 영역 -->
    <main class="flex-1 h-full flex items-center justify-center p-10 overflow-hidden">
      <div
        class="w-[min(560px,calc(100%-40px))] h-[min(670px,calc(100%-40px))] bg-surface-0 dark:bg-surface-800 rounded-2xl overflow-y-auto flex flex-col gap-2 p-6 shadow-lg"
        @dragover.prevent
        @drop="onDrop"
      >
        <div v-if="canvasItems.length === 0" class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
            <i class="pi pi-objects-column text-2xl text-primary-500" />
          </div>
          <h3 class="text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1">컴포넌트 추가</h3>
          <p class="text-xs text-surface-400 leading-relaxed max-w-[170px]">왼쪽에서 컴포넌트를 드래그하거나 클릭하여 추가하세요</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-surface-400">
            <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded">드래그</span>
            <span>또는</span>
            <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded">클릭</span>
          </div>
        </div>
        <div
          v-for="(item, index) in canvasItems"
          :key="item.uid"
          class="canvas-item"
          :class="{ selected: selectedIndex === index }"
          @click="selectItem(index)"
        >
          <!-- Header -->
          <div v-if="item.type === 'header'" class="bg-surface-100 dark:bg-surface-800 py-3 px-4 rounded-md font-semibold text-sm">
            <span>{{ item.props.title }}</span>
          </div>
          <!-- Button -->
          <Button
            v-else-if="item.type === 'button'"
            :label="item.props.label"
            :severity="item.props.severity"
            :outlined="item.props.outlined"
            class="w-full"
          />
          <!-- Input -->
          <InputText
            v-else-if="item.type === 'input'"
            :placeholder="item.props.placeholder"
            class="w-full"
          />
          <!-- Text -->
          <p v-else-if="item.type === 'text'" class="text-sm text-surface-600 dark:text-surface-400 m-0 leading-relaxed">
            {{ item.props.content }}
          </p>
          <!-- Image -->
          <div v-else-if="item.type === 'image'" class="bg-surface-100 dark:bg-surface-800 p-8 rounded-lg flex flex-col items-center gap-2 text-surface-400">
            <i class="pi pi-image text-2xl" />
            <span class="text-xs">{{ item.props.alt }}</span>
          </div>
          <!-- Card -->
          <Card v-else-if="item.type === 'card'">
            <template #title>{{ item.props.title }}</template>
            <template #content>{{ item.props.content }}</template>
          </Card>
        </div>
      </div>
    </main>

    <!-- 오른쪽: 트리 + 속성 패널 -->
    <aside class="w-[300px] min-w-[300px] h-full bg-surface-0 dark:bg-surface-800 border-l border-surface-200 dark:border-surface-700 flex flex-col shrink-0 overflow-hidden relative">
      <!-- 메인 패널: 페이지 + 트리 -->
      <div class="flex flex-col h-full">
        <!-- 현재 페이지 헤더 -->
        <div class="px-4 py-3 text-sm border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
          <i class="pi pi-file text-primary-500" />
          <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ currentPage?.name }}</span>
        </div>
        <!-- Element 트리 -->
        <div class="flex-1 overflow-y-auto p-2">
          <div v-if="canvasItems.length === 0" class="flex flex-col items-center justify-center h-full text-center p-4">
            <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-3">
              <i class="pi pi-sitemap text-xl text-surface-400" />
            </div>
            <h4 class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1">비어있음</h4>
            <p class="text-xs text-surface-400 leading-relaxed">캔버스에 컴포넌트를<br />추가하면 여기에 표시됩니다</p>
          </div>
          <div
            v-for="(item, index) in canvasItems"
            :key="item.uid"
            class="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all text-surface-700 dark:text-surface-300"
            :class="selectedIndex === index 
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
              : 'hover:bg-surface-100 dark:hover:bg-surface-700'"
            @click="selectItem(index)"
          >
            <i :class="getComponentIcon(item.type)" class="text-sm w-5 text-center" />
            <span class="text-sm flex-1 truncate">{{ getComponentLabel(item) }}</span>
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              size="small"
              class="w-6 h-6 !p-0"
              @click.stop="deleteItem(index)"
            />
          </div>
        </div>
      </div>

      <!-- 슬라이드 속성 패널 -->
      <Transition name="slide">
        <div
          v-if="selectedIndex !== null && selectedItem"
          class="absolute inset-0 bg-surface-0 dark:bg-surface-800 flex flex-col z-10"
        >
          <!-- 속성 패널 헤더 -->
          <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
            <Button
              icon="pi pi-arrow-left"
              severity="secondary"
              text
              rounded
              size="small"
              @click="selectedIndex = null"
            />
            <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ getComponentName(selectedItem.type) }} 편집</span>
          </div>
          <!-- 속성 편집 영역 -->
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Header 속성 -->
            <template v-if="selectedItem.type === 'header'">
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">제목</label>
                <InputText v-model="selectedItem.props.title" class="w-full" />
              </div>
            </template>

            <!-- Button 속성 -->
            <template v-else-if="selectedItem.type === 'button'">
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">라벨</label>
                <InputText v-model="selectedItem.props.label" class="w-full" />
              </div>
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">스타일</label>
                <Select
                  v-model="selectedItem.props.severity"
                  :options="severityOptions"
                  class="w-full"
                />
              </div>
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">아웃라인</label>
                <ToggleSwitch v-model="selectedItem.props.outlined" />
              </div>
            </template>

            <!-- Input 속성 -->
            <template v-else-if="selectedItem.type === 'input'">
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">Placeholder</label>
                <InputText v-model="selectedItem.props.placeholder" class="w-full" />
              </div>
            </template>

            <!-- Text 속성 -->
            <template v-else-if="selectedItem.type === 'text'">
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">내용</label>
                <Textarea v-model="selectedItem.props.content" rows="4" class="w-full" />
              </div>
            </template>

            <!-- Image 속성 -->
            <template v-else-if="selectedItem.type === 'image'">
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">Alt 텍스트</label>
                <InputText v-model="selectedItem.props.alt" class="w-full" />
              </div>
            </template>

            <!-- Card 속성 -->
            <template v-else-if="selectedItem.type === 'card'">
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">제목</label>
                <InputText v-model="selectedItem.props.title" class="w-full" />
              </div>
              <div class="mb-4">
                <label class="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">내용</label>
                <Textarea v-model="selectedItem.props.content" rows="3" class="w-full" />
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </aside>
  </div>
</template>

<script lang="ts" setup>
interface ComponentDef {
  id: string
  name: string
  description: string
  icon: string
  type: string
  defaultProps: Record<string, any>
}

interface CanvasItem {
  uid: string
  type: string
  props: Record<string, any>
}

interface Page {
  id: string
  name: string
}

// 왼쪽 탭 상태
const leftTab = ref('elements')

// 목데이터: 페이지 목록
const pages: Page[] = [
  { id: '1', name: 'MyForm' }
]

const currentPage = ref<Page | null>(pages[0])

const components: ComponentDef[] = [
  { id: '1', name: '헤더', description: '페이지 상단 네비게이션', icon: 'pi pi-bars', type: 'header', defaultProps: { title: '헤더 제목' } },
  { id: '2', name: '버튼', description: '클릭 가능한 액션 버튼', icon: 'pi pi-stop', type: 'button', defaultProps: { label: '버튼', severity: 'primary', outlined: false } },
  { id: '3', name: '입력창', description: '텍스트 입력 필드', icon: 'pi pi-pencil', type: 'input', defaultProps: { placeholder: '입력하세요...' } },
  { id: '4', name: '텍스트', description: '단락 텍스트 표시', icon: 'pi pi-align-left', type: 'text', defaultProps: { content: '텍스트 내용을 입력하세요.' } },
  { id: '5', name: '이미지', description: '이미지 미디어 요소', icon: 'pi pi-image', type: 'image', defaultProps: { alt: '이미지 설명' } },
  { id: '6', name: '카드', description: '컨텐츠 카드 컨테이너', icon: 'pi pi-id-card', type: 'card', defaultProps: { title: '카드 제목', content: '카드 내용' } },
]

const componentNames: Record<string, string> = {
  header: '헤더',
  button: '버튼',
  input: '입력창',
  text: '텍스트',
  image: '이미지',
  card: '카드'
}

const componentIcons: Record<string, string> = {
  header: 'pi pi-bars',
  button: 'pi pi-stop',
  input: 'pi pi-pencil',
  text: 'pi pi-align-left',
  image: 'pi pi-image',
  card: 'pi pi-id-card'
}

const severityOptions = ['primary', 'secondary', 'success', 'info', 'warn', 'danger']

const canvasItems = ref<CanvasItem[]>([])
const selectedIndex = ref<number | null>(null)
const draggedComponent = ref<ComponentDef | null>(null)

const selectedItem = computed(() => {
  if (selectedIndex.value === null) return null
  return canvasItems.value[selectedIndex.value]
})

function generateUid() {
  return Math.random().toString(36).substring(2, 9)
}

function selectPage(page: Page) {
  currentPage.value = page
}

function addComponent(comp: ComponentDef) {
  const newItem: CanvasItem = {
    uid: generateUid(),
    type: comp.type,
    props: { ...comp.defaultProps }
  }
  canvasItems.value.push(newItem)
  selectedIndex.value = canvasItems.value.length - 1
}

function onDragStart(comp: ComponentDef) {
  draggedComponent.value = comp
}

function onDrop() {
  if (draggedComponent.value) {
    addComponent(draggedComponent.value)
    draggedComponent.value = null
  }
}

function selectItem(index: number) {
  selectedIndex.value = index
}

function deleteItem(index: number) {
  canvasItems.value.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = null
  } else if (selectedIndex.value !== null && selectedIndex.value > index) {
    selectedIndex.value--
  }
}

function getComponentIcon(type: string) {
  return componentIcons[type] || 'pi pi-box'
}

function getComponentName(type: string) {
  return componentNames[type] || type
}

function getComponentLabel(item: CanvasItem) {
  const name = getComponentName(item.type)
  if (item.type === 'header') return item.props.title || name
  if (item.type === 'button') return item.props.label || name
  if (item.type === 'text') return item.props.content?.substring(0, 20) || name
  return name
}
</script>

<style lang="scss" scoped>
// 캔버스 아이템 선택 상태
.canvas-item {
  @apply p-2 border-2 border-transparent rounded-lg transition-all cursor-pointer;

  &:hover {
    @apply border-surface-300;
  }

  &.selected {
    @apply border-primary-500 bg-primary-500/5;
  }
}

// 슬라이드 트랜지션
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}


/* PrimeVue Tabs 배경 오버라이드 */
.p-tabs {
  background: transparent !important;
}
.p-tablist {
  background: transparent !important;
}
.p-tablist-content {
  border-bottom: 1px solid var(--p-surface-200) !important;
}
.dark .p-tablist-content {
  border-bottom: 1px solid var(--p-surface-700) !important;
}
.p-tabpanels {
  background: transparent !important;
}
.p-tab {
  border: none !important;
  margin: 0 !important;
  transition: all 0.2s ease !important;
}
.p-tablist-tab-list {
  border: none !important;
}
.p-tablist-active-bar {
  display: none !important;
}
</style>
