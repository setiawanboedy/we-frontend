import type { FolderItem } from "@/shared/types/explorer"

export interface INavigationHistoryService {
  addToHistory(folderId: string): void
  navigateBack(): string | null
  navigateForward(): string | null
  canGoBack(): boolean
  canGoForward(): boolean
  getHistory(): string[]
  getCurrentIndex(): number
  clear(): void
}

export interface ISearchService {
  searchInFolderTree(folders: FolderItem[], query: string): FolderItem[]
  normalizeQuery(query: string): string
  isValidQuery(query: string): boolean
  highlightSearchTerms(text: string, query: string): string
}

export interface IFolderSelectionService {
  selectFolder(folderId: string): Promise<void>
  selectMainFolder(folderId: string): void
  clearMainSelection(): void
}

export interface IFolderDataService {
  loadSidebarFolders(): Promise<void>
  loadFolderChildren(folderId: string): Promise<void>
}