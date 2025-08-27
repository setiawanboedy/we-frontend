import type { FolderHierarchy } from '@/domain/entities/FolderHierarchy'
import type { FolderItem } from '@/shared/types/explorer'
import { ref } from 'vue'

export class FolderState {
  readonly sidebarFolders = ref<FolderItem[]>([])
  readonly folderHierarchy = ref<FolderHierarchy | null>(null)
  readonly currentFolderChildren = ref<FolderItem[]>([])
  readonly selectedFolderId = ref<string | null>(null)
  readonly currentPath = ref<string>('')
  readonly selectedMainFolderId = ref<string | null>(null)

  readonly navigationHistory = ref<string[]>([])
  readonly currentHistoryIndex = ref<number>(-1)

  readonly searchQuery = ref<string>('')
  readonly searchResults = ref<FolderItem[]>([])
  readonly isSearchMode = ref<boolean>(false)
  readonly isSearching = ref<boolean>(false)

  readonly isLoadingSidebar = ref(false)
  readonly isLoadingChildren = ref(false)

  readonly sidebarError = ref<string | null>(null)
  readonly childrenError = ref<string | null>(null)

  reset(): void {
    this.sidebarFolders.value = []
    this.folderHierarchy.value = null
    this.currentFolderChildren.value = []
    this.selectedFolderId.value = null
    this.currentPath.value = ''
    this.selectedMainFolderId.value = null
    this.navigationHistory.value = []
    this.currentHistoryIndex.value = -1
    this.searchQuery.value = ''
    this.searchResults.value = []
    this.isSearchMode.value = false
    this.isSearching.value = false
    this.isLoadingSidebar.value = false
    this.isLoadingChildren.value = false
    this.sidebarError.value = null
    this.childrenError.value = null
  }
}
