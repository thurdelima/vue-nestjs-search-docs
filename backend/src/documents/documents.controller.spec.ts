import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document, DocumentType } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocumentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleBlocklist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a document', async () => {
      const createDto: CreateDocumentDto = {
        number: '123.456.789-09',
        type: DocumentType.CPF,
      };

      const document: Document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDocumentsService.create.mockResolvedValue(document);

      const result = await controller.create(createDto);

      expect(result).toEqual(document);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated documents', async () => {
      const filterDto = { page: 1, limit: 10 };
      const result = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockDocumentsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(filterDto)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findOne', () => {
    it('should return a document by id', async () => {
      const document: Document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDocumentsService.findOne.mockResolvedValue(document);

      expect(await controller.findOne('1')).toEqual(document);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const updateDto: UpdateDocumentDto = {
        number: '987.654.321-00',
        type: DocumentType.CNPJ,
      };

      const updatedDocument: Document = {
        id: '1',
        number: '98765432100',
        type: DocumentType.CNPJ,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDocumentsService.update.mockResolvedValue(updatedDocument);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedDocument);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should update only number', async () => {
      const updateDto: UpdateDocumentDto = {
        number: '987.654.321-00',
      };

      const updatedDocument: Document = {
        id: '1',
        number: '98765432100',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDocumentsService.update.mockResolvedValue(updatedDocument);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedDocument);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should update only type', async () => {
      const updateDto: UpdateDocumentDto = {
        type: DocumentType.CNPJ,
      };

      const updatedDocument: Document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CNPJ,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDocumentsService.update.mockResolvedValue(updatedDocument);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedDocument);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('toggleBlocklist', () => {
    it('should toggle blocklist status', async () => {
      const document: Document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const toggledDocument: Document = {
        ...document,
        isBlocklisted: true,
      };

      mockDocumentsService.toggleBlocklist.mockResolvedValue(toggledDocument);

      const result = await controller.toggleBlocklist('1');

      expect(result).toEqual(toggledDocument);
      expect(result.isBlocklisted).toBe(true);
      expect(service.toggleBlocklist).toHaveBeenCalledWith('1');
    });

    it('should toggle from true to false', async () => {
      const document: Document = {
        id: '1',
        number: '12345678909',
        type: DocumentType.CPF,
        isBlocklisted: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const toggledDocument: Document = {
        ...document,
        isBlocklisted: false,
      };

      mockDocumentsService.toggleBlocklist.mockResolvedValue(toggledDocument);

      const result = await controller.toggleBlocklist('1');

      expect(result).toEqual(toggledDocument);
      expect(result.isBlocklisted).toBe(false);
      expect(service.toggleBlocklist).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should remove a document (soft delete)', async () => {
      mockDocumentsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});

