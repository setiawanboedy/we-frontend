import { describe, it, expect, beforeEach } from 'vitest'
import { FolderHierarchy, FolderNode } from '../../../domain/entities/FolderHierarchy'

describe('FolderHierarchy', () => {
  describe('FolderNode', () => {
    it('should create a FolderNode with all parameters', () => {
      const children = [
        new FolderNode('child1', 'Child 1', '/parent/child1', 'parent-id', '512', []),
      ]

      const node = new FolderNode('parent-id', 'Parent Folder', '/parent', null, '1024', children)

      expect(node.id).toBe('parent-id')
      expect(node.name).toBe('Parent Folder')
      expect(node.path).toBe('/parent')
      expect(node.parentId).toBeNull()
      expect(node.size).toBe('1024')
      expect(node.children).toHaveLength(1)
      expect(node.children[0].id).toBe('child1')
    })

    it('should create a FolderNode with default empty children', () => {
      const node = new FolderNode('test-id', 'Test Folder', '/test', 'parent-id', null)

      expect(node.children).toEqual([])
    })
  })

  describe('FolderHierarchy', () => {
    let rootNode: FolderNode
    let childNode1: FolderNode
    let childNode2: FolderNode
    let grandchildNode: FolderNode
    let hierarchy: FolderHierarchy

    beforeEach(() => {
      grandchildNode = new FolderNode(
        'grandchild',
        'Grandchild',
        '/root/child1/grandchild',
        'child1',
        '256',
        [],
      )

      childNode1 = new FolderNode('child1', 'Child 1', '/root/child1', 'root', '512', [
        grandchildNode,
      ])

      childNode2 = new FolderNode('child2', 'Child 2', '/root/child2', 'root', '1024', [])

      rootNode = new FolderNode('root', 'Root', '/root', null, '2048', [childNode1, childNode2])

      hierarchy = new FolderHierarchy([rootNode])
    })

    describe('findById', () => {
      it('should find root node by id', () => {
        const found = hierarchy.findById('root')
        expect(found).toBe(rootNode)
      })

      it('should find child node by id', () => {
        const found = hierarchy.findById('child1')
        expect(found).toBe(childNode1)
      })

      it('should find grandchild node by id', () => {
        const found = hierarchy.findById('grandchild')
        expect(found).toBe(grandchildNode)
      })

      it('should return null for non-existent id', () => {
        const found = hierarchy.findById('non-existent')
        expect(found).toBeNull()
      })
    })

    describe('getAllIds', () => {
      it('should return all ids in depth-first order', () => {
        const ids = hierarchy.getAllIds()
        expect(ids).toEqual(['root', 'child1', 'grandchild', 'child2'])
      })

      it('should return empty array for empty hierarchy', () => {
        const emptyHierarchy = new FolderHierarchy([])
        const ids = emptyHierarchy.getAllIds()
        expect(ids).toEqual([])
      })

      it('should handle multiple root nodes', () => {
        const rootNode2 = new FolderNode('root2', 'Root 2', '/root2', null, '1024', [])

        const multiRootHierarchy = new FolderHierarchy([rootNode, rootNode2])
        const ids = multiRootHierarchy.getAllIds()
        expect(ids).toEqual(['root', 'child1', 'grandchild', 'child2', 'root2'])
      })
    })
  })

  describe('complex hierarchy scenarios', () => {
    it('should handle deep nested hierarchy', () => {
      // Create a deep hierarchy: root -> child -> grandchild -> great-grandchild
      const greatGrandchild = new FolderNode(
        'ggc',
        'Great Grandchild',
        '/root/child/gc/ggc',
        'gc',
        '128',
        [],
      )

      const grandchild = new FolderNode('gc', 'Grandchild', '/root/child/gc', 'child', '256', [
        greatGrandchild,
      ])

      const child = new FolderNode('child', 'Child', '/root/child', 'root', '512', [grandchild])

      const root = new FolderNode('root', 'Root', '/root', null, '1024', [child])

      const hierarchy = new FolderHierarchy([root])

      // Test finding deeply nested node
      const found = hierarchy.findById('ggc')
      expect(found).toBe(greatGrandchild)

      // Test all ids include deeply nested ones
      const ids = hierarchy.getAllIds()
      expect(ids).toEqual(['root', 'child', 'gc', 'ggc'])
    })

    it('should handle hierarchy with empty folders', () => {
      const emptyChild = new FolderNode('empty', 'Empty Folder', '/root/empty', 'root', '0', [])

      const root = new FolderNode('root', 'Root', '/root', null, '1024', [emptyChild])

      const hierarchy = new FolderHierarchy([root])

      const found = hierarchy.findById('empty')
      expect(found).toBe(emptyChild)

      const ids = hierarchy.getAllIds()
      expect(ids).toEqual(['root', 'empty'])
    })

    it('should handle nodes with special characters in IDs', () => {
      const specialNode = new FolderNode(
        'special-id_123',
        'Special Folder',
        '/special',
        null,
        '512',
        [],
      )
      const hierarchy = new FolderHierarchy([specialNode])

      const found = hierarchy.findById('special-id_123')
      expect(found).toBe(specialNode)

      const ids = hierarchy.getAllIds()
      expect(ids).toEqual(['special-id_123'])
    })

    it('should handle very large hierarchy efficiently', () => {
      // Create a large hierarchy to test performance
      const createLargeHierarchy = (depth: number, breadth: number): FolderNode => {
        if (depth === 0) {
          return new FolderNode(`leaf-${Math.random()}`, 'Leaf', '/leaf', null, '1', [])
        }

        const children: FolderNode[] = []
        for (let i = 0; i < breadth; i++) {
          children.push(createLargeHierarchy(depth - 1, breadth))
        }

        return new FolderNode(
          `node-${depth}-${breadth}`,
          `Node ${depth}`,
          `/node/${depth}`,
          null,
          '1024',
          children,
        )
      }

      const largeHierarchy = new FolderHierarchy([createLargeHierarchy(3, 3)])

      // Just test that it doesn't crash and returns some IDs
      const ids = largeHierarchy.getAllIds()
      expect(ids.length).toBeGreaterThan(0)
      expect(ids[0]).toMatch(/^node-3-3/)
    })

    it('should handle empty constructor parameters gracefully', () => {
      const emptyNode = new FolderNode('', '', '', null, null, [])
      expect(emptyNode.id).toBe('')
      expect(emptyNode.name).toBe('')
      expect(emptyNode.path).toBe('')
      expect(emptyNode.parentId).toBeNull()
      expect(emptyNode.size).toBeNull()
      expect(emptyNode.children).toEqual([])
    })

    it('should handle null parentId in findById', () => {
      const rootNode = new FolderNode('root', 'Root', '/root', null, '1024', [])
      const hierarchy = new FolderHierarchy([rootNode])

      const found = hierarchy.findById('root')
      expect(found).toBe(rootNode)
      expect(found?.parentId).toBeNull()
    })

    it('should handle mixed hierarchy with some nodes having children and some not', () => {
      const leaf1 = new FolderNode('leaf1', 'Leaf 1', '/root/leaf1', 'root', '100', [])
      const leaf2 = new FolderNode('leaf2', 'Leaf 2', '/root/leaf2', 'root', '200', [])
      const parentWithChildren = new FolderNode('parent', 'Parent', '/root/parent', 'root', '500', [
        leaf1,
      ])
      const parentWithoutChildren = new FolderNode(
        'empty-parent',
        'Empty Parent',
        '/root/empty',
        'root',
        '0',
        [],
      )

      const root = new FolderNode('root', 'Root', '/root', null, '1024', [
        parentWithChildren,
        parentWithoutChildren,
        leaf2,
      ])

      const hierarchy = new FolderHierarchy([root])

      // Test finding all types of nodes
      expect(hierarchy.findById('leaf1')).toBe(leaf1)
      expect(hierarchy.findById('parent')).toBe(parentWithChildren)
      expect(hierarchy.findById('empty-parent')).toBe(parentWithoutChildren)
      expect(hierarchy.findById('leaf2')).toBe(leaf2)

      // Test getAllIds includes all nodes
      const ids = hierarchy.getAllIds()
      expect(ids).toEqual(['root', 'parent', 'leaf1', 'empty-parent', 'leaf2'])
    })

    it('should handle hierarchy with duplicate names but different IDs', () => {
      const folder1 = new FolderNode('id1', 'Same Name', '/path1', null, '100', [])
      const folder2 = new FolderNode('id2', 'Same Name', '/path2', null, '200', [])

      const hierarchy = new FolderHierarchy([folder1, folder2])

      expect(hierarchy.findById('id1')).toBe(folder1)
      expect(hierarchy.findById('id2')).toBe(folder2)

      const ids = hierarchy.getAllIds()
      expect(ids).toEqual(['id1', 'id2'])
    })
  })
})
