import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FolderLoadingActions } from '../../../../presentation/stores/actions/FolderLoadingActions'
import type { FolderState } from '../../../../presentation/stores/state/FolderState'
import type { ApplicationService } from '../../../../application/services/ApplicationService'
import type { FolderItem } from '../../../../shared/types/explorer'

// Mock the folderHelpers module
vi.mock('../../../../shared/utils/folderHelpers', () => ({
  convertFolderToUI: vi.fn((folder) => ({
    id: folder.id,
    name: folder.name,
    size: folder.size,
    icon: 'folder',
    updateAt: folder.updateAt,
    isExpanded: false,
    parentId: undefined,
    path: undefined,
  })),
}))

// Mock dependencies
const mockState: FolderState = {
  isLoadingSidebar: { value: false },
  sidebarError: { value: null },
  sidebarFolders: { value: [] },
  folderHierarchy: { value: null },
  currentFolderChildren: { value: [] },
  isLoadingChildren: { value: false },
  childrenError: { value: null },
  selectedFolderId: { value: null },
} as any

const mockAppService: ApplicationService = {
  getFolderHierarchy: vi.fn(),
  getFolderChildren: vi.fn(),
} as any

describe('FolderLoadingActions', () => {
  let loadingActions: FolderLoadingActions

  beforeEach(() => {
    vi.clearAllMocks()
    loadingActions = new FolderLoadingActions(mockState, mockAppService)
  })

  describe('loadSidebarFolders', () => {
    it('should load sidebar folders successfully', async () => {
      const mockHierarchy = [{ id: 'root', name: 'Root', children: [] }]
      const mockUIFolders: FolderItem[] = [
        {
          id: '1',
          name: 'Test Folder',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      vi.mocked(mockAppService.getFolderHierarchy).mockResolvedValue(mockHierarchy as any)

      await loadingActions.loadSidebarFolders()

      expect(mockState.isLoadingSidebar.value).toBe(false)
      expect(mockState.sidebarError.value).toBeNull()
    })

    it('should handle load sidebar folders error', async () => {
      const error = new Error('Load failed')

      vi.mocked(mockAppService.getFolderHierarchy).mockRejectedValue(error)

      await loadingActions.loadSidebarFolders()

      expect(mockState.isLoadingSidebar.value).toBe(false)
      expect(mockState.sidebarError.value).toBe('Terjadi kesalahan: Load failed')
    })
  })

  describe('loadFolderChildren', () => {
    it('should load folder children successfully', async () => {
      const folderId = 'test-folder-id'
      const mockChildren = [
        {
          id: 'child1',
          name: 'Child 1',
          size: '0',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]
      const expectedTransformedChildren = [
        {
          id: 'child1',
          name: 'Child 1',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
          isExpanded: false,
          parentId: undefined,
          path: undefined,
        },
      ]

      vi.mocked(mockAppService.getFolderChildren).mockResolvedValue(mockChildren as any)

      await loadingActions.loadFolderChildren(folderId)

      expect(mockState.isLoadingChildren.value).toBe(false)
      expect(mockState.childrenError.value).toBeNull()
      expect(mockState.currentFolderChildren.value).toEqual(expectedTransformedChildren)
    })

    it('should handle load folder children error', async () => {
      const folderId = 'test-folder-id'
      const error = new Error('Load children failed')

      vi.mocked(mockAppService.getFolderChildren).mockRejectedValue(error)

      await loadingActions.loadFolderChildren(folderId)

      expect(mockState.isLoadingChildren.value).toBe(false)
      expect(mockState.childrenError.value).toBe('Terjadi kesalahan: Load children failed')
    })
  })
})
