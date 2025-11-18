import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FilterDocumentDto } from './dto/filter-document.dto';
import { Document } from './entities/document.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo documento (CPF/CNPJ)' })
  @ApiResponse({
    status: 201,
    description: 'Documento criado com sucesso',
    type: Document,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Documento já existe' })
  create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar documentos com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos retornada com sucesso',
  })
  findAll(@Query() filterDto: FilterDocumentDto) {
    return this.documentsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar documento por ID' })
  @ApiParam({ name: 'id', description: 'UUID do documento' })
  @ApiResponse({
    status: 200,
    description: 'Documento encontrado',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  findOne(@Param('id') id: string): Promise<Document> {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um documento' })
  @ApiParam({ name: 'id', description: 'UUID do documento' })
  @ApiResponse({
    status: 200,
    description: 'Documento atualizado com sucesso',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @ApiResponse({ status: 409, description: 'Documento já existe' })
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Patch(':id/blocklist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alternar status de blocklist de um documento' })
  @ApiParam({ name: 'id', description: 'UUID do documento' })
  @ApiResponse({
    status: 200,
    description: 'Status de blocklist alterado com sucesso',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  toggleBlocklist(@Param('id') id: string): Promise<Document> {
    return this.documentsService.toggleBlocklist(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um documento' })
  @ApiParam({ name: 'id', description: 'UUID do documento' })
  @ApiResponse({ status: 204, description: 'Documento deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  remove(@Param('id') id: string): Promise<void> {
    return this.documentsService.remove(id);
  }
}

