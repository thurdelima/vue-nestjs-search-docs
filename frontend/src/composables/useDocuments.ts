import { ref, computed } from 'vue'
import { useDocumentsStore } from '@/stores/documents.store'
import { useSnackbar } from './useSnackbar'
import type { CreateDocumentDto, UpdateDocumentDto, FilterDocumentDto } from '@/types/document.types'

export function useDocuments() {
  const documentsStore = useDocumentsStore()
  const { snackbar, snackbarText, snackbarColor, showSuccess, showError } = useSnackbar()
  const loading = ref(false)

  const documents = computed(() => documentsStore.documents)
  const total = computed(() => documentsStore.total)
  const page = computed(() => documentsStore.page)
  const limit = computed(() => documentsStore.limit)

  const fetchDocuments = async (filters?: FilterDocumentDto) => {
    loading.value = true
    try {
      await documentsStore.fetchDocuments(filters)
    } catch (error: any) {
      showError('Erro ao carregar documentos')
    } finally {
      loading.value = false
    }
  }

  const createDocument = async (data: CreateDocumentDto) => {
    try {
      await documentsStore.createDocument(data)
      showSuccess('Documento criado com sucesso!')
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Erro ao criar documento'
      return { success: false, error: errorMessage }
    }
  }

  const updateDocument = async (id: string, data: UpdateDocumentDto) => {
    try {
      await documentsStore.updateDocument(id, data)
      showSuccess('Documento atualizado com sucesso!')
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Erro ao atualizar documento'
      return { success: false, error: errorMessage }
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      await documentsStore.deleteDocument(id)
      showSuccess('Documento deletado com sucesso!')
    } catch (error: any) {
      showError('Erro ao deletar documento')
    }
  }

  const toggleBlocklist = async (id: string) => {
    try {
      await documentsStore.toggleBlocklist(id)
      showSuccess('Status de blocklist alterado!')
    } catch (error: any) {
      showError('Erro ao alterar status de blocklist')
    }
  }

  return {
    documents,
    total,
    page,
    limit,
    loading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    toggleBlocklist,
    snackbar,
    snackbarText,
    snackbarColor,
    showSuccess,
    showError
  }
}

