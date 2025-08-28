import type { ApplicationFolderService } from '@/application/services/ApplicationFolderService'
import type { FolderState } from '../state/FolderState'
import type { FolderItem } from '@/shared/types/explorer'
import { FolderConverters } from '../converters/FolderConverters'
import { convertFolderToUI } from '@/shared/utils/folderHelpers'
import { ResultFormatter } from '@/shared/utils/ResultFormatter'

export class FolderLoadingActions {
  constructor(
    private state: FolderState,
    private appService: ApplicationFolderService,
  ) {}

  async loadSidebarFolders(): Promise<void> {
    this.state.isLoadingSidebar.value = true
    this.state.sidebarError.value = null

    try {
      const expandedFolderIds = new Set<string>()
      const collectExpandedIds = (folders: FolderItem[]): void => {
        folders.forEach((folder) => {
          if (folder.isExpanded) {
            expandedFolderIds.add(folder.id)
          }
          if (folder.children) {
            collectExpandedIds(folder.children)
          }
        })
      }
      collectExpandedIds(this.state.sidebarFolders.value)

      const hierarchyDtos = await this.appService.getFolderHierarchy()
      this.state.folderHierarchy.value = FolderConverters.convertDtoToDomainHierarchy(hierarchyDtos)

      if (this.state.folderHierarchy.value) {
        this.state.sidebarFolders.value = FolderConverters.convertFolderHierarchyToUI(
          this.state.folderHierarchy.value as any,
        )

        const restoreExpansionState = (folders: FolderItem[]): void => {
          folders.forEach((folder) => {
            if (expandedFolderIds.has(folder.id)) {
              folder.isExpanded = true
            }
            if (folder.children) {
              restoreExpansionState(folder.children)
            }
          })
        }
        restoreExpansionState(this.state.sidebarFolders.value)
      }
    } catch (error) {
      this.state.sidebarError.value = ResultFormatter.handleError(error, 'memuat daftar folder')
    } finally {
      this.state.isLoadingSidebar.value = false
    }
  }

  async loadFolderChildren(folderId: string): Promise<void> {
    this.state.isLoadingChildren.value = true
    this.state.childrenError.value = null

    try {
      const children = await this.appService.getFolderChildren(folderId)
      this.state.currentFolderChildren.value = children.map(convertFolderToUI)
    } catch (error) {
      this.state.childrenError.value = ResultFormatter.handleError(error, 'memuat isi folder')
      this.state.currentFolderChildren.value = []
    } finally {
      this.state.isLoadingChildren.value = false
    }
  }
}
