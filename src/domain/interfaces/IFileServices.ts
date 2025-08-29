import type {
  FileDto,
} from '@/application/dto/FileDto'


export interface IFileDataService {
  loadFilesByFolder(folderId: string): Promise<FileDto[]>
  loadFile(fileId: string): Promise<FileDto>
}
