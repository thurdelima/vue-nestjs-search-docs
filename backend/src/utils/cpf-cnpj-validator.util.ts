/**
 * Utilitário para validação de CPF e CNPJ
 * Implementa os algoritmos de validação dos dígitos verificadores
 */

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

/**
 * Remove formatação do documento (pontos, traços, barras, espaços)
 */
export function normalizeDocument(document: string): string {
  return document.replace(/[^\d]/g, '');
}

/**
 * Valida se um CPF é válido
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF é válido
 */
export function isValidCPF(cpf: string): boolean {
  const numbers = normalizeDocument(cpf);

  if (numbers.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(numbers)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) {
    return false;
  }

  return true;
}

/**
 * Valida se um CNPJ é válido
 * @param cnpj - CNPJ com ou sem formatação
 * @returns true se o CNPJ é válido
 */
export function isValidCNPJ(cnpj: string): boolean {
  const numbers = normalizeDocument(cnpj);

  if (numbers.length !== 14) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(numbers)) {
    return false;
  }

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(numbers[12])) {
    return false;
  }

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(numbers[13])) {
    return false;
  }

  return true;
}

/**
 * Detecta o tipo de documento (CPF ou CNPJ) baseado no tamanho
 * @param document - Documento com ou sem formatação
 * @returns DocumentType ou null se não for possível detectar
 */
export function detectDocumentType(document: string): DocumentType | null {
  const numbers = normalizeDocument(document);
  if (numbers.length === 11) {
    return DocumentType.CPF;
  }
  if (numbers.length === 14) {
    return DocumentType.CNPJ;
  }
  return null;
}

/**
 * Valida um documento (CPF ou CNPJ)
 * @param document - Documento com ou sem formatação
 * @returns true se o documento é válido
 */
export function isValidDocument(document: string): boolean {
  const numbers = normalizeDocument(document);
  const type = detectDocumentType(document);

  if (type === DocumentType.CPF) {
    return isValidCPF(document);
  }
  if (type === DocumentType.CNPJ) {
    return isValidCNPJ(document);
  }

  return false;
}

