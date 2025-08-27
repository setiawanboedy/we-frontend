import type { CreateFolderRequest } from '@/application/dto/CreateFolderRequest'
import type { UpdateFolderRequest } from '@/application/dto/UpdateFolderRequest'
import type { FolderEntity } from '@/domain/entities/FolderEntity'
import type { IFolderRepository } from '@/domain/repositories/IFolderRepository'
import { folderApiService } from '../api/folderApi'
import { FolderMappingService } from '@/application/services/FolderMappingService'
import { FolderHierarchy } from '@/domain/entities/FolderHierarchy'

export class FolderRepository implements IFolderRepository {
  async getAllWithHierarchy(): Promise<FolderHierarchy> {
    const response = await folderApiService.getAllFolders()

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get folder hierarchy')
    }
    const nodes = response.data.map((folder) =>
      FolderMappingService.folderWithChildrenToNode(folder),
    )
    return new FolderHierarchy(nodes)
  }
  async getById(id: string): Promise<FolderEntity | null> {
    const response = await folderApiService.getFolderById(id)

    if (!response.success) {
      if (response.error?.includes('not found')) {
        return null
      }
      throw new Error(response.error || 'Failed to get folder')
    }
    return response.data ? FolderMappingService.folderToEntity(response.data) : null
  }
  async getRoots(): Promise<FolderEntity[]> {
    const response = await folderApiService.getRootFolders()
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get root folders')
    }

    return response.data.map((folder) => FolderMappingService.folderToEntity(folder))
  }
  async getChildren(parentId: string): Promise<FolderEntity[]> {
    const response = await folderApiService.getFolderChildren(parentId)

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get folder children')
    }

    return response.data.map((folder) => FolderMappingService.folderToEntity(folder))
  }
  async create(data: CreateFolderRequest): Promise<FolderEntity> {
    const response = await folderApiService.createFolder({
      name: data.name,
      path: data.path,
      parentId: data.parentId || undefined,
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create folder')
    }

    return FolderMappingService.folderToEntity(response.data)
  }
  async update(id: string, data: UpdateFolderRequest): Promise<FolderEntity> {
    const response = await folderApiService.updateFolder(id, {
      name: data.name,
      path: data.path,
      parentId: data.parentId === null ? undefined : data.parentId,
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update folder')
    }

    return FolderMappingService.folderToEntity(response.data)
  }
  async delete(id: string): Promise<void> {
    const response = await folderApiService.deleteFolder(id)

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete folder')
    }
  }
  async exists(id: string): Promise<boolean> {
    try {
      const folder = await this.getById(id)
      return folder !== null
    } catch {
      return false
    }
  }
}
