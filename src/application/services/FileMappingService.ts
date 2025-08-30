import type { FileItem } from '@/shared/types/explorer'
import { FileEntity } from '../../domain/entities/FileEntity'
import type { FileDto } from '../dto/FileDto'

export class FileMappingService {
  static toDto(entity: FileEntity): FileDto {
    return {
      id: entity.id,
      name: entity.name,
      path: entity.path,
      folderId: entity.folderId,
      size: entity.size,
      mimeType: entity.mimeType,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    }
  }

  static entitiesToDtos(entities: FileEntity[]): FileDto[] {
    return entities.map((entity) => this.toDto(entity))
  }

  static toEntity(dto: FileDto): FileEntity {
    return new FileEntity(
      dto.id,
      dto.name,
      dto.path,
      dto.folderId,
      dto.size,
      dto.mimeType,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    )
  }

  static toEntityList(dtos: FileDto[]): FileEntity[] {
    return dtos.map((dto) => this.toEntity(dto))
  }

  static dtoToFileItem(dto: FileDto): FileItem {
    return {
      id: dto.id,
      name: dto.name,
      size: dto.size,
      icon: 'file',
      path: dto.path,
      updatedAt: dto.updatedAt,
      folderId: dto.folderId,
      mimeType: dto.mimeType,
    }
  }
}
