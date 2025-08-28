import type { IFileSearchService } from '@/domain/interfaces/IFileServices'
import type { FileState } from '../state/FileState'
import type { ApplicationFileService } from '@/application/services/ApplicationFileService'
import type { FileDto, SearchFileParams } from '@/application/dto/FileDto'

export class FileSearchActions {
  constructor(
    private state: FileState,
    private fileSearchService: IFileSearchService,
  ) {}

  async searchFiles(query: string): Promise<FileDto[]> {
    this.state.isSearching.value = true
    this.state.fileError.value = null

    try {
      const files = await this.fileSearchService.searchFiles(query)
      this.state.searchResults.value = files
      this.state.searchQuery.value = query
      this.state.isSearchMode.value = true
      return files
    } catch (error) {
      this.state.fileError.value = error instanceof Error ? error.message : 'Failed to search files'
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
