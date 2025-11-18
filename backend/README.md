# Backend - Sistema de Gerenciamento CPF/CNPJ

Backend desenvolvido em NestJS para gerenciamento e validação de CPF/CNPJ.

## Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **class-validator** - Validação de dados
- **Swagger** - Documentação da API
- **Pino** - Logger JSON estruturado
- **Jest** - Testes unitários

## Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose
- npm ou yarn

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

Edite o arquivo `.env` conforme necessário.

3. Inicie o banco de dados PostgreSQL com Docker:
```bash
docker-compose up -d
```

4. Execute as migrações do banco de dados:
```bash
npm run migration:run
```

5. Inicie a aplicação:
```bash
npm run start:dev
```

## Executando a aplicação

### Desenvolvimento
```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`

### Produção
```bash
npm run build
npm run start:prod
```

## Documentação da API

Com a aplicação rodando, acesse:
- **Swagger UI**: http://localhost:3000/api

## Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:cov
```

## Migrations

O projeto utiliza TypeORM Migrations para gerenciar o schema do banco de dados.

### Comandos de Migration

```bash
# Ver status das migrations
npm run migration:show

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert

# Criar nova migration vazia
npm run migration:create src/migrations/NomeDaMigration

# Gerar migration a partir das entidades (cuidado: pode sobrescrever)
npm run migration:generate src/migrations/NomeDaMigration
```

### Estrutura de Migrations

As migrations estão em `src/migrations/` e são compiladas para `dist/migrations/`.

**Importante**: 
- Em desenvolvimento, `synchronize: true` ainda está ativo para agilizar
- Em produção, sempre use `synchronize: false` e execute migrations manualmente
- Nunca edite migrations já executadas em produção

## Estrutura do Projeto

```
backend/
├── src/
│   ├── common/
│   │   ├── interceptors/     # Interceptors globais
│   │   └── validators/        # Validadores customizados
│   ├── config/                # Configurações
│   ├── documents/             # Módulo de documentos
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── entities/          # Entidades TypeORM
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   └── documents.module.ts
│   ├── migrations/            # Migrations do banco de dados
│   ├── status/                # Módulo de status
│   ├── utils/                 # Utilitários
│   ├── app.module.ts          # Módulo raiz
│   └── main.ts                # Arquivo principal
├── data-source.ts             # Configuração TypeORM CLI
├── docker-compose.yml         # Configuração do PostgreSQL
└── package.json
```

## Endpoints Principais

### Documents
- `GET /documents` - Listar documentos (com filtros e paginação)
- `GET /documents/:id` - Buscar documento por ID
- `POST /documents` - Criar novo documento
- `PATCH /documents/:id` - Atualizar documento
- `PATCH /documents/:id/blocklist` - Alternar status de blocklist
- `DELETE /documents/:id` - Deletar documento

### Status
- `GET /status` - Obter status do servidor (uptime e contador de consultas)

## Validação de CPF/CNPJ

A aplicação valida CPF e CNPJ usando os algoritmos oficiais de validação dos dígitos verificadores:
- CPF: 11 dígitos com validação dos 2 dígitos verificadores
- CNPJ: 14 dígitos com validação dos 2 dígitos verificadores

Os documentos podem ser enviados com ou sem formatação (pontos, traços, barras são removidos automaticamente).

## Logging

O projeto utiliza **Pino** para logging estruturado em JSON.

### Configuração

- **Desenvolvimento**: Logs formatados e coloridos (pino-pretty)
- **Produção**: Logs em JSON estruturado
- **Nível de log**: Configurável via `LOG_LEVEL` (debug, info, warn, error)

### Recursos

- Logging automático de requisições HTTP
- Logs estruturados em JSON
- Níveis de log customizados por status HTTP
- Ignora automaticamente endpoints de health check (`/status`, `/health`)

### Uso em Serviços

```typescript
import { Logger } from 'nestjs-pino';

@Injectable()
export class MyService {
  constructor(private readonly logger: Logger) {}

  someMethod() {
    this.logger.log('Informação');
    this.logger.warn('Aviso');
    this.logger.error('Erro');
  }
}
```

## Variáveis de Ambiente

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cpf_cnpj_db
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
FRONTEND_URL=http://localhost:5173
```

## Banco de Dados

O banco de dados PostgreSQL é executado via Docker Compose. Para parar o banco:

```bash
docker-compose down
```

Para remover os dados:

```bash
docker-compose down -v
```

