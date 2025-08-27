import type { IFolderRepository } from '@/domain/repositories/IFolderRepository'
import { CreateFolderUseCase } from '@/domain/usecases/CreateFolderUseCase'
import { DeleteFolderUseCase } from '@/domain/usecases/DeleteFolderUseCase'
import { GetFolderChildrenUseCase } from '@/domain/usecases/GetFolderChildrenUseCase'
import { GetFolderHierarchyUseCase } from '@/domain/usecases/GetFolderHierarchyUseCase'
import { UpdateFolderUseCase } from '@/domain/usecases/UpdateFolderUseCase'
import { FolderMappingService } from './FolderMappingService'
import type { FolderDto, FolderWithChildrenDto } from '../dto/FolderDto'
import type { CreateFolderRequest } from '../dto/CreateFolderRequest'

export class ApplicationService {
  private getFolderHierarchyUseCase: GetFolderHierarchyUseCase
  private getFolderChildrenUseCase: GetFolderChildrenUseCase
  private createFolderUseCase: CreateFolderUseCase
  private deleteFolderUseCase: DeleteFolderUseCase
  private updateFolderUseCase: UpdateFolderUseCase

  constructor(folderRepository: IFolderRepository) {
    this.getFolderHierarchyUseCase = new GetFolderHierarchyUseCase(folderRepository)
    this.getFolderChildrenUseCase = new GetFolderChildrenUseCase(folderRepository)
    this.createFolderUseCase = new CreateFolderUseCase(folderRepository)
    this.deleteFolderUseCase = new DeleteFolderUseCase(folderRepository)
    this.updateFolderUseCase = new UpdateFolderUseCase(folderRepository)
  }

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
