import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { GetFolderHierarchyUseCase } from '../../../domain/usecases/GetFolderHierarchyUseCase'
import type { IFolderRepository } from '../../../domain/repositories/IFolderRepository'
import { FolderHierarchy, FolderNode } from '../../../domain/entities/FolderHierarchy'

describe('GetFolderHierarchyUseCase', () => {
  let mockRepository: {
    getAllWithHierarchy: Mock
    getById: Mock
    getRoots: Mock
    getChildren: Mock
    create: Mock
    update: Mock
    delete: Mock
    exists: Mock
  }
  let useCase: GetFolderHierarchyUseCase

  beforeEach(() => {
    mockRepository = {
      getAllWithHierarchy: vi.fn(),
      getById: vi.fn(),
      getRoots: vi.fn(),
      getChildren: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    }
    useCase = new GetFolderHierarchyUseCase(mockRepository as IFolderRepository)
  })

  describe('execute', () => {
    it('should return folder hierarchy successfully', async () => {
      const expectedHierarchy = new FolderHierarchy([
        new FolderNode('root', 'Root', '/root', null, '1024', [
          new FolderNode('child1', 'Child 1', '/root/child1', 'root', '512', []),
        ]),
      ])

      mockRepository.getAllWithHierarchy.mockResolvedValue(expectedHierarchy)

      const result = await useCase.execute()

      expect(mockRepository.getAllWithHierarchy).toHaveBeenCalled()
      expect(result).toBe(expectedHierarchy)
    })

    it('should return empty hierarchy when no folders exist', async () => {
      const emptyHierarchy = new FolderHierarchy([])

      mockRepository.getAllWithHierarchy.mockResolvedValue(emptyHierarchy)

      const result = await useCase.execute()

      expect(result).toBe(emptyHierarchy)
      expect(result.folders).toEqual([])
    })

    it('should return complex hierarchy with multiple levels', async () => {
      const grandchild = new FolderNode(
        'grandchild',
        'Grandchild',
        '/root/child/grandchild',
        'child',
        '256',
        [],
      )
      const child = new FolderNode('child', 'Child', '/root/child', 'root', '512', [grandchild])
      const root = new FolderNode('root', 'Root', '/root', null, '1024', [child])
      const complexHierarchy = new FolderHierarchy([root])

      mockRepository.getAllWithHierarchy.mockResolvedValue(complexHierarchy)

      const result = await useCase.execute()

      expect(result).toBe(complexHierarchy)
      expect(result.folders).toHaveLength(1)
      expect(result.folders[0].children).toHaveLength(1)
      expect(result.folders[0].children[0].children).toHaveLength(1)
    })

    it('should return hierarchy with multiple root folders', async () => {
      const root1 = new FolderNode('root1', 'Root 1', '/root1', null, '1024', [])
      const root2 = new FolderNode('root2', 'Root 2', '/root2', null, '2048', [])
      const multiRootHierarchy = new FolderHierarchy([root1, root2])

      mockRepository.getAllWithHierarchy.mockResolvedValue(multiRootHierarchy)

      const result = await useCase.execute()

      expect(result).toBe(multiRootHierarchy)
      expect(result.folders).toHaveLength(2)
      expect(result.folders[0].id).toBe('root1')
      expect(result.folders[1].id).toBe('root2')
    })

    it('should throw error when repository getAllWithHierarchy fails', async () => {
      const error = new Error('Database connection failed')

      mockRepository.getAllWithHierarchy.mockRejectedValue(error)

      await expect(useCase.execute()).rejects.toThrow(
        'Failed to get folder hierarchy: Database connection failed',
      )
    })

    it('should throw error when repository getAllWithHierarchy fails with unknown error', async () => {
      mockRepository.getAllWithHierarchy.mockRejectedValue('Unknown error')

      await expect(useCase.execute()).rejects.toThrow(
        'Failed to get folder hierarchy: Unknown error',
      )
    })

    it('should handle repository returning null', async () => {
      mockRepository.getAllWithHierarchy.mockResolvedValue(null as any)

      const result = await useCase.execute()

      expect(result).toBeNull()
    })

    it('should handle very large hierarchy', async () => {
      // Create a large hierarchy
      const createLargeHierarchy = (depth: number): FolderNode[] => {
        if (depth === 0) return []

        const nodes: FolderNode[] = []
        for (let i = 0; i < 5; i++) {
          const children = createLargeHierarchy(depth - 1)
          nodes.push(
            new FolderNode(
              `node-${depth}-${i}`,
              `Node ${depth}-${i}`,
              `/node/${depth}/${i}`,
              null,
              '1024',
              children,
            ),
          )
        }
        return nodes
      }

      const largeHierarchy = new FolderHierarchy(createLargeHierarchy(3))
      mockRepository.getAllWithHierarchy.mockResolvedValue(largeHierarchy)

      const result = await useCase.execute()

      expect(result).toBe(largeHierarchy)
      expect(result.folders.length).toBeGreaterThan(0)
    })
  })

  describe('error handling', () => {
    it('should wrap non-Error exceptions', async () => {
      mockRepository.getAllWithHierarchy.mockRejectedValue(123)

      await expect(useCase.execute()).rejects.toThrow(
        'Failed to get folder hierarchy: Unknown error',
      )
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network timeout')
      mockRepository.getAllWithHierarchy.mockRejectedValue(networkError)

      await expect(useCase.execute()).rejects.toThrow(
        'Failed to get folder hierarchy: Network timeout',
      )
    })

    it('should handle permission errors', async () => {
      const permissionError = new Error('Access denied')
      mockRepository.getAllWithHierarchy.mockRejectedValue(permissionError)

      await expect(useCase.execute()).rejects.toThrow(
        'Failed to get folder hierarchy: Access denied',
      )
    })
  })

  describe('data integrity', () => {
    it('should preserve folder hierarchy structure', async () => {
      const originalHierarchy = new FolderHierarchy([
        new FolderNode('root', 'Root', '/root', null, '1024', [
          new FolderNode('child1', 'Child 1', '/root/child1', 'root', '512', [
            new FolderNode(
              'grandchild',
              'Grandchild',
              '/root/child1/grandchild',
              'child1',
              '256',
              [],
            ),
          ]),
          new FolderNode('child2', 'Child 2', '/root/child2', 'root', '1024', []),
        ]),
      ])

      mockRepository.getAllWithHierarchy.mockResolvedValue(originalHierarchy)

      const result = await useCase.execute()

      expect(result.folders[0].id).toBe('root')
      expect(result.folders[0].children[0].id).toBe('child1')
      expect(result.folders[0].children[0].children[0].id).toBe('grandchild')
      expect(result.folders[0].children[1].id).toBe('child2')
    })

    it('should handle folders with no size information', async () => {
      const hierarchyWithNullSizes = new FolderHierarchy([
        new FolderNode('root', 'Root', '/root', null, null, [
          new FolderNode('child', 'Child', '/root/child', 'root', null, []),
        ]),
      ])

      mockRepository.getAllWithHierarchy.mockResolvedValue(hierarchyWithNullSizes)

      const result = await useCase.execute()

      expect(result.folders[0].size).toBeNull()
      expect(result.folders[0].children[0].size).toBeNull()
    })
  })
})
