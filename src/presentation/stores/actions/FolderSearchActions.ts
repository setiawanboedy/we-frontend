import type { ISearchService } from '@/domain/interfaces/IFolderServices'
import type { FolderState } from '../state/FolderState'

export class FolderSearchActions {
  constructor(
    private state: FolderState,
    private searchService: ISearchService,
  ) {}

  async searchFolders(query: string): Promise<void> {
    this.state.searchQuery.value = this.searchService.normalizeQuery(query)

    if (!this.searchService.isValidQuery(this.state.searchQuery.value)) {
      this.state.isSearchMode.value = false
      this.state.searchResults.value = []
      return
    }

    this.state.isSearching.value = true
    this.state.isSearchMode.value = true

    try {
      const results = this.searchService.searchInFolderTree(
        this.state.sidebarFolders.value,
        this.state.searchQuery.value,
      )
      this.state.searchResults.value = results
    } catch (error) {
      this.state.searchResults.value = []
    } finally {
      this.state.isSearching.value = false
    }
  }

  clearSearch(): void {
    this.state.searchQuery.value = ''
    this.state.searchResults.value = []
    this.state.isSearchMode.value = false
    this.state.isSearching.value = false
  }
}
