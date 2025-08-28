import type { FileEntity } from '../entities/FileEntity'
import type { IFileRepository } from '../repositories/IFileRepository'

export class GetFileByIdUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(id: string): Promise<FileEntity | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('File ID is required')
    }

    try {
      return await this.fileRepository.getById(id)
    } catch (error) {
      throw new Error(
        `Failed to get file by ID: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
