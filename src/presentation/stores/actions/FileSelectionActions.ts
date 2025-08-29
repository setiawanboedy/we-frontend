import type { FileState } from '../state/FileState'

export class FileSelectionActions {
  constructor(
    private state: FileState,
  ) {}

  selectFile(fileId: string): void {
    this.state.selectedFileId.value = fileId
  }

  clearFileSelection(): void {
    this.state.selectedFileId.value = null
  }

  clearSearch(): void {
    this.state.searchQuery.value = ''
    this.state.searchResults.value = []
    this.state.isSearchMode.value = false
  }
}
