<script setup lang="ts">
import { useFolderStore } from '../stores/folderStore';

const folderStore = useFolderStore()

const navigateToPath = (index: number) => {
  if (index === 0) {
    folderStore.selectedFolderId = null
    folderStore.currentPath = 'This PC'
    folderStore.currentFolderChildren = []
  }
}
</script>

<template>
  <div class="flex items-center text-sm text-gray-700">
    <template v-for="(part, index) in folderStore.breadcrumbPath" :key="index">
      <span
        v-if="index < folderStore.breadcrumbPath.length - 1"
        class="hover:underline cursor-pointer text-blue-600"
        @click="navigateToPath(index)"
      >
        {{ part }}
      </span>
      <span v-else>{{ part }}</span>

      <i
        v-if="index < folderStore.breadcrumbPath.length - 1"
        class="fas fa-chevron-right text-xs text-gray-400 mx-2"
      ></i>
    </template>
  </div>
</template>