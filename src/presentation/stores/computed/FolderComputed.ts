import { computed } from 'vue'
import type { FolderState } from '../state/FolderState'
import { FolderConverters } from '../converters/FolderConverters'

export class FolderComputed {
  constructor(private state: FolderState) {}

  readonly selectedFolder = computed(() => {
    if (!this.state.selectedFolderId.value || !this.state.folderHierarchy.value) return null
    const folderNode = this.state.folderHierarchy.value.findById(this.state.selectedFolderId.value)
    return folderNode ? FolderConverters.convertFolderNodeToUI(folderNode) : null
  })

  readonly breadcrumbPath = computed(() => {
    if (!this.selectedFolder.value || !this.state.folderHierarchy.value) return ['This PC']

    const pathArray = this.state.folderHierarchy.value.getPathToNode(
      this.state.selectedFolderId.value!,
    )
    return pathArray
  })

  readonly displayedFolders = computed(() => {
    if (this.state.isSearchMode.value) {
      return this.state.searchResults.value
    }
    return this.state.currentFolderChildren.value
  })

  readonly canGoBack = computed(() => {
    return this.state.currentHistoryIndex.value > 0
  })

  readonly canGoForward = computed(() => {
    return this.state.currentHistoryIndex.value < this.state.navigationHistory.value.length - 1
  })
}
