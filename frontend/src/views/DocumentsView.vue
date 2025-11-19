<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDocuments } from '@/composables/useDocuments'
import { useAuth } from '@/composables/useAuth'
import DocumentFormModal from '@/components/DocumentFormModal.vue'
import DocumentTable from '@/components/DocumentTable.vue'
import DocumentFilters from '@/components/DocumentFilters.vue'
import type { FilterDocumentDto, Document } from '@/types/document.types'

const {
  documents,
  total,
  page,
  limit,
  loading,
  fetchDocuments,
  deleteDocument,
  toggleBlocklist,
  snackbar,
  snackbarText,
  snackbarColor,
  showError
} = useDocuments()
const { logout } = useAuth()

const showCreateModal = ref(false)
const editingDocument = ref<Document | null>(null)

const filters = ref<FilterDocumentDto>({
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  order: 'DESC'
})

const handleCreate = () => {
  editingDocument.value = null
  showCreateModal.value = true
}

const handleEdit = (doc: Document) => {
  editingDocument.value = doc
  showCreateModal.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Tem certeza que deseja deletar este documento?')) {
    await deleteDocument(id)
    await fetchDocuments(filters.value)
  }
}

const handleToggleBlocklist = async (id: string) => {
  await toggleBlocklist(id)
  await fetchDocuments(filters.value)
}

const handleFilterChange = (newFilters: FilterDocumentDto) => {
  const cleanedFilters: FilterDocumentDto = { ...newFilters }
  
  if (cleanedFilters.type && cleanedFilters.type !== 'CPF' && cleanedFilters.type !== 'CNPJ') {
    delete cleanedFilters.type
  }
  
  if (cleanedFilters.type === undefined) {
    delete cleanedFilters.type
  }
  
  if (cleanedFilters.isBlocklisted !== true && cleanedFilters.isBlocklisted !== false) {
    delete cleanedFilters.isBlocklisted
  }
  
  const mergedFilters = { ...filters.value, ...cleanedFilters, page: 1 }
  
  if (!cleanedFilters.type) {
    delete mergedFilters.type
  }
  
  if (cleanedFilters.isBlocklisted !== true && cleanedFilters.isBlocklisted !== false) {
    delete mergedFilters.isBlocklisted
  }
  
  filters.value = mergedFilters
}

const handlePageChange = (newPage: number) => {
  filters.value.page = newPage
}

const handleLimitChange = (newLimit: number) => {
  filters.value.limit = newLimit
}

const handleModalClose = () => {
  showCreateModal.value = false
  editingDocument.value = null
}

const handleModalSaved = () => {
  handleModalClose()
  fetchDocuments(filters.value)
}

watch(
  filters,
  () => {
    fetchDocuments(filters.value)
  },
  { deep: true }
)

onMounted(() => {
  fetchDocuments(filters.value)
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Gerenciamento de Documentos</span>
            <div>
              <v-btn color="primary" @click="handleCreate" class="mr-2">
                <v-icon start>mdi-plus</v-icon>
                Novo Documento
              </v-btn>
              <v-btn color="error" @click="logout">
                <v-icon start>mdi-logout</v-icon>
                Sair
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <DocumentFilters @filter-change="handleFilterChange" />

            <DocumentTable
              :documents="documents"
              :loading="loading"
              :total="total"
              :page="page"
              :limit="limit"
              @edit="handleEdit"
              @delete="handleDelete"
              @toggle-blocklist="handleToggleBlocklist"
              @page-change="handlePageChange"
              @limit-change="handleLimitChange"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <DocumentFormModal
      v-model="showCreateModal"
      :document="editingDocument"
      :show-error="showError"
      @close="handleModalClose"
      @saved="handleModalSaved"
    />

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      location="top"
      :z-index="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

