import type { IFolderDataService, INavigationHistoryService } from '@/domain/interfaces/IFolderServices'
import type { FolderState } from '../state/FolderState'

export class FolderSelectionActions {
  constructor(
    private state: FolderState,
    private loadingActions: IFolderDataService,
    private navigationService: INavigationHistoryService,
  ) {}

  async selectFolder(folderId: string, skipHistory = false): Promise<void> {
    if (this.state.isSearchMode.value) {
      this.clearSearch()
    }

    if (!skipHistory) {
      this.addToHistory(folderId)
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

    async navigateBack(): Promise<void> {
    if (this.state.currentHistoryIndex.value > 0) {
      this.state.currentHistoryIndex.value--
      const folderId = this.state.navigationHistory.value[this.state.currentHistoryIndex.value]
      if (folderId) {
        await this.selectFolder(folderId, true) 
      }
    }
  }

  async navigateForward(): Promise<void> {
    if (this.state.currentHistoryIndex.value < this.state.navigationHistory.value.length - 1) {
      this.state.currentHistoryIndex.value++
      const folderId = this.state.navigationHistory.value[this.state.currentHistoryIndex.value]
      if (folderId) {
        await this.selectFolder(folderId, true)
      }
    }
  }

  private addToHistory(folderId: string): void {
    const lastFolderId = this.state.navigationHistory.value[this.state.currentHistoryIndex.value]
    if (lastFolderId !== folderId) {
      this.state.navigationHistory.value = this.state.navigationHistory.value.slice(
        0,
        this.state.currentHistoryIndex.value + 1,
      )

      this.state.navigationHistory.value.push(folderId)
      this.state.currentHistoryIndex.value = this.state.navigationHistory.value.length - 1

      this.navigationService.addToHistory(folderId)
    }
  }

  private clearSearch(): void {
    this.state.searchQuery.value = ''
    this.state.searchResults.value = []
    this.state.isSearchMode.value = false
    this.state.isSearching.value = false
  }
}
