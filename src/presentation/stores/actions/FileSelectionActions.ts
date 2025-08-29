import type { FileState } from '../state/FileState'

export class FileSelectionActions {
  constructor(
    private state: FileState,
  ) {}

  async selectFile(fileId: string): Promise<void> {
    if (this.state.isSearchMode.value) {
      this.clearSearch()
    }

    this.state.selectedFileId.value = fileId
  }

  selectFileLocal(fileId: string): void {
    this.state.selectedFileId.value = fileId
  }

  clearFileSelection(): void {
    this.state.selectedFileId.value = null
  }

  toggleFileSelection(fileId: string): void {
    this.state.selectedFileId.value = fileId
  }

  clearSearch(): void {
    this.state.searchQuery.value = ''
    this.state.searchResults.value = []
    this.state.isSearchMode.value = false
  }
}
