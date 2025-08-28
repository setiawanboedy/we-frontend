import type { IFileRepository } from '../repositories/IFileRepository'

export class DeleteFileUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error('File ID is required')
    }

    try {
      const existingFile = await this.fileRepository.getById(id)
      if (!existingFile) {
        throw new Error('File not found')
      }


      await this.fileRepository.delete(id)
    } catch (error) {
      throw new Error(
        `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
