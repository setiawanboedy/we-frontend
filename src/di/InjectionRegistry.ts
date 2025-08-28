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

// File Use Cases
import { GetFilesByFolderUseCase } from '@/domain/usecases/GetFilesByFolderUseCase'
import { CreateFileUseCase } from '@/domain/usecases/CreateFileUseCase'
import { UpdateFileUseCase } from '@/domain/usecases/UpdateFileUseCase'
import { DeleteFileUseCase } from '@/domain/usecases/DeleteFileUseCase'
import { SearchFilesUseCase } from '@/domain/usecases/SearchFilesUseCase'
import { GetFileByIdUseCase } from '@/domain/usecases/GetFileByIdUseCase'

// Folder Use Cases
import { GetFolderHierarchyUseCase } from '@/domain/usecases/GetFolderHierarchyUseCase'
import { GetFolderChildrenUseCase } from '@/domain/usecases/GetFolderChildrenUseCase'
import { CreateFolderUseCase } from '@/domain/usecases/CreateFolderUseCase'
import { UpdateFolderUseCase } from '@/domain/usecases/UpdateFolderUseCase'
import { DeleteFolderUseCase } from '@/domain/usecases/DeleteFolderUseCase'
import { GetFolderByIdUseCase } from '@/domain/usecases/GetFolderByIdUseCase'

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

      // Register Folder Use Cases
      this.container.register<GetFolderHierarchyUseCase>('getFolderHierarchyUseCase', () => {
        const repository = this.container.get<FolderRepository>('folderRepository')
        return new GetFolderHierarchyUseCase(repository)
      })

      this.container.register<GetFolderChildrenUseCase>('getFolderChildrenUseCase', () => {
        const repository = this.container.get<FolderRepository>('folderRepository')
        return new GetFolderChildrenUseCase(repository)
      })

      this.container.register<CreateFolderUseCase>('createFolderUseCase', () => {
        const repository = this.container.get<FolderRepository>('folderRepository')
        return new CreateFolderUseCase(repository)
      })

      this.container.register<UpdateFolderUseCase>('updateFolderUseCase', () => {
        const repository = this.container.get<FolderRepository>('folderRepository')
        return new UpdateFolderUseCase(repository)
      })

      this.container.register<DeleteFolderUseCase>('deleteFolderUseCase', () => {
        const repository = this.container.get<FolderRepository>('folderRepository')
        return new DeleteFolderUseCase(repository)
      })

      this.container.register<GetFolderByIdUseCase>('getFolderByIdUseCase', () => {
        const repository = this.container.get<FolderRepository>('folderRepository')
        return new GetFolderByIdUseCase(repository)
      })

      this.container.register<ApplicationFolderService>('folderService', () => {
        const getFolderHierarchyUseCase = this.container.get<GetFolderHierarchyUseCase>(
          'getFolderHierarchyUseCase',
        )
        const getFolderChildrenUseCase = this.container.get<GetFolderChildrenUseCase>(
          'getFolderChildrenUseCase',
        )
        const createFolderUseCase = this.container.get<CreateFolderUseCase>('createFolderUseCase')
        const updateFolderUseCase = this.container.get<UpdateFolderUseCase>('updateFolderUseCase')
        const deleteFolderUseCase = this.container.get<DeleteFolderUseCase>('deleteFolderUseCase')
        const getFolderByIdUseCase = this.container.get<GetFolderByIdUseCase>('getFolderByIdUseCase')

        const service = new ApplicationFolderService(
          getFolderHierarchyUseCase,
          getFolderChildrenUseCase,
          createFolderUseCase,
          deleteFolderUseCase,
          updateFolderUseCase,
          getFolderByIdUseCase,
        )
        return service
      })

      this.container.register<FileRepository>('fileRepository', () => {
        const repository = new FileRepository()
        return repository
      })

      // Register File Use Cases
      this.container.register<GetFilesByFolderUseCase>('getFilesByFolderUseCase', () => {
        const repository = this.container.get<FileRepository>('fileRepository')
        return new GetFilesByFolderUseCase(repository)
      })

      this.container.register<CreateFileUseCase>('createFileUseCase', () => {
        const repository = this.container.get<FileRepository>('fileRepository')
        return new CreateFileUseCase(repository)
      })

      this.container.register<UpdateFileUseCase>('updateFileUseCase', () => {
        const repository = this.container.get<FileRepository>('fileRepository')
        return new UpdateFileUseCase(repository)
      })

      this.container.register<DeleteFileUseCase>('deleteFileUseCase', () => {
        const repository = this.container.get<FileRepository>('fileRepository')
        return new DeleteFileUseCase(repository)
      })

      this.container.register<SearchFilesUseCase>('searchFilesUseCase', () => {
        const repository = this.container.get<FileRepository>('fileRepository')
        return new SearchFilesUseCase(repository)
      })

      this.container.register<GetFileByIdUseCase>('getFileByIdUseCase', () => {
        const repository = this.container.get<FileRepository>('fileRepository')
        return new GetFileByIdUseCase(repository)
      })

      this.container.register<ApplicationFileService>('fileService', () => {
        const getFilesByFolderUseCase =
          this.container.get<GetFilesByFolderUseCase>('getFilesByFolderUseCase')
        const createFileUseCase = this.container.get<CreateFileUseCase>('createFileUseCase')
        const updateFileUseCase = this.container.get<UpdateFileUseCase>('updateFileUseCase')
        const deleteFileUseCase = this.container.get<DeleteFileUseCase>('deleteFileUseCase')
        const searchFilesUseCase = this.container.get<SearchFilesUseCase>('searchFilesUseCase')
        const getFileByIdUseCase = this.container.get<GetFileByIdUseCase>('getFileByIdUseCase')

        const service = new ApplicationFileService(
          getFilesByFolderUseCase,
          createFileUseCase,
          updateFileUseCase,
          deleteFileUseCase,
          searchFilesUseCase,
          getFileByIdUseCase,
        )
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
