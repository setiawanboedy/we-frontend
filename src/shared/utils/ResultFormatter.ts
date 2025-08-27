export interface SuccessResult<T> {
  success: true
  data: T
  message: string
}

export interface ErrorResult {
  success: false
  error: string
  details?: string
}

export class ResultFormatter {
  static success<T>(data: T, message: string): SuccessResult<T> {
    return {
      success: true,
      data,
      message,
    }
  }

  static handleError(error: unknown, details?: string): string {
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('Network')) {
        return 'Koneksi ke server gagal. Periksa koneksi internet Anda.'
      }
      if (error.message.includes('not found') || error.message.includes('Not Found')) {
        return 'Data tidak ditemukan.'
      }
      if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
        return 'Anda tidak memiliki akses untuk melakukan tindakan ini.'
      }
      if (error.message.includes('timeout')) {
        return 'Permintaan memakan waktu terlalu lama. Coba lagi.'
      }
      if (error.message.includes('validation') || error.message.includes('invalid')) {
        return 'Data yang dimasukkan tidak valid. Periksa kembali input Anda.'
      }
      if (error.message.includes('duplicate') || error.message.includes('already exists')) {
        return 'Data dengan nama tersebut sudah ada.'
      }

      return error.message.includes('Failed to')
        ? error.message
        : `Terjadi kesalahan: ${error.message}`
    }
    return `Terjadi kesalahan tidak dikenal saat ${details?.toLowerCase()}.`
  }

  static error(error: unknown, defaultMessage: string): ErrorResult {
    const details = this.handleError(error, defaultMessage);
    const errorMessage = String(error);
    return {
      success: false,
      error: errorMessage,
      details,
    }
  }
}
