# GameRanking

#### Distribuição deste projeto em outros repositórios pois se tornou vários micro serviços.

Api gateway com comunicação RabbitMQ: [Api-gateway](https://github.com/lucassrlkz/micro-admin-backend-gameRanking)
Micro backend gameRanking com comunicação RabbitMQ: [Micro-backend](https://github.com/lucassrlkz/micro-admin-backend-gameRanking)

#### Este repositório não sera mais usado.

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
| NestJS 12 | Framework da API e organização por módulos |
| Express | Plataforma HTTP usada pelo NestJS |
| MongoDB | Banco de dados |
| Mongoose | Conexão com o MongoDB, schemas e modelos |
| `class-validator` e `class-transformer` | Validação e transformação de dados de entrada |
| `dotenv` | Leitura de variáveis de ambiente |
| `moment-timezone` | Formatação de datas no fuso horário configurado |
| Jest | Testes unitários e end-to-end |
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

## Docker

A API recebe a URI do MongoDB pela variável `DB_CONNECTION`. Para usar um MongoDB hospedado externamente com Docker Compose:

1. Na raiz do projeto, crie ou edite o arquivo `.env` (ele é ignorado pelo Git) e configure a URI fornecida pelo serviço MongoDB:

   ```dotenv
   DB_CONNECTION=mongodb+srv://<usuario>:<senha>@<cluster>/<database>?retryWrites=true&w=majority
   ```

   Substitua o exemplo pela URI real do provedor. Se usuário ou senha contiver caracteres especiais, codifique-os conforme as regras de URI. Não publique nem compartilhe esse arquivo.

2. Construa a imagem e inicie a API:

   ```bash
   docker compose up --build
   ```

   O Compose carrega automaticamente as variáveis do `.env` para substituir `${DB_CONNECTION}` no `compose.yaml`. Também é possível definir `DB_CONNECTION` no ambiente do terminal antes de executar o comando. Se ela não estiver definida, o Compose interrompe a inicialização e informa o que falta.

3. Acesse a API em `http://localhost:8080`. O MongoDB remoto não é iniciado pelo Compose; o container da API precisa conseguir acessar o endereço do banco pela rede, e o provedor precisa permitir essa conexão.

Para parar a API, use `docker compose down`. A URI é passada ao container em tempo de execução, não embutida na imagem.

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

## CI/CD

O GitHub Actions executa lint, testes unitários e end-to-end, build da aplicação e build da imagem Docker em pull requests e pushes para `main` ou `master`.

Ao enviar uma tag começando com `v` (por exemplo, `v1.0.0`), o workflow também publica a imagem no GitHub Container Registry (`ghcr.io`) com a tag da versão e `latest`:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Esse fluxo publica a imagem; o deploy em um ambiente de execução deve ser configurado separadamente conforme a infraestrutura utilizada.
