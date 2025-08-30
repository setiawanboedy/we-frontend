import type { FileDto } from '@/application/dto/FileDto'
import type { FileItem } from '../types/explorer'
import { formatDateTime } from './formatHelpers'

export function convertFileToUI(file: FileDto): FileItem {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    icon: 'file',
    path: file.path,
    updatedAt: formatDateTime(file.updatedAt),
    folderId: file.folderId,
    mimeType: file.mimeType,
  }

}
