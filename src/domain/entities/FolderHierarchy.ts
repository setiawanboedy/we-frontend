export class FolderHierarchy {
  constructor(public readonly folders: ReadonlyArray<FolderNode>) {}

    findById(id: string): FolderNode | null {
        for (const folder of this.folders){
            const found = this.findByIdRecursive(folder, id);
            if (found) return found;
        }
        return null;
    }

    private findByIdRecursive(node: FolderNode, id: string): FolderNode | null {
        if (node.id === id) return node;

        for (const child of node.children){
            const found = this.findByIdRecursive(child, id);
            if (found) return found;
        }

        return null;
    }


    getAllIds(): string[] {
        const ids: string[] = [];

        const transverse = (nodes: ReadonlyArray<FolderNode>) => {
            nodes.forEach(node => {
                ids.push(node.id);
                transverse(node.children);
            });
        };
        transverse(this.folders);
        return ids;
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
