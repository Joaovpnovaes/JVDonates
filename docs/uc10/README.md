# UC10 — Consultar Inventário de Doações

## Visão Geral

| Campo       | Valor                              |
|-------------|-------------------------------------|
| Caso de Uso | UC10                               |
| Nome        | Consultar Inventário de Doações    |
| Método HTTP | `GET`                              |
| Endpoint    | `/api/v1/doacoes`                  |
| Autores     | ErikMazzuco, JuniorSfredo, Yasmin-YY |

---

## Descrição

Permite consultar todas as doações cadastradas no sistema, retornando um array JSON com os campos públicos de cada doação.

---

## Arquitetura em Camadas

```
GET /api/v1/doacoes
        │
        ▼
 DoacoesController          ← HTTP (src/modules/doacoes/controllers/)
        │
        ▼
   DoacoesService            ← Lógica de negócio (src/modules/doacoes/services/)
        │
        ▼
 DoacoesRepository (interface)  ← Contrato (src/modules/doacoes/repositories/)
        │
        ▼
 DoacoesTypeORMRepository   ← Persistência PostgreSQL via TypeORM
        │
        ▼
   Tabela: doacoes           ← PostgreSQL
```

---

## Contrato da API

### Request

```
GET /api/v1/doacoes
```

Sem parâmetros, sem body.

### Response — 200 OK

```json
[
  {
    "id": "uuid-doacao-1",
    "titulo": "Roupas de Inverno",
    "quantidade": 10,
    "status": "disponivel",
    "doadorId": "uuid-doador-1"
  },
  {
    "id": "uuid-doacao-2",
    "titulo": "Cestas Básicas",
    "quantidade": 5,
    "status": "pendente",
    "doadorId": "uuid-doador-2"
  }
]
```

### Response — Lista vazia

```json
[]
```

---

## Campos do Contrato

| Campo      | Tipo              | Descrição                        |
|------------|-------------------|----------------------------------|
| `id`       | `string (uuid)`   | Identificador único da doação    |
| `titulo`   | `string`          | Título/descrição da doação       |
| `quantidade` | `number (int)` | Quantidade de itens              |
| `status`   | `DoacaoStatusEnum`| Status atual da doação           |
| `doadorId` | `string (uuid)`   | Identificador do doador          |

> Campos internos (`createdAt`, `updatedAt`, `deletedAt`) **não** são expostos no contrato público.

---

## Enum: DoacaoStatusEnum

| Valor        | Descrição                         |
|--------------|-----------------------------------|
| `pendente`   | Doação criada, aguardando aprovação |
| `disponivel` | Disponível para retirada           |
| `reservada`  | Reservada por uma ONG              |
| `entregue`   | Doação entregue com sucesso        |

---

## Arquivos Criados

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/common/doacoes/enums/doacao-status.enum.ts` | Enum de status |
| `src/modules/doacoes/entities/doacao.entity.ts` | Entidade TypeORM |
| `src/modules/doacoes/repositories/doacoes.repository.interface.ts` | Interface do repositório |
| `src/modules/doacoes/repositories/doacoes-type-orm.repository.ts` | Implementação TypeORM |
| `src/modules/doacoes/dto/listar-doacoes-response.dto.ts` | DTO de resposta |
| `src/modules/doacoes/services/doacoes.service.ts` | Serviço (lógica) |
| `src/modules/doacoes/services/doacoes.service.spec.ts` | Testes unitários |
| `src/modules/doacoes/controllers/doacoes.controller.ts` | Controller HTTP |
| `src/modules/doacoes/doacoes.module.ts` | Módulo NestJS |

---

## Como Executar os Testes

```bash
cd celillac-backend

# Rodar apenas os testes da UC10
npx jest doacoes.service.spec.ts --verbose

# Rodar todos os testes do projeto
npx jest --verbose
```

---

## Como Testar o Endpoint

Com o servidor rodando (`npm run start:dev`):

```bash
# Listar todas as doações
curl -X GET http://localhost:3000/api/v1/doacoes \
  -H "Content-Type: application/json"
```

---

## Metodologia TDD

| Etapa   | Issue   | Descrição |
|---------|---------|-----------|
| RED     | UC10-01 | Testes criados antes da implementação — falham por design |
| GREEN   | UC10-02/03 | Implementação do repositório e serviço — testes passam |
| REFACTOR | UC10-04 | Validação do contrato, remoção de código duplicado |
| DOCS    | UC10-05 | Documentação técnica neste diretório |
