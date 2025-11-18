import {
  isValidCPF,
  isValidCNPJ,
  isValidDocument,
  detectDocumentType,
  normalizeDocument,
  DocumentType,
} from './cpf-cnpj-validator.util';

describe('CPF/CNPJ Validator', () => {
  describe('normalizeDocument', () => {
    it('should remove formatting from CPF', () => {
      expect(normalizeDocument('123.456.789-09')).toBe('12345678909');
      expect(normalizeDocument('12345678909')).toBe('12345678909');
    });

    it('should remove formatting from CNPJ', () => {
      expect(normalizeDocument('12.345.678/0001-90')).toBe('12345678000190');
      expect(normalizeDocument('12345678000190')).toBe('12345678000190');
    });
  });

  describe('isValidCPF', () => {
    it('should validate correct CPF', () => {
      expect(isValidCPF('123.456.789-09')).toBe(true);
      expect(isValidCPF('12345678909')).toBe(true);
      expect(isValidCPF('11144477735')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(isValidCPF('123.456.789-00')).toBe(false);
      expect(isValidCPF('111.111.111-11')).toBe(false);
      expect(isValidCPF('12345678900')).toBe(false);
      expect(isValidCPF('123')).toBe(false);
      expect(isValidCPF('123456789012')).toBe(false);
    });
  });

  describe('isValidCNPJ', () => {
    it('should validate correct CNPJ', () => {
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
      expect(isValidCNPJ('11222333000181')).toBe(true);
      expect(isValidCNPJ('00.000.000/0001-91')).toBe(true);
    });

    it('should reject invalid CNPJ', () => {
      expect(isValidCNPJ('11.222.333/0001-80')).toBe(false);
      expect(isValidCNPJ('11.111.111/1111-11')).toBe(false);
      expect(isValidCNPJ('123')).toBe(false);
      expect(isValidCNPJ('123456789012345')).toBe(false);
    });
  });

  describe('detectDocumentType', () => {
    it('should detect CPF', () => {
      expect(detectDocumentType('123.456.789-09')).toBe(DocumentType.CPF);
      expect(detectDocumentType('12345678909')).toBe(DocumentType.CPF);
    });

    it('should detect CNPJ', () => {
      expect(detectDocumentType('11.222.333/0001-81')).toBe(DocumentType.CNPJ);
      expect(detectDocumentType('11222333000181')).toBe(DocumentType.CNPJ);
    });

    it('should return null for invalid length', () => {
      expect(detectDocumentType('123')).toBe(null);
      expect(detectDocumentType('123456789012345')).toBe(null);
    });
  });

  describe('isValidDocument', () => {
    it('should validate CPF', () => {
      expect(isValidDocument('123.456.789-09')).toBe(true);
      expect(isValidDocument('12345678909')).toBe(true);
    });

    it('should validate CNPJ', () => {
      expect(isValidDocument('11.222.333/0001-81')).toBe(true);
      expect(isValidDocument('11222333000181')).toBe(true);
    });

    it('should reject invalid documents', () => {
      expect(isValidDocument('123.456.789-00')).toBe(false);
      expect(isValidDocument('11.222.333/0001-80')).toBe(false);
      expect(isValidDocument('123')).toBe(false);
    });
  });
});

