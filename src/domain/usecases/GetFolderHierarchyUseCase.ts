import type { FolderHierarchy } from "../entities/FolderHierarchy";
import type { IFolderRepository } from "../repositories/IFolderRepository";

export class GetFolderHierarchyUseCase {
    constructor(private readonly folderRepository: IFolderRepository) {}

    async execute(): Promise<FolderHierarchy>{
        try {
            return await this.folderRepository.getAllWithHierarchy();
        } catch (error) {
            throw new Error(`Failed to get folder hierarchy: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}