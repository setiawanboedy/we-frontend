import { FolderEntity } from '@/domain/entities/FolderEntity'
import { FolderNode } from '@/domain/entities/FolderHierarchy'
import type { Folder, FolderWithChildren } from '@/shared/types/explorer'

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

  static folderWithChildrenToNode(folderChild: FolderWithChildren): FolderNode {
    const children = folderChild.children.map((child) => this.folderWithChildrenToNode(child));

    return new FolderNode(
        folderChild.id,
        folderChild.name,
        folderChild.path,
        folderChild.parentId,
        folderChild.size,
        children,
    )
  }
}
