import type { IFileRepository } from '../repositories/IFileRepository'

export class DeleteFileUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(id: string): Promise<void> {
    // Validation
    if (!id || id.trim().length === 0) {
      throw new Error('File ID is required')
    }

    try {
      // Check if file exists
      const existingFile = await this.fileRepository.getById(id)
      if (!existingFile) {
        throw new Error('File not found')
      }

      // Perform business rule checks if needed
      // For example, check if file is in use, has permissions, etc.

      await this.fileRepository.delete(id)
    } catch (error) {
      throw new Error(
        `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
