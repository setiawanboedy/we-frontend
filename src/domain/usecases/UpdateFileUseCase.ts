import { FileEntity } from '../entities/FileEntity'
import type { IFileRepository } from '../repositories/IFileRepository'

export interface UpdateFileRequest {
  name?: string
  path?: string
  size?: number
  mimeType?: string
}

export class UpdateFileUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(id: string, request: UpdateFileRequest): Promise<FileEntity> {
    // Validation
    if (!id || id.trim().length === 0) {
      throw new Error('File ID is required')
    }

    if (!request || Object.keys(request).length === 0) {
      throw new Error('At least one field must be provided for update')
    }

    // Validate name if provided
    if (request.name !== undefined) {
      if (!request.name || request.name.trim().length === 0) {
        throw new Error('File name cannot be empty')
      }

      const maxFileNameLength = 255
      if (request.name.length > maxFileNameLength) {
        throw new Error(`File name cannot exceed ${maxFileNameLength} characters`)
      }

      const forbiddenChars = /[<>:"/\\|?*]/
      if (forbiddenChars.test(request.name)) {
        throw new Error('File name contains forbidden characters')
      }
    }

    // Validate path if provided
    if (request.path !== undefined && !request.path) {
      throw new Error('File path cannot be empty')
    }

    // Validate size if provided
    if (request.size !== undefined && request.size < 0) {
      throw new Error('File size cannot be negative')
    }

    // Validate mimeType if provided
    if (request.mimeType !== undefined && !request.mimeType) {
      throw new Error('MIME type cannot be empty')
    }

    try {
      // Get existing file
      const existingFile = await this.fileRepository.getById(id)
      if (!existingFile) {
        throw new Error('File not found')
      }

      // Create updated file entity
      const updatedFile = new FileEntity(
        existingFile.id,
        request.name?.trim() ?? existingFile.name,
        request.path ?? existingFile.path,
        existingFile.folderId,
        request.size ?? existingFile.size,
        request.mimeType ?? existingFile.mimeType,
        existingFile.createdAt,
        new Date(), // Update timestamp
      )

      return await this.fileRepository.update(id, updatedFile)
    } catch (error) {
      throw new Error(
        `Failed to update file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
