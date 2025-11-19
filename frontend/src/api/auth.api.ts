import apiClient from './client'
import type { LoginDto, LoginResponse } from '@/types/auth.types'
import type { User } from '@/types/user.types'

export const authApi = {
  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile')
    return response.data
  }
}

