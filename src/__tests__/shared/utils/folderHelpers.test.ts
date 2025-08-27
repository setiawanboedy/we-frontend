import { describe, it, expect } from 'vitest'
import {
  convertFolderToUI,
  convertFolderWithChildrenToUI,
} from '../../../shared/utils/folderHelpers'
import type { Folder, FolderWithChildren } from '../../../shared/types/explorer'

describe('folderHelpers', () => {
  describe('convertFolderToUI', () => {
    it('should convert Folder to FolderItem correctly', () => {
      const folder: Folder = {
        id: '1',
        name: 'Test Folder',
        path: '/test',
        parentId: null,
        size: '1024',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      }

      const result = convertFolderToUI(folder)

      expect(result).toEqual({
        id: '1',
        name: 'Test Folder',
        size: '1024',
        icon: 'folder',
        path: '/test',
        updateAt: expect.any(String), // formatDateTime result
        parentId: null,
        isExpanded: false,
      })
    })

    it('should handle null size', () => {
      const folder: Folder = {
        id: '2',
        name: 'Empty Folder',
        path: '/empty',
        parentId: '1',
        size: null,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      }

      const result = convertFolderToUI(folder)
      expect(result.size).toBe('')
    })
  })

  describe('convertFolderWithChildrenToUI', () => {
    it('should convert FolderWithChildren to FolderItem with children', () => {
      const folderWithChildren: FolderWithChildren = {
        id: '1',
        name: 'Parent Folder',
        path: '/parent',
        parentId: null,
        size: '2048',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        children: [
          {
            id: '2',
            name: 'Child Folder',
            path: '/parent/child',
            parentId: '1',
            size: '1024',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z',
            children: [],
          },
        ],
      }

      const result = convertFolderWithChildrenToUI(folderWithChildren)

      expect(result).toEqual({
        id: '1',
        name: 'Parent Folder',
        size: '2048',
        icon: 'folder',
        path: '/parent',
        updateAt: expect.any(String),
        parentId: null,
        isExpanded: false,
        children: [
          {
            id: '2',
            name: 'Child Folder',
            size: '1024',
            icon: 'folder',
            path: '/parent/child',
            updateAt: expect.any(String),
            parentId: '1',
            isExpanded: false,
            children: [],
          },
        ],
      })
    })

    it('should handle empty children array', () => {
      const folderWithChildren: FolderWithChildren = {
        id: '1',
        name: 'Empty Parent',
        path: '/empty',
        parentId: null,
        size: null,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        children: [],
      }

      const result = convertFolderWithChildrenToUI(folderWithChildren)
      expect(result.children).toEqual([])
    })
  })
})
