<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDocuments } from '@/composables/useDocuments'
import { useDocumentFormat } from '@/composables/useDocumentFormat'
import type { Document, DocumentType } from '@/types/document.types'

interface Props {
  modelValue: boolean
  document?: Document | null
  showError?: (message: string) => void
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { createDocument, updateDocument } = useDocuments()
const { unformatDocument, formatDocument } = useDocumentFormat()

const number = ref('')
const type = ref<DocumentType>('CPF')
const loading = ref(false)

const isEdit = computed(() => !!props.document)
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isFormValid = computed(() => {
  const cleaned = unformatDocument(number.value)
  if (type.value === 'CPF') {
    return cleaned.length === 11
  } else {
    return cleaned.length === 14
  }
})

const resetForm = () => {
  number.value = ''
  type.value = 'CPF'
}

const handleSave = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    const cleanedNumber = unformatDocument(number.value)
    const data = {
      number: cleanedNumber,
      type: type.value
    }

    let result
    if (isEdit.value && props.document) {
      result = await updateDocument(props.document.id, data)
    } else {
      result = await createDocument(data)
    }

    if (result.success) {
      emit('saved')
    } else {
      if (props.showError) {
        props.showError(result.error || 'Erro ao salvar documento')
      }
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Erro ao salvar documento'
    if (props.showError) {
      props.showError(errorMessage)
    }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  resetForm()
  emit('close')
}

watch(
  () => props.document,
  (doc) => {
    if (doc) {
      number.value = formatDocument(doc.number, doc.type)
      type.value = doc.type
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      resetForm()
    }
  }
)
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h5">
        {{ isEdit ? 'Editar Documento' : 'Novo Documento' }}
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-select
            v-model="type"
            label="Tipo de Documento"
            :items="[
              { title: 'CPF', value: 'CPF' },
              { title: 'CNPJ', value: 'CNPJ' }
            ]"
            variant="outlined"
            required
          />

          <v-text-field
            v-model="number"
            :label="type === 'CPF' ? 'CPF' : 'CNPJ'"
            :placeholder="type === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'"
            variant="outlined"
            required
            :rules="[
              (v) => !!v || 'Número é obrigatório',
              () => isFormValid || (type === 'CPF' ? 'CPF inválido' : 'CNPJ inválido')
            ]"
            class="mt-4"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="handleClose" :disabled="loading">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="handleSave"
          :loading="loading"
          :disabled="!isFormValid"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

