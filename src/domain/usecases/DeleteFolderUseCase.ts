import type { IFolderRepository } from '../repositories/IFolderRepository';

export class DeleteFolderUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(folderId: string): Promise<void> {
    if (!folderId || folderId.trim().length === 0) {
      throw new Error('Folder ID is required');
    }

    try {
      const folderExists = await this.folderRepository.exists(folderId);
      if (!folderExists) {
        throw new Error(`Folder with ID ${folderId} not found`);
      }

      await this.folderRepository.delete(folderId);
    } catch (error) {
      throw new Error(`Failed to delete folder: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
