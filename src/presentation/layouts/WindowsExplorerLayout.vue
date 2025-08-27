<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
import ToolbarView from '../components/Toolbar.vue';


</script>

<template>
    <div class="h-screen bg-win-gray font-segoe flex flex-col">
        <!-- Toolbar -->
         <ToolbarView />
         <!-- Main content -->
          <div class="flex flex-1 bg-white shadow-lg mx-4 overflow-hidden">
            <!-- Sidebar -->
             <Sidebar />
             <!-- Main area -->
             <div class="flex-1">
                <slot />
             </div>
          </div>

          <!-- status bar -->
           <div>Status bar</div>
    </div>
</template>