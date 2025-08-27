export interface CreateFolderRequest {
  name: string;
  path: string;
  parentId?: string;
}