import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FolderHelperActions } from '../../../../presentation/stores/actions/FolderHelperActions'
import type { FolderState } from '../../../../presentation/stores/state/FolderState'
import type { FolderItem } from '../../../../shared/types/explorer'

// Mock dependencies
const mockState: FolderState = {
  sidebarFolders: { value: [] },
} as any

describe('FolderHelperActions', () => {
  let helperActions: FolderHelperActions

  beforeEach(() => {
    vi.clearAllMocks()
    helperActions = new FolderHelperActions(mockState)
  })

  describe('toggleFolderExpansion', () => {
    it('should toggle folder expansion for root level folder', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Folder 1',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
          isExpanded: false,
        },
      ]

      mockState.sidebarFolders.value = folders

      helperActions.toggleFolderExpansion('1')

      expect(folders[0].isExpanded).toBe(true)
    })

    it('should toggle folder expansion for nested folder', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Parent',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
          children: [
            {
              id: '2',
              name: 'Child',
              size: '0',
              icon: 'folder',
              updateAt: '2023-01-01T00:00:00.000Z',
              isExpanded: false,
            },
          ],
        },
      ]

      mockState.sidebarFolders.value = folders

      helperActions.toggleFolderExpansion('2')

      expect(folders[0].children![0].isExpanded).toBe(true)
    })

    it('should handle non-existent folder id', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Folder 1',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
          isExpanded: false,
        },
      ]

      mockState.sidebarFolders.value = folders

      helperActions.toggleFolderExpansion('non-existent')

      expect(folders[0].isExpanded).toBe(false)
    })
  })
})
