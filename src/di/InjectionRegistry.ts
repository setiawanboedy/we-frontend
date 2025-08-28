import { FolderRepository } from '@/infrastructure/repositories/FolderRepository'
import { FileRepository } from '@/infrastructure/repositories/FileRepository'
import { InjectionContainer } from './InjectionContainer'
import { ApplicationFolderService } from '@/application/services/ApplicationFolderService'
import { ApplicationFileService } from '@/application/services/ApplicationFileService'
import { FileSearchService } from '@/application/services/FileSearchService'
import type { INavigationHistoryService, ISearchService } from '@/domain/interfaces/IFolderServices'
import type { IFileSearchService } from '@/domain/interfaces/IFileServices'
import { NavigationHistoryService } from '@/application/services/NavigationHistoryService'
import { SearchService } from '@/application/services/SearchService'
import { AdvancedSearchService } from '@/application/services/AdvancedSearchService'

interface ServiceConfig {
  useAdvancedSearch: boolean
  enableLogging: boolean
  maxRetries: number
}

const defaultConfig: ServiceConfig = {
  useAdvancedSearch: true,
  enableLogging: import.meta.env.DEV,
  maxRetries: 3,
}

export class InjectionRegistry {
  private container: InjectionContainer
  private config: ServiceConfig

  constructor(config: Partial<ServiceConfig> = {}) {
    this.container = new InjectionContainer()
    this.config = { ...defaultConfig, ...config }
    this.registerServices()
  }

  private registerServices(): void {
    try {
      this.container.register<INavigationHistoryService>('navigationHistory', () => {
        const service = new NavigationHistoryService()
        return service
      })

      this.container.register<ISearchService>('basicSearch', () => {
        const service = new SearchService()
        return service
      })

      this.container.register<ISearchService>('advancedSearch', () => {
        const basicSearch = this.container.get<ISearchService>('basicSearch')
        const service = new AdvancedSearchService(basicSearch)
        return service
      })

      this.container.register<FolderRepository>('folderRepository', () => {
        const repository = new FolderRepository()
        return repository
      })

      this.container.register<ApplicationFolderService>('folderService', () => {
        const repository = this.container.get<FolderRepository>('folderRepository')
        const service = new ApplicationFolderService(repository)
        return service
      })

      this.container.register<FileRepository>('fileRepository', () => {
        const repository = new FileRepository()
        return repository
      })

      this.container.register<ApplicationFileService>('fileService', () => {
        const repository = this.container.get<FileRepository>('fileRepository')
        const service = new ApplicationFileService(repository)
        return service
      })

      this.container.register<IFileSearchService>('fileSearchService', () => {
        const service = new FileSearchService()
        return service
      })
    } catch (error) {
      throw error
    }
  }

  public get<T>(name: string): T {
    try {
      return this.container.get<T>(name)
    } catch (error) {
      throw error
    }
  }

  public getSingleton<T>(name: string): T {
    try {
      return this.container.getSingleton<T>(name)
    } catch (error) {
      throw error
    }
  }

  public updateConfig(config: Partial<ServiceConfig>): void {
    this.config = { ...this.config, ...config }
    // Clear existing services and re-register
    this.container.clear()
    this.registerServices()
  }

  public getConfig(): ServiceConfig {
    return { ...this.config }
  }
}

export const injectRegistry = new InjectionRegistry()

export const injectContainer = injectRegistry['container'] as InjectionContainer

export const getNavigationService = (): INavigationHistoryService => {
  return injectRegistry.getSingleton<INavigationHistoryService>('navigationHistory')
}

export const getSearchService = (): ISearchService => {
  const serviceName = injectRegistry.getConfig().useAdvancedSearch
    ? 'advancedSearch'
    : 'basicSearch'
  return injectRegistry.getSingleton<ISearchService>(serviceName)
}

export const getFolderService = (): ApplicationFolderService => {
  return injectRegistry.getSingleton<ApplicationFolderService>('folderService')
}

export const getFileService = (): ApplicationFileService => {
  return injectRegistry.getSingleton<ApplicationFileService>('fileService')
}

export const getFileSearchService = (): IFileSearchService => {
  return injectRegistry.getSingleton<IFileSearchService>('fileSearchService')
}

export function initializeServices(config?: Partial<ServiceConfig>): void {
  try {
    if (config) {
      injectRegistry.updateConfig(config)
    }

    getNavigationService()
    getSearchService()
    getFolderService()
    getFileService()
    getFileSearchService()
  } catch (error) {
    throw error
  }
}

export function resetServices(): void {
  injectRegistry['container'].clear()
}
