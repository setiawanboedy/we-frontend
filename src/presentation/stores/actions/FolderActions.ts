import type { ApplicationFolderService } from '@/application/services/ApplicationFolderService'
import type { FolderState } from '../state/FolderState'
import { ResultFormatter } from '@/shared/utils/ResultFormatter'
import type { IFolderDataService } from '@/domain/interfaces/IFolderServices'
import type { CreateFolderRequest } from '@/application/dto/FolderDto'

export class FolderActions {
  constructor(
    private state: FolderState,
    private applicationService: ApplicationFolderService,
    private loadingActions: IFolderDataService,
  ) {}

  async createFolder(data: CreateFolderRequest): Promise<any> {
    try {
      await this.applicationService.createFolder(data)
      await this.loadingActions.loadSidebarFolders()
      if (data.parentId === this.state.selectedFolderId.value) {
        await this.loadingActions.loadFolderChildren(this.state.selectedFolderId.value)
      }
      return ResultFormatter.success('success', 'Folder berhasil dibuat')
    } catch (error) {
      return ResultFormatter.error(error, 'membuat folder')
    }
  }

  generateUniqueFolderName(baseName: string = 'New Folder'): string {
    const existingNames = this.state.currentFolderChildren.value.map((folder) =>
      folder.name.toLowerCase(),
    )

    if (!existingNames.includes(baseName.toLowerCase())) {
      return baseName
    }

    const copyName = `${baseName}-copy`
    if (!existingNames.includes(copyName.toLowerCase())) {
      return copyName
    }

    let counter = 2
    while (true) {
      const numberedCopyName = `${baseName}-copy${counter}`
      if (!existingNames.includes(numberedCopyName.toLowerCase())) {
        return numberedCopyName
      }
      counter++
    }
  }

  async createNewFolder(): Promise<any> {
    if (!this.state.selectedFolderId.value || !this.state.folderHierarchy.value) {
      return ResultFormatter.error(
        new Error('Tidak ada folder yang dipilih'),
        'membuat folder baru',
      )
    }

    try {
      const uniqueName = this.generateUniqueFolderName()

      const selectedFolderNode = this.state.folderHierarchy.value.findById(
        this.state.selectedFolderId.value,
      )

      if (!selectedFolderNode) {
        return ResultFormatter.error(
          new Error('Folder yang dipilih tidak ditemukan'),
          'membuat folder baru',
        )
      }

      const folderData = {
        name: uniqueName,
        path: selectedFolderNode.path ? `${selectedFolderNode.path}/${uniqueName}` : uniqueName,
        parentId: this.state.selectedFolderId.value,
      }

      return await this.createFolder(folderData)
    } catch (error) {
      return ResultFormatter.error(error, 'membuat folder baru')
    }
  }

  async deleteFolder(folderId: string): Promise<any> {
    try {
      await this.applicationService.deleteFolder(folderId)

      const idx = this.state.currentFolderChildren.value.findIndex((f) => f.id === folderId)
      if (idx !== -1) this.state.currentFolderChildren.value.splice(idx, 1)

      if (this.state.folderHierarchy.value) {
        await this.loadingActions.loadSidebarFolders()
      }

      if (this.state.selectedMainFolderId.value === folderId) {
        this.state.selectedMainFolderId.value = null
      }

      return ResultFormatter.success('success', 'Folder berhasil dihapus')
    } catch (error) {
      return ResultFormatter.error(error, 'menghapus folder')
    }
  }

  async renameFolder(folderId: string, newName: string): Promise<any> {
    try {
      await this.applicationService.updateFolder(folderId, { name: newName })

      const folder = this.state.currentFolderChildren.value.find((f) => f.id === folderId)
      if (folder) folder.name = newName

      if (this.state.folderHierarchy.value) {
        await this.loadingActions.loadSidebarFolders()
      }

      return ResultFormatter.success('success', 'Folder berhasil di-rename')
    } catch (error) {
      return ResultFormatter.error(error, 'rename folder')
    }
  }
}
