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

export interface FolderItem {
  id: string
  name: string
  size: string
  icon: string
  children?: FolderItem[]
  isExpanded?: boolean
  path?: string
  updateAt: string
  parentId?: string | null
}