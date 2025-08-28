import type { IFolderRepository } from "../repositories/IFolderRepository";
import type { FolderEntity } from "../entities/FolderEntity";
import type { CreateFolderRequest } from "@/application/dto/FolderDto";

export class CreateFolderUseCase {
    constructor(private readonly folderRepository: IFolderRepository) {}

    async execute(request: CreateFolderRequest): Promise<FolderEntity>{
        this.validateRequest(request);
        try {
            if (request.parentId) {
                const parentExists = await this.folderRepository.exists(request.parentId);
                if (!parentExists) {
                    throw new Error(`Parent folder with ID ${request.parentId} not found`);
                }
            }
            
            return await this.folderRepository.create(request);
        } catch (error) {
            throw new Error(`Failed to get folder hierarchy: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private validateRequest(request: CreateFolderRequest): void {
        if (!request.name || request.name.trim().length === 0) {
            throw new Error('Folder name is required');
        }

        if (!request.path || request.path.trim().length === 0) {
            throw new Error('Folder path is required');
        }
    }
}