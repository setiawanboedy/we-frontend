import type { FileDto, SearchFileParams } from '../dto/FileDto'
import type { IFileSearchService } from '@/domain/interfaces/IFileServices'
import { fileApiService } from '@/infrastructure/api/fileApi'

export class FileSearchService implements IFileSearchService {
  async searchFiles(query: string, folderId?: string): Promise<FileDto[]> {
    if (!this.isValidQuery(query)) {
      return []
    }

    try {
      const searchParams: SearchFileParams = {
        name: query,
        limit: 100, // Default limit
        offset: 0, // Default offset
      }

      const response = await fileApiService.searchFiles(searchParams)

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to search files')
      }

      // If folderId is provided, filter results to that folder
      let results = response.data
      if (folderId) {
        results = results.filter((file) => file.folderId === folderId)
      }

      return results
    } catch (error) {
      throw new Error(
        `Failed to search files: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  isValidQuery(query: string): boolean {
    return query.length >= 1 && query.length <= 100
  }
}

export const fileSearchService = new FileSearchService()
