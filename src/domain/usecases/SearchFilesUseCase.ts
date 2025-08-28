import type { FileEntity } from '../entities/FileEntity'
import type { IFileRepository } from '../repositories/IFileRepository'

export interface SearchFilesRequest {
  name?: string
  folderId?: string
  mimeType?: string
  limit?: number
  offset?: number
}

export class SearchFilesUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(request: SearchFilesRequest): Promise<FileEntity[]> {
    // Validation
    if (request.limit !== undefined && request.limit < 0) {
      throw new Error('Limit cannot be negative')
    }

    if (request.offset !== undefined && request.offset < 0) {
      throw new Error('Offset cannot be negative')
    }

    // Set defaults
    const searchParams = {
      name: request.name?.trim() || '',
      folderId: request.folderId,
      mimeType: request.mimeType,
      limit: request.limit ?? 50,
      offset: request.offset ?? 0,
    }

    try {
      return await this.fileRepository.search(searchParams)
    } catch (error) {
      throw new Error(
        `Failed to search files: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
