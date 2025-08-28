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

