import { describe, it, expect } from 'vitest'
import { FolderMappingService } from '@/application/services/FolderMappingService'
import { FolderEntity } from '@/domain/entities/FolderEntity'
import { FolderHierarchy, FolderNode } from '@/domain/entities/FolderHierarchy'
import type { Folder, FolderWithChildren } from '@/shared/types/explorer'
import type { FolderDto, FolderWithChildrenDto } from '@/application/dto/FolderDto'

describe('FolderMappingService', () => {
  describe('folderToEntity', () => {
    it('should convert Folder to FolderEntity', () => {
      const folder: Folder = {
        id: '1',
        name: 'Test Folder',
        path: '/test',
        parentId: null,
        size: '100',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      const entity = FolderMappingService.folderToEntity(folder)

      expect(entity).toBeInstanceOf(FolderEntity)
      expect(entity.id).toBe(folder.id)
      expect(entity.name).toBe(folder.name)
      expect(entity.path).toBe(folder.path)
      expect(entity.parentId).toBe(folder.parentId)
      expect(entity.size).toBe(100)
    })

    it('should handle null size', () => {
      const folder: Folder = {
        id: '1',
        name: 'Test Folder',
        path: '/test',
        parentId: 'parent-1',
        size: null,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      const entity = FolderMappingService.folderToEntity(folder)

      expect(entity.size).toBeNull()
    })
  })

  describe('folderWithChildrenToNode', () => {
    it('should convert FolderWithChildren to FolderNode', () => {
      const folderWithChildren: FolderWithChildren = {
        id: '1',
        name: 'Parent',
        path: '/parent',
        parentId: null,
        size: '0',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        children: [
          {
            id: '2',
            name: 'Child',
            path: '/parent/child',
            parentId: '1',
            size: '50',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
            children: [],
          },
        ],
      }

      const node = FolderMappingService.folderWithChildrenToNode(folderWithChildren)

      expect(node).toBeInstanceOf(FolderNode)
      expect(node.id).toBe(folderWithChildren.id)
      expect(node.name).toBe(folderWithChildren.name)
      expect(node.children).toHaveLength(1)
      expect(node.children[0].name).toBe('Child')
    })

    it('should handle empty children array', () => {
      const folderWithChildren: FolderWithChildren = {
        id: '1',
        name: 'Empty Folder',
        path: '/empty',
        parentId: null,
        size: '0',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        children: [],
      }

      const node = FolderMappingService.folderWithChildrenToNode(folderWithChildren)

      expect(node.children).toHaveLength(0)
    })
  })

  describe('entityToDto', () => {
    it('should convert FolderEntity to FolderDto', () => {
      const entity = new FolderEntity('1', 'Test', '/test', null, 100)

      const dto = FolderMappingService.entityToDto(entity)

      expect(dto.id).toBe(entity.id)
      expect(dto.name).toBe(entity.name)
      expect(dto.path).toBe(entity.path)
      expect(dto.parentId).toBe(entity.parentId)
      expect(dto.size).toBe('100')
      expect(dto.createdAt).toBe(entity.createdAt.toISOString())
      expect(dto.updatedAt).toBe(entity.updatedAt.toISOString())
    })

    it('should handle null size', () => {
      const entity = new FolderEntity('1', 'Test', '/test', null, null)

      const dto = FolderMappingService.entityToDto(entity)

      expect(dto.size).toBe('')
    })
  })

  describe('hierarchyToDtos', () => {
    it('should convert FolderHierarchy to FolderWithChildrenDto array', () => {
      const node1 = new FolderNode('1', 'Root1', '/root1', null, '0', [])
      const node2 = new FolderNode('2', 'Root2', '/root2', null, '100', [])
      const hierarchy = new FolderHierarchy([node1, node2])

      const dtos = FolderMappingService.hierarchyToDtos(hierarchy)

      expect(dtos).toHaveLength(2)
      expect(dtos[0].id).toBe('1')
      expect(dtos[1].id).toBe('2')
    })

    it('should handle empty hierarchy', () => {
      const hierarchy = new FolderHierarchy([])

      const dtos = FolderMappingService.hierarchyToDtos(hierarchy)

      expect(dtos).toHaveLength(0)
    })
  })

  describe('dtoToNode', () => {
    it('should convert FolderWithChildrenDto to FolderNode', () => {
      const dto: FolderWithChildrenDto = {
        id: '1',
        name: 'Parent',
        path: '/parent',
        parentId: null,
        size: '0',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        children: [
          {
            id: '2',
            name: 'Child',
            path: '/parent/child',
            parentId: '1',
            size: '50',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
            children: [],
          },
        ],
      }

      const node = FolderMappingService.dtoToNode(dto)

      expect(node).toBeInstanceOf(FolderNode)
      expect(node.id).toBe(dto.id)
      expect(node.children).toHaveLength(1)
    })
  })

  describe('nodeToDto', () => {
    it('should convert FolderNode to FolderWithChildrenDto', () => {
      const childNode = new FolderNode('2', 'Child', '/child', '1', '50', [])
      const parentNode = new FolderNode('1', 'Parent', '/parent', null, '0', [childNode])

      const dto = FolderMappingService.nodeToDto(parentNode)

      expect(dto.id).toBe(parentNode.id)
      expect(dto.name).toBe(parentNode.name)
      expect(dto.children).toHaveLength(1)
      expect(dto.children[0].id).toBe('2')
    })

    it('should handle null size in node', () => {
      const node = new FolderNode('1', 'Test', '/test', null, null, [])

      const dto = FolderMappingService.nodeToDto(node)

      expect(dto.size).toBe('')
    })
  })

  describe('entitiesToDtos', () => {
    it('should convert FolderEntity array to FolderDto array', () => {
      const entities = [
        new FolderEntity('1', 'Folder1', '/folder1', null, 100),
        new FolderEntity('2', 'Folder2', '/folder2', '1', 200),
      ]

      const dtos = FolderMappingService.entitiesToDtos(entities)

      expect(dtos).toHaveLength(2)
      expect(dtos[0].id).toBe('1')
      expect(dtos[1].id).toBe('2')
    })

    it('should handle empty array', () => {
      const dtos = FolderMappingService.entitiesToDtos([])

      expect(dtos).toHaveLength(0)
    })
  })

  describe('dtosToEntities', () => {
    it('should convert FolderDto array to FolderEntity array', () => {
      const dtos: FolderDto[] = [
        {
          id: '1',
          name: 'Folder1',
          path: '/folder1',
          parentId: null,
          size: '100',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Folder2',
          path: '/folder2',
          parentId: '1',
          size: '200',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const entities = FolderMappingService.dtosToEntities(dtos)

      expect(entities).toHaveLength(2)
      expect(entities[0]).toBeInstanceOf(FolderEntity)
      expect(entities[0].id).toBe('1')
      expect(entities[1].id).toBe('2')
    })
  })

  describe('dtoToEntity', () => {
    it('should convert FolderDto to FolderEntity', () => {
      const dto: FolderDto = {
        id: '1',
        name: 'Test Folder',
        path: '/test',
        parentId: null,
        size: '100',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      const entity = FolderMappingService.dtoToEntity(dto)

      expect(entity).toBeInstanceOf(FolderEntity)
      expect(entity.id).toBe(dto.id)
      expect(entity.name).toBe(dto.name)
      expect(entity.size).toBe(100)
    })

  })
})
