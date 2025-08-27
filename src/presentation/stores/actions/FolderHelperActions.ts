import type { FolderItem } from '@/shared/types/explorer'
import type { FolderState } from '../state/FolderState'

export class FolderHelperActions {
  constructor(private state: FolderState) {}

  toggleFolderExpansion(folderId: string): void {
    const findAndToggleFolder = (folders: FolderItem[]): boolean => {
      for (const folder of folders) {
        if (folder.id === folderId) {
          folder.isExpanded = !folder.isExpanded
          return true
        }
        if (folder.children && folder.children.length > 0) {
          if (findAndToggleFolder(folder.children)) {
            return true
          }
        }
      }
      return false
    }

    findAndToggleFolder(this.state.sidebarFolders.value)
  }
}
