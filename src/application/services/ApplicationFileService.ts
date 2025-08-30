import type {
  FileDto,
  CreateFileRequest,
  UpdateFileRequest,
  SearchFileParams,
} from '../dto/FileDto'
import type { GetFilesByFolderUseCase } from '../../domain/usecases/GetFilesByFolderUseCase'
import type { CreateFileUseCase } from '../../domain/usecases/CreateFileUseCase'
import type { UpdateFileUseCase } from '../../domain/usecases/UpdateFileUseCase'
import type { DeleteFileUseCase } from '../../domain/usecases/DeleteFileUseCase'
import type { SearchFilesUseCase } from '../../domain/usecases/SearchFilesUseCase'
import type { GetFileByIdUseCase } from '../../domain/usecases/GetFileByIdUseCase'
import { FileMappingService } from './FileMappingService'

export class ApplicationFileService {
  constructor(
    private readonly getFilesByFolderUseCase: GetFilesByFolderUseCase,
    private readonly createFileUseCase: CreateFileUseCase,
    private readonly updateFileUseCase: UpdateFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly searchFilesUseCase: SearchFilesUseCase,
    private readonly getFileByIdUseCase: GetFileByIdUseCase,
  ) {}

  async getFilesByFolder(folderId: string): Promise<FileDto[]> {
    try {
      const files = await this.getFilesByFolderUseCase.execute(folderId)
      return FileMappingService.entitiesToDtos(files)
    } catch (error) {
      throw new Error(
        `Failed to get files by folder: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async getFile(fileId: string): Promise<FileDto> {
    try {
      const file = await this.getFileByIdUseCase.execute(fileId)
      if (!file) {
        throw new Error('File not found')
      }

      const fileDto = FileMappingService.toDto(file)
      return {
        ...fileDto,
      }
    } catch (error) {
      throw new Error(
        `Failed to get file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async createFile(request: CreateFileRequest): Promise<FileDto> {
    try {
      const createRequest = {
        name: request.name,
        path: request.path,
        folderId: request.folderId,
        size: request.size || 0,
        mimeType: request.mimeType || 'application/octet-stream',
      }

      const fileEntity = await this.createFileUseCase.execute(createRequest)
      return FileMappingService.toDto(fileEntity)
    } catch (error) {
      throw new Error(
        `Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async updateFile(id: string, request: UpdateFileRequest): Promise<FileDto> {
    try {

      const fileEntity = await this.updateFileUseCase.execute(id, request)
      return FileMappingService.toDto(fileEntity)
    } catch (error) {
      throw new Error(
        `Failed to update file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.deleteFileUseCase.execute(fileId)
    } catch (error) {
      throw new Error(
        `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async searchFiles(query: SearchFileParams): Promise<FileDto[]> {
    try {
      const files = await this.searchFilesUseCase.execute(query)
      return FileMappingService.entitiesToDtos(files)
    } catch (error) {
      throw new Error(
        `Failed to search files: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
