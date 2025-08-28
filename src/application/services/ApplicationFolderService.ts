import type { CreateFolderUseCase } from '@/domain/usecases/CreateFolderUseCase'
import type { DeleteFolderUseCase } from '@/domain/usecases/DeleteFolderUseCase'
import type { GetFolderChildrenUseCase } from '@/domain/usecases/GetFolderChildrenUseCase'
import type { GetFolderHierarchyUseCase } from '@/domain/usecases/GetFolderHierarchyUseCase'
import type { UpdateFolderUseCase } from '@/domain/usecases/UpdateFolderUseCase'
import { FolderMappingService } from './FolderMappingService'
import type { CreateFolderRequest, FolderDto, FolderWithChildrenDto } from '../dto/FolderDto'

export class ApplicationFolderService {
  constructor(
    private readonly getFolderHierarchyUseCase: GetFolderHierarchyUseCase,
    private readonly getFolderChildrenUseCase: GetFolderChildrenUseCase,
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
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

  async updateFolder(id: string, data: { name: string }): Promise<FolderDto> {
    try {
      const folderEntity = await this.updateFolderUseCase.execute(id, { name: data.name })
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
}
