import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FolderSelectionActions } from '../../../../presentation/stores/actions/FolderSelectionActions'
import type { FolderState } from '../../../../presentation/stores/state/FolderState'
import type {
  IFolderDataService,
  INavigationHistoryService,
} from '../../../../domain/interfaces/IFolderServices'

// Mock dependencies
const mockState: FolderState = {
  isSearchMode: { value: false },
  selectedFolderId: { value: null },
  selectedMainFolderId: { value: null },
  folderHierarchy: { value: null },
  currentPath: { value: '' },
  currentHistoryIndex: { value: 0 },
  navigationHistory: { value: [] },
  searchQuery: { value: '' },
  searchResults: { value: [] },
  isSearching: { value: false },
} as any

const mockLoadingActions: IFolderDataService = {
  loadFolderChildren: vi.fn(),
} as any

const mockNavigationService: INavigationHistoryService = {
  addToHistory: vi.fn(),
  clearHistory: vi.fn(),
} as any

describe('FolderSelectionActions', () => {
  let selectionActions: FolderSelectionActions

  beforeEach(() => {
    vi.clearAllMocks()
    selectionActions = new FolderSelectionActions(
      mockState,
      mockLoadingActions,
      mockNavigationService,
    )
  })

  describe('selectFolder', () => {
    it('should select folder and load children', async () => {
      const folderId = 'test-folder-id'

      const loadChildrenMock = vi.fn().mockResolvedValue(undefined)
      mockLoadingActions.loadFolderChildren = loadChildrenMock

      await selectionActions.selectFolder(folderId)

      expect(mockState.selectedFolderId.value).toBe(folderId)
      expect(loadChildrenMock).toHaveBeenCalledWith(folderId)
    })

    it('should clear search mode when selecting folder', async () => {
      mockState.isSearchMode.value = true

      await selectionActions.selectFolder('test-id')

      expect(mockState.isSearchMode.value).toBe(false)
    })

    it('should add to history by default', async () => {
      const folderId = 'test-folder-id'

      await selectionActions.selectFolder(folderId)

      expect(mockNavigationService.addToHistory).toHaveBeenCalledWith(folderId)
    })

    it('should skip history when specified', async () => {
      const folderId = 'test-folder-id'

      await selectionActions.selectFolder(folderId, true)

      expect(mockNavigationService.addToHistory).not.toHaveBeenCalled()
    })
  })

  describe('selectMainFolder', () => {
    it('should set selected main folder id', () => {
      const folderId = 'main-folder-id'

      selectionActions.selectMainFolder(folderId)

      expect(mockState.selectedMainFolderId.value).toBe(folderId)
    })
  })

  describe('clearMainSelection', () => {
    it('should clear selected main folder id', () => {
      mockState.selectedMainFolderId.value = 'some-id'

      selectionActions.clearMainSelection()

      expect(mockState.selectedMainFolderId.value).toBeNull()
    })
  })
})
