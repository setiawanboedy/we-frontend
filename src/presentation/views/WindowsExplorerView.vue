<script setup lang="ts"></script>

<template>
  <div class="flex-1 bg-white">
    <div class="bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
        <div class="col-span-6 cursor-pointer hover:text-gray-800">
          Name
          <i  class="fas fa-chevron-up text-xs ml-1"></i>
        </div>
        <div class="col-span-2 cursor-pointer hover:text-gray-800" >
          Date modified
          <i  class="fas fa-chevron-up text-xs ml-1"></i>
        </div>
        <div class="col-span-2 cursor-pointer hover:text-gray-800" >
          Type
          <i class="fas fa-chevron-up text-xs ml-1"></i>
        </div>
        <div class="col-span-2 cursor-pointer hover:text-gray-800">
          Size
          <i class="fas fa-chevron-up text-xs ml-1"></i>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center py-16">
        <div class="text-center text-gray-500">
            <i class="fas fa-folder-open text-4xl mb-4"></i>
            <p>Select a folder from the sidebar to view its contents</p>
        </div>
    </div>
  </div>
</template>
