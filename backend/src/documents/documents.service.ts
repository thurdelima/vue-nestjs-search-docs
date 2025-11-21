import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FilterDocumentDto } from './dto/filter-document.dto';
import { normalizeDocument } from '../utils/cpf-cnpj-validator.util';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const normalizedNumber = normalizeDocument(createDocumentDto.number);

    const existing = await this.documentRepository.findOne({
      where: { number: normalizedNumber },
    });

    if (existing) {
      if (existing.isDeleted) {
        existing.isDeleted = false;
        existing.type = createDocumentDto.type;
        return await this.documentRepository.save(existing);
      } else {
        throw new ConflictException(
          `Documento ${normalizedNumber} já está cadastrado`,
        );
      }
    }

    const document = this.documentRepository.create({
      number: normalizedNumber,
      type: createDocumentDto.type,
      isDeleted: false,
    });

    return await this.documentRepository.save(document);
  }

  async findAll(filterDto: FilterDocumentDto) {
    const {
      type,
      isBlocklisted,
      search,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = filterDto;

    const where: FindOptionsWhere<Document> = {
      isDeleted: false,
    };

    if (type) {
      where.type = type;
    }

    if (isBlocklisted !== undefined) {
      where.isBlocklisted = isBlocklisted;
    }

    if (search) {
      where.number = Like(`%${normalizeDocument(search)}%`);
    }

    const [documents, total] = await this.documentRepository.findAndCount({
      where,
      order: {
        [sortBy]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!document) {
      throw new NotFoundException(`Documento com ID ${id} não encontrado`);
    }

    return document;
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const document = await this.findOne(id);

    if (updateDocumentDto.number) {
      const normalizedNumber = normalizeDocument(updateDocumentDto.number);

      const existing = await this.documentRepository.findOne({
        where: { number: normalizedNumber },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Documento ${normalizedNumber} já está cadastrado`,
        );
      }

      document.number = normalizedNumber;
    }

    if (updateDocumentDto.type) {
      document.type = updateDocumentDto.type;
    }

    return await this.documentRepository.save(document);
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);
    document.isDeleted = true;
    await this.documentRepository.save(document);
  }

  async toggleBlocklist(id: string): Promise<Document> {
    const document = await this.findOne(id);
    document.isBlocklisted = !document.isBlocklisted;
    return await this.documentRepository.save(document);
  }
}

