# UC06 - Confirmar Recebimento de Doação

## Visão Geral
Implementação completa do caso de uso 06 (UC06) seguindo padrões de arquitetura limpa e estrutura de pastas do projeto.

## Estrutura Criada

```
src/
├── common/
│   └── donations/
│       ├── enums/
│       │   └── entrega-status.enum.ts          # Estados da entrega
│       └── exceptions/
│           ├── entrega-not-found.exception.ts
│           └── entrega-already-confirmed.exception.ts
└── modules/
    └── donations/
        ├── entities/
        │   └── entrega.entity.ts              # Mapeamento TypeORM
        ├── repositories/
        │   ├── entregas.repository.interface.ts
        │   └── entregas-type-orm.repository.ts
        ├── services/
        │   └── entregas.service.ts            # Regras de negócio
        ├── controllers/
        │   └── entregas.controller.ts         # Endpoints
        ├── dto/
        │   ├── confirmar-saida-response.dto.ts
        │   └── confirmar-chegada-response.dto.ts
        └── donations.module.ts                # Módulo NestJS
```

## Regras de Negócio Implementadas

### RN06 - Confirmação Mútua
- **Confirmar Saída**: Endpoint `PATCH /api/v1/entregas/{id}/saida`
  - Marca `confirmacaoDoador = true`
  - Se `confirmacaoOng` também for `true`, muda status para `'confirmed'` e gera `hash_blockchain`
  - Caso contrário, muda status para `'in_transit'`

- **Confirmar Chegada**: Endpoint `PATCH /api/v1/entregas/{id}/chegada`
  - Marca `confirmacaoOng = true`
  - Se `confirmacaoDoador` também for `true`, muda status para `'confirmed'` e gera `hash_blockchain`
  - Caso contrário, muda status para `'in_transit'`

### RN02 - Imutabilidade
- Se o status de uma entrega for `'confirmed'`, qualquer tentativa de alterar lança exceção `EntregaAlreadyConfirmedException`
- Garante que entregas confirmadas não sejam modificadas

## Entidade Entrega (PostgreSQL via TypeORM)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| entrega_id | UUID | ID único da entrega (PK) |
| doacao_id | String | ID da doação associada |
| confirmacao_doador | Boolean | Confirmação de saída pelo doador |
| confirmacao_ong | Boolean | Confirmação de chegada pela ONG |
| status | Enum | Estados: pending, in_transit, confirmed |
| hash_blockchain | String (nullable) | Hash gerado quando ambas confirmações são true |
| created_at | Timestamp | Data de criação |
| updated_at | Timestamp | Data da última atualização |
| deleted_at | Timestamp (nullable) | Data de exclusão (soft delete) |

## Fluxo de Estados

```
┌─────────────┐
│   PENDING   │ (Estado inicial)
└──────┬──────┘
       │ confirmarSaida() OU confirmarChegada()
       ▼
┌─────────────────┐
│   IN_TRANSIT    │ (Uma confirmação recebida)
└──────┬──────────┘
       │ confirmarChegada() OU confirmarSaida()
       │ (ambas confirmações = true)
       ▼
┌─────────────────────────────────────┐
│   CONFIRMED + hash_blockchain       │ (Imutável!)
└─────────────────────────────────────┘
```

## Endpoints da API

### 1. Confirmar Saída (Doador)
```
PATCH /api/v1/entregas/{id}/saida
```
**Resposta (200 OK):**
```json
{
  "entregaId": "uuid-string",
  "confirmacaoDoador": true,
  "confirmacaoOng": false,
  "status": "in_transit",
  "hashBlockchain": null
}
```

### 2. Confirmar Chegada (ONG)
```
PATCH /api/v1/entregas/{id}/chegada
```
**Resposta (200 OK):**
```json
{
  "entregaId": "uuid-string",
  "confirmacaoDoador": true,
  "confirmacaoOng": true,
  "status": "confirmed",
  "hashBlockchain": "a1b2c3d4e5f6..."
}
```

## Tratamento de Erros

### Entregas não encontradas (404)
```json
{
  "statusCode": 404,
  "message": "Entrega with id \"xxx\" not found."
}
```

### Entregas já confirmadas (409)
```json
{
  "statusCode": 409,
  "message": "Entrega with id \"xxx\" is already confirmed. (RN02 - Immutability constraint)"
}
```

## Padrões Arquiteturais Aplicados

✅ **Repository Pattern**: Abstração da camada de dados via interface
✅ **Dependency Injection**: Uso de @Inject para inversão de controle
✅ **Service Layer**: Lógica de negócio centralizada
✅ **DTO Pattern**: Objetos de transferência de dados para respostas
✅ **Exception Handling**: Exceções customizadas para cada caso
✅ **Soft Delete**: Campo deletedAt para exclusão lógica
✅ **Timestamps**: Auditoria automática com createdAt/updatedAt

## Integração no Projeto

O módulo é automaticamente integrado no `AppModule`:
- `DonationsModule` importado e registrado
- `EntregaEntity` adicionada ao TypeORM
- Endpoints disponíveis em `http://localhost:3000/api/v1/entregas`

## Próximos Passos (Sugestões)

1. Adicionar testes unitários para `EntregasService`
2. Implementar DTOs de criação (POST /api/v1/entregas)
3. Adicionar autenticação/autorização (apenas doadores podem confirmar saída, apenas ONGs podem confirmar chegada)
4. Implementar validação de UUID nos parâmetros
5. Adicionar logging de eventos para auditoria
6. Integrar com sistemas de blockchain reais para hash_blockchain
