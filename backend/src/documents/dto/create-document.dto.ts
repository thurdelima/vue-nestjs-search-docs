import { IsString, IsNotEmpty, IsEnum, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../entities/document.entity';
import { IsValidDocumentConstraint } from '../../common/validators/is-valid-document.validator';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Número do CPF ou CNPJ (com ou sem formatação)',
    example: '123.456.789-09',
  })
  @IsString()
  @IsNotEmpty()
  @Validate(IsValidDocumentConstraint)
  number: string;

  @ApiProperty({
    description: 'Tipo do documento',
    enum: DocumentType,
    example: DocumentType.CPF,
  })
  @IsEnum(DocumentType)
  @IsNotEmpty()
  type: DocumentType;
}

