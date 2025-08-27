import { getFolderService, getNavigationService, getSearchService } from '@/di/InjectionRegistry'
import { defineStore } from 'pinia'
import { FolderState } from './state/FolderState'
import { FolderLoadingActions } from './actions/FolderLoadingActions'
import { FolderSelectionActions } from './actions/FolderSelectionActions'
import { FolderHelperActions } from './actions/FolderHelperActions'
import { FolderSearchActions } from './actions/FolderSearchActions'
import type { INavigationHistoryService, ISearchService } from '@/domain/interfaces/IFolderServices'
import { FolderComputed } from './computed/FolderComputed'
import { FolderActions } from './actions/FolderActions'

export const useFolderStore = defineStore('folders', () => {
  const navigationService: INavigationHistoryService = getNavigationService()
  const searchService: ISearchService = getSearchService()
  const appService = getFolderService()

  const state = new FolderState()

  const loadingActions = new FolderLoadingActions(state, appService)
  const selectionActions = new FolderSelectionActions(state, loadingActions, navigationService)
  const searchActions = new FolderSearchActions(state, searchService)
  const helperActions = new FolderHelperActions(state)

  const computed = new FolderComputed(state)

  const crudActions = new FolderActions(state, appService, loadingActions)

  function initialize() {
    loadingActions.loadSidebarFolders()
  }

  return {
    ...state,

    selectedFolder: computed.selectedFolder,
    breadcrumbPath: computed.breadcrumbPath,
    displayedFolders: computed.displayedFolders,
    canGoBack: computed.canGoBack,
    canGoForward: computed.canGoForward,

    loadSidebarFolders: loadingActions.loadSidebarFolders.bind(loadingActions),
    loadFolderChildren: loadingActions.loadFolderChildren.bind(loadingActions),
    selectFolder: selectionActions.selectFolder.bind(selectionActions),
    selectMainFolder: selectionActions.selectMainFolder.bind(selectionActions),
    clearMainSelection: selectionActions.clearMainSelection.bind(selectionActions),
    navigateBack: selectionActions.navigateBack.bind(selectionActions),
    navigateForward: selectionActions.navigateForward.bind(selectionActions),
    searchFolders: searchActions.searchFolders.bind(searchActions),
    clearSearch: searchActions.clearSearch.bind(searchActions),
    createFolder: crudActions.createFolder.bind(crudActions),
    createNewFolder: crudActions.createNewFolder.bind(crudActions),
    deleteFolder: crudActions.deleteFolder.bind(crudActions),
    renameFolder: crudActions.renameFolder.bind(crudActions),
    toggleFolderExpansion: helperActions.toggleFolderExpansion.bind(helperActions),
    initialize,
  }
})
