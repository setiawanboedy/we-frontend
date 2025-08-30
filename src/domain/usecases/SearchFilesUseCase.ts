import type { SearchFileParams } from '@/application/dto/FileDto'
import type { FileEntity } from '../entities/FileEntity'
import type { IFileRepository } from '../repositories/IFileRepository'

export class SearchFilesUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(params: SearchFileParams): Promise<FileEntity[]> {
    // Validation
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
      return await this.fileRepository.search(params)
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
