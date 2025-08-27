<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/ExplorerSidebar.vue'
import StatusBar from '../components/StatusBar.vue'
import ToolbarView from '../components/TopToolbar.vue'
import { useFolderStore } from '../stores/folderStore'
import ExplorerModal from '../components/ExplorerModal.vue'

const folderStore = useFolderStore()
const renameModalVisible = ref(false)
const renameInput = ref('')
let renameTargetId: string | null = null

const deleteModalVisible = ref(false)
let deleteTargetId: string | null = null
const deleteMessage = ref(
  'Are you sure you want to delete this folder? This action cannot be undone.',
)

const handleNavigateBack = () => {
  folderStore.navigateBack()
}

const handleNavigateForward = () => {
  folderStore.navigateForward()
}

const handleSearch = (query: string) => {
  folderStore.searchFolders(query)
}
const handleRenameFile = (fileId: string) => {
  const folder = folderStore.currentFolderChildren.find((f) => f.id === fileId)
  renameInput.value = folder ? folder.name : ''
  renameTargetId = fileId
  renameModalVisible.value = true
}

const doRenameFolder = async (newName: string) => {
  if (!renameTargetId || !newName.trim()) return
  await folderStore.renameFolder(renameTargetId, newName)
  renameModalVisible.value = false
}

const handleDeleteFiles = (fileId: string) => {
  deleteTargetId = fileId
  deleteModalVisible.value = true
}

const doDeleteFolder = async () => {
  if (!deleteTargetId) return
  const result = await folderStore.deleteFolder(deleteTargetId)
  if (result.success) {
    deleteModalVisible.value = false
    deleteTargetId = null
  }
}

const handleCreateItem = async (type: 'folder' | 'file') => {
  if (type === 'folder') {
    await folderStore.createNewFolder()
  } else {
  }
}
</script>

<template>
  <div class="h-screen bg-win-gray font-segoe flex flex-col">
    <!-- Toolbar -->
    <ToolbarView
      :current-path="folderStore.currentPath"
      :search-query="folderStore.searchQuery"
      :can-go-back="folderStore.canGoBack"
      :can-go-forward="folderStore.canGoForward"
      :selected-files="[]"
      :has-selection="false"
      @navigate-back="handleNavigateBack"
      @navigate-forward="handleNavigateForward"
      @search="handleSearch"
      @rename-file="handleRenameFile"
      @delete-files="handleDeleteFiles"
      @create-item="handleCreateItem"
    />
    <!-- Main content -->
    <div class="flex flex-1 bg-white shadow-lg overflow-hidden">
      <!-- Sidebar -->
      <Sidebar />
      <!-- Main area -->
      <div class="flex-1">
        <slot />
      </div>
    </div>

    <!-- status bar -->
    <StatusBar
        :item-count="folderStore.currentFolderChildren.length"
        :selected-count="0"
        :selected-file-info="undefined"
    />

    <!-- Rename Modal -->
    <ExplorerModal
      v-model:visible="renameModalVisible"
      title="Rename Folder"
      :show-input="true"
      :input-value="renameInput"
      input-placeholder="Enter new folder name"
      confirm-text="Rename"
      cancel-text="Cancel"
      @confirm="doRenameFolder"
      @update:inputValue="(val) => (renameInput = val)"
    />

    <!-- Delete Modal -->
    <ExplorerModal
      v-model:visible="deleteModalVisible"
      title="Delete Folder"
      :message="deleteMessage"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="doDeleteFolder"
    />
  </div>
</template>
