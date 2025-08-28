import { FileEntity } from '../entities/FileEntity'
import type { IFileRepository } from '../repositories/IFileRepository'

export interface CreateFileRequest {
  name: string
  path: string
  folderId: string
  size: number
  mimeType: string
}

export class CreateFileUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(request: CreateFileRequest): Promise<FileEntity> {
    if (!request.name || request.name.trim().length === 0) {
      throw new Error('File name is required')
    }

    if (!request.path) {
      throw new Error('File path is required')
    }

    if (!request.folderId) {
      throw new Error('Folder ID is required')
    }

    if (request.size < 0) {
      throw new Error('File size cannot be negative')
    }

    if (!request.mimeType) {
      throw new Error('MIME type is required')
    }

    const maxFileNameLength = 255
    if (request.name.length > maxFileNameLength) {
      throw new Error(`File name cannot exceed ${maxFileNameLength} characters`)
    }

    const forbiddenChars = /[<>:"/\\|?*]/
    if (forbiddenChars.test(request.name)) {
      throw new Error('File name contains forbidden characters')
    }

    try {
      const fileEntity = new FileEntity(
        '',
        request.name.trim(),
        request.path,
        request.folderId,
        request.size,
        request.mimeType,
        new Date(),
        new Date(),
      )

      return await this.fileRepository.create(fileEntity)
    } catch (error) {
      throw new Error(
        `Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
