import apiClient from './client'
import type { CreateUserDto, User } from '@/types/user.types'

export const usersApi = {
  async create(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    const response = await apiClient.post<Omit<User, 'password'>>('/users', data)
    return response.data
  },

  async getById(id: string): Promise<Omit<User, 'password'>> {
    const response = await apiClient.get<Omit<User, 'password'>>(`/users/${id}`)
    return response.data
  }
}

