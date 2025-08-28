import type { CreateFileRequest, SearchFileParams } from '@/application/dto/FileDto'
import type { FileEntity } from '../entities/FileEntity'
import type { UpdateFileRequest } from '@/application/dto/FileDto'

export interface IFileRepository {
  getByFolderId(folderId: string): Promise<FileEntity[]>

  getById(id: string): Promise<FileEntity | null>

  create(data: CreateFileRequest): Promise<FileEntity>

  update(id: string, data: UpdateFileRequest): Promise<FileEntity>

  delete(id: string): Promise<void>

  exists(id: string): Promise<boolean>

  search(query: SearchFileParams): Promise<FileEntity[]>
}
