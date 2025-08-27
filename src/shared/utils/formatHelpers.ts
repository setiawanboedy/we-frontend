export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString)

    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }

    const month = date.getMonth() + 1 
    const day = date.getDate()
    const year = date.getFullYear()

    let hours = date.getHours()
    const minutes = date.getMinutes()

    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12

    const minutesStr = minutes.toString().padStart(2, '0')

    return `${month}/${day}/${year} ${hours}:${minutesStr} ${ampm}`
  } catch (error) {
    return 'Invalid Date'
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSeconds < 60) {
      return 'Just now'
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      return formatDateTime(isoString)
    }
  } catch (error) {
    return 'Unknown'
  }
}
