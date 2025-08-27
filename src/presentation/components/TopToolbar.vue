<script setup lang="ts">
import BreadcrumbNav from '@/presentation/components/BreadcrumbNav.vue';


</script>

<template>
  <div class="win-toolbar">
    <div class="flex items-center space-x-4">
      <div class="flex space-x-1">
        <button class="win-button" title="Back">
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <button class="win-button" title="Forward">
          <i class="fas fa-arrow-right text-gray-600"></i>
        </button>
      </div>
      
      <div class="flex space-x-2">
        <button class="win-button" title="Rename">
          <i class="fas fa-edit text-gray-600 mr-1"></i>
          <span class="text-sm">Rename</span>
        </button>
        <button class="win-button win-button-danger" title="Delete">
          <i class="fas fa-trash text-red-600 mr-1"></i>
          <span class="text-sm">Delete</span>
        </button>
      </div>
      
      <div class="relative">
        <button class="win-button">
             <i class="fas fa-plus text-green-600"></i>
        </button>
        <!-- dropdown -->
      </div>

      <div class="flex-1 flex items-center win-input bg-white border-gray-300 rounded px-3 py-2">
        <i class="fas fa-desktop text-gray-500 mr-2"></i>
        <!-- Breadcrum -->
        <BreadcrumbNav />
      </div>

      <div class="flex items-center win-input bg-white border border-gray-300 rounded px-3 py-2 w-64">
        <i class="fas fa-search text-gray-400 mr-2"></i>
        <input
          ref="searchInput"
          type="text"
          placeholder="Search folders... (Ctrl+F)"
          class="flex-1 text-sm outline-none bg-transparent"
        />
        <button
          class="ml-2 text-gray-400 hover:text-gray-600"
          title="Clear search"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>

  </div>
</template>
