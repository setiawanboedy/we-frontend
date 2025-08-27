import type { Folder, FolderWithChildren, FolderItem } from '@/shared/types/explorer'
import { formatDateTime } from './formatHelpers'

export function convertFolderToUI(folder: Folder): FolderItem {
  return {
    id: folder.id,
    name: folder.name,
    size: folder.size ?? '',
    icon: 'folder',
    path: folder.path,
    updateAt: formatDateTime(folder.updatedAt),
    parentId: folder.parentId,
    isExpanded: false,
  }

}
export function convertFolderWithChildrenToUI(folderChild: FolderWithChildren): FolderItem {
  return {
    id: folderChild.id,
    name: folderChild.name,
    size: folderChild.size ?? '',
    icon: 'folder',
    path: folderChild.path,
    updateAt: folderChild.updatedAt,
    parentId: folderChild.parentId,
    isExpanded: false,
    children: folderChild.children?.map(convertFolderWithChildrenToUI) || [],
  }
}
