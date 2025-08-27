export class FolderEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly path: string,
    public readonly parentId: string | null = null,
    public readonly size: number | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    this.validateName(name)
    this.validatePath(path)
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Folder name cannot be empty')
    }

    if (name.length > 255) {
      throw new Error('Folder name cannot exceed 255 characters')
    }

    // Windows forbidden characters
    const forbiddenChars = /[<>:"/\\|?*]/
    if (forbiddenChars.test(name)) {
      throw new Error('Folder name contains invalid characters')
    }
  }

  private validatePath(path: string): void {
    if (!path || path.trim().length === 0) {
      throw new Error('Folder path cannot be empty')
    }

    if (!path.startsWith('/')) {
      throw new Error('Folder path must start with /')
    }
  }

  static fromObject(obj: {
    id: string
    name: string
    path: string
    parentId: string | null
    size: string | null
    createdAt: string | Date
    updatedAt: string | Date
  }): FolderEntity {
    return new FolderEntity(
      obj.id,
      obj.name,
      obj.path,
      obj.parentId,
      typeof obj.size === 'string' ? Number(obj.size) : obj.size,
      typeof obj.createdAt === 'string' ? new Date(obj.createdAt) : obj.createdAt,
      typeof obj.updatedAt === 'string' ? new Date(obj.updatedAt) : obj.updatedAt,
    )
  }
}
