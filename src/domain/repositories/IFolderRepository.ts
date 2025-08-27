import type { CreateFolderRequest } from "@/application/dto/CreateFolderRequest";
import type { FolderEntity } from "../entities/FolderEntity";
import type { UpdateFolderRequest } from "@/application/dto/UpdateFolderRequest";

export interface IFolderRepository {
    // getAllFolders(): Promise<>

    getById(id: string): Promise<FolderEntity | null>;

    getRoots(): Promise<FolderEntity[]>;

    getChildren(parentId: string): Promise<FolderEntity[]>;

    create(data: CreateFolderRequest): Promise<FolderEntity>;

    update(id: string, data: UpdateFolderRequest): Promise<FolderEntity>;

    delete(id: string): Promise<void>;

    exists(id: string): Promise<boolean>;

    
}