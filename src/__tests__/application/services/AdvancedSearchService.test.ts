import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AdvancedSearchService } from '@/application/services/AdvancedSearchService'
import type { ISearchService } from '@/domain/interfaces/IFolderServices'
import type { FolderItem } from '@/shared/types/explorer'

// Mock the basic search service
const mockBasicSearchService: ISearchService = {
  searchInFolderTree: vi.fn(),
  normalizeQuery: vi.fn(),
  isValidQuery: vi.fn(),
  highlightSearchTerms: vi.fn(),
}

describe('AdvancedSearchService', () => {
  let advancedSearchService: AdvancedSearchService

  beforeEach(() => {
    vi.clearAllMocks()
    advancedSearchService = new AdvancedSearchService(mockBasicSearchService)
  })

  describe('constructor', () => {
    it('should initialize with basic search service', () => {
      expect(advancedSearchService).toBeInstanceOf(AdvancedSearchService)
    })
  })

  describe('searchInFolderTree', () => {
    it('should combine basic and fuzzy search results', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Downloads',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const basicResults: FolderItem[] = [
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const fuzzyResults: any[] = [
        {
          id: '2',
          name: 'Downloads',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
          searchScore: 0.8,
        },
      ]

      ;(mockBasicSearchService.searchInFolderTree as any).mockReturnValue(basicResults)

      // Mock the fuzzy search to return results
      vi.spyOn(advancedSearchService as any, 'fuzzySearchInFolderTree').mockReturnValue(
        fuzzyResults,
      )
      vi.spyOn(advancedSearchService as any, 'deduplicateResults').mockReturnValue([
        ...basicResults,
        ...fuzzyResults,
      ])

      const results = advancedSearchService.searchInFolderTree(folders, 'doc')

      expect(mockBasicSearchService.searchInFolderTree).toHaveBeenCalledWith(folders, 'doc')
      expect(results).toHaveLength(2)
    })

    it('should handle empty results from both searches', () => {
      const folders: FolderItem[] = []

      ;(mockBasicSearchService.searchInFolderTree as any).mockReturnValue([])
      vi.spyOn(advancedSearchService as any, 'fuzzySearchInFolderTree').mockReturnValue([])
      vi.spyOn(advancedSearchService as any, 'deduplicateResults').mockReturnValue([])

      const results = advancedSearchService.searchInFolderTree(folders, 'test')

      expect(results).toHaveLength(0)
    })

    it('should search in nested folders', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Root',
          size: '0',
          icon: 'folder',
          children: [
            {
              id: '2',
              name: 'Nested',
              size: '0',
              icon: 'folder',
              updateAt: '2023-01-01T00:00:00.000Z',
            },
          ],
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      ;(mockBasicSearchService.searchInFolderTree as any).mockReturnValue([])
      vi.spyOn(advancedSearchService as any, 'fuzzySearchInFolderTree').mockReturnValue([])
      vi.spyOn(advancedSearchService as any, 'deduplicateResults').mockReturnValue([])

      advancedSearchService.searchInFolderTree(folders, 'nested')

      expect(mockBasicSearchService.searchInFolderTree).toHaveBeenCalledWith(folders, 'nested')
    })
  })

  describe('normalizeQuery', () => {
    it('should delegate to basic search service', () => {
      const query = 'Test Query'
      const normalizedQuery = 'test query'

      ;(mockBasicSearchService.normalizeQuery as any).mockReturnValue(normalizedQuery)

      const result = advancedSearchService.normalizeQuery(query)

      expect(mockBasicSearchService.normalizeQuery).toHaveBeenCalledWith(query)
      expect(result).toBe(normalizedQuery)
    })
  })

  describe('isValidQuery', () => {
    it('should delegate to basic search service', () => {
      const query = 'valid query'

      ;(mockBasicSearchService.isValidQuery as any).mockReturnValue(true)

      const result = advancedSearchService.isValidQuery(query)

      expect(mockBasicSearchService.isValidQuery).toHaveBeenCalledWith(query)
      expect(result).toBe(true)
    })
  })

  describe('highlightSearchTerms', () => {
    it('should delegate to basic search service', () => {
      const text = 'This is a test'
      const query = 'test'
      const highlightedText = 'This is a <mark>test</mark>'

      ;(mockBasicSearchService.highlightSearchTerms as any).mockReturnValue(highlightedText)

      const result = advancedSearchService.highlightSearchTerms(text, query)

      expect(mockBasicSearchService.highlightSearchTerms).toHaveBeenCalledWith(text, query)
      expect(result).toBe(highlightedText)
    })
  })

  describe('fuzzySearchInFolderTree', () => {
    it('should return folders with high similarity scores', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Downloads',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      // Mock calculateSimilarity to return high score for Documents
      vi.spyOn(advancedSearchService as any, 'calculateSimilarity')
        .mockReturnValueOnce(0.9) // Documents vs docs
        .mockReturnValueOnce(0.3) // Downloads vs docs

      const results = (advancedSearchService as any).fuzzySearchInFolderTree(folders, 'docs')

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Documents')
      expect(results[0].searchScore).toBe(0.9)
    })

    it('should search in nested folders', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Root',
          size: '0',
          icon: 'folder',
          children: [
            {
              id: '2',
              name: 'Documents',
              size: '0',
              icon: 'folder',
              updateAt: '2023-01-01T00:00:00.000Z',
            },
          ],
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      vi.spyOn(advancedSearchService as any, 'calculateSimilarity')
        .mockReturnValueOnce(0.2) // Root vs docs
        .mockReturnValueOnce(0.9) // Documents vs docs

      const results = (advancedSearchService as any).fuzzySearchInFolderTree(folders, 'docs')

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Documents')
    })

    it('should return results sorted by similarity score', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Docs',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      vi.spyOn(advancedSearchService as any, 'calculateSimilarity')
        .mockReturnValueOnce(0.7) // Documents vs docs
        .mockReturnValueOnce(0.95) // Docs vs docs

      const results = (advancedSearchService as any).fuzzySearchInFolderTree(folders, 'docs')

      expect(results).toHaveLength(2)
      expect(results[0].name).toBe('Docs') // Higher score first
      expect(results[1].name).toBe('Documents')
    })
  })

  describe('calculateSimilarity', () => {
    it('should calculate Levenshtein distance similarity', () => {
      const similarity = (advancedSearchService as any).calculateSimilarity('test', 'test')

      expect(similarity).toBe(1) // Exact match
    })

    it('should handle partial matches', () => {
      const similarity = (advancedSearchService as any).calculateSimilarity('testing', 'test')

      expect(similarity).toBeGreaterThan(0.5)
      expect(similarity).toBeLessThan(1)
    })

    it('should return 0 for completely different strings', () => {
      const similarity = (advancedSearchService as any).calculateSimilarity('abc', 'xyz')

      expect(similarity).toBe(0)
    })

    it('should handle empty strings', () => {
      expect((advancedSearchService as any).calculateSimilarity('', '')).toBe(1)
      expect((advancedSearchService as any).calculateSimilarity('test', '')).toBe(0)
      expect((advancedSearchService as any).calculateSimilarity('', 'test')).toBe(0)
    })
  })

  describe('deduplicateResults', () => {
    it('should remove duplicate folders by id', () => {
      const results: FolderItem[] = [
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Downloads',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const deduplicated = (advancedSearchService as any).deduplicateResults(results)

      expect(deduplicated).toHaveLength(2)
      expect(deduplicated.map((r: FolderItem) => r.id)).toEqual(['1', '2'])
    })

    it('should handle empty array', () => {
      const results: FolderItem[] = []
      const deduplicated = (advancedSearchService as any).deduplicateResults(results)

      expect(deduplicated).toHaveLength(0)
    })
  })
})
