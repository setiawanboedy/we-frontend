import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { UpdateFolderUseCase } from '../../../domain/usecases/UpdateFolderUseCase'
import type { IFolderRepository } from '../../../domain/repositories/IFolderRepository'
import { FolderEntity } from '../../../domain/entities/FolderEntity'
import type { UpdateFolderRequest } from '@/application/dto/FolderDto'

describe('UpdateFolderUseCase', () => {
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
  let useCase: UpdateFolderUseCase

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
    useCase = new UpdateFolderUseCase(mockRepository as IFolderRepository)
  })

  describe('execute', () => {
    it('should update folder successfully with all fields', async () => {
      const folderId = 'folder-to-update'
      const updateData: UpdateFolderRequest = {
        name: 'Updated Name',
        path: '/updated/path',
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Updated Name',
        '/updated/path',
        'new-parent-id',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(mockRepository.update).toHaveBeenCalledWith(folderId, updateData)
      expect(result).toBe(expectedUpdatedFolder)
    })

    it('should update folder successfully with partial fields', async () => {
      const folderId = 'folder-to-update'
      const updateData: UpdateFolderRequest = {
        name: 'Updated Name',
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Updated Name',
        '/original/path',
        'original-parent-id',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(mockRepository.update).toHaveBeenCalledWith(folderId, updateData)
      expect(result).toBe(expectedUpdatedFolder)
    })

    it('should update folder with empty update data', async () => {
      const folderId = 'folder-to-update'
      const updateData: UpdateFolderRequest = {}

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Original Name',
        '/original/path',
        'original-parent-id',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(mockRepository.update).toHaveBeenCalledWith(folderId, updateData)
      expect(result).toBe(expectedUpdatedFolder)
    })

    it('should update folder path only', async () => {
      const folderId = 'folder-to-update'
      const updateData: UpdateFolderRequest = {
        path: '/new/path',
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Original Name',
        '/new/path',
        'original-parent-id',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(mockRepository.update).toHaveBeenCalledWith(folderId, updateData)
      expect(result.path).toBe('/new/path')
    })


    it('should throw error when repository update fails', async () => {
      const folderId = 'test-id'
      const updateData: UpdateFolderRequest = { name: 'New Name' }
      const error = new Error('Database connection failed')

      mockRepository.update.mockRejectedValue(error)

      await expect(useCase.execute(folderId, updateData)).rejects.toThrow(error)
    })

    it('should throw error when repository update fails with unknown error', async () => {
      const folderId = 'test-id'
      const updateData: UpdateFolderRequest = { name: 'New Name' }

      mockRepository.update.mockRejectedValue('Unknown error')

      await expect(useCase.execute(folderId, updateData)).rejects.toThrow('Unknown error')
    })

    it('should handle special characters in update data', async () => {
      const folderId = 'folder-id'
      const updateData: UpdateFolderRequest = {
        name: 'Special Folder @#$%',
        path: '/special/path_123.test',
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Special Folder @#$%',
        '/special/path_123.test',
        'parent-id_456',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(result.name).toBe('Special Folder @#$%')
      expect(result.path).toBe('/special/path_123.test')
      expect(result.parentId).toBe('parent-id_456')
    })

    it('should handle very long update data', async () => {
      const folderId = 'folder-id'
      const longName = 'a'.repeat(200)
      const longPath = '/path/' + 'a'.repeat(200)
      const updateData: UpdateFolderRequest = {
        name: longName,
        path: longPath,
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        longName,
        longPath,
        'original-parent',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(result.name).toBe(longName)
      expect(result.path).toBe(longPath)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined values in update data', async () => {
      const folderId = 'folder-id'
      const updateData: UpdateFolderRequest = {
        name: undefined,
        path: undefined,
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Original Name',
        '/original/path',
        'original-parent',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(result.name).toBe('Original Name')
      expect(result.path).toBe('/original/path')
      expect(result.parentId).toBe('original-parent')
    })

    it('should handle null values in update data', async () => {
      const folderId = 'folder-id'
      const updateData: UpdateFolderRequest = {
        name: null as any,
        path: null as any,
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Valid Name',
        '/valid/path',
        null,
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(result.name).toBe('Valid Name')
      expect(result.path).toBe('/valid/path')
      expect(result.parentId).toBeNull()
    })

    it('should handle empty string values in update data', async () => {
      const folderId = 'folder-id'
      const updateData: UpdateFolderRequest = {
        name: '',
        path: '',
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Valid Name',
        '/valid/path',
        'valid-parent',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(result.name).toBe('Valid Name')
      expect(result.path).toBe('/valid/path')
      expect(result.parentId).toBe('valid-parent')
    })
  })

  describe('integration scenarios', () => {
    it('should support updating folder metadata', async () => {
      const folderId = 'metadata-folder'
      const updateData: UpdateFolderRequest = {
        name: 'Updated Metadata Folder',
        path: '/metadata/updated',
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Updated Metadata Folder',
        '/metadata/updated',
        null,
        2048,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(result.name).toBe('Updated Metadata Folder')
      expect(result.path).toBe('/metadata/updated')
      expect(result.size).toBe(2048)
    })

    it('should handle folder move operation', async () => {
      const folderId = 'folder-to-move'
      const updateData: UpdateFolderRequest = {
        path: '/new-parent/folder-to-move',
      }

      const expectedUpdatedFolder = new FolderEntity(
        folderId,
        'Original Name',
        '/new-parent/folder-to-move',
        'new-parent-id',
        1024,
      )

      mockRepository.update.mockResolvedValue(expectedUpdatedFolder)

      const result = await useCase.execute(folderId, updateData)

      expect(result.parentId).toBe('new-parent-id')
      expect(result.path).toBe('/new-parent/folder-to-move')
    })
  })
})
