# UC06 - Guia Rápido de Teste

## 🚀 Setup Inicial

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Iniciar a aplicação em modo desenvolvimento
```bash
pnpm start:dev
```

Aplicação disponível em: `http://localhost:3000`

### 3. Criar uma entrega (POST - ainda não implementado, será manual no DB)
Para testes rápidos, insira manualmente no PostgreSQL:
```sql
INSERT INTO entregas (
  entrega_id, doacao_id, confirmacao_doador, confirmacao_ong, 
  status, hash_blockchain, created_at, updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000', 
  'doacao-001', 
  false, false, 
  'pending', null, 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);
```

## 📡 Testes de Endpoints

### Teste 1: Confirmar Saída (Doador)
```bash
curl -X PATCH http://localhost:3000/api/v1/entregas/550e8400-e29b-41d4-a716-446655440000/saida
```

**Resposta Esperada (200 OK):**
```json
{
  "entregaId": "550e8400-e29b-41d4-a716-446655440000",
  "confirmacaoDoador": true,
  "confirmacaoOng": false,
  "status": "in_transit",
  "hashBlockchain": null
}
```

### Teste 2: Confirmar Chegada (ONG)
```bash
curl -X PATCH http://localhost:3000/api/v1/entregas/550e8400-e29b-41d4-a716-446655440000/chegada
```

**Resposta Esperada (200 OK):**
```json
{
  "entregaId": "550e8400-e29b-41d4-a716-446655440000",
  "confirmacaoDoador": true,
  "confirmacaoOng": true,
  "status": "confirmed",
  "hashBlockchain": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

### Teste 3: Tentar Confirmar Novamente (Deve Falhar - RN02)
```bash
curl -X PATCH http://localhost:3000/api/v1/entregas/550e8400-e29b-41d4-a716-446655440000/saida
```

**Resposta Esperada (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "Entrega with id \"550e8400-e29b-41d4-a716-446655440000\" is already confirmed. (RN02 - Immutability constraint)",
  "error": "Conflict"
}
```

### Teste 4: ID Inválido (Deve Falhar)
```bash
curl -X PATCH http://localhost:3000/api/v1/entregas/invalid-id-12345/saida
```

**Resposta Esperada (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Entrega with id \"invalid-id-12345\" not found.",
  "error": "Not Found"
}
```

## 🧪 Testes Unitários

### Executar testes
```bash
pnpm test
```

### Executar testes com coverage
```bash
pnpm test:cov
```

### Testes específicos do UC06
```bash
pnpm test -- entregas.service.spec
```

## 🐛 Debug com VS Code

### 1. Adicionar breakpoint no service
Abra `src/modules/donations/services/entregas.service.ts` e clique na margem esquerda para adicionar breakpoints.

### 2. Iniciar debug
```bash
pnpm start:debug
```

### 3. Fazer requisição para acionar breakpoint
```bash
curl -X PATCH http://localhost:3000/api/v1/entregas/550e8400-e29b-41d4-a716-446655440000/saida
```

## 📊 Fluxo de Teste Completo (Manual)

### Cenário A: Doador confirma primeiro
1. Inserir entrega no BD (status: pending)
2. `PATCH /saida` → status: in_transit, confirmacaoDoador: true
3. `PATCH /chegada` → status: confirmed, confirmacaoOng: true, hash gerado ✅

### Cenário B: ONG confirma primeiro
1. Inserir entrega no BD (status: pending)
2. `PATCH /chegada` → status: in_transit, confirmacaoOng: true
3. `PATCH /saida` → status: confirmed, confirmacaoDoador: true, hash gerado ✅

### Cenário C: Tentar modificar entrega confirmada
1. Seguir cenário A ou B até ter status: confirmed
2. `PATCH /saida` → Erro 409 ✗ (RN02 ativada)
3. `PATCH /chegada` → Erro 409 ✗ (RN02 ativada)

## 🔍 Verificar no Banco de Dados

Após confirmação, verificar dados:
```sql
SELECT * FROM entregas WHERE entrega_id = '550e8400-e29b-41d4-a716-446655440000';
```

Esperado:
- `confirmacao_doador`: true
- `confirmacao_ong`: true
- `status`: confirmed
- `hash_blockchain`: (valor preenchido)
- `updated_at`: timestamp recent

## 📝 Checklist de Validação

- [ ] Module criado em `src/modules/donations/`
- [ ] Entities com TypeORM em `src/modules/donations/entities/`
- [ ] Repository interface em `src/modules/donations/repositories/`
- [ ] Service com RN06 e RN02 em `src/modules/donations/services/`
- [ ] Controller com PATCH endpoints em `src/modules/donations/controllers/`
- [ ] Exceções em `src/common/donations/exceptions/`
- [ ] Enums em `src/common/donations/enums/`
- [ ] DonationsModule importado em AppModule
- [ ] EntregaEntity registrada em TypeORM
- [ ] Testes unitários passando (`pnpm test`)
- [ ] Endpoints respondendo corretamente
- [ ] RN06 funcionando (hash gerado quando ambas confirmações)
- [ ] RN02 funcionando (erro 409 ao tentar modificar confirmada)

## 🛠️ Troubleshooting

### "Cannot find module '@nestjs/common'"
**Solução:** Execute `pnpm install`

### "Relation \"entregas\" does not exist"
**Solução:** TypeORM criará automaticamente com `synchronize: true` no primeiro start. Se não funcionar, execute manualmente:
```sql
CREATE TABLE entregas (
  entrega_id UUID PRIMARY KEY,
  doacao_id VARCHAR NOT NULL,
  confirmacao_doador BOOLEAN DEFAULT false,
  confirmacao_ong BOOLEAN DEFAULT false,
  status VARCHAR NOT NULL,
  hash_blockchain VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
```

### Porta 3000 em uso
**Solução:** Kill processo ou usar porta diferente:
```bash
PORT=3001 pnpm start:dev
```

## 📚 Arquivos Principais

- Service Logic: [entregas.service.ts](./src/modules/donations/services/entregas.service.ts)
- Controller: [entregas.controller.ts](./src/modules/donations/controllers/entregas.controller.ts)
- Entity: [entrega.entity.ts](./src/modules/donations/entities/entrega.entity.ts)
- Tests: [entregas.service.spec.ts](./src/modules/donations/services/entregas.service.spec.ts)
