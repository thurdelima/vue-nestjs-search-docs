<script setup lang="ts">
import { computed } from 'vue'
import { useDocumentFormat } from '@/composables/useDocumentFormat'
import type { Document } from '@/types/document.types'
import { DocumentType } from '@/types/document.types'

interface Props {
  documents: Document[]
  loading: boolean
  total: number
  page: number
  limit: number
}

interface Emits {
  (e: 'edit', document: Document): void
  (e: 'delete', id: string): void
  (e: 'toggle-blocklist', id: string): void
  (e: 'page-change', page: number): void
  (e: 'limit-change', limit: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { formatDocument } = useDocumentFormat()

const headers = [
  { title: 'Número', key: 'number', sortable: false },
  { title: 'Tipo', key: 'type', sortable: false },
  { title: 'Blocklist', key: 'isBlocklisted', sortable: false },
  { title: 'Criado em', key: 'createdAt', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const }
]

const totalPages = computed(() => Math.ceil(props.total / props.limit))

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR')
}

const handleEdit = (document: Document) => {
  emit('edit', document)
}

const handleDelete = (id: string) => {
  emit('delete', id)
}

const handleToggleBlocklist = (id: string) => {
  emit('toggle-blocklist', id)
}

const handlePageChange = (newPage: number) => {
  emit('page-change', newPage)
}

const handleLimitChange = (newLimit: number) => {
  emit('limit-change', newLimit)
}
</script>

<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="documents"
      :loading="loading"
      :items-per-page="limit"
      :items-per-page-options="[10, 25, 50, 100]"
      @update:items-per-page="handleLimitChange"
      :server-items-length="total"
      :page="page"
      class="elevation-1"
      no-data-text="Nenhum documento encontrado"
      loading-text="Carregando documentos..."
    >
      <template #item.number="{ item }">
        {{ formatDocument(item.number, item.type) }}
      </template>

      <template #item.type="{ item }">
        <v-chip :color="item.type === DocumentType.CPF ? 'blue' : 'green'" size="small">
          {{ item.type }}
        </v-chip>
      </template>

      <template #item.isBlocklisted="{ item }">
        <v-chip
          :color="item.isBlocklisted ? 'error' : 'success'"
          size="small"
        >
          {{ item.isBlocklisted ? 'Sim' : 'Não' }}
        </v-chip>
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="handleEdit(item)"
          class="mr-1"
        />
        <v-btn
          :icon="item.isBlocklisted ? 'mdi-lock-open' : 'mdi-lock'"
          size="small"
          variant="text"
          :color="item.isBlocklisted ? 'success' : 'warning'"
          @click="handleToggleBlocklist(item.id)"
          class="mr-1"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="handleDelete(item.id)"
        />
      </template>
    </v-data-table>

    <div class="d-flex justify-center align-center mt-4" v-if="totalPages > 1">
      <v-pagination
        :model-value="page"
        :length="totalPages"
        :total-visible="7"
        @update:model-value="handlePageChange"
      />
    </div>
  </div>
</template>

