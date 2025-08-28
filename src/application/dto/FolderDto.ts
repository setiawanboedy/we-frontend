export interface FolderDto {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  size: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FolderWithChildrenDto extends FolderDto {
  children: FolderWithChildrenDto[];
}

export interface UpdateFolderRequest {
  name?: string
  path?: string
  parentId?: string
}

export interface CreateFolderRequest {
  name: string;
  path: string;
  parentId?: string;
}