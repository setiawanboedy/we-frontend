export class FolderHierarchy {
  constructor(public readonly folders: ReadonlyArray<FolderNode>) {}

  findById(id: string): FolderNode | null {
    for (const folder of this.folders) {
      const found = this.findByIdRecursive(folder, id)
      if (found) return found
    }
    return null
  }

  private findByIdRecursive(node: FolderNode, id: string): FolderNode | null {
    if (node.id === id) return node

    for (const child of node.children) {
      const found = this.findByIdRecursive(child, id)
      if (found) return found
    }
    return null
  }

  getPathToNode(nodeId: string): string[] {
    const node = this.findById(nodeId)
    if (!node) return ['This PC']

    const path: string[] = []
    let current: FolderNode | null = node

    while (current) {
      path.unshift(current.name)
      current = current.parentId ? this.findById(current.parentId) : null
    }

    return ['This PC', ...path]
  }

  getAllIds(): string[] {
    const ids: string[] = []
    const traverse = (nodes: ReadonlyArray<FolderNode>) => {
      nodes.forEach((node) => {
        ids.push(node.id)
        traverse(node.children)
      })
    }
    traverse(this.folders)
    return ids
  }
}

export class FolderNode {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly path: string,
    public readonly parentId: string | null,
    public readonly size: string | null,
    public readonly children: ReadonlyArray<FolderNode> = [],
  ) {}
}
