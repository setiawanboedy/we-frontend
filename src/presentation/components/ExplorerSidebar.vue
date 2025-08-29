<script setup lang="ts">
import SidebarFolder from '@/presentation/components/SidebarFolder.vue'
import { useFolderStore } from '../stores/folderStore'
import { useFileStore } from '../stores/fileStore'
import type { FolderItem } from '@/shared/types/explorer'
import { onMounted } from 'vue'

const folderStore = useFolderStore()
const fileStore = useFileStore()

const handleFolderSelect = (folder: FolderItem) => {
  if (folderStore.isSearchMode || fileStore.isSearchMode) {
    folderStore.clearFolderSearch()
    fileStore.clearFileSearch()
  }

  fileStore.clearFileSelection()

  folderStore.clearMainSelection()
  folderStore.selectFolder(folder.id)
}

onMounted(() => {
  folderStore.initialize()
})
</script>

<template>
  <div class="w-64 h-screen win-sidebar">
    <div class="p-2 md:p-4">
      <!-- Sidebar folder -->
      <div v-if="folderStore.isLoadingSidebar" class="flex items-center justify-center py-8">
        <div class="text-sm text-gray-500">Loading folders...</div>
      </div>
      <div v-else-if="folderStore.sidebarError" class="p-4 bg-red-50 border border-red-200 rounded">
        <div class="text-sm text-red-600">Error: {{ folderStore.sidebarError }}</div>
        <button
          class="mt-2 text-xs text-red-700 underline hover:no-underline"
          @click="folderStore.loadSidebarFolders()"
        >
          Retry
        </button>
      </div>
      <div v-else class="space-y-2">
        <SidebarFolder
          v-for="folder in folderStore.sidebarFolders"
          :key="folder.id"
          :folder="folder"
          :selected-folder="folderStore.selectedFolderId || ''"
          @folder-select="handleFolderSelect"
        />
      </div>
    </div>
  </div>
</template>
