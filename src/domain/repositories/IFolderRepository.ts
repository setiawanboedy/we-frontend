import type { CreateFolderRequest } from '@/application/dto/CreateFolderRequest'
import type { FolderEntity } from '../entities/FolderEntity'
import type { UpdateFolderRequest } from '@/application/dto/UpdateFolderRequest'
import type { FolderHierarchy } from '../entities/FolderHierarchy'

export interface IFolderRepository {
  getAllWithHierarchy(): Promise<FolderHierarchy>

  getById(id: string): Promise<FolderEntity | null>

  getRoots(): Promise<FolderEntity[]>

  getChildren(parentId: string): Promise<FolderEntity[]>

  create(data: CreateFolderRequest): Promise<FolderEntity>

  update(id: string, data: UpdateFolderRequest): Promise<FolderEntity>

  delete(id: string): Promise<void>

  exists(id: string): Promise<boolean>
}
