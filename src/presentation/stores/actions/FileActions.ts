import type { ApplicationFileService } from '@/application/services/ApplicationFileService'
import type { FileState } from '../state/FileState'
import type { CreateFileRequest, UpdateFileRequest } from '@/application/dto/FileDto'
import { ResultFormatter } from '@/shared/utils/ResultFormatter'
import type { IFileDataService } from '@/domain/interfaces/IFileServices'
import { getFolderService } from '@/di/InjectionRegistry'

export class FileActions {
  constructor(
    private state: FileState,
    private applicationService: ApplicationFileService,
    private loadingActions: IFileDataService,
    private folderStore?: any,
  ) {}

  async createFile(data: CreateFileRequest): Promise<any> {
    try {
      this.state.isCreating.value = true
      this.state.createError.value = null

      const file = await this.applicationService.createFile(data)

      if (this.state.currentFolderId.value) {
        await this.loadingActions.loadFilesByFolder(this.state.currentFolderId.value)
      }

      return ResultFormatter.success(file, 'File berhasil dibuat')
    } catch (error) {
      this.state.createError.value =
        error instanceof Error ? error.message : 'Failed to create file'
      return ResultFormatter.error(error, 'membuat file')
    } finally {
      this.state.isCreating.value = false
    }
  }

  generateUniqueFileName(baseName: string = 'New File.txt'): string {
    if (this.state.files.value.length === 0) {
      return baseName
    }

    const existingNames = this.state.files.value.map((file) => file.name.toLowerCase())

    if (!existingNames.includes(baseName.toLowerCase())) {
      return baseName
    }

    const nameParts = baseName.split('.')
    let extension = ''
    let nameWithoutExt = baseName

    if (nameParts.length > 1) {
      extension = nameParts.pop() || ''
      nameWithoutExt = nameParts.join('.')
    }

    let counter = 1
    while (true) {
      const numberedName = extension
        ? `${nameWithoutExt} (${counter}).${extension}`
        : `${nameWithoutExt} (${counter})`

      if (!existingNames.includes(numberedName.toLowerCase())) {
        return numberedName
      }
      counter++
    }
  }
  async createNewFile(folderId?: string): Promise<any> {
    const targetFolderId = folderId || this.state.currentFolderId.value

    if (!targetFolderId) {
      return ResultFormatter.error(new Error('Tidak ada folder yang dipilih'), 'membuat file baru')
    }

    try {
      await this.loadingActions.loadFilesByFolder(targetFolderId)

      const uniqueName = this.generateUniqueFileName()

      let folderPath = ''
      try {
        const folderService = getFolderService()
        const folderHierarchy = await folderService.getFolderHierarchy()

        const folderNode = folderHierarchy.find((h) => h.id === targetFolderId)

        if (folderNode) {
          folderPath = folderNode.path || ''
        }
      } catch (error) {
        console.error('Error getting folder hierarchy:', error)
      }

      let filePath = ''
      if (folderPath) {
        filePath = folderPath.startsWith('/')
          ? `${folderPath}/${uniqueName}`
          : `/${folderPath}/${uniqueName}`
      } else {
        filePath = `/${uniqueName}`
      }

      const fileData: CreateFileRequest = {
        name: uniqueName,
        path: filePath,
        folderId: targetFolderId,
        size: 0,
        mimeType: 'text/plain',
      }

      return await this.createFile(fileData)
    } catch (error) {
      return ResultFormatter.error(error, 'membuat file baru')
    }
  }

  async updateFile(fileId: string, data: UpdateFileRequest): Promise<any> {
    try {
      this.state.isUpdating.value = true
      this.state.updateError.value = null

      const file = await this.applicationService.updateFile(fileId, data)

      const index = this.state.files.value.findIndex((f) => f.id === fileId)
      if (index !== -1) {
        this.state.files.value[index] = file
      }

      return ResultFormatter.success(file, 'File berhasil diupdate')
    } catch (error) {
      this.state.updateError.value =
        error instanceof Error ? error.message : 'Failed to update file'
      return ResultFormatter.error(error, 'mengupdate file')
    } finally {
      this.state.isUpdating.value = false
    }
  }

  async deleteFile(fileId: string): Promise<any> {
    try {
      this.state.isDeleting.value = true
      this.state.deleteError.value = null

      await this.applicationService.deleteFile(fileId)

      const index = this.state.files.value.findIndex((f) => f.id === fileId)
      if (index !== -1) {
        this.state.files.value.splice(index, 1)
      }

      if (this.state.selectedFileId.value === fileId) {
        this.state.selectedFileId.value = null
      }

      this.state.selectedFileIds.value = this.state.selectedFileIds.value.filter(
        (id) => id !== fileId,
      )

      return ResultFormatter.success('success', 'File berhasil dihapus')
    } catch (error) {
      this.state.deleteError.value =
        error instanceof Error ? error.message : 'Failed to delete file'
      return ResultFormatter.error(error, 'menghapus file')
    } finally {
      this.state.isDeleting.value = false
    }
  }

  async renameFile(fileId: string, newName: string): Promise<any> {
    try {
      return await this.updateFile(fileId, { name: newName })
    } catch (error) {
      return ResultFormatter.error(error, 'rename file')
    }
  }

  selectFileLocal(fileId: string): void {
    this.state.selectedFileId.value = fileId
    this.state.selectedFileIds.value = [fileId]
  }

  clearFileSelection(): void {
    this.state.selectedFileId.value = null
    this.state.selectedFileIds.value = []
  }

  selectMultipleFiles(fileIds: string[]): void {
    this.state.selectedFileIds.value = fileIds
    this.state.selectedFileId.value = fileIds.length === 1 ? fileIds[0] : null
  }

  toggleFileSelection(fileId: string): void {
    const index = this.state.selectedFileIds.value.indexOf(fileId)
    if (index === -1) {
      this.state.selectedFileIds.value.push(fileId)
    } else {
      this.state.selectedFileIds.value.splice(index, 1)
    }

    if (this.state.selectedFileIds.value.length === 1) {
      this.state.selectedFileId.value = this.state.selectedFileIds.value[0]
    } else {
      this.state.selectedFileId.value = null
    }
  }
}
