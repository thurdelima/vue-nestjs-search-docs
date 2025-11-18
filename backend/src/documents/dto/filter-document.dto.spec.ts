import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { FilterDocumentDto } from './filter-document.dto';
import { DocumentType } from '../entities/document.entity';

describe('FilterDocumentDto', () => {
  describe('Validação bem-sucedida', () => {
    it('should validate successfully with all fields', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        type: DocumentType.CPF,
        isBlocklisted: true,
        search: '123',
        sortBy: 'createdAt',
        order: 'DESC',
        page: 1,
        limit: 10,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with no fields (all optional)', async () => {
      const dto = new FilterDocumentDto();

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate successfully with only type', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        type: DocumentType.CPF,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.type).toBe(DocumentType.CPF);
    });

    it('should validate successfully with only isBlocklisted as boolean', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        isBlocklisted: true,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.isBlocklisted).toBe(true);
    });

    it('should validate successfully with only search', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        search: '123456',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.search).toBe('123456');
    });

    it('should validate successfully with only sortBy', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        sortBy: 'number',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.sortBy).toBe('number');
    });

    it('should validate successfully with only order', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        order: 'ASC',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.order).toBe('ASC');
    });

    it('should validate successfully with only page', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        page: 5,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(5);
    });

    it('should validate successfully with only limit', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        limit: 20,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.limit).toBe(20);
    });

    it('should validate successfully with CNPJ type', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        type: DocumentType.CNPJ,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.type).toBe(DocumentType.CNPJ);
    });

    it('should validate successfully with order DESC', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        order: 'DESC',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.order).toBe('DESC');
    });
  });

  describe('Transform do isBlocklisted', () => {
    it('should transform string "true" to boolean true', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        isBlocklisted: 'true',
      });

      expect(dto.isBlocklisted).toBe(true);
    });

    it('should transform string "false" to boolean false', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        isBlocklisted: 'false',
      });

      expect(dto.isBlocklisted).toBe(false);
    });

    it('should keep boolean true as true', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        isBlocklisted: true,
      });

      expect(dto.isBlocklisted).toBe(true);
    });

    it('should keep boolean false as false', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        isBlocklisted: false,
      });

      expect(dto.isBlocklisted).toBe(false);
    });

    it('should keep other values unchanged', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        isBlocklisted: 'maybe',
      });

      expect(dto.isBlocklisted).toBe('maybe');
    });
  });

  describe('Falhas no campo type', () => {
    it('should fail when type is not a valid enum value', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        type: 'INVALID' as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });

    it('should fail when type is lowercase cpf', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        type: 'cpf' as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });

    it('should fail when type is lowercase cnpj', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        type: 'cnpj' as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'type')).toBe(true);
    });
  });

  describe('Falhas no campo isBlocklisted', () => {
    it('should fail when isBlocklisted is not a boolean after transform', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        isBlocklisted: 'maybe',
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'isBlocklisted')).toBe(true);
    });

    it('should fail when isBlocklisted is a number', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        isBlocklisted: 1,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'isBlocklisted')).toBe(true);
    });
  });

  describe('Falhas no campo search', () => {
    it('should fail when search is not a string', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        search: 123 as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'search')).toBe(true);
    });

    it('should fail when search is a number', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        search: 123456 as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'search')).toBe(true);
    });
  });

  describe('Falhas no campo sortBy', () => {
    it('should fail when sortBy is not a string', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        sortBy: 123 as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'sortBy')).toBe(true);
    });
  });

  describe('Falhas no campo order', () => {
    it('should fail when order is not a string', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        order: 123 as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'order')).toBe(true);
    });
  });

  describe('Falhas no campo page', () => {
    it('should fail when page is less than 1', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        page: 0,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'page')).toBe(true);
    });

    it('should fail when page is negative', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        page: -1,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'page')).toBe(true);
    });

    it('should fail when page is not an integer', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        page: 1.5,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'page')).toBe(true);
    });

    it('should fail when page is not a number', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        page: 'abc' as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'page')).toBe(true);
    });

    it('should pass when page is 1', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        page: 1,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass when page is a large number', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        page: 1000,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('Falhas no campo limit', () => {
    it('should fail when limit is less than 1', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        limit: 0,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'limit')).toBe(true);
    });

    it('should fail when limit is negative', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        limit: -1,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'limit')).toBe(true);
    });

    it('should fail when limit is not an integer', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        limit: 10.5,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'limit')).toBe(true);
    });

    it('should fail when limit is not a number', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        limit: 'abc' as any,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'limit')).toBe(true);
    });

    it('should pass when limit is 1', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        limit: 1,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass when limit is a large number', async () => {
      const dto = plainToInstance(FilterDocumentDto, {
        limit: 1000,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('Valores padrão', () => {
    it('should have default values for page and limit', () => {
      const dto = new FilterDocumentDto();

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(10);
    });

    it('should allow overriding default values', () => {
      const dto = plainToInstance(FilterDocumentDto, {
        page: 5,
        limit: 20,
      });

      expect(dto.page).toBe(5);
      expect(dto.limit).toBe(20);
    });
  });
});

