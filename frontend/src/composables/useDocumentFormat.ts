import { documentUtil } from '@/utils/document.util'

export function useDocumentFormat() {
  const formatCPF = (value: string): string => {
    return documentUtil.formatCPF(value)
  }

  const formatCNPJ = (value: string): string => {
    return documentUtil.formatCNPJ(value)
  }

  const formatDocument = (value: string, type: 'CPF' | 'CNPJ'): string => {
    return documentUtil.formatDocument(value, type)
  }

  const unformatDocument = (value: string): string => {
    return documentUtil.unformatDocument(value)
  }

  return {
    formatCPF,
    formatCNPJ,
    formatDocument,
    unformatDocument
  }
}

