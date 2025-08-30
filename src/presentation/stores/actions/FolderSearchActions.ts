import type { FolderState } from '../state/FolderState'
import type { FolderDto, SearchFolderParams } from '@/application/dto/FolderDto'
import type { ApplicationFolderService } from '@/application/services/ApplicationFolderService'
import { FolderMappingService } from '@/application/services/FolderMappingService'
import type { FolderItem } from '@/shared/types/explorer'
import { convertFolderToUI } from '@/shared/utils/folderHelpers'

export class FolderSearchActions {
  constructor(
    private state: FolderState,
    private appFolderService: ApplicationFolderService,
  ) {}

  async searchFolders(query: string): Promise<FolderDto[]> {
    this.state.isSearching.value = true
    this.state.folderError.value = null

    try {
      const queryParams: SearchFolderParams = {
        name: query,
        limit: 10,
        offset: 0
      }
      
      const folders = await this.appFolderService.searchFolders(queryParams)
      
      this.state.searchResults.value = folders.map(convertFolderToUI)
      this.state.searchQuery.value = query
      this.state.isSearchMode.value = true
      return folders
    } catch (error) {
      this.state.folderError.value = error instanceof Error ? error.message : 'Failed to search folders'
      throw error
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
