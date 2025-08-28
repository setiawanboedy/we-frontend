import type {
  FileDto,
} from '@/application/dto/FileDto'

export interface IFileSearchService {
  searchFiles(query: string): Promise<FileDto[]>
  isValidQuery(query: string): boolean
}

export interface IFileDataService {
  loadFilesByFolder(folderId: string): Promise<FileDto[]>
  loadFile(fileId: string): Promise<FileDto>
}
