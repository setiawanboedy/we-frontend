import { FileEntity } from '../entities/FileEntity'
import type { IFileRepository } from '../repositories/IFileRepository'

export class GetFilesByFolderUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(folderId: string): Promise<FileEntity[]> {
    if (!folderId || folderId.trim().length === 0) {
      throw new Error('Folder ID is required')
    }

    try {
      return await this.fileRepository.getByFolderId(folderId)
    } catch (error) {
      throw new Error(
        `Failed to get files by folder: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
