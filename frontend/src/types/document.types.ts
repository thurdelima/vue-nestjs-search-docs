export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ'
}

export interface Document {
  id: string
  number: string
  type: DocumentType
  isBlocklisted: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateDocumentDto {
  number: string
  type: DocumentType
}

export interface UpdateDocumentDto {
  number?: string
  type?: DocumentType
}

export interface FilterDocumentDto {
  type?: DocumentType
  isBlocklisted?: boolean
  search?: string
  sortBy?: string
  order?: 'ASC' | 'DESC'
  page?: number
  limit?: number
}

export interface DocumentsResponse {
  data: Document[]
  total: number
  page: number
  limit: number
  totalPages: number
}

