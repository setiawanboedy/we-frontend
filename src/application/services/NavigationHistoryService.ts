import type { INavigationHistoryService } from '@/domain/interfaces/IFolderServices'

export class NavigationHistoryService implements INavigationHistoryService {
  private history: string[] = []
  private currentIndex: number = -1
  private readonly maxHistorySize: number = 50

  addToHistory(folderId: string): void {
    const lastFolderId = this.history[this.currentIndex]
    if (lastFolderId === folderId) {
      return
    }

    this.history = this.history.slice(0, this.currentIndex + 1)

    this.history.push(folderId)
    this.currentIndex = this.history.length - 1

    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
      this.currentIndex--
    }
  }
  navigateBack(): string | null {
    if (!this.canGoBack()) return null

    this.currentIndex--
    return this.history[this.currentIndex]
  }
  navigateForward(): string | null {
    if (!this.canGoForward()) return null

    this.currentIndex++
    return this.history[this.currentIndex]
  }
  canGoBack(): boolean {
    return this.currentIndex > 0
  }
  canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1
  }
  getHistory(): string[] {
    return [...this.history]
  }
  getCurrentIndex(): number {
    return this.currentIndex
  }
  clear(): void {
    this.history = []
    this.currentIndex = -1
  }
}
