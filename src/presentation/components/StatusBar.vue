<script setup lang="ts">
interface Props {
  itemCount: number
  selectedCount: number
  selectedFileInfo?: string
}

withDefaults(defineProps<Props>(), {
  itemCount: 0,
  selectedCount: 0,
  selectedFileInfo: undefined
})
</script>

<template>
  <div class="border-t border-gray-200 px-4 py-2 bg-gray-50">
    <div class="flex justify-between items-center text-sm text-gray-600">
      <div class="flex space-x-4">
        <span>{{ itemCount }} items</span>
        <span v-if="selectedCount > 0" class="text-win-blue font-medium">
          {{ selectedCount }} items selected
        </span>
        <span v-if="selectedFileInfo" class="text-gray-500">
          {{ selectedFileInfo }}
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <span class="text-gray-500">Ready</span>
      </div>
    </div>
  </div>
</template>