import type { Folder, FolderWithChildren } from '@/shared/types/explorer'
import { apiClient, type ApiResponse } from './apiClient'
import type { CreateFolderRequest, UpdateFolderRequest } from '@/application/dto/FolderDto'

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
}

export const folderApiService = new FolderApi()
