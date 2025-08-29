import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { GetFolderChildrenUseCase } from '../../../domain/usecases/GetFolderChildrenUseCase'
import type { IFolderRepository } from '../../../domain/repositories/IFolderRepository'
import { FolderEntity } from '../../../domain/entities/FolderEntity'

describe('GetFolderChildrenUseCase', () => {
  let mockRepository: {
    getAllWithHierarchy: Mock
    getById: Mock
    getRoots: Mock
    getChildren: Mock
    create: Mock
    update: Mock
    delete: Mock
    exists: Mock
    search: Mock
  }
  let useCase: GetFolderChildrenUseCase

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
      search: vi.fn(),
    }
    useCase = new GetFolderChildrenUseCase(mockRepository as IFolderRepository)
  })

  describe('execute', () => {
    it('should return folder children successfully when folder exists', async () => {
      const folderId = 'parent-id'
      const expectedChildren = [
        new FolderEntity('child1', 'Child 1', '/parent/child1', folderId, 512),
        new FolderEntity('child2', 'Child 2', '/parent/child2', folderId, 1024),
      ]

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.getChildren.mockResolvedValue(expectedChildren)

      const result = await useCase.execute(folderId)

      expect(mockRepository.exists).toHaveBeenCalledWith(folderId)
      expect(mockRepository.getChildren).toHaveBeenCalledWith(folderId)
      expect(result).toEqual(expectedChildren)
    })

    it('should return empty array when folder has no children', async () => {
      const folderId = 'empty-parent-id'

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.getChildren.mockResolvedValue([])

      const result = await useCase.execute(folderId)

      expect(result).toEqual([])
      expect(mockRepository.getChildren).toHaveBeenCalledWith(folderId)
    })

    it('should throw error when folderId is empty string', async () => {
      await expect(useCase.execute('')).rejects.toThrow('Folder ID is required')
      expect(mockRepository.exists).not.toHaveBeenCalled()
      expect(mockRepository.getChildren).not.toHaveBeenCalled()
    })

    it('should throw error when folderId is whitespace only', async () => {
      await expect(useCase.execute('   ')).rejects.toThrow('Folder ID is required')
      expect(mockRepository.exists).not.toHaveBeenCalled()
      expect(mockRepository.getChildren).not.toHaveBeenCalled()
    })

    it('should throw error when folderId is null or undefined', async () => {
      await expect(useCase.execute(null as any)).rejects.toThrow('Folder ID is required')
      await expect(useCase.execute(undefined as any)).rejects.toThrow('Folder ID is required')
    })

    it('should throw error when folder does not exist', async () => {
      const folderId = 'non-existent-id'
      mockRepository.exists.mockResolvedValue(false)

      await expect(useCase.execute(folderId)).rejects.toThrow(
        `Folder with ID ${folderId} not found`,
      )

      expect(mockRepository.exists).toHaveBeenCalledWith(folderId)
      expect(mockRepository.getChildren).not.toHaveBeenCalled()
    })

    it('should throw error when repository getChildren fails', async () => {
      const folderId = 'test-id'
      const error = new Error('Database connection failed')

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.getChildren.mockRejectedValue(error)

      await expect(useCase.execute(folderId)).rejects.toThrow(
        'Failed to get folder children: Database connection failed',
      )
    })

    it('should throw error when repository getChildren fails with unknown error', async () => {
      const folderId = 'test-id'

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.getChildren.mockRejectedValue('Unknown error')

      await expect(useCase.execute(folderId)).rejects.toThrow(
        'Failed to get folder children: Unknown error',
      )
    })

    it('should handle folder with single child', async () => {
      const folderId = 'parent-id'
      const singleChild = new FolderEntity('child1', 'Child 1', '/parent/child1', folderId, 512)

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.getChildren.mockResolvedValue([singleChild])

      const result = await useCase.execute(folderId)

      expect(result).toEqual([singleChild])
      expect(result).toHaveLength(1)
    })

    it('should handle folder with many children', async () => {
      const folderId = 'parent-id'
      const manyChildren = Array.from(
        { length: 10 },
        (_, i) =>
          new FolderEntity(`child${i}`, `Child ${i}`, `/parent/child${i}`, folderId, 512 * (i + 1)),
      )

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.getChildren.mockResolvedValue(manyChildren)

      const result = await useCase.execute(folderId)

      expect(result).toEqual(manyChildren)
      expect(result).toHaveLength(10)
    })
  })

  describe('validation scenarios', () => {
    it('should validate folderId before checking existence', async () => {
      await expect(useCase.execute('')).rejects.toThrow('Folder ID is required')

      expect(mockRepository.exists).not.toHaveBeenCalled()
    })

    it('should handle special characters in folderId', async () => {
      const specialFolderId = 'folder-id_123.test'
      const children = [new FolderEntity('child', 'Child', '/path', specialFolderId, 512)]

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.getChildren.mockResolvedValue(children)

      const result = await useCase.execute(specialFolderId)

      expect(result).toEqual(children)
      expect(mockRepository.exists).toHaveBeenCalledWith(specialFolderId)
    })
  })
})
