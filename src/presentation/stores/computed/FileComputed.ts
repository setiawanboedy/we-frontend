import { computed } from 'vue'
import type { FileState } from '../state/FileState'
import type { FileDto } from '@/application/dto/FileDto'

export class FileComputed {
  constructor(private state: FileState) {}

  readonly selectedFile = computed((): FileDto | null => {
    if (!this.state.selectedFileId.value) return null
    return (
      this.state.files.value.find((file) => file.id === this.state.selectedFileId.value) || null
    )
  })

  readonly selectedFiles = computed((): FileDto[] => {
    return this.state.files.value.filter((file) =>
      this.state.selectedFileId.value = file.id,
    )
  })

  readonly displayedFiles = computed((): FileDto[] => {
    if (this.state.isSearchMode.value) {
      return this.state.searchResults.value
    }
    return this.state.files.value
  })

  readonly hasSelection = computed((): boolean => {
    return this.state.selectedFileId.value !== null
  })

  readonly hasSingleSelection = computed((): boolean => {
    return this.state.selectedFileId.value !== null
  })

  readonly isLoading = computed((): boolean => {
    return (
      this.state.isLoadingFiles.value ||
      this.state.isLoadingFile.value ||
      this.state.isCreating.value ||
      this.state.isUpdating.value ||
      this.state.isDeleting.value
    )
  })

  readonly hasError = computed((): boolean => {
    return (
      !!this.state.fileError.value ||
      !!this.state.createError.value ||
      !!this.state.updateError.value ||
      !!this.state.deleteError.value
    )
  })

}
