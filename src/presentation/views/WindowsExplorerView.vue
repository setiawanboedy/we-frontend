<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFolderStore } from '../stores/folderStore'
import type { FolderItem } from '@/shared/types/explorer'

const folderStore = useFolderStore()
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
      default:
        comparison = a.name.localeCompare(b.name)
        break
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  return folders
})

const sortBy = (column: EnumTable) => {
  if (currentSort.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    currentSort.value = column
    sortOrder.value = 'asc'
  }
}

const selectHighlight = (folder: FolderItem) => {
  if (folderStore.isSearchMode) {
    folderStore.selectMainFolder(folder.id)
  } else {
    folderStore.selectedFolderId = folder.id
    folderStore.selectMainFolder(folder.id)
  }
}

const handleFolderSelect = (folder: FolderItem) => {
  if (folderStore.isSearchMode) {
    folderStore.clearSearch()
  }
  folderStore.selectFolder(folder.id)
}
</script>

<template>
  <div class="flex-1 bg-white">
    <div class="bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
        <div class="col-span-6 cursor-pointer hover:text-gray-800" @click="sortBy('name')">
          Name
          <i class="fas fa-chevron-up text-xs ml-1"></i>
        </div>
        <div class="col-span-2 cursor-pointer hover:text-gray-800" @click="sortBy('date')">
          Date modified
          <i class="fas fa-chevron-up text-xs ml-1"></i>
        </div>
        <div class="col-span-2 cursor-pointer hover:text-gray-800" @click="sortBy('type')">
          Type
          <i class="fas fa-chevron-up text-xs ml-1"></i>
        </div>
        <div class="col-span-2 cursor-pointer hover:text-gray-800" @click="sortBy('size')">
          Size
          <i class="fas fa-chevron-up text-xs ml-1"></i>
        </div>
      </div>
    </div>

    <div class="p-4 win-scrollbar overflow-auto">
      <div v-if="folderStore.isSearching" class="flex items-center justify-center py-8">
        <div class="text-sm text-gray-500">Searching folders...</div>
      </div>

      <div
        v-if="folderStore.isSearchMode && folderStore.searchQuery"
        class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded"
      >
        <div class="text-sm text-blue-800">
          Search results for "<strong>{{ folderStore.searchQuery }}</strong
          >" ({{ folderStore.searchResults.length }})
          {{ folderStore.searchResults.length === 1 ? 'result' : 'results' }}
        </div>
        <button
          @click="folderStore.clearSearch()"
          class="mt-1 text-xs text-blue-600 underline hover:no-underline"
        >
          Clear search
        </button>
      </div>

      <div v-if="folderStore.isLoadingChildren" class="flex items-center justify-center py-8">
        <div class="text-sm text-gray-500">Loading folder contents...</div>
      </div>

      <div
        v-else-if="folderStore.childrenError"
        class="p-4 bg-red-50 border border-red-200 rounded"
      >
        <div class="text-sm text-red-600">Error: {{ folderStore.childrenError }}</div>
        <button
          v-if="folderStore.selectedFolderId"
          @click="folderStore.loadFolderChildren(folderStore.selectedFolderId)"
          class="mt-2 text-xs text-red-700 underline hover:no-underline"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="!folderStore.selectedFolderId && !folderStore.isSearchMode"
        class="flex items-center justify-center py-16"
      >
        <div class="text-center text-gray-500">
          <i class="fas fa-folder-open text-4xl mb-4"></i>
          <p>Select a folder from the sidebar to view its contents</p>
        </div>
      </div>

      <div
        v-else-if="folderStore.isSearchMode && folderStore.searchResults.length === 0"
        class="flex items-center justify-center py-16"
      >
        <div class="text-center text-gray-500">
          <i class="fas fa-search text-4xl mb-4"></i>
          <p>No folders found matching "{{ folderStore.searchQuery }}"</p>
        </div>
      </div>

      <div v-else-if="sortedFolders.length > 0" class="space-y-1">
        <div
          v-for="folder in sortedFolders"
          :key="folder.id"
          :class="[
            'flex items-center space-x-4 py-2 px-3 rounded cursor-default',
            folderStore.selectedFolderId === folder.id ? 'bg-blue-100' : 'hover:bg-blue-50',
          ]"
          @click="selectHighlight(folder)"
          @dblclick="handleFolderSelect(folder)"
        >
          <i class="fas fa-folder text-yellow-500 w-5"></i>
          <div class="flex-1 grid grid-cols-12 gap-4 text-sm">
            <div class="col-span-6">{{ folder.name }}</div>
            <div class="col-span-2 text-gray-500">{{ folder.updateAt }}</div>
            <div class="col-span-2 text-gray-500">Folder</div>
            <div class="col-span-2 text-gray-500">{{ folder.size }}</div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>
