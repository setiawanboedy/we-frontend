import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { FolderRepository } from '../../../infrastructure/repositories/FolderRepository'
import type { CreateFolderRequest } from '../../../application/dto/CreateFolderRequest'
import type { UpdateFolderRequest } from '../../../application/dto/UpdateFolderRequest'
import { FolderEntity } from '../../../domain/entities/FolderEntity'
import { FolderHierarchy } from '../../../domain/entities/FolderHierarchy'
import { folderApiService } from '../../../infrastructure/api/folderApi'
import { FolderMappingService } from '../../../application/services/FolderMappingService'

// Mock the dependencies
vi.mock('../../../infrastructure/api/folderApi', () => ({
  folderApiService: {
    getAllFolders: vi.fn(),
    getFolderById: vi.fn(),
    getRootFolders: vi.fn(),
    getFolderChildren: vi.fn(),
    createFolder: vi.fn(),
    updateFolder: vi.fn(),
    deleteFolder: vi.fn(),
  },
}))

vi.mock('../../../application/services/FolderMappingService', () => ({
  FolderMappingService: {
    folderWithChildrenToNode: vi.fn(),
    folderToEntity: vi.fn(),
  },
}))

describe('FolderRepository', () => {
  let repository: FolderRepository
  let mockFolderApiService: {
    getAllFolders: Mock
    getFolderById: Mock
    getRootFolders: Mock
    getFolderChildren: Mock
    createFolder: Mock
    updateFolder: Mock
    deleteFolder: Mock
  }
  let mockFolderMappingService: {
    folderWithChildrenToNode: Mock
    folderToEntity: Mock
  }

  beforeEach(() => {
    repository = new FolderRepository()
    mockFolderApiService = folderApiService as any
    mockFolderMappingService = FolderMappingService as any

    // Clear mocks
    vi.clearAllMocks()
  })

  describe('getAllWithHierarchy', () => {
    it('should return folder hierarchy successfully', async () => {
      const mockFolders = [
        {
          id: '1',
          name: 'Root',
          path: '/root',
          parentId: null,
          size: 0,
          children: [],
        },
      ]
      const mockResponse = {
        success: true,
        data: mockFolders,
      }
      const mockNode = {
        id: '1',
        name: 'Root',
        path: '/root',
        parentId: null,
        size: '0',
        children: [],
      }
      const expectedHierarchy = new FolderHierarchy([mockNode])

      mockFolderApiService.getAllFolders.mockResolvedValue(mockResponse)
      mockFolderMappingService.folderWithChildrenToNode.mockReturnValue(mockNode)

      const result = await repository.getAllWithHierarchy()

      expect(mockFolderApiService.getAllFolders).toHaveBeenCalled()
      expect(mockFolderMappingService.folderWithChildrenToNode).toHaveBeenCalledWith(mockFolders[0])
      expect(result).toEqual(expectedHierarchy)
    })

    it('should throw error when API call fails', async () => {
      const mockResponse = {
        success: false,
        error: 'API Error',
      }

      mockFolderApiService.getAllFolders.mockResolvedValue(mockResponse)

      await expect(repository.getAllWithHierarchy()).rejects.toThrow('API Error')
    })

    it('should throw error when response has no data', async () => {
      const mockResponse = {
        success: true,
        data: null,
      }

      mockFolderApiService.getAllFolders.mockResolvedValue(mockResponse)

      await expect(repository.getAllWithHierarchy()).rejects.toThrow(
        'Failed to get folder hierarchy',
      )
    })
  })

  describe('getById', () => {
    it('should return folder entity when found', async () => {
      const folderId = 'test-id'
      const mockFolder = {
        id: folderId,
        name: 'Test Folder',
        path: '/test',
        parentId: null,
        size: 1024,
      }
      const mockResponse = {
        success: true,
        data: mockFolder,
      }
      const mockEntity = new FolderEntity(folderId, 'Test Folder', '/test', null, 1024)

      mockFolderApiService.getFolderById.mockResolvedValue(mockResponse)
      mockFolderMappingService.folderToEntity.mockReturnValue(mockEntity)

      const result = await repository.getById(folderId)

      expect(mockFolderApiService.getFolderById).toHaveBeenCalledWith(folderId)
      expect(mockFolderMappingService.folderToEntity).toHaveBeenCalledWith(mockFolder)
      expect(result).toEqual(mockEntity)
    })

    it('should return null when folder not found', async () => {
      const folderId = 'test-id'
      const mockResponse = {
        success: false,
        error: 'Folder not found',
      }

      mockFolderApiService.getFolderById.mockResolvedValue(mockResponse)

      const result = await repository.getById(folderId)

      expect(result).toBeNull()
    })

    it('should throw error when API call fails with other error', async () => {
      const folderId = 'test-id'
      const mockResponse = {
        success: false,
        error: 'Server Error',
      }

      mockFolderApiService.getFolderById.mockResolvedValue(mockResponse)

      await expect(repository.getById(folderId)).rejects.toThrow('Server Error')
    })

    it('should return null when response has no data', async () => {
      const folderId = 'test-id'
      const mockResponse = {
        success: true,
        data: null,
      }

      mockFolderApiService.getFolderById.mockResolvedValue(mockResponse)

      const result = await repository.getById(folderId)

      expect(result).toBeNull()
    })
  })

  describe('getRoots', () => {
    it('should return root folders successfully', async () => {
      const mockFolders = [
        {
          id: '1',
          name: 'Root1',
          path: '/root1',
          parentId: null,
          size: '0',
        },
        {
          id: '2',
          name: 'Root2',
          path: '/root2',
          parentId: null,
          size: '0',
        },
      ]
      const mockResponse = {
        success: true,
        data: mockFolders,
      }
      const mockEntities = [
        new FolderEntity('1', 'Root1', '/root1', null, 0),
        new FolderEntity('2', 'Root2', '/root2', null, 0),
      ]

      mockFolderApiService.getRootFolders.mockResolvedValue(mockResponse)
      mockFolderMappingService.folderToEntity
        .mockReturnValueOnce(mockEntities[0])
        .mockReturnValueOnce(mockEntities[1])

      const result = await repository.getRoots()

      expect(mockFolderApiService.getRootFolders).toHaveBeenCalled()
      expect(mockFolderMappingService.folderToEntity).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockEntities)
    })

    it('should throw error when API call fails', async () => {
      const mockResponse = {
        success: false,
        error: 'API Error',
      }

      mockFolderApiService.getRootFolders.mockResolvedValue(mockResponse)

      await expect(repository.getRoots()).rejects.toThrow('API Error')
    })

    it('should throw error when response has no data', async () => {
      const mockResponse = {
        success: true,
        data: null,
      }

      mockFolderApiService.getRootFolders.mockResolvedValue(mockResponse)

      await expect(repository.getRoots()).rejects.toThrow('Failed to get root folders')
    })
  })

  describe('getChildren', () => {
    it('should return folder children successfully', async () => {
      const parentId = 'parent-id'
      const mockFolders = [
        {
          id: '1',
          name: 'Child1',
          path: '/parent/child1',
          parentId: parentId,
          size: 512,
        },
      ]
      const mockResponse = {
        success: true,
        data: mockFolders,
      }
      const mockEntities = [new FolderEntity('1', 'Child1', '/parent/child1', parentId, 512)]

      mockFolderApiService.getFolderChildren.mockResolvedValue(mockResponse)
      mockFolderMappingService.folderToEntity.mockReturnValue(mockEntities[0])

      const result = await repository.getChildren(parentId)

      expect(mockFolderApiService.getFolderChildren).toHaveBeenCalledWith(parentId)
      expect(mockFolderMappingService.folderToEntity).toHaveBeenCalledWith(mockFolders[0])
      expect(result).toEqual(mockEntities)
    })

    it('should throw error when API call fails', async () => {
      const parentId = 'parent-id'
      const mockResponse = {
        success: false,
        error: 'API Error',
      }

      mockFolderApiService.getFolderChildren.mockResolvedValue(mockResponse)

      await expect(repository.getChildren(parentId)).rejects.toThrow('API Error')
    })

    it('should throw error when response has no data', async () => {
      const parentId = 'parent-id'
      const mockResponse = {
        success: true,
        data: null,
      }

      mockFolderApiService.getFolderChildren.mockResolvedValue(mockResponse)

      await expect(repository.getChildren(parentId)).rejects.toThrow(
        'Failed to get folder children',
      )
    })
  })

  describe('create', () => {
    it('should create folder successfully', async () => {
      const createData: CreateFolderRequest = {
        name: 'New Folder',
        path: '/new/folder',
        parentId: 'parent-id',
      }
      const mockFolder = {
        id: 'new-id',
        name: 'New Folder',
        path: '/new/folder',
        parentId: 'parent-id',
        size: 0,
      }
      const mockResponse = {
        success: true,
        data: mockFolder,
      }
      const mockEntity = new FolderEntity('new-id', 'New Folder', '/new/folder', 'parent-id', 0)

      mockFolderApiService.createFolder.mockResolvedValue(mockResponse)
      mockFolderMappingService.folderToEntity.mockReturnValue(mockEntity)

      const result = await repository.create(createData)

      expect(mockFolderApiService.createFolder).toHaveBeenCalledWith({
        name: createData.name,
        path: createData.path,
        parentId: createData.parentId,
      })
      expect(mockFolderMappingService.folderToEntity).toHaveBeenCalledWith(mockFolder)
      expect(result).toEqual(mockEntity)
    })

    it('should create folder with undefined parentId when parentId is not provided', async () => {
      const createData: CreateFolderRequest = {
        name: 'New Folder',
        path: '/new/folder',
      }
      const mockFolder = {
        id: 'new-id',
        name: 'New Folder',
        path: '/new/folder',
        parentId: null,
        size: 0,
      }
      const mockResponse = {
        success: true,
        data: mockFolder,
      }
      const mockEntity = new FolderEntity('new-id', 'New Folder', '/new/folder', null, 0)

      mockFolderApiService.createFolder.mockResolvedValue(mockResponse)
      mockFolderMappingService.folderToEntity.mockReturnValue(mockEntity)

      const result = await repository.create(createData)

      expect(mockFolderApiService.createFolder).toHaveBeenCalledWith({
        name: createData.name,
        path: createData.path,
        parentId: undefined,
      })
      expect(result).toEqual(mockEntity)
    })

    it('should throw error when API call fails', async () => {
      const createData: CreateFolderRequest = {
        name: 'New Folder',
        path: '/new/folder',
      }
      const mockResponse = {
        success: false,
        error: 'API Error',
      }

      mockFolderApiService.createFolder.mockResolvedValue(mockResponse)

      await expect(repository.create(createData)).rejects.toThrow('API Error')
    })

    it('should throw error when response has no data', async () => {
      const createData: CreateFolderRequest = {
        name: 'New Folder',
        path: '/new/folder',
      }
      const mockResponse = {
        success: true,
        data: null,
      }

      mockFolderApiService.createFolder.mockResolvedValue(mockResponse)

      await expect(repository.create(createData)).rejects.toThrow('Failed to create folder')
    })
  })

  describe('update', () => {
    it('should update folder successfully', async () => {
      const folderId = 'update-id'
      const updateData: UpdateFolderRequest = {
        name: 'Updated Name',
        path: '/updated/path',
        parentId: 'new-parent-id',
      }
      const mockFolder = {
        id: folderId,
        name: 'Updated Name',
        path: '/updated/path',
        parentId: 'new-parent-id',
        size: 1024,
      }
      const mockResponse = {
        success: true,
        data: mockFolder,
      }
      const mockEntity = new FolderEntity(
        folderId,
        'Updated Name',
        '/updated/path',
        'new-parent-id',
        1024,
      )

      mockFolderApiService.updateFolder.mockResolvedValue(mockResponse)
      mockFolderMappingService.folderToEntity.mockReturnValue(mockEntity)

      const result = await repository.update(folderId, updateData)

      expect(mockFolderApiService.updateFolder).toHaveBeenCalledWith(folderId, {
        name: updateData.name,
        path: updateData.path,
        parentId: updateData.parentId,
      })
      expect(mockFolderMappingService.folderToEntity).toHaveBeenCalledWith(mockFolder)
      expect(result).toEqual(mockEntity)
    })

    it('should update folder with undefined parentId when parentId is null', async () => {
      const folderId = 'update-id'
      const updateData: UpdateFolderRequest = {
        name: 'Updated Name',
        path: '/updated/path',
        parentId: undefined,
      }
      const mockFolder = {
        id: folderId,
        name: 'Updated Name',
        path: '/updated/path',
        parentId: null,
        size: 1024,
      }
      const mockResponse = {
        success: true,
        data: mockFolder,
      }
      const mockEntity = new FolderEntity(folderId, 'Updated Name', '/updated/path', null, 1024)

      mockFolderApiService.updateFolder.mockResolvedValue(mockResponse)
      mockFolderMappingService.folderToEntity.mockReturnValue(mockEntity)

      const result = await repository.update(folderId, updateData)

      expect(mockFolderApiService.updateFolder).toHaveBeenCalledWith(folderId, {
        name: updateData.name,
        path: updateData.path,
        parentId: undefined,
      })
      expect(result).toEqual(mockEntity)
    })

    it('should throw error when API call fails', async () => {
      const folderId = 'update-id'
      const updateData: UpdateFolderRequest = {
        name: 'Updated Name',
        path: '/updated/path',
      }
      const mockResponse = {
        success: false,
        error: 'API Error',
      }

      mockFolderApiService.updateFolder.mockResolvedValue(mockResponse)

      await expect(repository.update(folderId, updateData)).rejects.toThrow('API Error')
    })

    it('should throw error when response has no data', async () => {
      const folderId = 'update-id'
      const updateData: UpdateFolderRequest = {
        name: 'Updated Name',
        path: '/updated/path',
      }
      const mockResponse = {
        success: true,
        data: null,
      }

      mockFolderApiService.updateFolder.mockResolvedValue(mockResponse)

      await expect(repository.update(folderId, updateData)).rejects.toThrow(
        'Failed to update folder',
      )
    })
  })

  describe('delete', () => {
    it('should delete folder successfully', async () => {
      const folderId = 'delete-id'
      const mockResponse = {
        success: true,
      }

      mockFolderApiService.deleteFolder.mockResolvedValue(mockResponse)

      await expect(repository.delete(folderId)).resolves.toBeUndefined()

      expect(mockFolderApiService.deleteFolder).toHaveBeenCalledWith(folderId)
    })

    it('should throw error when API call fails', async () => {
      const folderId = 'delete-id'
      const mockResponse = {
        success: false,
        error: 'API Error',
      }

      mockFolderApiService.deleteFolder.mockResolvedValue(mockResponse)

      await expect(repository.delete(folderId)).rejects.toThrow('API Error')
    })
  })

  describe('exists', () => {
    it('should return true when folder exists', async () => {
      const folderId = 'exists-id'
      const mockEntity = new FolderEntity(folderId, 'Test', '/test', null, 0)

      mockFolderMappingService.folderToEntity.mockReturnValue(mockEntity)
      mockFolderApiService.getFolderById.mockResolvedValue({
        success: true,
        data: { id: folderId, name: 'Test', path: '/test', parentId: null, size: 0 },
      })

      const result = await repository.exists(folderId)

      expect(result).toBe(true)
    })

    it('should return false when folder does not exist', async () => {
      const folderId = 'not-exists-id'

      mockFolderApiService.getFolderById.mockResolvedValue({
        success: false,
        error: 'Folder not found',
      })

      const result = await repository.exists(folderId)

      expect(result).toBe(false)
    })

    it('should return false when getById throws error', async () => {
      const folderId = 'error-id'

      mockFolderApiService.getFolderById.mockResolvedValue({
        success: false,
        error: 'Server Error',
      })

      const result = await repository.exists(folderId)

      expect(result).toBe(false)
    })
  })
})
