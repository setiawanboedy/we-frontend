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
  content?: string
}

export interface UpdateFileRequest {
  name?: string
  content?: string
}

export interface FileWithContentDto extends FileDto {
  content: string
}

export interface SearchFileParams {
  name?: string;
  limit?: number;
  offset?: number;
}