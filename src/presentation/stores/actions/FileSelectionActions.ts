import type { IFileDataService } from '@/domain/interfaces/IFileServices'
import type { FileState } from '../state/FileState'

export class FileSelectionActions {
  constructor(
    private state: FileState,
    private loadingActions: IFileDataService,
  ) {}

  async selectFile(fileId: string): Promise<void> {
    if (this.state.isSearchMode.value) {
      this.clearSearch()
    }

    this.state.selectedFileId.value = fileId
    this.state.selectedFileIds.value = [fileId]
  }

  selectFileLocal(fileId: string): void {
    this.state.selectedFileId.value = fileId
    this.state.selectedFileIds.value = [fileId]
  }

  clearFileSelection(): void {
    this.state.selectedFileId.value = null
    this.state.selectedFileIds.value = []
  }

  toggleFileSelection(fileId: string): void {
    const index = this.state.selectedFileIds.value.indexOf(fileId)
    if (index === -1) {
      this.state.selectedFileIds.value.push(fileId)
    } else {
      this.state.selectedFileIds.value.splice(index, 1)
    }

    if (this.state.selectedFileIds.value.length === 1) {
      this.state.selectedFileId.value = this.state.selectedFileIds.value[0]
    } else {
      this.state.selectedFileId.value = null
    }
  }

  clearSearch(): void {
    this.state.searchQuery.value = ''
    this.state.searchResults.value = []
    this.state.isSearchMode.value = false
  }
}
