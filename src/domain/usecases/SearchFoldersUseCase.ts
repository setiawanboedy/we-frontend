import type { SearchFolderParams } from '@/application/dto/FolderDto'
import type { IFolderRepository } from '../repositories/IFolderRepository'
import type { FolderEntity } from '../entities/FolderEntity'


export class SearchFoldersUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(params: SearchFolderParams): Promise<FolderEntity[]> {
    if (!params.name && !this.isValidQuery(params.name)) {
      return []
    }
    if (params.limit !== undefined && params.limit < 0) {
      throw new Error('Limit cannot be negative')
    }
    
    if (params.offset !== undefined && params.offset < 0) {
      throw new Error('Offset cannot be negative')
    }
    
    try {
      return await this.folderRepository.search(params)
    } catch (error) {
      throw new Error(
        `Failed to search files: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  private isValidQuery(query?: string): boolean {
    if (!query) {
      return false
    }
    return query.length >= 1 && query.length <= 100
  }
}
