import type { FolderEntity } from "../entities/FolderEntity";
import type { FolderHierarchy } from "../entities/FolderHierarchy";
import type { IFolderRepository } from "../repositories/IFolderRepository";

export class GetFolderByIdUseCase {
    constructor(private readonly folderRepository: IFolderRepository) {}

    async execute(id: string): Promise<FolderEntity | null>{
        try {
            return await this.folderRepository.getById(id);
        } catch (error) {
            throw new Error(`Failed to get folder by id: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}