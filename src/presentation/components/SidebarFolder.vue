<script setup lang="ts">
import type { FolderItem } from '@/shared/types/explorer'
import { useFolderStore } from '../stores/folderStore'
import { computed } from 'vue'

interface Props {
  folder: FolderItem
  selectedFolder: string
}

interface Emits {
  (e: 'folder-select', folder: FolderItem): void
}



const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const folderStore = useFolderStore()

const hasChildren = computed(() => {
  return props.folder.children && props.folder.children.length > 0
})

const isSelected = computed(() => {
  return props.selectedFolder === props.folder.id
})

const selectFolder = () => {
  emit('folder-select', props.folder)
}

const toggleExpanded = () => {
  if (hasChildren.value) {
    folderStore.toggleFolderExpansion(props.folder.id)
  }
}
</script>

<template>
  <div>
    <div
      class="flex items-center space-x-2 py-2 px-2 win-listitem rounded text-sm"
      :class="{ 'win-listitem-selected': isSelected }"
      @click="selectFolder"
    >
      <i
        v-if="hasChildren"
        class="fas text-xs w-3"
        :class="folder.isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"
        @click.stop="toggleExpanded"
      ></i>
      <div v-else class="w-3"></div>

      <i class="fas fa-folder text-yellow-500"></i>
      <span>{{ folder.name }}</span>
    </div>

    <div v-if="hasChildren && folder.isExpanded" class="ml-4">
      <SidebarFolder
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :selected-folder="selectedFolder"
        @folder-select="$emit('folder-select', $event)"
      />
    </div>
  </div>
</template>
