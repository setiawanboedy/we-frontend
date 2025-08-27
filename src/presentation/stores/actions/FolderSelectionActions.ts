import type { IFolderDataService } from '@/domain/interfaces/IFolderServices'
import type { FolderState } from '../state/FolderState'

export class FolderSelectionActions {
  constructor(
    private state: FolderState,
    private loadingActions: IFolderDataService,
  ) {}

  async selectFolder(folderId: string, skipHistory = false): Promise<void> {
    if (this.state.isSearchMode.value) {
      this.clearSearch()
    }

    this.state.selectedFolderId.value = folderId

    if (this.state.folderHierarchy.value) {
      const folderNode = this.state.folderHierarchy.value.findById(folderId)
      if (folderNode) {
        this.state.currentPath.value = `This PC > ${folderNode.name}`
      }
    }

    await this.loadingActions.loadFolderChildren(folderId)
  }

  selectMainFolder(folderId: string): void {
    this.state.selectedMainFolderId.value = folderId
  }

  clearMainSelection(): void {
    this.state.selectedMainFolderId.value = null
  }

  private clearSearch(): void {
    this.state.searchQuery.value = ''
    this.state.searchResults.value = []
    this.state.isSearchMode.value = false
    this.state.isSearching.value = false
  }
}
