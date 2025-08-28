import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FolderSearchActions } from '../../../../presentation/stores/actions/FolderSearchActions'
import type { FolderState } from '../../../../presentation/stores/state/FolderState'
import type { ISearchService } from '../../../../domain/interfaces/IFolderServices'

// Mock dependencies
const mockState: FolderState = {
  searchQuery: { value: '' },
  isSearchMode: { value: false },
  isSearching: { value: false },
  searchResults: { value: [] },
  sidebarFolders: { value: [] },
} as any

const mockSearchService: ISearchService = {
  searchInFolderTree: vi.fn(),
  normalizeQuery: vi.fn(),
  isValidQuery: vi.fn(),
  highlightSearchTerms: vi.fn(),
}

describe('FolderSearchActions', () => {
  let searchActions: FolderSearchActions

  beforeEach(() => {
    vi.clearAllMocks()
    searchActions = new FolderSearchActions(mockState, mockSearchService)
  })

  describe('searchFolders', () => {
    it('should search folders successfully', async () => {
      const query = 'test query'
      const normalizedQuery = 'test query'
      const searchResults = [
        {
          id: '1',
          name: 'Test Folder',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      vi.mocked(mockSearchService.normalizeQuery).mockReturnValue(normalizedQuery)
      vi.mocked(mockSearchService.isValidQuery).mockReturnValue(true)
      vi.mocked(mockSearchService.searchInFolderTree).mockReturnValue(searchResults)

      await searchActions.searchFolders(query)

      expect(mockState.searchQuery.value).toBe(normalizedQuery)
      expect(mockState.isSearchMode.value).toBe(true)
      expect(mockState.isSearching.value).toBe(false)
      expect(mockState.searchResults.value).toBe(searchResults)
    })

    it('should handle invalid query', async () => {
      const query = 'invalid'

      vi.mocked(mockSearchService.normalizeQuery).mockReturnValue('invalid')
      vi.mocked(mockSearchService.isValidQuery).mockReturnValue(false)

      await searchActions.searchFolders(query)

      expect(mockState.isSearchMode.value).toBe(false)
      expect(mockState.searchResults.value).toEqual([])
    })

    it('should handle search error', async () => {
      const query = 'test'
      const error = new Error('Search failed')

      vi.mocked(mockSearchService.normalizeQuery).mockReturnValue('test')
      vi.mocked(mockSearchService.isValidQuery).mockReturnValue(true)
      vi.mocked(mockSearchService.searchInFolderTree).mockImplementation(() => {
        throw error
      })

      await searchActions.searchFolders(query)

      expect(mockState.searchResults.value).toEqual([])
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
