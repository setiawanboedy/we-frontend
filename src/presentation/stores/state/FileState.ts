import type { FileDto } from '@/application/dto/FileDto'
import { ref } from 'vue'

export class FileState {
  readonly files = ref<FileDto[]>([])
  readonly selectedFileId = ref<string | null>(null)
  readonly selectedFileIds = ref<string[]>([])
  readonly currentFolderId = ref<string | null>(null)

  readonly searchQuery = ref<string>('')
  readonly searchResults = ref<FileDto[]>([])
  readonly isSearchMode = ref<boolean>(false)
  readonly isSearching = ref<boolean>(false)

  readonly isLoadingFiles = ref(false)
  readonly isLoadingFile = ref(false)
  readonly isCreating = ref(false)
  readonly isUpdating = ref(false)
  readonly isDeleting = ref(false)

  readonly fileError = ref<string | null>(null)
  readonly createError = ref<string | null>(null)
  readonly updateError = ref<string | null>(null)
  readonly deleteError = ref<string | null>(null)

  reset(): void {
    this.files.value = []
    this.selectedFileId.value = null
    this.selectedFileIds.value = []
    this.currentFolderId.value = null
    this.searchQuery.value = ''
    this.searchResults.value = []
    this.isSearchMode.value = false
    this.isSearching.value = false
    this.isLoadingFiles.value = false
    this.isLoadingFile.value = false
    this.isCreating.value = false
    this.isUpdating.value = false
    this.isDeleting.value = false
    this.fileError.value = null
    this.createError.value = null
    this.updateError.value = null
    this.deleteError.value = null
  }
}
