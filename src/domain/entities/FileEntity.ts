export class FileEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly path: string,
    public readonly folderId: string,
    public readonly size: number | null = null,
    public readonly mimeType: string | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    this.validateName(name)
    this.validatePath(path)
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('File name cannot be empty')
    }

    if (name.length > 255) {
      throw new Error('File name cannot exceed 255 characters')
    }

    const forbiddenChars = /[<>:"/\\|?*]/
    if (forbiddenChars.test(name)) {
      throw new Error('File name contains invalid characters')
    }
  }

  private validatePath(path: string): void {
    if (!path || path.trim().length === 0) {
      throw new Error('File path cannot be empty')
    }

    if (!path.startsWith('/')) {
      throw new Error('File path must start with /')
    }
  }

  get extension(): string {
    const parts = this.name.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  }

  get isImage(): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
    return imageExtensions.includes(this.extension)
  }

  get isVideo(): boolean {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv']
    return videoExtensions.includes(this.extension)
  }

  get isDocument(): boolean {
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
    return documentExtensions.includes(this.extension)
  }

  static fromObject(obj: {
    id: string
    name: string
    path: string
    folderId: string
    size: number | null
    mimeType: string | null
    createdAt: string | Date
    updatedAt: string | Date
  }): FileEntity {
    return new FileEntity(
      obj.id,
      obj.name,
      obj.path,
      obj.folderId,
      obj.size,
      obj.mimeType,
      obj.createdAt instanceof Date ? obj.createdAt : new Date(obj.createdAt),
      obj.updatedAt instanceof Date ? obj.updatedAt : new Date(obj.updatedAt),
    )
  }
}
