import { getFileService, getFileSearchService } from '@/di/InjectionRegistry'
import { defineStore } from 'pinia'
import { FileState } from './state/FileState'
import { FileLoadingActions } from './actions/FileLoadingActions'
import { FileSelectionActions } from './actions/FileSelectionActions'
import { FileSearchActions } from './actions/FileSearchActions'
import { FileComputed } from './computed/FileComputed'
import { FileActions } from './actions/FileActions'
import { useFolderStore } from './folderStore'

export const useFileStore = defineStore('files', () => {
  const fileService = getFileService()
  const fileSearchService = getFileSearchService()
  const folderStore = useFolderStore()

  const state = new FileState()

  const loadingActions = new FileLoadingActions(state, fileService)
  const selectionActions = new FileSelectionActions(state, loadingActions)
  const searchActions = new FileSearchActions(state, fileSearchService)

  const computed = new FileComputed(state)

  const crudActions = new FileActions(state, fileService, loadingActions, folderStore)

  return {
    ...state,

    selectedFile: computed.selectedFile,
    selectedFiles: computed.selectedFiles,
    displayedFiles: computed.displayedFiles,
    hasSelection: computed.hasSelection,
    hasSingleSelection: computed.hasSingleSelection,
    isLoading: computed.isLoading,
    hasError: computed.hasError,

    loadFilesByFolder: loadingActions.loadFilesByFolder.bind(loadingActions),
    loadFile: loadingActions.loadFile.bind(loadingActions),
    searchFiles: searchActions.searchFiles.bind(searchActions),
    clearSearch: searchActions.clearSearch.bind(searchActions),

    selectFile: selectionActions.selectFile.bind(selectionActions),
    selectFileLocal: selectionActions.selectFileLocal.bind(selectionActions),
    clearFileSelection: selectionActions.clearFileSelection.bind(selectionActions),
    toggleFileSelection: selectionActions.toggleFileSelection.bind(selectionActions),

    createFile: crudActions.createFile.bind(crudActions),
    createNewFile: crudActions.createNewFile.bind(crudActions),
    updateFile: crudActions.updateFile.bind(crudActions),
    deleteFile: crudActions.deleteFile.bind(crudActions),
    renameFile: crudActions.renameFile.bind(crudActions),
  }
})
