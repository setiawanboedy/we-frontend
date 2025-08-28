<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFolderStore } from '../stores/folderStore'
import { useFileStore } from '../stores/fileStore'
import type { FolderItem } from '@/shared/types/explorer'

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

const selectHighlight = (folder: FolderItem) => {
  fileStore.clearFileSelection()

  if (folderStore.isSearchMode) {
    folderStore.selectMainFolder(folder.id)
  } else {
    folderStore.selectMainFolder(folder.id)
  }
}

const selectHighlightFile = (fileId: string) => {
  folderStore.clearMainSelection()
  fileStore.selectFileLocal(fileId)
}

const handleFolderSelect = (folder: FolderItem) => {
  if (folderStore.isSearchMode || fileStore.isSearchMode) {
    folderStore.clearSearch()
    fileStore.clearSearch()
  }
  folderStore.selectFolder(folder.id)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (sortedFolders.value.length === 0 && sortedFiles.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      navigateNext()
      break
    case 'ArrowUp':
      event.preventDefault()
      navigatePrevious()
      break
    case 'Enter':
      event.preventDefault()
      activateSelected()
      break
    case 'Escape':
      event.preventDefault()
      clearSelection()
      break
  }
}

const navigateNext = () => {
  const folders = sortedFolders.value
  const files = sortedFiles.value
  const allItems = [...folders, ...files]

  if (allItems.length === 0) return

  let currentIndex = -1

  if (folderStore.selectedMainFolderId) {
    currentIndex = folders.findIndex((f) => f.id === folderStore.selectedMainFolderId)
    if (currentIndex === -1) {
      currentIndex = folders.length + files.findIndex((f) => f.id === fileStore.selectedFileId)
    }
  } else if (fileStore.selectedFileId) {
    currentIndex = folders.length + files.findIndex((f) => f.id === fileStore.selectedFileId)
  }

  const nextIndex = (currentIndex + 1) % allItems.length

  if (nextIndex < folders.length) {
    selectHighlight(folders[nextIndex])
  } else {
    const fileIndex = nextIndex - folders.length
    selectHighlightFile(files[fileIndex].id)
  }
}

const navigatePrevious = () => {
  const folders = sortedFolders.value
  const files = sortedFiles.value
  const allItems = [...folders, ...files]

  if (allItems.length === 0) return

  let currentIndex = -1

  if (folderStore.selectedMainFolderId) {
    currentIndex = folders.findIndex((f) => f.id === folderStore.selectedMainFolderId)
    if (currentIndex === -1) {
      currentIndex = folders.length + files.findIndex((f) => f.id === fileStore.selectedFileId)
    }
  } else if (fileStore.selectedFileId) {
    currentIndex = folders.length + files.findIndex((f) => f.id === fileStore.selectedFileId)
  }

  const prevIndex = currentIndex <= 0 ? allItems.length - 1 : currentIndex - 1

  if (prevIndex < folders.length) {
    selectHighlight(folders[prevIndex])
  } else {
    const fileIndex = prevIndex - folders.length
    selectHighlightFile(files[fileIndex].id)
  }
}

const activateSelected = () => {
  if (folderStore.selectedMainFolderId) {
    const folder = sortedFolders.value.find((f) => f.id === folderStore.selectedMainFolderId)
    if (folder) {
      handleFolderSelect(folder)
    }
  }
}

const clearSelection = () => {
  folderStore.clearMainSelection()
  fileStore.clearFileSelection()
}


const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="flex-1 bg-white" @keydown="handleKeyDown" tabindex="0">
    <div class="bg-gray-50 border-b border-gray-200 px-4 py-2">
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

    <div class="p-4 win-scrollbar overflow-auto">
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
          @click="(folderStore.clearSearch(), fileStore.clearSearch())"
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
          @click="
            (folderStore.loadFolderChildren(folderStore.selectedFolderId),
            fileStore.loadFilesByFolder(folderStore.selectedFolderId))
          "
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
              'flex items-center space-x-4 py-2 px-3 rounded cursor-default transition-colors',
              folderStore.selectedMainFolderId === folder.id
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'hover:bg-blue-50',
            ]"
            @click="selectHighlight(folder)"
            @dblclick="handleFolderSelect(folder)"
          >
            <i class="fas fa-folder text-yellow-500 w-5"></i>
            <div class="flex-1 grid grid-cols-12 gap-4 text-sm">
              <div class="col-span-6 font-medium">{{ folder.name }}</div>
              <div class="col-span-2 text-gray-500">{{ folder.updateAt }}</div>
              <div class="col-span-2 text-gray-500">Folder</div>
              <div class="col-span-2 text-gray-500">{{ folder.size }}</div>
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
              'flex items-center space-x-4 py-2 px-3 rounded cursor-default transition-colors',
              fileStore.selectedFileIds.includes(file.id)
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'hover:bg-blue-50',
            ]"
            @click="selectHighlightFile(file.id)"
          >
            <i class="fas fa-file text-gray-500 w-5"></i>
            <div class="flex-1 grid grid-cols-12 gap-4 text-sm">
              <div class="col-span-6 font-medium">{{ file.name }}</div>
              <div class="col-span-2 text-gray-500">{{ formatDate(file.updatedAt) }}</div>
              <div class="col-span-2 text-gray-500">plain/text</div>
              <div class="col-span-2 text-gray-500">
                1Kb
              </div>
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
          !fileStore.isLoading
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
