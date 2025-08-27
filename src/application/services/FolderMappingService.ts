import { FolderEntity } from '@/domain/entities/FolderEntity'
import { FolderHierarchy, FolderNode } from '@/domain/entities/FolderHierarchy'
import type { Folder, FolderWithChildren } from '@/shared/types/explorer'
import type { FolderDto, FolderWithChildrenDto } from '../dto/FolderDto'

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
    const children = folderChild.children.map((child) => this.folderWithChildrenToNode(child))

    return new FolderNode(
      folderChild.id,
      folderChild.name,
      folderChild.path,
      folderChild.parentId,
      folderChild.size,
      children,
    )
  }

  static entityToDto(entity: FolderEntity): FolderDto {
    return {
      id: entity.id,
      name: entity.name,
      path: entity.path,
      parentId: entity.parentId,
      size: entity.size?.toString() ?? '',
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    }
  }

  static hierarchyToDtos(hierarchy: FolderHierarchy): FolderWithChildrenDto[] {
    return hierarchy.folders.map((folder) => this.nodeToDto(folder))
  }

  static dtoToNode(dto: FolderWithChildrenDto): FolderNode {
    return new FolderNode(
      dto.id,
      dto.name,
      dto.path,
      dto.parentId,
      dto.size,
      dto.children.map((child) => this.dtoToNode(child)),
    )
  }

  static nodeToDto(node: FolderNode): FolderWithChildrenDto {
    return {
      id: node.id,
      name: node.name,
      path: node.path,
      parentId: node.parentId,
      size: node.size?.toString() ?? '',
      createdAt: new Date().toISOString(), // Default values since FolderNode doesn't have timestamps
      updatedAt: new Date().toISOString(),
      children: node.children.map((child) => this.nodeToDto(child)),
    }
  }

  static entitiesToDtos(entities: FolderEntity[]): FolderDto[] {
    return entities.map((entity) => this.entityToDto(entity))
  }

  static dtosToEntities(dtos: FolderDto[]): FolderEntity[] {
    return dtos.map((dto) => this.dtoToEntity(dto))
  }

  static dtoToEntity(dto: FolderDto): FolderEntity {
    return FolderEntity.fromObject({
      id: dto.id,
      name: dto.name,
      path: dto.path,
      parentId: dto.parentId,
      size: dto.size,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    })
  }
}
