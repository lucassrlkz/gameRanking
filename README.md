# GameRanking

API REST para organizar jogadores, categorias e desafios entre jogadores. Um desafio pode ser atualizado ao longo do seu ciclo de vida e, quando realizado, associado a uma partida com vencedor e resultados por set.

## Características

- Cadastro, consulta, atualização e remoção de jogadores.
- Organização de jogadores em categorias, com eventos e valores configuráveis.
- Criação e acompanhamento de desafios entre jogadores.
- Associação de partidas a desafios, incluindo vencedor e resultado por set.
- Persistência dos dados no MongoDB.
- Validação de dados de entrada com DTOs e `class-validator`.
- Tratamento global de exceções HTTP.
- Serialização de datas no fuso `America/Sao_Paulo`, no formato `YYYY-MM-DD HH:mm:ss.SSS`.

Os estados possíveis de um desafio são `PENDENTE`, `ACEITO`, `NEGADO`, `REALIZADO` e `CANCELADO`.

## Ferramentas e tecnologias

| Ferramenta/tecnologia | Uso |
| --- | --- |
| Node.js | Ambiente de execução |
| TypeScript | Linguagem da aplicação |
| NestJS 10 | Framework da API e organização por módulos |
| Express | Plataforma HTTP usada pelo NestJS |
| MongoDB | Banco de dados |
| Mongoose | Conexão com o MongoDB, schemas e modelos |
| `class-validator` e `class-transformer` | Validação e transformação de dados de entrada |
| `dotenv` | Leitura de variáveis de ambiente |
| `moment-timezone` | Formatação de datas no fuso horário configurado |
| Jest e Supertest | Testes unitários e end-to-end |
| ESLint e Prettier | Análise estática e formatação |
| Nest CLI | Execução e build da aplicação |

## Arquitetura

A aplicação segue a organização modular do NestJS. Cada recurso concentra seu controller, service, módulo, provedores de persistência e DTOs:

```text
src/
├── app.module.ts              # Módulo raiz e composição dos recursos
├── main.ts                    # Inicialização HTTP, filtro global e datas
├── database/                  # Provedor de conexão com MongoDB
├── players/                   # API e regras de jogadores
├── category/                  # API e regras de categorias
├── challenges/                # API de desafios e partidas
└── common/
    ├── errors/                # Tratamento de erros da aplicação
    ├── filters/               # Filtros HTTP globais
    ├── interfaces/            # Tipos e estados de domínio
    ├── pipes/                 # Validações reutilizáveis
    └── schema/                 # Schemas Mongoose
```

Controllers recebem as requisições HTTP e validam os dados com DTOs; services implementam as regras de negócio; providers criam os modelos Mongoose usados pelos services. O `AppModule` importa os módulos de jogadores, categorias e desafios. Categorias dependem de jogadores, e desafios usam jogadores e categorias para validar e registrar partidas.

As principais coleções MongoDB são `players`, `categories`, `challenges` e `matchs`. Categorias podem referenciar jogadores; desafios referenciam solicitante, jogadores participantes e partida associada.

## API

Todas as rotas usam o prefixo `/api/v1`.

### Jogadores — `/jogadores`

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/v1/jogadores` | Cadastra um jogador |
| `GET` | `/api/v1/jogadores` | Lista jogadores |
| `GET` | `/api/v1/jogadores/:_id` | Consulta um jogador |
| `PUT` | `/api/v1/jogadores/:_id` | Atualiza um jogador |
| `DELETE` | `/api/v1/jogadores/:_id` | Remove um jogador |

Os dados de jogador incluem nome, e-mail, telefone, ranking, posição no ranking e URL da foto.

### Categorias — `/categorias`

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/v1/categorias` | Cria uma categoria |
| `GET` | `/api/v1/categorias` | Lista categorias e jogadores associados |
| `GET` | `/api/v1/categorias/:categoryId` | Consulta uma categoria |
| `PUT` | `/api/v1/categorias/:categoryId` | Atualiza uma categoria |
| `POST` | `/api/v1/categorias/:category/jogadores/:playerId` | Associa um jogador à categoria |

Uma categoria contém uma identificação, descrição, eventos configuráveis e os jogadores associados.

### Desafios — `/desafios`

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/v1/desafios` | Cria um desafio |
| `GET` | `/api/v1/desafios` | Lista desafios |
| `PUT` | `/api/v1/desafios/:challengeId` | Atualiza o status e/ou a data do desafio |
| `POST` | `/api/v1/desafios/:challengeId/partida` | Registra uma partida para o desafio |
| `DELETE` | `/api/v1/desafios/:id` | Marca o desafio como cancelado |

A criação de um desafio valida os participantes, o solicitante e a categoria associada ao solicitante. A partida registra o vencedor (`def`) e os resultados dos sets; ao vinculá-la, o desafio passa ao status `REALIZADO`.

## Pré-requisitos

- Node.js e npm instalados.
- Uma instância MongoDB acessível pela aplicação.

## Configuração e execução

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure a variável de ambiente `DB_CONNECTION` com a URI do MongoDB. Por exemplo, em um arquivo `.env` na raiz:

   ```dotenv
   DB_CONNECTION=mongodb://localhost:27017/gameRanking
   ```

   O arquivo `.env` é local e não deve ser versionado.

3. Inicie a aplicação:

   ```bash
   # Desenvolvimento
   npm run start:dev

   # Execução normal
   npm run start

   # Build e execução em produção
   npm run build
   npm run start:prod
   ```

A API escuta na porta `8080` e estará disponível em `http://localhost:8080`.

## Testes e qualidade

```bash
# Testes unitários
npm test

# Testes end-to-end
npm run test:e2e

# Cobertura de testes
npm run test:cov

# Lint
npm run lint

# Formatação
npm run format
```
