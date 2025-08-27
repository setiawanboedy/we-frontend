import type { AxiosRequestConfig } from 'axios'
import { CONFIG } from '../config/config'
import axios from 'axios'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: string
}

export class ApiClient {
  private baseURL: string

  constructor(baseUrl: string = CONFIG.API.BASE_URL) {
    this.baseURL = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: AxiosRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await axios({
        url,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      })
      return response.data
    } catch (error) {
      let errorMsg = 'Unknown error occurred'
      let details = ''
      if (axios.isAxiosError(error)) {
        errorMsg = error.message
        details = error.response?.data?.message || ''
      } else if (error instanceof Error) {
        errorMsg = error.message
      }
      return {
        success: false,
        error: errorMsg,
        details,
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      data: body,
    })
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      data: body,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()