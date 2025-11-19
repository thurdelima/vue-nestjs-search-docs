export interface User {
  id: string
  email: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  email: string
  password: string
}

