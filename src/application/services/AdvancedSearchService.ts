import type { ISearchService } from '@/domain/interfaces/IFolderServices'
import type { FolderItem } from '@/shared/types/explorer'

interface SearchResultFolderItem extends FolderItem {
  searchScore?: number
}

export class AdvancedSearchService implements ISearchService {
  private basicSearchService: ISearchService

  constructor(basicSearchService: ISearchService) {
    this.basicSearchService = basicSearchService
  }
  searchInFolderTree(folders: FolderItem[], query: string): FolderItem[] {
    const basicResults = this.basicSearchService.searchInFolderTree(folders, query)

    const fuzzyResults = this.fuzzySearchInFolderTree(folders, query)

    const allResults = [...basicResults, ...fuzzyResults]
    return this.deduplicateResults(allResults)
  }
  normalizeQuery(query: string): string {
    return this.basicSearchService.normalizeQuery(query)
  }
  isValidQuery(query: string): boolean {
    return this.basicSearchService.isValidQuery(query)
  }
  highlightSearchTerms(text: string, query: string): string {
    return this.basicSearchService.highlightSearchTerms(text, query)
  }

  private fuzzySearchInFolderTree(folders: FolderItem[], query: string): SearchResultFolderItem[] {
    const results: SearchResultFolderItem[] = []
    const normalizedQuery = this.normalizeQuery(query)

    for (const folder of folders) {
      const similarity = this.calculateSimilarity(folder.name.toLowerCase(), normalizedQuery)

      if (similarity > 0.6) {
        results.push({
          ...folder,
          searchScore: similarity, 
        })
      }

      if (folder.children && folder.children.length > 0) {
        const childResults = this.fuzzySearchInFolderTree(folder.children, query)
        results.push(...childResults)
      }
    }

    return results.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0))
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const matrix: number[][] = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          )
        }
      }
    }

    const maxLength = Math.max(str1.length, str2.length)
    return maxLength === 0 ? 1 : (maxLength - matrix[str2.length][str1.length]) / maxLength
  }

  private deduplicateResults(results: FolderItem[]): FolderItem[] {
    const seen = new Set<string>()
    return results.filter((folder) => {
      if (seen.has(folder.id)) {
        return false
      }
      seen.add(folder.id)
      return true
    })
  }
}
