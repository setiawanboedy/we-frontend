import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApplicationService } from '@/application/services/ApplicationService'
import type { IFolderRepository } from '@/domain/repositories/IFolderRepository'
import { FolderEntity } from '@/domain/entities/FolderEntity'
import { FolderHierarchy } from '@/domain/entities/FolderHierarchy'
import type { FolderDto, FolderWithChildrenDto } from '@/application/dto/FolderDto'
import type { CreateFolderRequest } from '@/application/dto/CreateFolderRequest'

// Mock the use cases
vi.mock('@/domain/usecases/GetFolderHierarchyUseCase', () => ({
  GetFolderHierarchyUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(),
  })),
}))

vi.mock('@/domain/usecases/GetFolderChildrenUseCase', () => ({
  GetFolderChildrenUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(),
  })),
}))

vi.mock('@/domain/usecases/CreateFolderUseCase', () => ({
  CreateFolderUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(),
  })),
}))

vi.mock('@/domain/usecases/DeleteFolderUseCase', () => ({
  DeleteFolderUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(),
  })),
}))

vi.mock('@/domain/usecases/UpdateFolderUseCase', () => ({
  UpdateFolderUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(),
  })),
}))

vi.mock('@/application/services/FolderMappingService', () => ({
  FolderMappingService: {
    hierarchyToDtos: vi.fn(),
    entitiesToDtos: vi.fn(),
    entityToDto: vi.fn(),
  },
}))

import { GetFolderHierarchyUseCase } from '@/domain/usecases/GetFolderHierarchyUseCase'
import { GetFolderChildrenUseCase } from '@/domain/usecases/GetFolderChildrenUseCase'
import { CreateFolderUseCase } from '@/domain/usecases/CreateFolderUseCase'
import { DeleteFolderUseCase } from '@/domain/usecases/DeleteFolderUseCase'
import { UpdateFolderUseCase } from '@/domain/usecases/UpdateFolderUseCase'
import { FolderMappingService } from '@/application/services/FolderMappingService'

describe('ApplicationService', () => {
  let mockRepository: IFolderRepository
  let applicationService: ApplicationService
  let mockGetFolderHierarchyUseCase: any
  let mockGetFolderChildrenUseCase: any
  let mockCreateFolderUseCase: any
  let mockDeleteFolderUseCase: any
  let mockUpdateFolderUseCase: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockRepository = {} as IFolderRepository

    // Create mock instances
    mockGetFolderHierarchyUseCase = {
      execute: vi.fn(),
    }
    mockGetFolderChildrenUseCase = {
      execute: vi.fn(),
    }
    mockCreateFolderUseCase = {
      execute: vi.fn(),
    }
    mockDeleteFolderUseCase = {
      execute: vi.fn(),
    }
    mockUpdateFolderUseCase = {
      execute: vi.fn(),
    }

    // Mock the constructors
    ;(GetFolderHierarchyUseCase as any).mockImplementation(() => mockGetFolderHierarchyUseCase)
    ;(GetFolderChildrenUseCase as any).mockImplementation(() => mockGetFolderChildrenUseCase)
    ;(CreateFolderUseCase as any).mockImplementation(() => mockCreateFolderUseCase)
    ;(DeleteFolderUseCase as any).mockImplementation(() => mockDeleteFolderUseCase)
    ;(UpdateFolderUseCase as any).mockImplementation(() => mockUpdateFolderUseCase)

    applicationService = new ApplicationService(mockRepository)
  })

  describe('constructor', () => {
    it('should initialize all use cases with the repository', () => {
      expect(GetFolderHierarchyUseCase).toHaveBeenCalledWith(mockRepository)
      expect(GetFolderChildrenUseCase).toHaveBeenCalledWith(mockRepository)
      expect(CreateFolderUseCase).toHaveBeenCalledWith(mockRepository)
      expect(DeleteFolderUseCase).toHaveBeenCalledWith(mockRepository)
      expect(UpdateFolderUseCase).toHaveBeenCalledWith(mockRepository)
    })
  })

  describe('getFolderHierarchy', () => {
    it('should return folder hierarchy successfully', async () => {
      const mockHierarchy = new FolderHierarchy([])
      const mockDtos: FolderWithChildrenDto[] = []

      mockGetFolderHierarchyUseCase.execute.mockResolvedValue(mockHierarchy)
      ;(FolderMappingService.hierarchyToDtos as any).mockReturnValue(mockDtos)

      const result = await applicationService.getFolderHierarchy()

      expect(mockGetFolderHierarchyUseCase.execute).toHaveBeenCalled()
      expect(FolderMappingService.hierarchyToDtos).toHaveBeenCalledWith(mockHierarchy)
      expect(result).toBe(mockDtos)
    })

    it('should throw error when use case fails', async () => {
      const error = new Error('Repository error')
      mockGetFolderHierarchyUseCase.execute.mockRejectedValue(error)

      await expect(applicationService.getFolderHierarchy()).rejects.toThrow(
        'Failed to get folder hierarchy: Repository error',
      )
    })

    it('should handle unknown errors', async () => {
      mockGetFolderHierarchyUseCase.execute.mockRejectedValue('Unknown error')

      await expect(applicationService.getFolderHierarchy()).rejects.toThrow(
        'Failed to get folder hierarchy: Unknown error',
      )
    })
  })

  describe('getFolderChildren', () => {
    it('should return folder children successfully', async () => {
      const folderId = 'folder-1'
      const mockChildren = [new FolderEntity('1', 'Child', '/child', 'folder-1', 100)]
      const mockDtos: FolderDto[] = []

      mockGetFolderChildrenUseCase.execute.mockResolvedValue(mockChildren)
      ;(FolderMappingService.entitiesToDtos as any).mockReturnValue(mockDtos)

      const result = await applicationService.getFolderChildren(folderId)

      expect(mockGetFolderChildrenUseCase.execute).toHaveBeenCalledWith(folderId)
      expect(FolderMappingService.entitiesToDtos).toHaveBeenCalledWith(mockChildren)
      expect(result).toBe(mockDtos)
    })

    it('should throw error when use case fails', async () => {
      const folderId = 'folder-1'
      const error = new Error('Folder not found')
      mockGetFolderChildrenUseCase.execute.mockRejectedValue(error)

      await expect(applicationService.getFolderChildren(folderId)).rejects.toThrow(
        'Failed to get folder children: Folder not found',
      )
    })
  })

  describe('createFolder', () => {
    it('should create folder successfully', async () => {
      const request: CreateFolderRequest = {
        name: 'New Folder',
        path: '/new-folder',
        parentId: undefined,
      }
      const mockEntity = new FolderEntity('1', 'New Folder', '/new-folder', null, 0)
      const mockDto: FolderDto = {
        id: '1',
        name: 'New Folder',
        path: '/new-folder',
        parentId: null,
        size: '0',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      mockCreateFolderUseCase.execute.mockResolvedValue(mockEntity)
      ;(FolderMappingService.entityToDto as any).mockReturnValue(mockDto)

      const result = await applicationService.createFolder(request)

      expect(mockCreateFolderUseCase.execute).toHaveBeenCalledWith(request)
      expect(FolderMappingService.entityToDto).toHaveBeenCalledWith(mockEntity)
      expect(result).toBe(mockDto)
    })

    it('should throw error when creation fails', async () => {
      const request: CreateFolderRequest = {
        name: 'New Folder',
        path: '/new-folder',
        parentId: undefined,
      }
      const error = new Error('Creation failed')
      mockCreateFolderUseCase.execute.mockRejectedValue(error)

      await expect(applicationService.createFolder(request)).rejects.toThrow(
        'Failed to create folder: Creation failed',
      )
    })
  })

  describe('updateFolder', () => {
    it('should update folder successfully', async () => {
      const id = 'folder-1'
      const data = { name: 'Updated Name' }
      const mockEntity = new FolderEntity('1', 'Updated Name', '/folder', null, 100)
      const mockDto: FolderDto = {
        id: '1',
        name: 'Updated Name',
        path: '/folder',
        parentId: null,
        size: '100',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      mockUpdateFolderUseCase.execute.mockResolvedValue(mockEntity)
      ;(FolderMappingService.entityToDto as any).mockReturnValue(mockDto)

      const result = await applicationService.updateFolder(id, data)

      expect(mockUpdateFolderUseCase.execute).toHaveBeenCalledWith(id, { name: data.name })
      expect(FolderMappingService.entityToDto).toHaveBeenCalledWith(mockEntity)
      expect(result).toBe(mockDto)
    })

    it('should throw error when update fails', async () => {
      const id = 'folder-1'
      const data = { name: 'Updated Name' }
      const error = new Error('Update failed')
      mockUpdateFolderUseCase.execute.mockRejectedValue(error)

      await expect(applicationService.updateFolder(id, data)).rejects.toThrow(
        'Failed to update folder: Update failed',
      )
    })
  })

  describe('deleteFolder', () => {
    it('should delete folder successfully', async () => {
      const folderId = 'folder-1'
      mockDeleteFolderUseCase.execute.mockResolvedValue(undefined)

      await expect(applicationService.deleteFolder(folderId)).resolves.toBeUndefined()

      expect(mockDeleteFolderUseCase.execute).toHaveBeenCalledWith(folderId)
    })

    it('should throw error when deletion fails', async () => {
      const folderId = 'folder-1'
      const error = new Error('Deletion failed')
      mockDeleteFolderUseCase.execute.mockRejectedValue(error)

      await expect(applicationService.deleteFolder(folderId)).rejects.toThrow(
        'Failed to delete folder: Deletion failed',
      )
    })
  })
})
