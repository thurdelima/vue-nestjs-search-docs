<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FilterDocumentDto, DocumentType } from '@/types/document.types'

interface Emits {
  (e: 'filter-change', filters: FilterDocumentDto): void
}

const emit = defineEmits<Emits>()

const type = ref<DocumentType | undefined>(undefined)
const isBlocklisted = ref<boolean | undefined>(undefined)
const search = ref('')

const handleFilterChange = () => {
  const filters: FilterDocumentDto = {}

  if (type.value === 'CPF' || type.value === 'CNPJ') {
    filters.type = type.value
  }

  if (isBlocklisted.value === true || isBlocklisted.value === false) {
    filters.isBlocklisted = isBlocklisted.value
  }

  if (search.value.trim()) {
    filters.search = search.value.trim()
  }

  emit('filter-change', filters)
}

const clearFilters = () => {
  type.value = undefined
  isBlocklisted.value = undefined
  search.value = ''
  handleFilterChange()
}

watch([type, isBlocklisted, search], () => {
  handleFilterChange()
})
</script>

<template>
  <v-card class="mb-4">
    <v-card-title class="text-subtitle-1">Filtros</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3">
          <v-select
            v-model="type"
            label="Tipo"
            :items="[
              { title: 'Todos', value: undefined },
              { title: 'CPF', value: 'CPF' },
              { title: 'CNPJ', value: 'CNPJ' }
            ]"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="isBlocklisted"
            label="Blocklist"
            :items="[
              { title: 'Todos', value: undefined },
              { title: 'Sim', value: true },
              { title: 'Não', value: false }
            ]"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Buscar por número"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>

        <v-col cols="12" md="2" class="d-flex align-start">
          <v-btn
            color="secondary"
            variant="outlined"
            block
            @click="clearFilters"
          >
            Limpar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

