import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document, DocumentType } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: Repository<Document>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const createDto: CreateDocumentDto = {
        number: '123.456.789-09',
        type: DocumentType.CPF,
      };

      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(document);
      mockRepository.save.mockResolvedValue(document);

      const result = await service.create(createDto);

      expect(result).toEqual(document);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { number: '12345678909' },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        number: '12345678909',
        type: DocumentType.CPF,
        isDeleted: false,
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if document already exists', async () => {
      const createDto: CreateDocumentDto = {
        number: '123.456.789-09',
        type: DocumentType.CPF,
      };

      const existingDocument = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isDeleted: false,
      };

      mockRepository.findOne.mockResolvedValue(existingDocument);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a document by id', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(document);

      const result = await service.findOne('1');

      expect(result).toEqual(document);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', isDeleted: false },
      });
    });

    it('should throw NotFoundException if document not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should perform soft delete by setting isDeleted to true', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(document);
      mockRepository.save.mockResolvedValue({
        ...document,
        isDeleted: true,
      });

      await service.remove('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', isDeleted: false },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isDeleted: true }),
      );
    });

    it('should throw NotFoundException if document not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should filter out deleted documents', async () => {
      const documents = [
        {
          id: '1',
          number: '12345678909',
          type: DocumentType.CPF,
          isBlocklisted: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([documents, 1]);

      const result = await service.findAll({});

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result.data).toEqual(documents);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by type', async () => {
      const documents = [
        {
          id: '1',
          number: '12345678909',
          type: DocumentType.CPF,
          isBlocklisted: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([documents, 1]);

      await service.findAll({ type: DocumentType.CPF });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false, type: DocumentType.CPF },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter by isBlocklisted', async () => {
      const documents = [
        {
          id: '1',
          number: '12345678909',
          type: DocumentType.CPF,
          isBlocklisted: true,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([documents, 1]);

      await service.findAll({ isBlocklisted: true });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false, isBlocklisted: true },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter by search', async () => {
      const documents = [
        {
          id: '1',
          number: '12345678909',
          type: DocumentType.CPF,
          isBlocklisted: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([documents, 1]);

      await service.findAll({ search: '123.456.789-09' });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false, number: Like('%12345678909%') },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('should handle pagination', async () => {
      const documents = [
        {
          id: '1',
          number: '12345678909',
          type: DocumentType.CPF,
          isBlocklisted: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([documents, 25]);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { createdAt: 'DESC' },
        skip: 10,
        take: 10,
      });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(3);
    });

    it('should handle sorting', async () => {
      const documents = [
        {
          id: '1',
          number: '12345678909',
          type: DocumentType.CPF,
          isBlocklisted: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([documents, 1]);

      await service.findAll({ sortBy: 'number', order: 'ASC' });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { number: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('should combine multiple filters', async () => {
      const documents = [
        {
          id: '1',
          number: '12345678909',
          type: DocumentType.CPF,
          isBlocklisted: true,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([documents, 1]);

      await service.findAll({
        type: DocumentType.CPF,
        isBlocklisted: true,
        search: '123',
        page: 1,
        limit: 5,
        sortBy: 'number',
        order: 'ASC',
      });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          isDeleted: false,
          type: DocumentType.CPF,
          isBlocklisted: true,
          number: Like('%123%'),
        },
        order: { number: 'ASC' },
        skip: 0,
        take: 5,
      });
    });
  });

  describe('update', () => {
    it('should update document number', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto: UpdateDocumentDto = {
        number: '987.654.321-00',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(document)
        .mockResolvedValueOnce(null);
      mockRepository.save.mockResolvedValue({
        ...document,
        number: '98765432100',
      });

      const result = await service.update('1', updateDto);

      expect(result.number).toBe('98765432100');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update document type', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto: UpdateDocumentDto = {
        type: DocumentType.CNPJ,
      };

      mockRepository.findOne.mockResolvedValue(document);
      mockRepository.save.mockResolvedValue({
        ...document,
        type: DocumentType.CNPJ,
      });

      const result = await service.update('1', updateDto);

      expect(result.type).toBe(DocumentType.CNPJ);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update both number and type', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto: UpdateDocumentDto = {
        number: '987.654.321-00',
        type: DocumentType.CNPJ,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(document)
        .mockResolvedValueOnce(null);
      mockRepository.save.mockResolvedValue({
        ...document,
        number: '98765432100',
        type: DocumentType.CNPJ,
      });

      const result = await service.update('1', updateDto);

      expect(result.number).toBe('98765432100');
      expect(result.type).toBe(DocumentType.CNPJ);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if new number already exists in another document', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingDocument = {
        id: '2',
        number: '98765432100',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto: UpdateDocumentDto = {
        number: '987.654.321-00',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(document) // findOne no update
        .mockResolvedValueOnce(existingDocument); // verificação de duplicata

      await expect(service.update('1', updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should allow updating to same number (same document)', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto: UpdateDocumentDto = {
        number: '123.456.789-09', // mesmo número, formato diferente
      };

      mockRepository.findOne
        .mockResolvedValueOnce(document) // findOne no update
        .mockResolvedValueOnce(document); // verificação (mesmo ID, então permite)
      mockRepository.save.mockResolvedValue(document);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(document);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if document not found', async () => {
      const updateDto: UpdateDocumentDto = {
        number: '987.654.321-00',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleBlocklist', () => {
    it('should toggle blocklist status from false to true', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(document);
      mockRepository.save.mockResolvedValue({
        ...document,
        isBlocklisted: true,
      });

      const result = await service.toggleBlocklist('1');

      expect(result.isBlocklisted).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should toggle blocklist status from true to false', async () => {
      const document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(document);
      mockRepository.save.mockResolvedValue({
        ...document,
        isBlocklisted: false,
      });

      const result = await service.toggleBlocklist('1');

      expect(result.isBlocklisted).toBe(false);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if document not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.toggleBlocklist('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

