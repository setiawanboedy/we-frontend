export interface Folder {
  id: string
  name: string
  path: string
  parentId: string | null
  size: string | null
  createdAt: string
  updatedAt: string
}

export interface FolderWithChildren extends Folder {
  children: FolderWithChildren[]
}