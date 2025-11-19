# Frontend - Sistema de Gerenciamento CPF/CNPJ

Frontend desenvolvido em Vue.js 3 com TypeScript, Vuetify e Composition API.

## Tecnologias

- **Vue.js 3** - Framework JavaScript progressivo
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vuetify 3** - Framework de componentes Material Design
- **Pinia** - State management
- **Vue Router** - Roteamento
- **Axios** - Cliente HTTP
- **Vite** - Build tool
- **Composition API** - Abordagem moderna do Vue 3 com `<script setup>`

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário (a URL da API já está configurada para `http://localhost:3000`).

## Executando a aplicação

### Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para produção
```bash
npm run build
```

Os arquivos compilados estarão na pasta `dist/`.

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── api/              # Serviços de API (Axios)
│   ├── stores/            # Stores Pinia
│   ├── composables/       # Composables reutilizáveis
│   ├── views/             # Páginas/Vistas
│   ├── components/        # Componentes reutilizáveis
│   ├── router/            # Configuração do Vue Router
│   ├── types/             # Tipos TypeScript
│   ├── utils/             # Utilitários
│   ├── App.vue            # Componente raiz
│   └── main.ts            # Entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Funcionalidades

### Autenticação
- **Registro de usuário**: Criação de conta com email e senha
- **Login**: Autenticação com JWT
- **Logout**: Remoção do token do localStorage

### Gerenciamento de Documentos
- **Listagem**: Tabela com paginação
- **Filtros**: Por tipo (CPF/CNPJ), blocklist e busca por número
- **Criação**: Modal para adicionar novo documento
- **Edição**: Modal para editar documento existente
- **Deleção**: Soft delete de documentos
- **Blocklist**: Alternar status de blocklist

## Composables

- `useAuth`: Lógica de autenticação (login, logout)
- `useDocuments`: Lógica de documentos (CRUD)
- `useSnackbar`: Notificações (snackbar)
- `useDocumentFormat`: Formatação de CPF/CNPJ

## Stores Pinia

- `auth`: Estado de autenticação (token, user)
- `documents`: Estado de documentos (lista, paginação)

## Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000
```

## Integração com Backend

O frontend se comunica com o backend através de requisições HTTP:
- Base URL configurável via `VITE_API_URL`
- Token JWT adicionado automaticamente via interceptor do Axios
- Redirecionamento automático para login em caso de 401

