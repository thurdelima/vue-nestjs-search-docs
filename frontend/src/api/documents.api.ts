import apiClient from './client'
import type {
  Document,
  CreateDocumentDto,
  UpdateDocumentDto,
  FilterDocumentDto,
  DocumentsResponse
} from '@/types/document.types'

export const documentsApi = {
  async getAll(filters?: FilterDocumentDto): Promise<DocumentsResponse> {
    const response = await apiClient.get<DocumentsResponse>('/documents', { params: filters })
    return response.data
  },

  async getById(id: string): Promise<Document> {
    const response = await apiClient.get<Document>(`/documents/${id}`)
    return response.data
  },

  async create(data: CreateDocumentDto): Promise<Document> {
    const response = await apiClient.post<Document>('/documents', data)
    return response.data
  },

  async update(id: string, data: UpdateDocumentDto): Promise<Document> {
    const response = await apiClient.patch<Document>(`/documents/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}`)
  },

  async toggleBlocklist(id: string): Promise<Document> {
    const response = await apiClient.patch<Document>(`/documents/${id}/blocklist`)
    return response.data
  }
}

