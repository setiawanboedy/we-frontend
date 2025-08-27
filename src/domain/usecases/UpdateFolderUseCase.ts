import type { IFolderRepository } from '../repositories/IFolderRepository'
import type { FolderEntity } from '../entities/FolderEntity'
import type { UpdateFolderRequest } from '@/application/dto/UpdateFolderRequest'

export class UpdateFolderUseCase {
  private folderRepository: IFolderRepository

  constructor(folderRepository: IFolderRepository) {
    this.folderRepository = folderRepository
  }

  async execute(id: string, data: UpdateFolderRequest): Promise<FolderEntity> {
    return this.folderRepository.update(id, data)
  }
}
