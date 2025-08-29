import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FolderSearchActions } from '../../../../presentation/stores/actions/FolderSearchActions'
import type { FolderState } from '../../../../presentation/stores/state/FolderState'
import type { ApplicationFolderService } from '../../../../application/services/ApplicationFolderService'
import type { FolderDto } from '../../../../application/dto/FolderDto'

// Mock dependencies
const mockState: FolderState = {
  searchQuery: { value: '' },
  isSearchMode: { value: false },
  isSearching: { value: false },
  searchResults: { value: [] },
  sidebarFolders: { value: [] },
  folderError: { value: null },
} as any

const mockAppFolderService = {
  searchFolders: vi.fn(),
} as any


describe('FolderSearchActions', () => {
  let searchActions: FolderSearchActions

  beforeEach(() => {
    vi.clearAllMocks()
    searchActions = new FolderSearchActions(mockState, mockAppFolderService)
  })

  describe('searchFolders', () => {
    it('should search folders successfully', async () => {
      const query = 'test query'
      const mockFolders: FolderDto[] = [
        {
          id: '1',
          name: 'Test Folder',
          path: '/test',
          parentId: null,
          size: '0',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      mockAppFolderService.searchFolders.mockResolvedValue(mockFolders)

      const result = await searchActions.searchFolders(query)

      expect(mockAppFolderService.searchFolders).toHaveBeenCalledWith({
        name: query,
        limit: 10,
        offset: 1
      })
      expect(mockState.searchQuery.value).toBe(query)
      expect(mockState.isSearchMode.value).toBe(true)
      expect(mockState.isSearching.value).toBe(false)
      expect(result).toBe(mockFolders)
    })

    it('should handle search error', async () => {
      const query = 'test'
      const error = new Error('Search failed')

      mockAppFolderService.searchFolders.mockRejectedValue(error)

      await expect(searchActions.searchFolders(query)).rejects.toThrow('Search failed')

      expect(mockState.folderError.value).toBe('Search failed')
      expect(mockState.isSearching.value).toBe(false)
    })
  })

  describe('clearSearch', () => {
    it('should clear all search state', () => {
      mockState.searchQuery.value = 'test'
      mockState.searchResults.value = [
        { id: '1', name: 'Test', size: '0', icon: 'folder', updateAt: '2023-01-01T00:00:00.000Z' },
      ]
      mockState.isSearchMode.value = true
      mockState.isSearching.value = true

      searchActions.clearSearch()

      expect(mockState.searchQuery.value).toBe('')
      expect(mockState.searchResults.value).toEqual([])
      expect(mockState.isSearchMode.value).toBe(false)
      expect(mockState.isSearching.value).toBe(false)
    })
  })
})
