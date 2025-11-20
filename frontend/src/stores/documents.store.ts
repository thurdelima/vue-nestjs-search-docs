import { defineStore } from 'pinia'
import { ref } from 'vue'
import { documentsApi } from '@/api/documents.api'
import type {
  Document,
  CreateDocumentDto,
  UpdateDocumentDto,
  FilterDocumentDto
} from '@/types/document.types'

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref<Document[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(10)

  const fetchDocuments = async (filters?: FilterDocumentDto) => {
    console.log(filters);
    const response = await documentsApi.getAll(filters)
    documents.value = response.data
    total.value = response.total
    page.value = response.page
    limit.value = response.limit
  }

  const createDocument = async (data: CreateDocumentDto) => {
    const newDocument = await documentsApi.create(data)
    documents.value.unshift(newDocument)
    total.value++
  }

  const updateDocument = async (id: string, data: UpdateDocumentDto) => {
    const updated = await documentsApi.update(id, data)
    const index = documents.value.findIndex((d) => d.id === id)
    if (index !== -1) {
      documents.value[index] = updated
    }
  }

  const deleteDocument = async (id: string) => {
    await documentsApi.delete(id)
    documents.value = documents.value.filter((d) => d.id !== id)
    total.value--
  }

  const toggleBlocklist = async (id: string) => {
    const updated = await documentsApi.toggleBlocklist(id)
    const index = documents.value.findIndex((d) => d.id === id)
    if (index !== -1) {
      documents.value[index] = updated
    }
  }

  return {
    documents,
    total,
    page,
    limit,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    toggleBlocklist
  }
})

