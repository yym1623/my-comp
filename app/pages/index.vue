<template>
  <div class="flex h-screen w-full bg-surface-50 dark:bg-surface-900 overflow-hidden">
    <Toast />

    <!-- 모바일 메뉴 모달 -->
    <Transition name="slide-left">
      <div 
        v-if="panelStore.isMobileMenuOpen"
        class="fixed inset-0 z-[100] bg-surface-0 dark:bg-surface-800 flex flex-col"
      >
        <!-- 메뉴 헤더 -->
        <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
          <span class="text-lg font-bold text-surface-800 dark:text-surface-100">메뉴</span>
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            @click="panelStore.closeMobileMenu()"
          />
        </div>

        <!-- 메뉴 버튼들 또는 패널 내용 -->
        <div class="flex-1 overflow-hidden">
          <!-- 메뉴 선택 화면 -->
          <Transition name="slide-left" mode="out-in">
            <div v-if="!panelStore.activeMobilePanel" key="menu" class="p-4 flex flex-col gap-3">
              <button
                class="flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
                @click="panelStore.openPanel('elements')"
              >
                <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <i class="pi pi-th-large text-xl text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div class="font-semibold text-surface-800 dark:text-surface-100">Elements</div>
                  <div class="text-sm text-surface-500">컴포넌트 추가</div>
                </div>
                <i class="pi pi-angle-right ml-auto text-surface-400" />
              </button>

              <button
                class="flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
                @click="panelStore.openPanel('pages')"
              >
                <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <i class="pi pi-file text-xl text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div class="font-semibold text-surface-800 dark:text-surface-100">Page</div>
                  <div class="text-sm text-surface-500">페이지 선택</div>
                </div>
                <i class="pi pi-angle-right ml-auto text-surface-400" />
              </button>

              <button
                class="flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
                @click="panelStore.openPanel('options')"
              >
                <div class="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <i class="pi pi-cog text-xl text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div class="font-semibold text-surface-800 dark:text-surface-100">Options</div>
                  <div class="text-sm text-surface-500">속성 편집</div>
                </div>
                <i class="pi pi-angle-right ml-auto text-surface-400" />
              </button>
            </div>

            <!-- Elements 패널 -->
            <div v-else-if="panelStore.activeMobilePanel === 'elements'" key="elements" class="h-full flex flex-col">
              <div class="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
                <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="panelStore.closePanel()" />
                <span class="font-semibold text-surface-700 dark:text-surface-200">Elements</span>
              </div>
              <div class="px-3 py-2.5 border-b border-surface-200 dark:border-surface-700">
                <div class="relative">
                  <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs z-10" />
                  <InputText
                    v-model="componentSearchQuery"
                    placeholder="컴포넌트 검색..."
                    class="w-full pl-8 pr-3 py-2 text-sm bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
              <div class="flex-1 overflow-y-auto p-3">
                <div class="grid gap-2">
                  <div
                    v-for="comp in filteredComponents"
                    :key="comp.id"
                    class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm group"
                    @click="addComponent(comp); panelStore.closeMobileMenu()"
                  >
                    <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                      <i :class="comp.icon" class="text-lg text-primary-600 dark:text-primary-400" />
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ comp.name }}</span>
                      <span class="text-xs text-surface-400 truncate">{{ comp.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pages 패널 -->
            <div v-else-if="panelStore.activeMobilePanel === 'pages'" key="pages" class="h-full flex flex-col">
              <div class="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
                <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="panelStore.closePanel()" />
                <span class="font-semibold text-surface-700 dark:text-surface-200">Page</span>
              </div>
              <div class="px-3 py-2.5 border-b border-surface-200 dark:border-surface-700">
                <div class="relative">
                  <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs z-10" />
                  <InputText
                    v-model="pageSearchQuery"
                    placeholder="페이지 검색..."
                    class="w-full pl-8 pr-3 py-2 text-sm bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
              <div class="flex-1 overflow-y-auto p-3">
                <div class="grid gap-2">
                  <div
                    v-for="page in filteredPages"
                    :key="page.id"
                    class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border"
                    :class="currentPage?.id === page.id 
                      ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600'"
                    @click="selectPage(page); panelStore.closeMobileMenu()"
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
              </div>
            </div>

            <!-- Options 패널 -->
            <div v-else-if="panelStore.activeMobilePanel === 'options'" key="options" class="h-full flex flex-col">
              <div class="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
                <Button icon="pi pi-arrow-left" severity="secondary" text rounded size="small" @click="panelStore.closePanel()" />
                <span class="font-semibold text-surface-700 dark:text-surface-200">Options</span>
              </div>
              <div class="flex-1 overflow-y-auto p-4">
                <template v-if="selectedIndex !== null && selectedItem">
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
                      <Select v-model="selectedItem.props.severity" :options="severityOptions" class="w-full" />
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
                </template>
                <div v-else class="text-center text-surface-400 py-8">
                  <i class="pi pi-info-circle text-2xl mb-2" />
                  <p class="text-sm">편집할 요소를 선택하세요</p>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- 왼쪽: Elements / Page 탭 -->
    <aside 
      class="h-full bg-surface-0 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col shrink-0 transition-all duration-300"
      :class="[
        isMobile 
          ? (isLeftPanelOpen ? 'fixed top-0 bottom-0 left-0 z-50 w-full overflow-hidden' : 'fixed top-0 bottom-0 -left-full z-50 w-full') 
          : (isLeftPanelOpen ? 'relative w-[300px] min-w-[300px] overflow-visible' : 'relative w-0 min-w-0 border-r-0 overflow-visible')
      ]"
    >
 

      
      <Tabs v-model:value="leftTab" class="flex flex-col h-full overflow-hidden">
        <TabList class="border-b border-surface-200 dark:border-surface-700">
          <Tab value="elements" class="flex-1 px-4 py-3 text-sm data-[p-active=true]:!bg-surface-100 dark:data-[p-active=true]:!bg-surface-700">Elements</Tab>
          <Tab value="pages" class="flex-1 px-4 py-3 text-sm !border-l !border-surface-200 dark:!border-surface-700 data-[p-active=true]:!bg-surface-100 dark:data-[p-active=true]:!bg-surface-700">Page</Tab>
        </TabList>
        <TabPanels class="flex-1 overflow-hidden">
          <!-- Elements 탭 -->
          <TabPanel value="elements" class="h-full flex flex-col overflow-hidden">
            <div class="px-3 py-2.5 border-b border-surface-200 dark:border-surface-700">
              <div class="relative">
                <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs z-10" />
                <InputText
                  v-model="componentSearchQuery"
                  placeholder="컴포넌트 검색..."
                  class="w-full pl-8 pr-3 py-2 text-sm bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto p-3">
              <div class="grid gap-2">
                <div
                  v-for="comp in filteredComponents"
                  :key="comp.id"
                  class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm group"
                  :class="{ 'opacity-50 pointer-events-none': isPreviewMode }"
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
            </div>
          </TabPanel>
          <!-- Page 탭 -->
          <TabPanel value="pages" class="h-full flex flex-col overflow-hidden">
            <div class="px-3 py-2.5 border-b border-surface-200 dark:border-surface-700">
              <div class="relative">
                <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 text-xs z-10" />
                <InputText
                  v-model="pageSearchQuery"
                  placeholder="페이지 검색..."
                  class="w-full pl-8 pr-3 py-2 text-sm bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto p-3">
              <div class="grid gap-2">
                <div
                  v-for="page in filteredPages"
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
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <!-- 오른쪽 바깥 버튼 바 (데스크탑만) -->
      <div v-if="!isMobile" class="absolute top-2 -right-[52px] flex flex-col gap-2 z-20">
        <Button
          :icon="isLeftPanelOpen ? 'pi pi-angle-left' : 'pi pi-angle-right'"
          severity="secondary"
          text
          rounded
          size="small"
          class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm"
          v-tooltip.right="isLeftPanelOpen ? '패널 닫기' : '패널 열기'"
          @click="isLeftPanelOpen = !isLeftPanelOpen"
        />
        <Button
          :icon="isPreviewMode ? 'pi pi-pencil' : 'pi pi-eye'"
          :severity="isPreviewMode ? 'primary' : 'secondary'"
          text
          rounded
          size="small"
          class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm"
          v-tooltip.right="isPreviewMode ? '편집 모드' : '미리보기'"
          @click="isPreviewMode = !isPreviewMode"
        />
      </div>

      <!-- 모바일 닫기 버튼 -->
      <div v-if="isMobile && isLeftPanelOpen" class="absolute top-1 right-3 z-10 flex gap-2">
        <Button
          icon="pi pi-times"
          severity="secondary"
          text
          rounded
          size="small"
          class="!w-9 !h-9"
          @click="isLeftPanelOpen = false"
        />
      </div>
    </aside>

    <!-- 중앙: 프리뷰 영역 -->
    <main class="flex-1 h-full flex items-center justify-center p-10 overflow-hidden relative">
      <!-- 프리뷰 모드 표시 배지 -->
      <div 
        v-if="isPreviewMode" 
        class="absolute top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center gap-2 shadow-lg z-10"
      >
        <i class="pi pi-eye text-xs" />
        미리보기 모드
      </div>
      <div
        class="w-[min(660px,calc(100%-40px))] h-[min(700px,calc(100%-10px))] bg-surface-0 dark:bg-surface-800 rounded-2xl overflow-y-auto flex flex-col gap-2 p-6 shadow-lg relative"
        :class="{ 'ring-2 ring-primary-500': isPreviewMode }"
        @dragover.prevent="!isPreviewMode"
        @drop="!isPreviewMode && onDrop()"
      >
        <Transition name="fade">
          <div v-if="canvasItems.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <div class="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4 shrink-0">
              <i class="pi pi-objects-column text-2xl text-primary-500" />
            </div>
            <h3 class="text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1 whitespace-nowrap">컴포넌트 추가</h3>
            <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap">{{ isMobile ? '메뉴' : '왼쪽' }}에서 컴포넌트를 드래그하거나 클릭하여 추가하세요</p>
            <div class="flex items-center gap-2 mt-4 text-xs text-surface-400 shrink-0">
              <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded whitespace-nowrap">드래그</span>
              <span class="whitespace-nowrap">또는</span>
              <span class="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded whitespace-nowrap">클릭</span>
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="canvasItems.length > 0">
            <div
              v-for="(item, index) in canvasItems"
              :key="item.uid"
              class="canvas-item"
              :class="{ selected: selectedIndex === index && !isPreviewMode, 'pointer-events-none': isPreviewMode }"
              @click="!isPreviewMode && selectItem(index)"
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
        </Transition>
      </div>
    </main>

    <!-- 오른쪽: 트리 + 속성 패널 -->
    <aside 
      class="h-full bg-surface-0 dark:bg-surface-800 border-l border-surface-200 dark:border-surface-700 flex flex-col shrink-0 transition-all duration-300"
      :class="[
        isMobile 
          ? (isRightPanelOpen ? 'fixed top-0 bottom-0 right-0 z-50 w-full overflow-hidden' : 'fixed top-0 bottom-0 -right-full z-50 w-full') 
          : (isRightPanelOpen ? 'relative w-[300px] min-w-[300px] overflow-visible' : 'relative w-0 min-w-0 border-l-0 overflow-visible')
      ]"
    >

      <!-- 메인 패널: 페이지 + 트리 -->
      <div class="flex flex-col h-full overflow-hidden">
        <!-- 현재 페이지 헤더 -->
        <div v-if="currentPage" class="px-4 py-3 text-sm border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
          <i class="pi pi-file text-primary-500" />
          <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ currentPage?.name }}</span>
        </div>
        <!-- Element 트리 -->
        <div class="flex-1 overflow-y-auto p-2 relative">
          <Transition name="fade">
            <div v-if="!currentPage" class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
              <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-3 shrink-0">
                <i class="pi pi-sitemap text-xl text-surface-400" />
              </div>
              <h4 class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-1 whitespace-nowrap">페이지 추가</h4>
              <p class="text-xs text-surface-400 leading-relaxed whitespace-nowrap">페이지를 선택하면 여기에 표시됩니다</p>
            </div>
          </Transition>
          <Transition name="fade">
            <div v-if="currentPage">
              <div
                v-for="(item, index) in canvasItems"
                :key="item.uid"
                class="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all text-surface-700 dark:text-surface-300"
                :class="selectedIndex === index 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-surface-100 dark:hover:bg-surface-700'"
                @click="selectItem(index)"
              >
                <i :class="getComponentIcon(item.type)" class="text-sm w-5 text-center shrink-0" />
                <span class="text-sm flex-1 truncate">{{ getComponentLabel(item) }}</span>
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  class="w-6 h-6 !p-0 shrink-0"
                  @click.stop="deleteItem(index)"
                />
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- 모바일 닫기 버튼 -->
      <div v-if="isMobile && isRightPanelOpen" class="absolute top-1 right-3 z-10">
        <Button
          icon="pi pi-times"
          severity="secondary"
          text
          rounded
          size="small"
          class="!w-9 !h-9"
          @click="isRightPanelOpen = false"
        />
      </div>
      <!-- 왼쪽 바깥 버튼 (데스크탑만) -->
      <div v-if="!isMobile" class="absolute top-2 -left-[52px] flex flex-col gap-2 z-20">
        <Button
          :icon="isRightPanelOpen ? 'pi pi-angle-right' : 'pi pi-angle-left'"
          severity="secondary"
          text
          rounded
          size="small"
          class="!w-9 !h-9 bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm"
          v-tooltip.left="isRightPanelOpen ? '패널 닫기' : '패널 열기'"
          @click="isRightPanelOpen = !isRightPanelOpen"
        />
      </div>

      <!-- 옵션 패널 -->
      <Transition name="slide">
        <div
          v-if="currentPage && selectedIndex !== null && selectedItem"
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
import { usePanelStore } from '@app/stores/panel'

// Pinia store
const panelStore = usePanelStore()

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

// 패널 상태
const isLeftPanelOpen = ref(true)
const isRightPanelOpen = ref(true)
const isPreviewMode = ref(false)

// 반응형 상태 (lg = 1024px)
const LG_BREAKPOINT = 1024
const isMobile = ref(false)

// 화면 크기 감지
function checkScreenSize() {
  const wasSmall = isMobile.value
  const isSmall = window.innerWidth < LG_BREAKPOINT
  isMobile.value = isSmall
  
  // 크기 변경 시에만 패널 상태 변경
  if (wasSmall !== isSmall) {
    if (isSmall) {
      isLeftPanelOpen.value = false
      isRightPanelOpen.value = false
    } else {
      isLeftPanelOpen.value = true
      isRightPanelOpen.value = true
    }
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// 목데이터: 페이지 목록
const pages: Page[] = [
  { id: '1', name: 'MyForm' },
  { id: '2', name: 'Home' },
  { id: '3', name: 'About' }
]

const currentPage = ref<Page | null>(null)

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

// Toast 인스턴스
const toast = useToast()

// 검색 쿼리
const componentSearchQuery = ref('')
const pageSearchQuery = ref('')

// 필터링된 컴포넌트
const filteredComponents = computed(() => {
  if (!componentSearchQuery.value.trim()) {
    return components
  }
  const query = componentSearchQuery.value.toLowerCase()
  return components.filter(comp => 
    comp.name.toLowerCase().includes(query)
  )
})

// 필터링된 페이지
const filteredPages = computed(() => {
  if (!pageSearchQuery.value.trim()) {
    return pages
  }
  const query = pageSearchQuery.value.toLowerCase()
  return pages.filter(page => 
    page.name.toLowerCase().includes(query)
  )
})

// 페이지별 컴포넌트 저장 (목업 데이터)
const pagesData = ref<Record<string, CanvasItem[]>>({
  '1': [], // MyForm 페이지 초기 데이터
  '2': [], // Home 페이지 초기 데이터
  '3': []  // About 페이지 초기 데이터
})

const canvasItems = computed({
  get: () => {
    if (!currentPage.value) return []
    return pagesData.value[currentPage.value.id] || []
  },
  set: (value) => {
    if (!currentPage.value) return
    pagesData.value[currentPage.value.id] = value
  }
})

const selectedIndex = ref<number | null>(null)
const draggedComponent = ref<ComponentDef | null>(null)

// 프리뷰 모드 전환 시 선택 해제
watch(isPreviewMode, (preview) => {
  if (preview) {
    selectedIndex.value = null
  }
})

const selectedItem = computed(() => {
  if (selectedIndex.value === null || !currentPage.value) return null
  const pageItems = pagesData.value[currentPage.value.id]
  if (!pageItems || selectedIndex.value >= pageItems.length) return null
  return pageItems[selectedIndex.value]
})

function generateUid() {
  return Math.random().toString(36).substring(2, 9)
}

function selectPage(page: Page) {
  currentPage.value = page
  // 페이지 선택 시 해당 페이지의 컴포넌트 로드
  if (!pagesData.value[page.id]) {
    pagesData.value[page.id] = []
  }
  selectedIndex.value = null
}

function addComponent(comp: ComponentDef) {
  // 페이지가 선택되지 않았으면 Toast 메시지 표시
  if (!currentPage.value) {
    toast.add({
      severity: 'warn',
      summary: '페이지 선택 필요',
      detail: '컴포넌트를 추가하려면 먼저 페이지를 선택해주세요.',
      life: 3000
    })
    return
  }

  const newItem: CanvasItem = {
    uid: generateUid(),
    type: comp.type,
    props: { ...comp.defaultProps }
  }
  
  // 현재 페이지의 컴포넌트 배열에 추가
  const pageId = currentPage.value.id
  if (!pagesData.value[pageId]) {
    pagesData.value[pageId] = []
  }
  const pageItems = pagesData.value[pageId]
  pageItems.push(newItem)
  selectedIndex.value = pageItems.length - 1
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
  if (!currentPage.value) return
  
  const pageId = currentPage.value.id
  const pageItems = pagesData.value[pageId]
  if (!pageItems) return
  
  pageItems.splice(index, 1)
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

// 슬라이드 트랜지션 (오른쪽에서)
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

// 슬라이드 트랜지션 (왼쪽에서)
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(-100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

// 페이드 트랜지션
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  padding: 0;
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
