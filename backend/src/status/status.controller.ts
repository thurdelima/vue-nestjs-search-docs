import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatusService } from './status.service';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @ApiOperation({ summary: 'Obter status do servidor' })
  @ApiResponse({
    status: 200,
    description: 'Status retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        uptime: {
          type: 'number',
          description: 'Tempo de atividade em segundos',
          example: 3600,
        },
        queryCount: {
          type: 'number',
          description: 'Quantidade de consultas desde o último start',
          example: 42,
        },
      },
    },
  })
  getStatus() {
    return this.statusService.getStatus();
  }
}

