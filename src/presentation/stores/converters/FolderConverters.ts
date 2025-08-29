import type { FolderWithChildrenDto } from "@/application/dto/FolderDto"
import  { FolderHierarchy, FolderNode } from "@/domain/entities/FolderHierarchy"
import type { FolderItem } from "@/shared/types/explorer"

export class FolderConverters {
    static convertDtoToDomainHierarchy(dtos: FolderWithChildrenDto[]): FolderHierarchy {
    const nodes = dtos.map((dto) => this.convertDtoToDomainNode(dto))
    return new FolderHierarchy(nodes)
  }

  static convertDtoToDomainNode(dto: FolderWithChildrenDto): FolderNode {
    const children = dto.children.map((child) => this.convertDtoToDomainNode(child))
    return new FolderNode(dto.id, dto.name, dto.path, dto.parentId, dto.size, children)
  }

  static convertFolderNodeToUI(node: FolderNode): FolderItem {
    return {
      id: node.id,
      name: node.name,
      size: node.size ?? '',
      icon: 'folder',
      path: node.path,
      updateAt: '', 
      parentId: node.parentId,
      isExpanded: false,
      children: node.children.map((child) => this.convertFolderNodeToUI(child)),
    }
  }

  static convertFolderHierarchyToUI(hierarchy: FolderHierarchy): FolderItem[] {
    return hierarchy.folders.map((node) => this.convertFolderNodeToUI(node))
  }
}