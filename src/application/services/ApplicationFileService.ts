import type { IFileRepository } from '@/domain/repositories/IFileRepository'
import type {
  FileDto,
  CreateFileRequest,
  UpdateFileRequest,
  FileWithContentDto,
  SearchFileParams,
} from '../dto/FileDto'

export class ApplicationFileService {
  constructor(private fileRepository: IFileRepository) {}

  async getFilesByFolder(folderId: string): Promise<FileDto[]> {
    try {
      const files = await this.fileRepository.getByFolderId(folderId)
      return files.map((file) => ({
        id: file.id,
        name: file.name,
        path: file.path,
        folderId: file.folderId,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
      }))
    } catch (error) {
      throw new Error(
        `Failed to get files by folder: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async getFile(fileId: string): Promise<FileWithContentDto> {
    try {
      const file = await this.fileRepository.getById(fileId)
      if (!file) {
        throw new Error('File not found')
      }

      // For now, return without content - this would need to be implemented
      // based on how file content is stored/retrieved
      return {
        id: file.id,
        name: file.name,
        path: file.path,
        folderId: file.folderId,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
        content: '', // TODO: Implement content retrieval
      }
    } catch (error) {
      throw new Error(
        `Failed to get file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async createFile(request: CreateFileRequest): Promise<FileDto> {
    try {
      const fileEntity = await this.fileRepository.create(request)
      return {
        id: fileEntity.id,
        name: fileEntity.name,
        path: fileEntity.path,
        folderId: fileEntity.folderId,
        size: fileEntity.size,
        mimeType: fileEntity.mimeType,
        createdAt: fileEntity.createdAt.toISOString(),
        updatedAt: fileEntity.updatedAt.toISOString(),
      }
    } catch (error) {
      throw new Error(
        `Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async updateFile(id: string, request: UpdateFileRequest): Promise<FileDto> {
    try {
      const fileEntity = await this.fileRepository.update(id, request)
      return {
        id: fileEntity.id,
        name: fileEntity.name,
        path: fileEntity.path,
        folderId: fileEntity.folderId,
        size: fileEntity.size,
        mimeType: fileEntity.mimeType,
        createdAt: fileEntity.createdAt.toISOString(),
        updatedAt: fileEntity.updatedAt.toISOString(),
      }
    } catch (error) {
      throw new Error(
        `Failed to update file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.fileRepository.delete(fileId)
    } catch (error) {
      throw new Error(
        `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async searchFiles(query: SearchFileParams): Promise<FileDto[]> {
    try {
      const files = await this.fileRepository.search(query)
      return files.map((file) => ({
        id: file.id,
        name: file.name,
        path: file.path,
        folderId: file.folderId,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
      }))
    } catch (error) {
      throw new Error(
        `Failed to search files: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
