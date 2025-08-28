import type { CreateFileRequest, SearchFileParams } from '@/application/dto/FileDto'
import type { UpdateFileRequest } from '@/application/dto/FileDto'
import { FileEntity } from '@/domain/entities/FileEntity'
import type { IFileRepository } from '@/domain/repositories/IFileRepository'
import { fileApiService } from '../api/fileApi'

export class FileRepository implements IFileRepository {
  async getByFolderId(folderId: string): Promise<FileEntity[]> {
    const response = await fileApiService.getFilesByFolder(folderId)

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get files by folder')
    }

    return response.data.map((file) =>
      FileEntity.fromObject({
        id: file.id,
        name: file.name,
        path: file.path,
        folderId: file.folderId,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      }),
    )
  }

  async getById(id: string): Promise<FileEntity | null> {
    const response = await fileApiService.getFileById(id)

    if (!response.success) {
      if (response.error?.includes('not found')) {
        return null
      }
      throw new Error(response.error || 'Failed to get file')
    }

    if (!response.data) {
      return null
    }

    return FileEntity.fromObject({
      id: response.data.id,
      name: response.data.name,
      path: response.data.path,
      folderId: response.data.folderId,
      size: response.data.size,
      mimeType: response.data.mimeType,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
    })
  }

  async create(data: CreateFileRequest): Promise<FileEntity> {
    const response = await fileApiService.createFile({
      name: data.name,
      path: data.path,
      folderId: data.folderId,
      size: data.size,
      mimeType: data.mimeType,
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create file')
    }

    return FileEntity.fromObject({
      id: response.data.id,
      name: response.data.name,
      path: response.data.path,
      folderId: response.data.folderId,
      size: response.data.size,
      mimeType: response.data.mimeType,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
    })
  }

  async update(id: string, data: UpdateFileRequest): Promise<FileEntity> {
    const response = await fileApiService.updateFile(id, {
      name: data.name,
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update file')
    }

    return FileEntity.fromObject({
      id: response.data.id,
      name: response.data.name,
      path: response.data.path,
      folderId: response.data.folderId,
      size: response.data.size,
      mimeType: response.data.mimeType,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
    })
  }

  async delete(id: string): Promise<void> {
    const response = await fileApiService.deleteFile(id)

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete file')
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const file = await this.getById(id)
      return file !== null
    } catch {
      return false
    }
  }

  async search(query: SearchFileParams): Promise<FileEntity[]> {
    const response = await fileApiService.searchFiles(query)

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to search files')
    }

    return response.data.map((file) =>
      FileEntity.fromObject({
        id: file.id,
        name: file.name,
        path: file.path,
        folderId: file.folderId,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      }),
    )
  }
}
