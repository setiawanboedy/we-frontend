<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @click="close">
        <i class="fas fa-times"></i>
      </button>
      <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
      <slot name="body">
        <div v-if="message" class="mb-4 text-gray-700">{{ message }}</div>
        <input
          v-if="showInput"
          v-model="localInput"
          :placeholder="inputPlaceholder"
          class="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
      </slot>
      <div class="flex justify-end space-x-2 mt-4">
        <slot name="actions">
          <button class="win-button" @click="confirm">{{ confirmText }}</button>
          <button class="win-button win-button-danger" @click="close">{{ cancelText }}</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  showInput: { type: Boolean, default: false },
  inputValue: { type: String, default: '' },
  inputPlaceholder: { type: String, default: '' },
  confirmText: { type: String, default: 'OK' },
  cancelText: { type: String, default: 'Cancel' },
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'update:inputValue'])

const localInput = ref(props.inputValue)

watch(
  () => props.inputValue,
  (val) => {
    localInput.value = val
  },
)

const close = () => {
  emit('update:visible', false)
  emit('cancel')
}

const confirm = () => {
  emit('confirm', localInput.value)
  emit('update:visible', false)
}

watch(localInput, (val) => {
  emit('update:inputValue', val)
})
</script>

<style scoped>
.win-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: #3b82f6;
  color: #fff;
  transition: background 0.2s;
}
.win-button:hover {
  background-color: #2563eb;
}
.win-button-danger {
  background-color: #ef4444;
}
.win-button-danger:hover {
  background-color: #dc2626;
}
</style>
