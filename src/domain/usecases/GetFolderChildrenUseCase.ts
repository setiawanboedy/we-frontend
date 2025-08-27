import type { FolderEntity } from "../entities/FolderEntity";
import type { FolderHierarchy } from "../entities/FolderHierarchy";
import type { IFolderRepository } from "../repositories/IFolderRepository";

export class GetFolderChildrenUseCase {
    constructor(private readonly folderRepository: IFolderRepository) {}

    async execute(folderId: string): Promise<FolderEntity[]>{
        if (!folderId || folderId.trim().length === 0) {
            throw new Error('Folder ID is required');
        }
        try {
            const folderExists = await this.folderRepository.exists(folderId);
            if (!folderExists) {
                throw new Error(`Folder with ID ${folderId} not found`);
            }
            return await this.folderRepository.getChildren(folderId);
        } catch (error) {
            throw new Error(`Failed to get folder children: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

}