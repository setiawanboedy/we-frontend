import type {
  FileDto,
  CreateFileRequest,
  UpdateFileRequest,
  FileWithContentDto,
  SearchFileParams,
} from '@/application/dto/FileDto'
import { apiClient, type ApiResponse } from './apiClient'

export class FileApi {
  async getFilesByFolder(folderId: string): Promise<ApiResponse<FileDto[]>> {
    return apiClient.get<FileDto[]>(`/files/folder/${folderId}`)
  }

  async getFileById(id: string): Promise<ApiResponse<FileWithContentDto>> {
    return apiClient.get<FileWithContentDto>(`/files/${id}`)
  }

  async createFile(data: CreateFileRequest): Promise<ApiResponse<FileDto>> {
    return apiClient.post<FileDto>('/files', data)
  }

  async updateFile(id: string, data: UpdateFileRequest): Promise<ApiResponse<FileDto>> {
    return apiClient.put<FileDto>(`/files/${id}`, data)
  }

  async deleteFile(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/files/${id}`)
  }

  async searchFiles(params: SearchFileParams): Promise<ApiResponse<FileDto[]>> {
    const searchParams = new URLSearchParams()

    if (params.name) {
      searchParams.append('name', params.name)
    }
    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString())
    }
    if (params.offset !== undefined) {
      searchParams.append('offset', params.offset.toString())
    }

    return apiClient.get<FileDto[]>(`/files/search?${searchParams.toString()}`)
  }
}

export const fileApiService = new FileApi()
