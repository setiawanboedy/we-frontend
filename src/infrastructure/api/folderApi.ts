import type { Folder, FolderWithChildren } from '@/shared/types/explorer'
import { apiClient, type ApiResponse } from './apiClient'
import type { CreateFolderRequest, FolderDto, SearchFolderParams, UpdateFolderRequest } from '@/application/dto/FolderDto'
import type { SearchFileParams } from '@/application/dto/FileDto'

export class FolderApi {
  async getAllFolders(): Promise<ApiResponse<FolderWithChildren[]>> {
    return apiClient.get<FolderWithChildren[]>('/folders')
  }

  async getRootFolders(): Promise<ApiResponse<Folder[]>> {
    return apiClient.get<Folder[]>('/folders/root')
  }

  async getFolderById(id: string): Promise<ApiResponse<Folder>> {
    return apiClient.get<Folder>(`/folders/${id}`)
  }

  async getFolderChildren(id: string): Promise<ApiResponse<Folder[]>> {
    return apiClient.get<Folder[]>(`/folders/${id}/children`)
  }

  async createFolder(data: CreateFolderRequest): Promise<ApiResponse<Folder>> {
    return apiClient.post<Folder>('/folders', data)
  }

  async updateFolder(id: string, data: UpdateFolderRequest): Promise<ApiResponse<Folder>> {
    return apiClient.put<Folder>(`/folders/${id}`, data)
  }

  async deleteFolder(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/folders/${id}`)
  }

  async searchFolders(params: SearchFolderParams): Promise<ApiResponse<FolderDto[]>> {
    
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
      
      const data = await apiClient.get<FolderDto[]>(`/folders/search?${searchParams.toString()}`)
      
      return data
    }
}



export const folderApiService = new FolderApi()
