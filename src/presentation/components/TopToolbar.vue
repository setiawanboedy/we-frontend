<script setup lang="ts">
import BreadcrumbNav from '@/presentation/components/BreadcrumbNav.vue'
import { computed, ref } from 'vue'
import { useFolderStore } from '../stores/folderStore'
import { useFileStore } from '../stores/fileStore'

const folderStore = useFolderStore()
const fileStore = useFileStore()

const hasMainFolderSelected = computed(() => !!folderStore.selectedMainFolderId)
const hasFileSelected = computed(() => fileStore.selectedFileIds.length > 0)
const hasSingleFileSelected = computed(() => fileStore.selectedFileIds.length === 1)
const hasMultipleFilesSelected = computed(() => fileStore.selectedFileIds.length > 1)

interface Props {
  currentPath: string
  searchQuery: string
  canGoBack?: boolean
  canGoForward?: boolean
  selectedFiles?: string[]
  hasSelection?: boolean
}

interface Emits {
  (e: 'navigate-back'): void
  (e: 'navigate-forward'): void
  (e: 'search', query: string): void
  (e: 'navigate-to', path: string): void
  (e: 'rename-file', fileId: string): void
  (e: 'rename-folder', folderId: string): void
  (e: 'delete-files', fileIds: string[]): void
  (e: 'delete-folder', folderId: string): void
  (e: 'create-item', type: 'folder' | 'file'): void
  (e: 'toggle-sidebar'): void
}

withDefaults(defineProps<Props>(), {
  canGoBack: true,
  canGoForward: false,
  selectedFiles: () => [],
  hasSelection: false,
})

const emit = defineEmits<Emits>()

const showDropdown = ref(false)
const showMobileSearch = ref(false)
let searchTimeout: number | null = null
const searchInput = ref<HTMLInputElement | null>(null)

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const query = target.value

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    emit('search', query)
  }, 300)
}

const clearSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
  emit('search', '')
  folderStore.clearSearch()
  fileStore.clearSearch()
}

const handleBreadcrumbClick = (path: string) => {
  emit('navigate-to', path)
}

const createItem = (type: 'file' | 'folder') => {
  showDropdown.value = false
  emit('create-item', type)
}

const handleRenameFile = () => {
  if (hasSingleFileSelected.value && fileStore.selectedFileId) {
    emit('rename-file', fileStore.selectedFileId)
  } else if (hasMainFolderSelected.value && folderStore.selectedMainFolderId) {
    emit('rename-folder', folderStore.selectedMainFolderId)
  }
}

const handleDeleteFiles = () => {
  if (hasFileSelected.value) {
    emit('delete-files', fileStore.selectedFileIds)
  } else if (hasMainFolderSelected.value && folderStore.selectedMainFolderId) {
    emit('delete-folder', folderStore.selectedMainFolderId)
  }
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
  if (showMobileSearch.value) {
    // Focus search input when opened
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }
}
</script>

<template>
  <div class="win-toolbar">
    <!-- Mobile Layout -->
    <div class="flex md:hidden items-center justify-between space-x-2 px-2">
      <!-- Left: Sidebar toggle and Navigation -->
      <div class="flex space-x-1">
        <button class="win-button p-1" title="Menu" @click="$emit('toggle-sidebar')">
          <i class="fas fa-bars text-gray-600 text-sm"></i>
        </button>
        <button
          class="win-button"
          title="Back"
          @click="$emit('navigate-back')"
          :disabled="!canGoBack"
        >
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <button
          class="win-button"
          title="Forward"
          @click="$emit('navigate-forward')"
          :disabled="!canGoForward"
        >
          <i class="fas fa-arrow-right text-gray-600"></i>
        </button>
      </div>

      <div class="flex-1 min-w-0 mx-2">
        <div class="flex items-center win-input bg-white border-gray-300 rounded px-2 py-1 text-xs">
          <i class="fas fa-desktop text-gray-500 mr-1 text-xs"></i>
          <div class="truncate">
            <BreadcrumbNav
              :path="currentPath"
              @navigate-to="handleBreadcrumbClick"
              :compact="true"
            />
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex space-x-1">
        <!-- Action buttons for selection -->
        <div v-if="hasMainFolderSelected || hasFileSelected" class="flex space-x-1">
          <button
            v-if="hasSingleFileSelected || hasMainFolderSelected"
            class="win-button p-1"
            title="Rename"
            @click="handleRenameFile"
          >
            <i class="fas fa-edit text-gray-600 text-sm"></i>
          </button>
          <button
            class="win-button win-button-danger p-1"
            title="Delete"
            @click="handleDeleteFiles"
          >
            <i class="fas fa-trash text-red-600 text-sm"></i>
          </button>
        </div>

        <!-- Create dropdown -->
        <div class="relative">
          <button class="win-button p-1" @click="showDropdown = !showDropdown">
            <i class="fas fa-plus text-green-600 text-sm"></i>
          </button>
          <div
            v-if="showDropdown"
            class="absolute right-0 z-10 mt-2 bg-white border border-gray-300 rounded shadow-lg min-w-[120px]"
          >
            <button
              class="flex items-center w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              @click="createItem('folder')"
            >
              <i class="fas fa-folder text-yellow-500 mr-2 w-3"></i>
              Folder
            </button>
            <button
              class="flex items-center w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              @click="createItem('file')"
            >
              <i class="fas fa-file text-blue-500 mr-2 w-3"></i>
              File
            </button>
          </div>
        </div>

        <!-- Search toggle -->
        <button class="win-button p-1" @click="toggleMobileSearch" title="Search">
          <i class="fas fa-search text-gray-600 text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Search (collapsible) -->
    <div v-if="showMobileSearch" class="md:hidden px-2 pb-2">
      <div class="flex items-center win-input bg-white border border-gray-300 rounded px-3 py-2">
        <i
          v-if="!folderStore.isSearching && !fileStore.isSearching"
          class="fas fa-search text-gray-400 mr-2"
        ></i>
        <i v-else class="fas fa-spinner fa-spin text-gray-400 mr-2"></i>
        <input
          ref="searchInput"
          type="text"
          placeholder="Search..."
          class="flex-1 text-sm outline-none bg-transparent"
          :value="searchQuery"
          @input="handleSearchInput"
          @keyup.escape="clearSearch"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="ml-2 text-gray-400 hover:text-gray-600"
          title="Clear search"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden md:flex items-center space-x-4">
      <div class="flex space-x-1">
        <button
          class="win-button"
          title="Back"
          @click="$emit('navigate-back')"
          :disabled="!canGoBack"
        >
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <button
          class="win-button"
          title="Forward"
          @click="$emit('navigate-forward')"
          :disabled="!canGoForward"
        >
          <i class="fas fa-arrow-right text-gray-600"></i>
        </button>
      </div>

      <div v-if="hasMainFolderSelected || hasFileSelected" class="flex space-x-2">
        <div class="relative">
          <button class="win-button" @click="showDropdown = !showDropdown">
            <i class="fas fa-plus text-green-600"></i>
          </button>
          <!-- dropdown -->
          <div
            v-if="showDropdown"
            class="absolute z-10 mt-2 bg-white border border-gray-300 rounded shadow-lg min-w-[140px]"
          >
            <button
              class="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
              @click="createItem('folder')"
            >
              <i class="fas fa-folder text-yellow-500 mr-3 w-4"></i>
              New Folder
            </button>
            <button
              class="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
              @click="createItem('file')"
            >
              <i class="fas fa-file text-blue-500 mr-3 w-4"></i>
              New File
            </button>
          </div>
        </div>
        <button
          v-if="hasSingleFileSelected || hasMainFolderSelected"
          class="win-button"
          title="Rename"
          @click="handleRenameFile"
        >
          <i class="fas fa-edit text-gray-600 mr-1"></i>
          <span class="text-sm">Rename</span>
        </button>
        <button class="win-button win-button-danger" title="Delete" @click="handleDeleteFiles">
          <i class="fas fa-trash text-red-600 mr-1"></i>
          <span class="text-sm">
            Delete
            <span v-if="hasMultipleFilesSelected">({{ fileStore.selectedFileIds.length }})</span>
          </span>
        </button>
      </div>

      <div class="flex-1 flex items-center win-input bg-white border-gray-300 rounded px-3 py-2">
        <i class="fas fa-desktop text-gray-500 mr-2"></i>
        <BreadcrumbNav :path="currentPath" @navigate-to="handleBreadcrumbClick" />
      </div>

      <div
        class="flex items-center win-input bg-white border border-gray-300 rounded px-3 py-2 w-64"
      >
        <i
          v-if="!folderStore.isSearching && !fileStore.isSearching"
          class="fas fa-search text-gray-400 mr-2"
        ></i>
        <i v-else class="fas fa-spinner fa-spin text-gray-400 mr-2"></i>
        <input
          ref="searchInput"
          type="text"
          placeholder="Search folders and files... (Ctrl+F)"
          class="flex-1 text-sm outline-none bg-transparent"
          :value="searchQuery"
          @input="handleSearchInput"
          @keyup.escape="clearSearch"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="ml-2 text-gray-400 hover:text-gray-600"
          title="Clear search"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>
