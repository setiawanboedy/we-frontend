export interface FileDto {
  id: string
  name: string
  path: string
  folderId: string
  size: number | null
  mimeType: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateFileRequest {
  name: string
  path: string
  folderId: string
  size: number | null
  mimeType: string | null
}

export interface UpdateFileRequest {
  name?: string;
  path?: string;
}


export interface SearchFileParams {
  name?: string;
  limit?: number;
  offset?: number;
}