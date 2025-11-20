# Search Docs - Sistema de Gerenciamento CPF/CNPJ

Sistema completo para gerenciamento e validação de documentos CPF/CNPJ, desenvolvido com NestJS no backend e Vue.js 3 no frontend.

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose instalados
- Git (para clonar o repositório)

### Comandos para Subir os Containers

```bash
# Subir todos os serviços (banco, backend e frontend)
docker compose up --build

# Subir em modo detached (background)
docker compose up -d --build

# Parar os containers
docker compose down

# Parar e remover volumes (limpar dados do banco)
docker compose down -v

# Ver logs dos containers
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Acessos

Após subir os containers:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432

### Credenciais Padrão (Seed)

O seed cria automaticamente um usuário para testes:

- **Email**: `example@email.com`
- **Senha**: `senha123`

## 🛠️ Tecnologias

### 🔷 Backend

- **NestJS** ^11.1.9 - Framework Node.js progressivo
- **TypeORM** ^0.3.27 - ORM para PostgreSQL
- **PostgreSQL** 15 - Banco de dados relacional
- **class-validator** ^0.14.2 - Validação de DTOs
- **class-transformer** ^0.5.1 - Transformação de objetos
- **@nestjs/swagger** ^11.2.2 - Documentação automática da API
- **nestjs-pino** ^4.4.1 - Logger JSON estruturado (Pino)
- **pino** ^9.14.0 - Logger de alta performance
- **pino-http** ^9.0.0 - Middleware HTTP para Pino
- **@nestjs/jwt** ^11.0.1 - Autenticação JWT
- **@nestjs/passport** ^11.0.5 - Estratégias de autenticação
- **passport-jwt** ^4.0.1 - Estratégia JWT para Passport
- **bcrypt** ^5.1.1 - Hash de senhas
- **pg** ^8.16.3 - Driver PostgreSQL
- **Jest** ^30.2.0 - Framework de testes
- **TypeScript** ^5.9.3 - Superset do JavaScript

### 🔶 Frontend

- **Vue.js 3** ^3.4.21 - Framework JavaScript progressivo
- **TypeScript** ^5.4.3 - Tipagem estática
- **Vuetify 3** ^3.5.10 - Framework de componentes Material Design
- **Pinia** ^2.1.7 - State management
- **Vue Router** ^4.3.0 - Roteamento
- **Axios** ^1.6.7 - Cliente HTTP
- **Vite** ^5.2.0 - Build tool e dev server
- **@vuelidate/core** ^2.0.3 - Validação de formulários
- **@vuelidate/validators** ^2.0.2 - Validadores para Vuelidate
- **@mdi/font** ^7.4.47 - Ícones Material Design
- **Composition API** - Abordagem moderna do Vue 3 com `<script setup>`

## 🧪 Testes Unitários (Backend)

O backend utiliza Jest para testes unitários com cobertura de código.

### Comandos de Teste

```bash
# Executar todos os testes
cd backend
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:cov

# Executar testes com debug
npm run test:debug
```

### Estrutura de Testes

Os testes estão localizados junto aos arquivos que testam, seguindo o padrão `*.spec.ts`:

- `src/**/*.spec.ts` - Testes unitários de controllers, services e DTOs
- Cobertura de código gerada em `coverage/`

### Exemplos de Arquivos de Teste

- `src/documents/documents.controller.spec.ts`
- `src/documents/documents.service.spec.ts`
- `src/users/users.controller.spec.ts`
- `src/users/users.service.spec.ts`
- `src/auth/auth.service.spec.ts`
- `src/auth/auth.controller.spec.ts`
- E outros...

## 📝 Logs com Pino (Backend)

O backend utiliza **Pino** para logging estruturado em JSON, proporcionando logs de alta performance e fácil análise.

### Configuração

Os logs são configurados em `backend/src/config/logger.config.ts`:

- **Desenvolvimento**: Logs formatados e coloridos com `pino-pretty`
- **Produção**: Logs em JSON estruturado
- **Níveis**: `debug`, `info`, `warn`, `error`

### Variáveis de Ambiente

```env
LOG_LEVEL=debug  # ou info, warn, error
```

### Formato dos Logs

**Desenvolvimento** (com pino-pretty):
```
[2025-11-20 16:50:37] INFO: POST /auth/login 401
```

**Produção** (JSON):
```json
{"level":30,"time":1763657152355,"pid":40,"hostname":"container","msg":"POST /auth/login 401"}
```

### Recursos do Logger

- Logging automático de requisições HTTP
- Serialização customizada de requests e responses
- Níveis de log customizados baseados em status code
- Ignora rotas específicas (ex: `/status`, `/health`)

## 📚 Swagger (Backend)

A documentação interativa da API está disponível através do Swagger.

### Acesso

Após iniciar o backend:

**URL**: http://localhost:3000/api

### Funcionalidades

- **Documentação interativa** de todos os endpoints
- **Teste de requisições** diretamente na interface
- **Autenticação JWT** integrada (botão "Authorize")
- **Schemas** de request/response
- **Exemplos** de payloads

### Autenticação no Swagger

1. Acesse http://localhost:3000/api
2. Clique no botão **"Authorize"** (cadeado no topo)
3. Faça login via `/auth/login` para obter o token
4. Cole o token no campo "Value" (formato: `Bearer <token>` ou apenas `<token>`)
5. Clique em **"Authorize"** e depois **"Close"**
6. Agora você pode testar endpoints protegidos

### Tags da API

- **documents** - Operações relacionadas a documentos CPF/CNPJ
- **users** - Gerenciamento de usuários
- **auth** - Autenticação (login, profile)
- **status** - Status do servidor

## 📁 Estrutura do Projeto

```
search_docs/
├── backend/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── documents/     # Módulo de documentos
│   │   ├── users/          # Módulo de usuários
│   │   ├── migrations/     # Migrations do TypeORM
│   │   ├── database/
│   │   │   └── seeds/      # Seeds do banco de dados
│   │   └── config/         # Configurações (DB, JWT, Logger)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                # Frontend Vue.js 3
│   ├── src/
│   │   ├── api/            # Serviços de API (Axios)
│   │   ├── stores/         # Stores Pinia
│   │   ├── composables/     # Composables reutilizáveis
│   │   ├── views/           # Páginas/Vistas
│   │   ├── components/      # Componentes Vue
│   │   ├── router/          # Configuração do Vue Router
│   │   └── types/           # Tipos TypeScript
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Orquestração dos containers
└── README.md               # Este arquivo
```

## 🔄 Fluxo de Inicialização

Quando você executa `docker compose up --build`:

1. **PostgreSQL** inicia e aguarda conexões
2. **Backend** aguarda o banco ficar saudável (healthcheck)
3. **Backend** executa migrations automaticamente
4. **Backend** executa seed (cria usuário e documentos de teste)
5. **Backend** inicia a aplicação NestJS
6. **Frontend** inicia após o backend estar pronto

## 🔐 Variáveis de Ambiente

### Backend

Crie um arquivo `backend/.env` baseado em `backend/env.example`:

```env
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cpf_cnpj_db

PORT=3000
NODE_ENV=production

LOG_LEVEL=info

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1d

FRONTEND_URL=http://localhost:5173
```

### Frontend

Crie um arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## 🗄️ Banco de Dados

### Migrations

As migrations são executadas automaticamente ao iniciar o backend via Docker.

Para executar manualmente (desenvolvimento local):

```bash
cd backend
npm run migration:run
```

### Seeds

O seed é executado automaticamente após as migrations no Docker.

Para executar manualmente:

```bash
cd backend
npm run seed
```

O seed cria:
- 1 usuário: `example@email.com` / `senha123`
- 5 CPFs válidos
- 5 CNPJs válidos

## 🛠️ Desenvolvimento Local (sem Docker)

### Backend

```bash
cd backend
npm install
cp env.example .env
# Edite o .env com suas configurações
npm run migration:run
npm run seed
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📦 Scripts Úteis

### Backend

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Testes
npm test
npm run test:watch
npm run test:cov

# Migrations
npm run migration:run
npm run migration:revert
npm run migration:show

# Seed
npm run seed
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🐛 Troubleshooting

### Backend não inicia

- Verifique se o PostgreSQL está rodando e saudável
- Verifique as variáveis de ambiente no `docker-compose.yml`
- Veja os logs: `docker compose logs backend`

### Frontend não conecta ao backend

- Verifique se `VITE_API_URL` está correto
- Verifique se o backend está rodando na porta 3000
- Verifique CORS no backend

### Erro de migration

- Verifique se o banco está acessível
- Verifique as credenciais do banco
- Veja os logs: `docker compose logs backend`

## 📄 Licença

ISC

