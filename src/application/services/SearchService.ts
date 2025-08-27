import type { ISearchService } from '@/domain/interfaces/IFolderServices'
import type { FolderItem } from '@/shared/types/explorer'

export class SearchService implements ISearchService {
  searchInFolderTree(folders: FolderItem[], query: string): FolderItem[] {
    const results: FolderItem[] = []

    for (const folder of folders) {
      if (folder.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(folder)
      }

      if (folder.children && folder.children.length > 0) {
        const childResults = this.searchInFolderTree(folder.children, query)
        results.push(...childResults)
      }
    }

    return results
  }
  normalizeQuery(query: string): string {
    return query.trim().toLowerCase()
  }
  isValidQuery(query: string): boolean {
    const normalized = this.normalizeQuery(query)
    return normalized.length > 0 && normalized.length <= 100
  }
  highlightSearchTerms(text: string, query: string): string {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }
}
