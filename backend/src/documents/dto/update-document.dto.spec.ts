import { validate } from 'class-validator';
import { UpdateDocumentDto } from './update-document.dto';
import { DocumentType } from '../entities/document.entity';

describe('UpdateDocumentDto', () => {
  describe('Validação bem-sucedida - campos opcionais', () => {
    it('should validate successfully with no fields (all optional)', async () => {
      const dto = new UpdateDocumentDto();

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with only number field', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with only type field', async () => {
      const dto = new UpdateDocumentDto();
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with both fields', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('Validação bem-sucedida - valores válidos', () => {
    it('should validate successfully with valid CPF with formatting', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with valid CPF without formatting', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '12345678909';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with valid CNPJ with formatting', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '11.222.333/0001-81';
      dto.type = DocumentType.CNPJ;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with valid CNPJ without formatting', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '11222333000181';
      dto.type = DocumentType.CNPJ;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with another valid CPF', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '11144477735';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with another valid CNPJ', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '00.000.000/0001-91';
      dto.type = DocumentType.CNPJ;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('Falhas no campo number quando fornecido', () => {
    it('should fail when number is empty string', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const numberErrors = errors.filter((e) => e.property === 'number');
      expect(numberErrors.length).toBeGreaterThan(0);
    });

    it('should pass when number is null (optional field)', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = null as any;
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail when number is not a string', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = 12345678909 as any;
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'number')).toBe(true);
    });

    it('should fail when number is an invalid CPF', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-00';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const numberError = errors.find((e) => e.property === 'number');
      expect(numberError).toBeDefined();
      expect(numberError?.constraints).toBeDefined();
    });

    it('should fail when number is an invalid CNPJ', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '11.222.333/0001-80';
      dto.type = DocumentType.CNPJ;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const numberError = errors.find((e) => e.property === 'number');
      expect(numberError).toBeDefined();
    });

    it('should fail when number is a random string', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = 'abc123';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'number')).toBe(true);
    });

    it('should fail when number is too short', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'number')).toBe(true);
    });

    it('should fail when number is too long', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123456789012345';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'number')).toBe(true);
    });

    it('should fail when CPF has all same digits', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '111.111.111-11';
      dto.type = DocumentType.CPF;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'number')).toBe(true);
    });

    it('should fail when CNPJ has all same digits', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '11.111.111/1111-11';
      dto.type = DocumentType.CNPJ;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'number')).toBe(true);
    });
  });

  describe('Falhas no campo type quando fornecido', () => {
    it('should fail when type is empty string', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';
      dto.type = '' as any;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });

    it('should pass when type is null (optional field)', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';
      dto.type = null as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail when type is not a valid enum value', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';
      dto.type = 'INVALID' as any;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });

    it('should fail when type is lowercase cpf', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';
      dto.type = 'cpf' as any;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });

    it('should fail when type is lowercase cnpj', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '11.222.333/0001-81';
      dto.type = 'cnpj' as any;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });

    it('should fail when type is a number', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';
      dto.type = 123 as any;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });
  });

  describe('Falhas em ambos os campos quando fornecidos', () => {
    it('should fail when both fields are invalid', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-00';
      dto.type = 'INVALID' as any;

      const errors = await validate(dto);

      const fields = errors.map((error) => error.property);
      expect(fields).toEqual(expect.arrayContaining(['number', 'type']));
    });

    it('should fail when number is empty and type is invalid', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '';
      dto.type = 'INVALID' as any;

      const errors = await validate(dto);

      const fields = errors.map((error) => error.property);
      expect(fields).toEqual(expect.arrayContaining(['number', 'type']));
    });
  });

  describe('Comportamento de campos opcionais', () => {
    it('should allow updating only number without type', async () => {
      const dto = new UpdateDocumentDto();
      dto.number = '123.456.789-09';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should allow updating only type without number', async () => {
      const dto = new UpdateDocumentDto();
      dto.type = DocumentType.CNPJ;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should allow empty DTO for partial updates', async () => {
      const dto = new UpdateDocumentDto();

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});

