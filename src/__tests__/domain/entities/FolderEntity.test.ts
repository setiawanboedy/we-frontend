import { describe, it, expect } from 'vitest'
import { FolderEntity } from '../../../domain/entities/FolderEntity'

describe('FolderEntity', () => {
  describe('constructor', () => {
    it('should create a valid FolderEntity with all parameters', () => {
      const createdAt = new Date('2023-01-01')
      const updatedAt = new Date('2023-01-02')

      const folder = new FolderEntity(
        'test-id',
        'Test Folder',
        '/test/path',
        'parent-id',
        1024,
        createdAt,
        updatedAt,
      )

      expect(folder.id).toBe('test-id')
      expect(folder.name).toBe('Test Folder')
      expect(folder.path).toBe('/test/path')
      expect(folder.parentId).toBe('parent-id')
      expect(folder.size).toBe(1024)
      expect(folder.createdAt).toBe(createdAt)
      expect(folder.updatedAt).toBe(updatedAt)
    })

    it('should create a FolderEntity with default values', () => {
      const folder = new FolderEntity('test-id', 'Test Folder', '/test/path')

      expect(folder.id).toBe('test-id')
      expect(folder.name).toBe('Test Folder')
      expect(folder.path).toBe('/test/path')
      expect(folder.parentId).toBeNull()
      expect(folder.size).toBeNull()
      expect(folder.createdAt).toBeInstanceOf(Date)
      expect(folder.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('validation', () => {
    it('should throw error for empty name', () => {
      expect(() => {
        new FolderEntity('id', '', '/path')
      }).toThrow('Folder name cannot be empty')
    })

    it('should throw error for whitespace-only name', () => {
      expect(() => {
        new FolderEntity('id', '   ', '/path')
      }).toThrow('Folder name cannot be empty')
    })

    it('should throw error for name exceeding 255 characters', () => {
      const longName = 'a'.repeat(256)
      expect(() => {
        new FolderEntity('id', longName, '/path')
      }).toThrow('Folder name cannot exceed 255 characters')
    })

    it('should throw error for name with forbidden characters', () => {
      const forbiddenNames = [
        '<test>',
        'test:file',
        'test"file',
        'test|file',
        'test?file',
        'test*file',
      ]

      forbiddenNames.forEach((name) => {
        expect(() => {
          new FolderEntity('id', name, '/path')
        }).toThrow('Folder name contains invalid characters')
      })
    })

    it('should throw error for empty path', () => {
      expect(() => {
        new FolderEntity('id', 'Test', '')
      }).toThrow('Folder path cannot be empty')
    })

    it('should throw error for whitespace-only path', () => {
      expect(() => {
        new FolderEntity('id', 'Test', '   ')
      }).toThrow('Folder path cannot be empty')
    })

    it('should throw error for path not starting with /', () => {
      expect(() => {
        new FolderEntity('id', 'Test', 'invalid/path')
      }).toThrow('Folder path must start with /')
    })
  })

  describe('fromObject', () => {
    it('should create FolderEntity from object with string dates', () => {
      const obj = {
        id: 'test-id',
        name: 'Test Folder',
        path: '/test/path',
        parentId: 'parent-id',
        size: '1024',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      }

      const folder = FolderEntity.fromObject(obj)

      expect(folder.id).toBe('test-id')
      expect(folder.name).toBe('Test Folder')
      expect(folder.path).toBe('/test/path')
      expect(folder.parentId).toBe('parent-id')
      expect(folder.size).toBe(1024)
      expect(folder.createdAt).toBeInstanceOf(Date)
      expect(folder.updatedAt).toBeInstanceOf(Date)
    })

    it('should create FolderEntity from object with Date objects', () => {
      const createdAt = new Date('2023-01-01')
      const updatedAt = new Date('2023-01-02')

      const obj = {
        id: 'test-id',
        name: 'Test Folder',
        path: '/test/path',
        parentId: null,
        size: null,
        createdAt,
        updatedAt,
      }

      const folder = FolderEntity.fromObject(obj)

      expect(folder.createdAt).toBe(createdAt)
      expect(folder.updatedAt).toBe(updatedAt)
      expect(folder.size).toBeNull()
    })

    it('should handle null size in fromObject', () => {
      const obj = {
        id: 'test-id',
        name: 'Test Folder',
        path: '/test/path',
        parentId: null,
        size: null,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      }

      const folder = FolderEntity.fromObject(obj)
      expect(folder.size).toBeNull()
    })
  })
})
