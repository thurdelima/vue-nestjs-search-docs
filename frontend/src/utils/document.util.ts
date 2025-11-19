export const documentUtil = {
  formatCPF(value: string): string {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length !== 11) return value
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  },

  formatCNPJ(value: string): string {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length !== 14) return value
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  },

  formatDocument(value: string, type: 'CPF' | 'CNPJ'): string {
    return type === 'CPF' ? this.formatCPF(value) : this.formatCNPJ(value)
  },

  unformatDocument(value: string): string {
    return value.replace(/\D/g, '')
  },

  isValidCPF(value: string): boolean {
    const cleaned = this.unformatDocument(value)
    if (cleaned.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleaned)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleaned[9])) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    return remainder === parseInt(cleaned[10])
  },

  isValidCNPJ(value: string): boolean {
    const cleaned = this.unformatDocument(value)
    if (cleaned.length !== 14) return false
    if (/^(\d)\1{13}$/.test(cleaned)) return false

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned[i]) * weights1[i]
    }
    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder
    if (digit1 !== parseInt(cleaned[12])) return false

    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleaned[i]) * weights2[i]
    }
    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder
    return digit2 === parseInt(cleaned[13])
  }
}

