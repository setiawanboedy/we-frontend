<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/ExplorerSidebar.vue'
import StatusBar from '../components/StatusBar.vue'
import ToolbarView from '../components/TopToolbar.vue'
import { useFolderStore } from '../stores/folderStore'
import { useFileStore } from '../stores/fileStore'
import ExplorerModal from '../components/ExplorerModal.vue'

const folderStore = useFolderStore()
const fileStore = useFileStore()
const renameModalVisible = ref(false)
const renameInput = ref('')
let renameTargetId: string | null = null
let renameTargetType: 'folder' | 'file' | null = null

const deleteModalVisible = ref(false)
let deleteTargetIds: string[] = []
let deleteTargetType: 'folder' | 'file' | null = null
const deleteMessage = ref('')

const handleNavigateBack = () => {
  if (folderStore.isSearchMode || fileStore.isSearchMode) {
    folderStore.clearSearch()
    fileStore.clearSearch()
  }
  folderStore.navigateBack()
}

const handleNavigateForward = () => {
  if (folderStore.isSearchMode || fileStore.isSearchMode) {
    folderStore.clearSearch()
    fileStore.clearSearch()
  }
  folderStore.navigateForward()
}

const handleSearch = (query: string) => {
  if (query.trim() === '') {
    folderStore.clearSearch()
    fileStore.clearSearch()
  } else {
    folderStore.searchFolders(query)
    fileStore.searchFiles(query)
  }
}
const handleRenameFile = (fileId: string) => {
  const file = fileStore.displayedFiles.find((f) => f.id === fileId)
  renameInput.value = file ? file.name : ''
  renameTargetId = fileId
  renameTargetType = 'file'
  renameModalVisible.value = true
}

const doRenameFolder = async (newName: string) => {
  if (!renameTargetId || !newName.trim()) return

  if (renameTargetType === 'file') {
    await fileStore.renameFile(renameTargetId, newName)
  } else {
    await folderStore.renameFolder(renameTargetId, newName)
  }

  renameModalVisible.value = false
  renameTargetId = null
  renameTargetType = null
}

const handleDeleteFiles = (fileIds: string[]) => {
  deleteTargetIds = fileIds
  deleteTargetType = 'file'
  deleteMessage.value =
    fileIds.length === 1
      ? 'Are you sure you want to delete this file? This action cannot be undone.'
      : `Are you sure you want to delete ${fileIds.length} files? This action cannot be undone.`
  deleteModalVisible.value = true
}

const doDeleteFolder = async () => {
  if (deleteTargetIds.length === 0) return

  if (deleteTargetType === 'file') {
    for (const fileId of deleteTargetIds) {
      await fileStore.deleteFile(fileId)
    }
  } else {
    const result = await folderStore.deleteFolder(deleteTargetIds[0])
    if (!result.success) return
  }

  deleteModalVisible.value = false
  deleteTargetIds = []
  deleteTargetType = null
}

const handleCreateItem = async (type: 'folder' | 'file') => {
  if (type === 'folder') {
    await folderStore.createNewFolder()
  } else {
    const selectedFolderId = folderStore.selectedMainFolderId || folderStore.selectedFolderId
    if (!selectedFolderId) {
      return
    }
    const result = await fileStore.createNewFile(selectedFolderId)
    if (!result.success) {
    }
  }
}

const handleDeleteFolder = (folderId: string) => {
  deleteTargetIds = [folderId]
  deleteTargetType = 'folder'
  deleteMessage.value = 'Are you sure you want to delete this folder? This action cannot be undone.'
  deleteModalVisible.value = true
}
</script>

<template>
  <div class="h-screen bg-win-gray font-segoe flex flex-col">
    <!-- Toolbar -->
    <ToolbarView
      :current-path="folderStore.currentPath"
      :search-query="folderStore.searchQuery || fileStore.searchQuery"
      :can-go-back="folderStore.canGoBack"
      :can-go-forward="folderStore.canGoForward"
      :selected-files="fileStore.selectedFileIds"
      :has-selection="
        folderStore.selectedMainFolderId !== null || fileStore.selectedFileIds.length > 0
      "
      @navigate-back="handleNavigateBack"
      @navigate-forward="handleNavigateForward"
      @search="handleSearch"
      @rename-file="handleRenameFile"
      @delete-files="handleDeleteFiles"
      @delete-folder="handleDeleteFolder"
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
      :item-count="folderStore.currentFolderChildren.length + fileStore.displayedFiles.length"
      :selected-count="
        (folderStore.selectedMainFolderId ? 1 : 0) + fileStore.selectedFileIds.length
      "
      :selected-file-info="
        fileStore.selectedFile
          ? `${fileStore.selectedFile.name} (${fileStore.selectedFile.size} bytes)`
          : undefined
      "
    />

    <!-- Rename Modal -->
    <ExplorerModal
      v-model:visible="renameModalVisible"
      :title="renameTargetType === 'file' ? 'Rename File' : 'Rename Folder'"
      :show-input="true"
      :input-value="renameInput"
      :input-placeholder="
        renameTargetType === 'file' ? 'Enter new file name' : 'Enter new folder name'
      "
      confirm-text="Rename"
      cancel-text="Cancel"
      @confirm="doRenameFolder"
      @update:inputValue="(val) => (renameInput = val)"
    />

    <!-- Delete Modal -->
    <ExplorerModal
      v-model:visible="deleteModalVisible"
      :title="
        deleteTargetType === 'file'
          ? deleteTargetIds.length === 1
            ? 'Delete File'
            : 'Delete Files'
          : 'Delete Folder'
      "
      :message="deleteMessage"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="doDeleteFolder"
    />
  </div>
</template>
