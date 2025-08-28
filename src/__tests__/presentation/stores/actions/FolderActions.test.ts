import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FolderActions } from '../../../../presentation/stores/actions/FolderActions'
import type { FolderState } from '../../../../presentation/stores/state/FolderState'
import type { CreateFolderRequest } from '@/application/dto/FolderDto'

// Mock dependencies
const mockState: FolderState = {
  selectedFolderId: { value: 'test-folder-id' },
  currentFolderChildren: { value: [] },
} as any

const mockApplicationService = {
  createFolder: vi.fn(),
} as any

const mockLoadingActions = {
  loadSidebarFolders: vi.fn(),
  loadFolderChildren: vi.fn(),
} as any

describe('FolderActions', () => {
  let folderActions: FolderActions

  beforeEach(() => {
    vi.clearAllMocks()
    folderActions = new FolderActions(mockState, mockApplicationService, mockLoadingActions)
  })

  describe('createFolder', () => {
    it('should create folder successfully', async () => {
      const request: CreateFolderRequest = {
        name: 'Test Folder',
        path: '/test/path',
        parentId: 'parent-id',
      }

      vi.mocked(mockApplicationService.createFolder).mockResolvedValue(undefined)
      vi.mocked(mockLoadingActions.loadSidebarFolders).mockResolvedValue(undefined)
      vi.mocked(mockLoadingActions.loadFolderChildren).mockResolvedValue(undefined)

      const result = await folderActions.createFolder(request)

      expect(mockApplicationService.createFolder).toHaveBeenCalledWith(request)
      expect(mockLoadingActions.loadSidebarFolders).toHaveBeenCalled()
      expect(result.success).toBe(true)
      expect(result.message).toBe('Folder berhasil dibuat')
    })

    it('should reload children when parent matches selected folder', async () => {
      const request: CreateFolderRequest = {
        name: 'Test Folder',
        path: '/test/path',
        parentId: 'test-folder-id',
      }

      vi.mocked(mockApplicationService.createFolder).mockResolvedValue(undefined)
      vi.mocked(mockLoadingActions.loadSidebarFolders).mockResolvedValue(undefined)
      vi.mocked(mockLoadingActions.loadFolderChildren).mockResolvedValue(undefined)

      await folderActions.createFolder(request)

      expect(mockLoadingActions.loadFolderChildren).toHaveBeenCalledWith('test-folder-id')
    })

    it('should handle create folder error', async () => {
      const request: CreateFolderRequest = {
        name: 'Test Folder',
        path: '/test/path',
        parentId: 'parent-id',
      }
      const error = new Error('Create failed')

      vi.mocked(mockApplicationService.createFolder).mockRejectedValue(error)

      const result = await folderActions.createFolder(request)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Error: Create failed')
    })
  })

  describe('generateUniqueFolderName', () => {
    it('should return base name when no conflict', () => {
      mockState.currentFolderChildren.value = [{ name: 'Existing Folder' }] as any

      const result = folderActions.generateUniqueFolderName('New Folder')

      expect(result).toBe('New Folder')
    })

    it('should generate copy name when base name exists', () => {
      mockState.currentFolderChildren.value = [{ name: 'New Folder' }] as any

      const result = folderActions.generateUniqueFolderName('New Folder')

      expect(result).toBe('New Folder-copy')
    })

    it('should generate numbered copy when copy name also exists', () => {
      mockState.currentFolderChildren.value = [
        { name: 'New Folder' },
        { name: 'New Folder-copy' },
      ] as any

      const result = folderActions.generateUniqueFolderName('New Folder')

      expect(result).toBe('New Folder-copy2')
    })

    it('should handle case insensitive matching', () => {
      mockState.currentFolderChildren.value = [{ name: 'new folder' }] as any

      const result = folderActions.generateUniqueFolderName('New Folder')

      expect(result).toBe('New Folder-copy')
    })
  })
})
