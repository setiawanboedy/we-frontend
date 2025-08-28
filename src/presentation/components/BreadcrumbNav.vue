<script setup lang="ts">
import { useFolderStore } from '../stores/folderStore'
import { computed } from 'vue'

interface Props {
  path?: string
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const folderStore = useFolderStore()

const displayPath = computed(() => {
  if (props.compact && folderStore.breadcrumbPath.length > 2) {
    const first = folderStore.breadcrumbPath[0]
    const last = folderStore.breadcrumbPath[folderStore.breadcrumbPath.length - 1]
    return [first, '...', last]
  }
  return folderStore.breadcrumbPath
})

const navigateToPath = (index: number) => {
  if (index === 0) {
    folderStore.selectedFolderId = null
    folderStore.currentPath = 'This PC'
    folderStore.currentFolderChildren = []
  }
}

interface Emits {
  (e: 'navigate-to', path: string): void
}

defineEmits<Emits>()
</script>

<template>
  <div class="flex items-center text-sm text-gray-700">
    <template v-for="(part, index) in displayPath" :key="index">
      <span
        v-if="index < displayPath.length - 1 && part !== '...'"
        class="hover:underline cursor-pointer text-blue-600"
        @click="navigateToPath(index)"
      >
        {{ part }}
      </span>
      <span v-else-if="part === '...'" class="text-gray-500">{{ part }}</span>
      <span v-else>{{ part }}</span>

      <i
        v-if="index < displayPath.length - 1"
        class="fas fa-chevron-right text-xs text-gray-400 mx-1"
        :class="{ 'mx-2': !compact }"
      ></i>
    </template>
  </div>
</template>
