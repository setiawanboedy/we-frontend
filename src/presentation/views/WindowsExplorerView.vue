<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFolderStore } from '../stores/folderStore'
import { useFileStore } from '../stores/fileStore'
import type { FileItem, FolderItem } from '@/shared/types/explorer'

const folderStore = useFolderStore()
const fileStore = useFileStore()

type EnumTable = 'name' | 'date' | 'type' | 'size'
const currentSort = ref<EnumTable>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedFolders = computed(() => {
  const folders = [...folderStore.displayedFolders]
  folders.sort((a, b) => {
    let comparison = 0

    switch (currentSort.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'date':
        comparison = new Date(a.updateAt || '').getTime() - new Date(b.updateAt || '').getTime()
        break
      case 'type':
        comparison = 'Folder'.localeCompare('Folder')
        break
      case 'size':
        comparison = (parseInt(a.size) || 0) - (parseInt(b.size) || 0)
        break
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  return folders
})

const sortedFiles = computed(() => {
  const files = [...fileStore.displayedFiles]
  files.sort((a, b) => {
    let comparison = 0

    switch (currentSort.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'date':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        break
      case 'type':
        break
      case 'size':
        comparison = (a.size || 0) - (b.size || 0)
        break
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  return files
})

const sortBy = (column: EnumTable) => {
  if (currentSort.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    currentSort.value = column
    sortOrder.value = 'asc'
  }
}

watch(
  () => folderStore.selectedFolderId,
  (newFolderId, oldFolderId) => {
    if (newFolderId && newFolderId !== oldFolderId) {
      fileStore.loadFilesByFolder(newFolderId)
    }
  },
  { immediate: true },
)

const selectFolder = (folder: FolderItem) => {
  fileStore.clearFileSelection()
  
  if (folderStore.isSearchMode) {
    folderStore.selectMainFolder(folder.id)
  } else {
    folderStore.selectMainFolder(folder.id)
  }
}

const selectFile = (file: FileItem) => {
  folderStore.clearMainSelection()
  fileStore.selectFile(file.id)
}

const handleFolderSelect = (folder: FolderItem) => {
  if (folderStore.isSearchMode || fileStore.isSearchMode) {
    folderStore.clearFolderSearch()
    fileStore.clearFileSearch()
  }
  folderStore.selectFolder(folder.id)
}


const handleRetry = (folderStore: any) => {
  folderStore.loadFolderChildren(folderStore.selectedFolderId)
  fileStore.loadFilesByFolder(folderStore.selectedFolderId)
}

</script>

<template>
  <div class="flex-1 bg-white" >
    <!-- Desktop Header -->
    <div class="hidden md:block bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
        <div
          class="col-span-6 cursor-pointer hover:text-gray-800 flex items-center"
          @click="sortBy('name')"
        >
          Name
          <i
            :class="[
              'fas ml-1 text-xs',
              currentSort === 'name'
                ? sortOrder === 'asc'
                  ? 'fa-chevron-up'
                  : 'fa-chevron-down'
                : 'fa-chevron-up text-gray-400',
            ]"
          ></i>
        </div>
        <div
          class="col-span-2 cursor-pointer hover:text-gray-800 flex items-center"
          @click="sortBy('date')"
        >
          Date modified
          <i
            :class="[
              'fas ml-1 text-xs',
              currentSort === 'date'
                ? sortOrder === 'asc'
                  ? 'fa-chevron-up'
                  : 'fa-chevron-down'
                : 'fa-chevron-up text-gray-400',
            ]"
          ></i>
        </div>
        <div
          class="col-span-2 cursor-pointer hover:text-gray-800 flex items-center"
          @click="sortBy('type')"
        >
          Type
          <i
            :class="[
              'fas ml-1 text-xs',
              currentSort === 'type'
                ? sortOrder === 'asc'
                  ? 'fa-chevron-up'
                  : 'fa-chevron-down'
                : 'fa-chevron-up text-gray-400',
            ]"
          ></i>
        </div>
        <div
          class="col-span-2 cursor-pointer hover:text-gray-800 flex items-center"
          @click="sortBy('size')"
        >
          Size
          <i
            :class="[
              'fas ml-1 text-xs',
              currentSort === 'size'
                ? sortOrder === 'asc'
                  ? 'fa-chevron-up'
                  : 'fa-chevron-down'
                : 'fa-chevron-up text-gray-400',
            ]"
          ></i>
        </div>
      </div>
    </div>

    <!-- Mobile Header -->
    <div class="md:hidden bg-gray-50 border-b border-gray-200 px-3 py-2">
      <div class="flex items-center justify-between text-sm font-medium text-gray-600">
        <span>Items</span>
        <div class="flex items-center space-x-2">
          <button
            class="p-1 rounded hover:bg-gray-200"
            @click="sortBy('name')"
            :class="{ 'text-blue-600': currentSort === 'name' }"
          >
            <i class="fas fa-sort-alpha-down text-xs"></i>
          </button>
          <button
            class="p-1 rounded hover:bg-gray-200"
            @click="sortBy('date')"
            :class="{ 'text-blue-600': currentSort === 'date' }"
          >
            <i class="fas fa-sort-numeric-down text-xs"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="px-3 md:px-4 py-2 win-scrollbar overflow-auto">
      <div
        v-if="folderStore.isSearching || fileStore.isSearching"
        class="flex items-center justify-center py-8"
      >
        <div class="text-sm text-gray-500">Searching...</div>
      </div>

      <div
        v-if="
          (folderStore.isSearchMode || fileStore.isSearchMode) &&
          (folderStore.searchQuery || fileStore.searchQuery)
        "
        class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded"
      >
        <div class="text-sm text-blue-800">
          Search results for "<strong>{{ folderStore.searchQuery || fileStore.searchQuery }}</strong
          >" ({{ folderStore.searchResults.length + fileStore.searchResults.length }})
          {{
            folderStore.searchResults.length + fileStore.searchResults.length === 1
              ? 'result'
              : 'results'
          }}
        </div>
        <button
          @click="(folderStore.clearFolderSearch(), fileStore.clearFileSearch())"
          class="mt-1 text-xs text-blue-600 underline hover:no-underline"
        >
          Clear search
        </button>
      </div>

      <div
        v-if="folderStore.isLoadingChildren || fileStore.isLoading"
        class="flex items-center justify-center py-8"
      >
        <div class="text-sm text-gray-500">Loading contents...</div>
      </div>

      <div
        v-else-if="folderStore.childrenError || fileStore.fileError"
        class="p-4 bg-red-50 border border-red-200 rounded"
      >
        <div class="text-sm text-red-600">
          Error: {{ folderStore.childrenError || fileStore.fileError }}
        </div>
        <button
          v-if="folderStore.selectedFolderId"
          @click="handleRetry"
          class="mt-2 text-xs text-red-700 underline hover:no-underline"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="
          !folderStore.selectedFolderId && !folderStore.isSearchMode && !fileStore.isSearchMode
        "
        class="flex items-center justify-center py-16"
      >
        <div class="text-center text-gray-500">
          <i class="fas fa-folder-open text-4xl mb-4"></i>
          <p>Select a folder from the sidebar to view its contents</p>
        </div>
      </div>

      <div
        v-else-if="
          (folderStore.isSearchMode || fileStore.isSearchMode) &&
          folderStore.searchResults.length + fileStore.searchResults.length === 0
        "
        class="flex items-center justify-center py-16"
      >
        <div class="text-center text-gray-500">
          <i class="fas fa-search text-4xl mb-4"></i>
          <p>No results found for "{{ folderStore.searchQuery || fileStore.searchQuery }}"</p>
        </div>
      </div>

      <div v-if="sortedFolders.length > 0">
        <div class="space-y-1">
          <div
            v-for="folder in sortedFolders"
            :key="`folder-${folder.id}`"
            :class="[
              'flex items-center py-2 px-3 rounded cursor-default transition-colors',
              folderStore.selectedMainFolderId === folder.id ? 'bg-blue-100' : 'hover:bg-blue-50',
            ]"
            @click="selectFolder(folder)"
            @dblclick="handleFolderSelect(folder)"
          >
            <i class="fas fa-folder text-yellow-500 w-5 mr-3 flex-shrink-0"></i>
            <!-- Desktop Layout -->
            <div class="hidden md:grid flex-1 grid-cols-12 gap-4 text-sm">
              <div class="col-span-6 font-medium">{{ folder.name }}</div>
              <div class="col-span-2 text-gray-500">{{ folder.updateAt }}</div>
              <div class="col-span-2 text-gray-500">Folder</div>
              <div class="col-span-2 text-gray-500"></div>
            </div>
            <!-- Mobile Layout -->
            <div class="md:hidden flex-1 min-w-0">
              <div class="font-medium text-sm truncate">{{ folder.name }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ folder.updateAt || 'Folder' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="sortedFiles.length > 0">
        <div>
          <div
            v-for="file in sortedFiles"
            :key="`file-${file.id}`"
            :class="[
              'flex items-center py-2 px-3 rounded cursor-default transition-colors',
              fileStore.selectedFileId === file.id ? 'bg-blue-100 ' : 'hover:bg-blue-50',
            ]"
            @click="selectFile(file)"
          >
            <i class="fas fa-file text-gray-500 w-5 mr-3 flex-shrink-0"></i>
            <!-- Desktop Layout -->
            <div class="hidden md:grid flex-1 grid-cols-12 gap-4 text-sm">
              <div class="col-span-6 font-medium">{{ file.name }}</div>
              <div class="col-span-2 text-gray-500">{{ file.updatedAt }}</div>
              <div class="col-span-2 text-gray-500">Text Document</div>
              <div class="col-span-2 text-gray-500">1Kb</div>
            </div>
            <!-- Mobile Layout -->
            <div class="md:hidden flex-1 min-w-0">
              <div class="font-medium text-sm truncate">{{ file.name }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ file.updatedAt }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="
          sortedFolders.length === 0 &&
          sortedFiles.length === 0 &&
          folderStore.selectedFolderId &&
          !folderStore.isLoadingChildren &&
          !fileStore.isLoading &&
          !folderStore.isSearchMode &&
          !fileStore.isSearchMode
        "
        class="flex items-center justify-center py-16"
      >
        <div class="text-center text-gray-500">
          <i class="fas fa-folder-open text-4xl mb-4"></i>
          <p>This folder is empty</p>
          <p class="text-sm mt-2">No folders or files found</p>
        </div>
      </div>
    </div>
  </div>
</template>
