# 🚀 API Reference - Endpoints CRUD Implementados

**Projeto:** JVDonates Backend NestJS  
**Data:** 26 de maio de 2026  
**Base URL:** `http://localhost:3000`

---

## 📋 Endpoints Disponíveis

### 1️⃣ **GET** - Listar Todas as Doações

```http
GET /api/v1/doacoes
```

**Descrição:** Lista todas as doações cadastradas no sistema.

**Response (200 OK):**
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

**cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/doacoes
```

**JavaScript (Fetch API):**
```javascript
fetch('http://localhost:3000/api/v1/doacoes')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 2️⃣ **GET** - Buscar Doação por ID

```http
GET /api/v1/doacoes/:id
```

**Descrição:** Busca uma doação específica pelo ID.

**Parameters:**
- `id` (string, required): ID da doação (UUID)

**Response (200 OK):**
```json
{
  "id": "uuid-doacao-1",
  "titulo": "Roupas de Inverno",
  "quantidade": 10,
  "status": "disponivel",
  "doadorId": "uuid-doador-1"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Doação não encontrada."
}
```

**cURL:**
```bash
# Sucesso
curl -X GET http://localhost:3000/api/v1/doacoes/uuid-doacao-1

# ID inválido
curl -X GET http://localhost:3000/api/v1/doacoes/uuid-inexistente
```

**JavaScript (Fetch API):**
```javascript
const id = 'uuid-doacao-1';
fetch(`http://localhost:3000/api/v1/doacoes/${id}`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

### 3️⃣ **PATCH** - Atualizar Doação Parcialmente

```http
PATCH /api/v1/doacoes/:id
Content-Type: application/json
```

**Descrição:** Atualiza parcialmente uma doação (apenas campos fornecidos).

**Parameters:**
- `id` (string, required): ID da doação (UUID)

**Request Body (UpdateDoacaoDto):**
```typescript
{
  titulo?: string;          // Opcional
  quantidade?: number;      // Opcional
  status?: DoacaoStatusEnum; // Opcional
  doadorId?: string;        // Opcional
}
```

**Exemplo 1: Atualizar Apenas Título**

```json
{
  "titulo": "Roupas de Verão"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-doacao-1",
  "titulo": "Roupas de Verão",
  "quantidade": 10,
  "status": "disponivel",
  "doadorId": "uuid-doador-1"
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v1/doacoes/uuid-doacao-1 \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Roupas de Verão"}'
```

**JavaScript (Fetch API):**
```javascript
const id = 'uuid-doacao-1';
fetch(`http://localhost:3000/api/v1/doacoes/${id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    titulo: 'Roupas de Verão'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

**Exemplo 2: Atualizar Múltiplos Campos**

```json
{
  "titulo": "Roupas de Verão",
  "quantidade": 20,
  "status": "disponivel"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-doacao-1",
  "titulo": "Roupas de Verão",
  "quantidade": 20,
  "status": "disponivel",
  "doadorId": "uuid-doador-1"
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v1/doacoes/uuid-doacao-1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Roupas de Verão",
    "quantidade": 20,
    "status": "disponivel"
  }'
```

---

**Exemplo 3: ID Inválido (404)**

```json
{
  "titulo": "Qualquer Título"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Doação não encontrada."
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v1/doacoes/uuid-inexistente \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Novo Título"}'
```

---

## 📊 Enums (Status)

### DoacaoStatusEnum

```typescript
enum DoacaoStatusEnum {
  PENDENTE = "pendente",
  DISPONIVEL = "disponivel",
  RESERVADA = "reservada",
  ENTREGUE = "entregue",
  CANCELADA = "cancelada"
}
```

**Valores Válidos para PATCH:**
- `"pendente"`
- `"disponivel"`
- `"reservada"`
- `"entregue"`
- `"cancelada"`

---

## 🔐 Segurança - Campos Protegidos

### ❌ **Campos NÃO Podem Ser Alterados (Excluídos do DTO)**

```json
{
  "id": "UUID (imutável)",
  "createdAt": "Data de criação (imutável)",
  "updatedAt": "Data de atualização (automática)",
  "deletedAt": "Data de exclusão (reservado)"
}
```

### ✅ **Campos Permitidos para Atualização**

```json
{
  "titulo": "string",
  "quantidade": "number",
  "status": "DoacaoStatusEnum",
  "doadorId": "string"
}
```

---

## 📋 Response DTO (Estrutura de Resposta)

### ListarDoacoesResponseDto

```typescript
{
  id: string;              // UUID da doação
  titulo: string;          // Título/descrição
  quantidade: number;      // Quantidade de itens
  status: DoacaoStatusEnum; // Status atual
  doadorId: string;        // ID do doador
}
```

**Campos Internos NÃO aparecem na resposta:**
- ❌ `createdAt`
- ❌ `updatedAt`
- ❌ `deletedAt`

---

## 🧪 Exemplos Completos

### Exemplo 1: Listar → Buscar → Atualizar

```bash
#!/bin/bash

# 1. Listar todas as doações
echo "=== Listando todas as doações ==="
curl -X GET http://localhost:3000/api/v1/doacoes

# 2. Buscar uma doação específica
echo ""
echo "=== Buscando doação por ID ==="
DOACAO_ID="uuid-doacao-1"
curl -X GET http://localhost:3000/api/v1/doacoes/$DOACAO_ID

# 3. Atualizar a doação
echo ""
echo "=== Atualizando doação ==="
curl -X PATCH http://localhost:3000/api/v1/doacoes/$DOACAO_ID \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Roupas Novas",
    "quantidade": 25,
    "status": "disponivel"
  }'

# 4. Verificar atualização
echo ""
echo "=== Verificando atualização ==="
curl -X GET http://localhost:3000/api/v1/doacoes/$DOACAO_ID
```

---

### Exemplo 2: Tratamento de Erros em JavaScript

```javascript
async function buscarEAtualizar(id, updateData) {
  try {
    // 1. Buscar doação
    const getRes = await fetch(`/api/v1/doacoes/${id}`);
    if (!getRes.ok) {
      throw new Error(`Doação não encontrada: ${getRes.status}`);
    }
    const doacao = await getRes.json();
    console.log('Doação encontrada:', doacao);

    // 2. Atualizar doação
    const patchRes = await fetch(`/api/v1/doacoes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!patchRes.ok) {
      throw new Error(`Falha na atualização: ${patchRes.status}`);
    }

    const doacaoAtualizada = await patchRes.json();
    console.log('Doação atualizada com sucesso:', doacaoAtualizada);
    return doacaoAtualizada;

  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Uso
buscarEAtualizar('uuid-doacao-1', {
  titulo: 'Novo Título',
  quantidade: 50
});
```

---

## ✅ Checklist de Testes

### ✅ Testes Automatizados

```bash
# Executar todos os testes
npm test

# Resultado esperado
Test Suites: 4 passed, 4 total
Tests:       34 passed, 34 total
Time:        1.242 s
```

### ✅ Testes Manuais (cURL)

- [ ] GET /api/v1/doacoes - Retorna array
- [ ] GET /api/v1/doacoes/uuid-valido - Retorna 200
- [ ] GET /api/v1/doacoes/uuid-invalido - Retorna 404
- [ ] PATCH /api/v1/doacoes/uuid-valido - Retorna 200 com dados atualizados
- [ ] PATCH /api/v1/doacoes/uuid-invalido - Retorna 404
- [ ] PATCH com campo parcial - Atualiza apenas esse campo
- [ ] PATCH não modifica campos restritos (id, createdAt)

---

## 📚 Documentação Relacionada

- [IMPLEMENTACAO_BUSCA_POR_ID.md](./celillac-backend/IMPLEMENTACAO_BUSCA_POR_ID.md) - GET:id details
- [IMPLEMENTACAO_ATUALIZA_PATCH.md](./celillac-backend/IMPLEMENTACAO_ATUALIZA_PATCH.md) - PATCH details
- [STATUS-COMPLETO-CRUD.md](./STATUS-COMPLETO-CRUD.md) - Overall CRUD status

---

## 🔗 Endpoints Summary

| Método | Rota | Descrição | Status HTTP |
|--------|------|-----------|-------------|
| GET | `/api/v1/doacoes` | Listar todas | 200 |
| GET | `/api/v1/doacoes/:id` | Buscar por ID | 200 / 404 |
| PATCH | `/api/v1/doacoes/:id` | Atualizar parcial | 200 / 404 |

---

**Última atualização:** 26 de maio de 2026, 08:45 UTC
