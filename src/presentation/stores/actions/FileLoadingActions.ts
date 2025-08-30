import type { ApplicationFileService } from '@/application/services/ApplicationFileService'
import type { FileState } from '../state/FileState'
import type { FileDto } from '@/application/dto/FileDto'
import type { IFileDataService } from '@/domain/interfaces/IFileServices'
import { convertFileToUI } from '@/shared/utils/fileHelpers'

export class FileLoadingActions implements IFileDataService {
  constructor(
    private state: FileState,
    private appService: ApplicationFileService,
  ) {}

  async loadFilesByFolder(folderId: string): Promise<FileDto[]> {
    this.state.isLoadingFiles.value = true
    this.state.fileError.value = null
    this.state.currentFolderId.value = folderId

    try {
      const files = await this.appService.getFilesByFolder(folderId)
      this.state.files.value = files.map(convertFileToUI)
      return files
    } catch (error) {
      this.state.fileError.value = error instanceof Error ? error.message : 'Failed to load files'
      throw error
    } finally {
      this.state.isLoadingFiles.value = false
    }
  }

  async loadFile(fileId: string): Promise<FileDto> {
    this.state.isLoadingFile.value = true
    this.state.fileError.value = null

    try {
      const file = await this.appService.getFile(fileId)
      return file
    } catch (error) {
      this.state.fileError.value = error instanceof Error ? error.message : 'Failed to load file'
      throw error
    } finally {
      this.state.isLoadingFile.value = false
    }
  }

}
