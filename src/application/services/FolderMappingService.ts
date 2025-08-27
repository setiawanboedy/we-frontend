import { FolderEntity } from "@/domain/entities/FolderEntity";
import type { Folder } from "@/shared/types/explorer";

export class FolderMappingService {
static folderToEntity(folder: Folder): FolderEntity {
    return FolderEntity.fromObject({
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parentId,
      size: folder.size,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    })
  }
}