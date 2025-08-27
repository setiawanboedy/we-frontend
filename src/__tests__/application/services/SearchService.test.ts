import { describe, it, expect, beforeEach } from 'vitest'
import { SearchService } from '@/application/services/SearchService'
import type { FolderItem } from '@/shared/types/explorer'

describe('SearchService', () => {
  let searchService: SearchService

  beforeEach(() => {
    searchService = new SearchService()
  })

  describe('searchInFolderTree', () => {
    it('should return folders that match the query', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          children: [
            {
              id: '2',
              name: 'Work',
              size: '0',
              icon: 'folder',
              updateAt: '2023-01-01T00:00:00.000Z',
            },
            {
              id: '3',
              name: 'Personal',
              size: '0',
              icon: 'folder',
              updateAt: '2023-01-01T00:00:00.000Z',
            },
          ],
          updateAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '4',
          name: 'Downloads',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const results = searchService.searchInFolderTree(folders, 'work')

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Work')
    })

    it('should return multiple matches', () => {
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
          name: 'Work Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '3',
          name: 'Personal',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const results = searchService.searchInFolderTree(folders, 'doc')

      expect(results).toHaveLength(2)
      expect(results.map((r) => r.name)).toEqual(['Documents', 'Work Documents'])
    })

    it('should search case-insensitively', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const results = searchService.searchInFolderTree(folders, 'DOCUMENTS')

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Documents')
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
              name: 'Level 1',
              size: '0',
              icon: 'folder',
              children: [
                {
                  id: '3',
                  name: 'Target Folder',
                  size: '0',
                  icon: 'folder',
                  updateAt: '2023-01-01T00:00:00.000Z',
                },
              ],
              updateAt: '2023-01-01T00:00:00.000Z',
            },
          ],
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const results = searchService.searchInFolderTree(folders, 'target')

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Target Folder')
    })

    it('should return empty array when no matches found', () => {
      const folders: FolderItem[] = [
        {
          id: '1',
          name: 'Documents',
          size: '0',
          icon: 'folder',
          updateAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const results = searchService.searchInFolderTree(folders, 'nonexistent')

      expect(results).toHaveLength(0)
    })

    it('should handle empty folder array', () => {
      const results = searchService.searchInFolderTree([], 'test')

      expect(results).toHaveLength(0)
    })
  })

  describe('normalizeQuery', () => {
    it('should trim whitespace and convert to lowercase', () => {
      const result = searchService.normalizeQuery('  Test Query  ')

      expect(result).toBe('test query')
    })

    it('should handle empty string', () => {
      const result = searchService.normalizeQuery('')

      expect(result).toBe('')
    })

    it('should handle string with only whitespace', () => {
      const result = searchService.normalizeQuery('   ')

      expect(result).toBe('')
    })
  })

  describe('isValidQuery', () => {
    it('should return true for valid queries', () => {
      expect(searchService.isValidQuery('test')).toBe(true)
      expect(searchService.isValidQuery('a')).toBe(true)
      expect(searchService.isValidQuery('query with spaces')).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(searchService.isValidQuery('')).toBe(false)
    })

    it('should return false for whitespace-only string', () => {
      expect(searchService.isValidQuery('   ')).toBe(false)
    })

    it('should return false for query longer than 100 characters', () => {
      const longQuery = 'a'.repeat(101)
      expect(searchService.isValidQuery(longQuery)).toBe(false)
    })

    it('should return true for query exactly 100 characters', () => {
      const hundredCharQuery = 'a'.repeat(100)
      expect(searchService.isValidQuery(hundredCharQuery)).toBe(true)
    })
  })

  describe('highlightSearchTerms', () => {
    it('should wrap search terms with mark tags', () => {
      const result = searchService.highlightSearchTerms('This is a test string', 'test')

      expect(result).toBe('This is a <mark>test</mark> string')
    })

    it('should handle multiple occurrences', () => {
      const result = searchService.highlightSearchTerms('test test test', 'test')

      expect(result).toBe('<mark>test</mark> <mark>test</mark> <mark>test</mark>')
    })

    it('should be case-insensitive', () => {
      const result = searchService.highlightSearchTerms('This is a TEST string', 'test')

      expect(result).toBe('This is a <mark>TEST</mark> string')
    })

    it('should return original text when query is empty', () => {
      const originalText = 'This is a test string'
      const result = searchService.highlightSearchTerms(originalText, '')

      expect(result).toBe(originalText)
    })

    it('should return original text when query is whitespace only', () => {
      const originalText = 'This is a test string'
      const result = searchService.highlightSearchTerms(originalText, '   ')

      expect(result).toBe(originalText)
    })

    it('should handle special regex characters in query', () => {
      const result = searchService.highlightSearchTerms('file.txt and file.doc', 'file.txt')

      expect(result).toBe('<mark>file.txt</mark> and file.doc')
    })
  })
})
