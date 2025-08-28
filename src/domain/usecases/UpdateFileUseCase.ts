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
    if (!id || id.trim().length === 0) {
      throw new Error('File ID is required')
    }

    if (!request || Object.keys(request).length === 0) {
      throw new Error('At least one field must be provided for update')
    }

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

    if (request.path !== undefined && !request.path) {
      throw new Error('File path cannot be empty')
    }

    try {
      const existingFile = await this.fileRepository.getById(id)
      if (!existingFile) {
        throw new Error('File not found')
      }


      return await this.fileRepository.update(id, request)
    } catch (error) {
      throw new Error(
        `Failed to update file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
