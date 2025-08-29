import type { CreateFolderUseCase } from '@/domain/usecases/CreateFolderUseCase'
import type { DeleteFolderUseCase } from '@/domain/usecases/DeleteFolderUseCase'
import type { GetFolderChildrenUseCase } from '@/domain/usecases/GetFolderChildrenUseCase'
import type { GetFolderHierarchyUseCase } from '@/domain/usecases/GetFolderHierarchyUseCase'
import type { UpdateFolderUseCase } from '@/domain/usecases/UpdateFolderUseCase'
import { FolderMappingService } from './FolderMappingService'
import type { CreateFolderRequest, FolderDto, FolderWithChildrenDto, SearchFolderParams } from '../dto/FolderDto'
import type { GetFolderByIdUseCase } from '@/domain/usecases/GetFolderByIdUseCase'
import type { SearchFoldersUseCase } from '@/domain/usecases/SearchFoldersUseCase'
import { folderApiService } from '../../infrastructure/api/folderApi';
import type { UpdateFileRequest } from '../dto/FileDto'

export class ApplicationFolderService {
  constructor(
    private readonly getFolderHierarchyUseCase: GetFolderHierarchyUseCase,
    private readonly getFolderChildrenUseCase: GetFolderChildrenUseCase,
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
    private readonly getFolderByIDUsecase: GetFolderByIdUseCase,
    private readonly searchFolderUsecase: SearchFoldersUseCase,
  ) {}

  async getFolderHierarchy(): Promise<FolderWithChildrenDto[]> {
    try {
      const hierarchy = await this.getFolderHierarchyUseCase.execute()
      return FolderMappingService.hierarchyToDtos(hierarchy)
    } catch (error) {
      throw new Error(
        `Failed to get folder hierarchy: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async getFolderChildren(folderId: string): Promise<FolderDto[]> {
    try {
      const children = await this.getFolderChildrenUseCase.execute(folderId)
      return FolderMappingService.entitiesToDtos(children)
    } catch (error) {
      throw new Error(
        `Failed to get folder children: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async getFolderById(folderId: string): Promise<FolderDto | null> {
    try {
      const folderEntity = await this.getFolderByIDUsecase.execute(folderId)
      if (folderEntity) {
        
        return FolderMappingService.entityToDto(folderEntity)
      }
      return null
    } catch (error) {
      throw new Error(
        `Failed to get folder by id: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async createFolder(request: CreateFolderRequest): Promise<FolderDto> {
    try {
      const folderEntity = await this.createFolderUseCase.execute(request)
      return FolderMappingService.entityToDto(folderEntity)
    } catch (error) {
      throw new Error(
        `Failed to create folder: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async updateFolder(id: string, data: UpdateFileRequest): Promise<FolderDto> {
    try {
      const folderEntity = await this.updateFolderUseCase.execute(id, data)
      return FolderMappingService.entityToDto(folderEntity)
    } catch (error) {
      throw new Error(
        `Failed to update folder: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async deleteFolder(folderId: string): Promise<void> {
    
    try {
      await this.deleteFolderUseCase.execute(folderId)
    } catch (error) {
      throw new Error(
        `Failed to delete folder: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

    async searchFolders(params: SearchFolderParams): Promise<FolderDto[]> {
      try {
        const folders = await this.searchFolderUsecase.execute(params)
        return FolderMappingService.entitiesToDtos(folders)
      } catch (error) {
        throw new Error(
          `Failed to search files: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
      }
    }
}
