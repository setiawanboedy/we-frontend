import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { CreateFolderUseCase } from '../../../domain/usecases/CreateFolderUseCase'
import type { IFolderRepository } from '../../../domain/repositories/IFolderRepository'
import { FolderEntity } from '../../../domain/entities/FolderEntity'
import type { CreateFolderRequest } from '@/application/dto/FolderDto'

describe('CreateFolderUseCase', () => {
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
  let useCase: CreateFolderUseCase

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
    useCase = new CreateFolderUseCase(mockRepository as IFolderRepository)
  })

  describe('execute', () => {
    it('should create folder successfully when parent exists', async () => {
      const request: CreateFolderRequest = {
        name: 'New Folder',
        path: '/parent/new-folder',
        parentId: 'parent-id',
      }

      const expectedFolder = new FolderEntity(
        'new-id',
        'New Folder',
        '/parent/new-folder',
        'parent-id',
        null,
      )

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.create.mockResolvedValue(expectedFolder)

      const result = await useCase.execute(request)

      expect(mockRepository.exists).toHaveBeenCalledWith('parent-id')
      expect(mockRepository.create).toHaveBeenCalledWith(request)
      expect(result).toBe(expectedFolder)
    })

    it('should create root folder successfully', async () => {
      const request: CreateFolderRequest = {
        name: 'Root Folder',
        path: '/root-folder',
      }

      const expectedFolder = new FolderEntity('root-id', 'Root Folder', '/root-folder', null, null)

      mockRepository.create.mockResolvedValue(expectedFolder)

      const result = await useCase.execute(request)

      expect(mockRepository.exists).not.toHaveBeenCalled()
      expect(mockRepository.create).toHaveBeenCalledWith(request)
      expect(result).toBe(expectedFolder)
    })

    it('should throw error when parent folder does not exist', async () => {
      const request: CreateFolderRequest = {
        name: 'New Folder',
        path: '/parent/new-folder',
        parentId: 'non-existent-parent',
      }

      mockRepository.exists.mockResolvedValue(false)

      await expect(useCase.execute(request)).rejects.toThrow(
        'Parent folder with ID non-existent-parent not found',
      )

      expect(mockRepository.exists).toHaveBeenCalledWith('non-existent-parent')
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error when repository create fails', async () => {
      const request: CreateFolderRequest = {
        name: 'New Folder',
        path: '/new-folder',
      }

      const error = new Error('Database connection failed')
      mockRepository.create.mockRejectedValue(error)

      await expect(useCase.execute(request)).rejects.toThrow(
        'Failed to get folder hierarchy: Database connection failed',
      )
    })

    it('should throw error when repository create fails with unknown error', async () => {
      const request: CreateFolderRequest = {
        name: 'New Folder',
        path: '/new-folder',
      }

      mockRepository.create.mockRejectedValue('Unknown error')

      await expect(useCase.execute(request)).rejects.toThrow(
        'Failed to get folder hierarchy: Unknown error',
      )
    })
  })

  describe('validateRequest', () => {
    it('should throw error for empty name', async () => {
      const request: CreateFolderRequest = {
        name: '',
        path: '/test',
      }

      await expect(useCase.execute(request)).rejects.toThrow('Folder name is required')
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error for whitespace-only name', async () => {
      const request: CreateFolderRequest = {
        name: '   ',
        path: '/test',
      }

      await expect(useCase.execute(request)).rejects.toThrow('Folder name is required')
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error for empty path', async () => {
      const request: CreateFolderRequest = {
        name: 'Test Folder',
        path: '',
      }

      await expect(useCase.execute(request)).rejects.toThrow('Folder path is required')
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error for whitespace-only path', async () => {
      const request: CreateFolderRequest = {
        name: 'Test Folder',
        path: '   ',
      }

      await expect(useCase.execute(request)).rejects.toThrow('Folder path is required')
      expect(mockRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('integration scenarios', () => {
    it('should handle complex folder creation with parent validation', async () => {
      const request: CreateFolderRequest = {
        name: 'Deep Nested Folder',
        path: '/root/parent/deep-nested',
        parentId: 'parent-id',
      }

      const expectedFolder = new FolderEntity(
        'deep-id',
        'Deep Nested Folder',
        '/root/parent/deep-nested',
        'parent-id',
        null,
      )

      mockRepository.exists.mockResolvedValue(true)
      mockRepository.create.mockResolvedValue(expectedFolder)

      const result = await useCase.execute(request)

      expect(result.name).toBe('Deep Nested Folder')
      expect(result.path).toBe('/root/parent/deep-nested')
      expect(result.parentId).toBe('parent-id')
    })

    it('should validate request before checking parent existence', async () => {
      const request: CreateFolderRequest = {
        name: '',
        path: '/test',
        parentId: 'parent-id',
      }

      await expect(useCase.execute(request)).rejects.toThrow('Folder name is required')

      expect(mockRepository.exists).not.toHaveBeenCalled()
      expect(mockRepository.create).not.toHaveBeenCalled()
    })
  })
})
