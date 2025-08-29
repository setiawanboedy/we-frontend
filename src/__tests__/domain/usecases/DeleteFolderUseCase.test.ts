import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { DeleteFolderUseCase } from '../../../domain/usecases/DeleteFolderUseCase'
import type { IFolderRepository } from '../../../domain/repositories/IFolderRepository'

describe('DeleteFolderUseCase', () => {
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
  let useCase: DeleteFolderUseCase

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
    useCase = new DeleteFolderUseCase(mockRepository as IFolderRepository)
  })

  describe('execute', () => {
    it('should delete folder successfully when folder exists', async () => {
      const folderId = 'folder-to-delete'

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.delete.mockResolvedValue(undefined)

      await expect(useCase.execute(folderId)).resolves.toBeUndefined()

      expect(mockRepository.exists).toHaveBeenCalledWith(folderId)
      expect(mockRepository.delete).toHaveBeenCalledWith(folderId)
    })

    it('should throw error when folderId is empty string', async () => {
      await expect(useCase.execute('')).rejects.toThrow('Folder ID is required')
      expect(mockRepository.exists).not.toHaveBeenCalled()
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })

    it('should throw error when folderId is whitespace only', async () => {
      await expect(useCase.execute('   ')).rejects.toThrow('Folder ID is required')
      expect(mockRepository.exists).not.toHaveBeenCalled()
      expect(mockRepository.delete).not.toHaveBeenCalled()
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
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })

    it('should throw error when repository delete fails', async () => {
      const folderId = 'test-id'
      const error = new Error('Database connection failed')

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.delete.mockRejectedValue(error)

      await expect(useCase.execute(folderId)).rejects.toThrow(
        'Failed to delete folder: Database connection failed',
      )
    })

    it('should throw error when repository delete fails with unknown error', async () => {
      const folderId = 'test-id'

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.delete.mockRejectedValue('Unknown error')

      await expect(useCase.execute(folderId)).rejects.toThrow(
        'Failed to delete folder: Unknown error',
      )
    })

    it('should handle deletion of root folder', async () => {
      const rootFolderId = 'root-folder'

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.delete.mockResolvedValue(undefined)

      await expect(useCase.execute(rootFolderId)).resolves.toBeUndefined()

      expect(mockRepository.exists).toHaveBeenCalledWith(rootFolderId)
      expect(mockRepository.delete).toHaveBeenCalledWith(rootFolderId)
    })

    it('should handle deletion of nested folder', async () => {
      const nestedFolderId = 'nested-folder-id'

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.delete.mockResolvedValue(undefined)

      await expect(useCase.execute(nestedFolderId)).resolves.toBeUndefined()

      expect(mockRepository.exists).toHaveBeenCalledWith(nestedFolderId)
      expect(mockRepository.delete).toHaveBeenCalledWith(nestedFolderId)
    })
  })

  describe('validation scenarios', () => {
    it('should validate folderId before checking existence', async () => {
      await expect(useCase.execute('')).rejects.toThrow('Folder ID is required')

      expect(mockRepository.exists).not.toHaveBeenCalled()
    })

    it('should handle special characters in folderId', async () => {
      const specialFolderId = 'folder-id_123.test'

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.delete.mockResolvedValue(undefined)

      await expect(useCase.execute(specialFolderId)).resolves.toBeUndefined()

      expect(mockRepository.exists).toHaveBeenCalledWith(specialFolderId)
      expect(mockRepository.delete).toHaveBeenCalledWith(specialFolderId)
    })

    it('should handle very long folderId', async () => {
      const longFolderId = 'a'.repeat(255)

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.delete.mockResolvedValue(undefined)

      await expect(useCase.execute(longFolderId)).resolves.toBeUndefined()

      expect(mockRepository.exists).toHaveBeenCalledWith(longFolderId)
      expect(mockRepository.delete).toHaveBeenCalledWith(longFolderId)
    })
  })

  describe('edge cases', () => {
    it('should handle concurrent delete operations', async () => {
      const folderId = 'concurrent-delete'

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.delete.mockResolvedValue(undefined)

      const promises = [
        useCase.execute(folderId),
        useCase.execute(folderId),
        useCase.execute(folderId),
      ]

      await expect(Promise.all(promises)).resolves.toEqual([undefined, undefined, undefined])

      expect(mockRepository.exists).toHaveBeenCalledTimes(3)
      expect(mockRepository.delete).toHaveBeenCalledTimes(3)
    })

    it('should handle folder that gets deleted between existence check and delete', async () => {
      const folderId = 'race-condition-folder'

      mockRepository.exists.mockResolvedValueOnce(true)
      mockRepository.delete.mockRejectedValue(new Error('Folder not found'))

      await expect(useCase.execute(folderId)).rejects.toThrow(
        'Failed to delete folder: Folder not found',
      )

      expect(mockRepository.exists).toHaveBeenCalledWith(folderId)
      expect(mockRepository.delete).toHaveBeenCalledWith(folderId)
    })
  })
})
