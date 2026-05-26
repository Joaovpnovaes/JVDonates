# UC06 - Arquitetura Visual

## 🏗️ Diagrama de Camadas

```
┌──────────────────────────────────────────────────────────┐
│                    HTTP Layer                             │
│              PATCH /api/v1/entregas/{id}/saida            │
│              PATCH /api/v1/entregas/{id}/chegada          │
└────────────────────┬─────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│           Presentation Layer (Controllers)                 │
│                                                             │
│   EntregasController                                       │
│   ├─ @Patch(':id/saida') → confirmarSaida()              │
│   └─ @Patch(':id/chegada') → confirmarChegada()          │
└────────────────────┬──────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│         Business Logic Layer (Services)                    │
│                                                             │
│   EntregasService (RN06 + RN02)                           │
│   ├─ confirmarSaida(id)      [RN06: Confirmação Mútua]   │
│   │  ├─ findById()                                        │
│   │  ├─ validateImmutability() [RN02]                    │
│   │  ├─ markConfirmacao()                                │
│   │  ├─ checkMutualConfirmation()                        │
│   │  ├─ generateHash()                                   │
│   │  └─ save()                                           │
│   │                                                       │
│   └─ confirmarChegada(id)    [RN06: Confirmação Mútua]   │
│      ├─ findById()                                        │
│      ├─ validateImmutability() [RN02]                    │
│      ├─ markConfirmacao()                                │
│      ├─ checkMutualConfirmation()                        │
│      ├─ generateHash()                                   │
│      └─ save()                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│        Data Access Layer (Repositories)                    │
│                                                             │
│   EntregasRepository (Interface)                          │
│   ├─ findById(id): Promise<EntregaEntity>                │
│   └─ save(entrega): Promise<EntregaEntity>               │
│                                                             │
│         ↓ Implemented by ↓                                │
│                                                             │
│   EntregasTypeORMRepository                               │
│   ├─ @InjectRepository(EntregaEntity)                    │
│   ├─ findById(id)                                        │
│   └─ save(entrega)                                       │
└────────────────────┬──────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│       Database Layer (TypeORM Entity Mapping)              │
│                                                             │
│   EntregaEntity                                           │
│   ├─ @Entity('entregas')                                 │
│   ├─ @PrimaryGeneratedColumn('uuid')                    │
│   ├─ entregaId: string                                   │
│   ├─ doacaoId: string                                    │
│   ├─ confirmacaoDoador: boolean                          │
│   ├─ confirmacaoOng: boolean                             │
│   ├─ status: EntregaStatusEnum                           │
│   ├─ hashBlockchain: string | null                       │
│   ├─ createdAt: Date                                     │
│   ├─ updatedAt: Date                                     │
│   └─ deletedAt: Date | null                              │
└────────────────────┬──────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│         PostgreSQL Database                                │
│               TABLE: entregas                             │
│   ┌────────────────────────────────────────────────┐     │
│   │ entrega_id (UUID) - PRIMARY KEY               │     │
│   │ doacao_id (VARCHAR)                           │     │
│   │ confirmacao_doador (BOOLEAN)                  │     │
│   │ confirmacao_ong (BOOLEAN)                     │     │
│   │ status (VARCHAR: pending|in_transit|confirmed)     │     │
│   │ hash_blockchain (VARCHAR - NULLABLE)         │     │
│   │ created_at (TIMESTAMP)                        │     │
│   │ updated_at (TIMESTAMP)                        │     │
│   │ deleted_at (TIMESTAMP - NULLABLE)             │     │
│   └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

## 📊 Fluxo de Estados - State Machine Diagram

```
                    ┌─────────────────┐
                    │     PENDING     │ (Initial State)
                    │ confirmacaoDoador: false
                    │ confirmacaoOng: false
                    │ hash_blockchain: null
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼─────────┐       ┌──────────▼────────┐
    │  PATCH /saida     │       │ PATCH /chegada    │
    │  (Doador)         │       │ (ONG)             │
    └─────────┬─────────┘       └──────────┬────────┘
              │                           │
              └───────────────┬───────────┘
                             │
              ┌──────────────▼────────────────┐
              │     IN_TRANSIT                │ (1 confirmation)
              │ confirmacaoDoador: true       │
              │ confirmacaoOng: false    OR   │
              │ confirmacaoDoador: false      │
              │ confirmacaoOng: true          │
              │ hash_blockchain: null         │
              └───────────────┬────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
  ┌─────────▼─────────┐            ┌──────────▼────────┐
  │  PATCH /chegada   │            │ PATCH /saida      │
  │  (if /saida used) │            │ (if /chegada used)│
  └─────────┬─────────┘            └──────────┬────────┘
            │                                  │
            └──────────────┬───────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │          CONFIRMED                 │ (Mutual Confirmation)
        │ confirmacaoDoador: true            │
        │ confirmacaoOng: true               │
        │ status: 'confirmed'                │
        │ hash_blockchain: 'SHA256(...)' ─ Generated
        │                                    │
        │ ⚠️ STATE IS IMMUTABLE (RN02)       │
        │ Further PATCH calls return 409    │
        └────────────────────────────────────┘
```

## 🔄 Fluxo de Execução - Sequence Diagram

```
Cenário: Doador confirma saída, depois ONG confirma chegada

  Doador Client        API              Service              Repository        Database
      │                 │                  │                     │                │
      │─── PATCH /saida─│                  │                     │                │
      │                 │─ confirmarSaida()│                     │                │
      │                 │                  │─ findById()────────→│ SELECT        │
      │                 │                  │                     │────────────────→
      │                 │                  │←── Entrega (PENDING)                │
      │                 │                  │                     │                │
      │                 │                  │─ validateImmutable()│                │
      │                 │                  │  ✓ status != CONFIRMED              │
      │                 │                  │                     │                │
      │                 │                  │─ markConfirmacao()  │                │
      │                 │                  │  confirmacaoDoador:true             │
      │                 │                  │                     │                │
      │                 │                  │─ checkMutual()      │                │
      │                 │                  │  confirmacaoOng:false → IN_TRANSIT  │
      │                 │                  │                     │                │
      │                 │                  │─ save()────────────→│ UPDATE        │
      │                 │                  │                     │────────────────→
      │                 │                  │←── Saved Entrega    │                │
      │                 │                  │                     │                │
      │←─ 200 OK (DTO) ─│                  │                     │                │
      │                 │                  │                     │                │

ONG Client           API              Service              Repository        Database
      │                 │                  │                     │                │
      │─ PATCH /chegada │                  │                     │                │
      │                 │ confirmarChegada()                      │                │
      │                 │                  │─ findById()────────→│ SELECT        │
      │                 │                  │                     │────────────────→
      │                 │                  │←── Entrega (IN_TRANSIT)             │
      │                 │                  │                     │                │
      │                 │                  │─ validateImmutable()│                │
      │                 │                  │  ✓ status != CONFIRMED              │
      │                 │                  │                     │                │
      │                 │                  │─ markConfirmacao()  │                │
      │                 │                  │  confirmacaoOng:true                │
      │                 │                  │                     │                │
      │                 │                  │─ checkMutual()      │                │
      │                 │                  │  BOTH CONFIRMATIONS TRUE!            │
      │                 │                  │  → status: CONFIRMED                │
      │                 │                  │  → generate hash()                  │
      │                 │                  │                     │                │
      │                 │                  │─ save()────────────→│ UPDATE        │
      │                 │                  │                     │────────────────→
      │                 │                  │←── Saved Entrega    │                │
      │                 │                  │                     │                │
      │←─ 200 OK (DTO) ─│                  │                     │                │
      │ + hash_blockchain                  │                     │                │
```

## 🛡️ Validações de Segurança (RN02 - Immutability)

```
Request: PATCH /api/v1/entregas/{id}/saida

┌──────────────────────────────────────────┐
│1. Repository: findById(entregaId)        │
│   └─ Fetch current state from DB         │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│2. Service: validateImmutability()         │
│                                           │
│   if (entrega.status === 'CONFIRMED') {   │
│     throw new                             │
│     EntregaAlreadyConfirmedException()    │
│   }                                       │
│                                           │
│   ✓ Status = PENDING?  → PASS ✓          │
│   ✓ Status = IN_TRANSIT? → PASS ✓        │
│   ✗ Status = CONFIRMED? → FAIL ✗ (409)   │
└──────────────┬───────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼─────────────────┐  │
│ RN02 Check Failed  │  │
│ -────────────────  │  │
│ 409 Conflict       │  │
│ Exception thrown   │  │
└───────────────────┘  │
                       │
                ┌──────▼──────────────────┐
                │3. Continue processing  │
                │   Mark confirmacao      │
                │   Save to DB            │
                │   Return 200 OK         │
                └──────────────────────────┘
```

## 🔐 Hash Blockchain - Geração

```typescript
// Quando ambas confirmações = true

private generateBlockchainHash(entregaId: string): string {
  const timestamp = new Date().getTime().toString();
  const data = `${entregaId}:${timestamp}`;
  
  return crypto.createHash('sha256')
    .update(data)
    .digest('hex');
}

// Exemplo:
// Input:  entregaId: "550e8400-e29b-41d4-a716-446655440000"
//         timestamp: "1704067200000"
// 
// Data:   "550e8400-e29b-41d4-a716-446655440000:1704067200000"
// 
// Output: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t"
//         (64 hex chars - SHA256)

```

## 📦 Module Dependency Graph

```
┌─────────────────┐
│  AppModule      │
│                 │
│ imports: [      │
│   OrdersModule  │
│   DonationsModule───────┐
│   TypeOrmModule │       │
│ ]               │       │
└─────────────────┘       │
                          │
              ┌───────────▼──────────────┐
              │  DonationsModule         │
              │  @Module({               │
              │    imports: [            │
              │      TypeOrmModule       │
              │    ],                    │
              │    controllers: [        │
              │      EntregasController  │
              │    ],                    │
              │    providers: [          │
              │      EntregasService     │
              │      Repository Impl     │
              │    ],                    │
              │    exports: [            │
              │      EntregasService     │
              │    ]                     │
              │  })                      │
              └────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼────┐  ┌─────▼──────┐  ┌───▼────────┐
    │Service  │  │Repository  │  │Controller  │
    │         │  │            │  │            │
    │confir-  │  │findById()  │  │@Patch      │
    │marSaida │  │save()      │  │saida       │
    │         │  │            │  │chegada     │
    │confir-  │  │Entity      │  │            │
    │marChega │  │injection   │  │Injection   │
    │         │  │ via        │  │            │
    └────┬────┘  │TypeOrmMod  │  └────────────┘
         │       │@Inject     │
         │       └─────┬──────┘
         │             │
         └─────────────┼────────────┐
                       │            │
                  ┌────▼────────────▼─────┐
                  │   PostgreSQL DB       │
                  │  TABLE: entregas      │
                  │                       │
                  │ Persistent Storage    │
                  └───────────────────────┘
```

## 🎯 Regras de Negócio Visualizadas

### RN06 - Confirmação Mútua

```
                         CONFIRMACAO STATES
                                │
                ┌───────────────┼───────────────┐
                │               │               │
           ┌────▼────┐      ┌───▼────┐     ┌──▼─────┐
           │ DOADOR  │      │  ONG   │     │ RESULT │
           │CONFIRMS │      │CONFIRMS│     │        │
           └────┬────┘      └───┬────┘     └────────┘
                │               │
         T=T    │        T=T     │
         F=F    │        F=F     │
         T=F    │        F=T     │
         F=T    │        T=F     │
                │               │
                ▼               ▼
         ┌─────────────────────────────┐
         │   MUTUAL CONFIRMATION       │
         │   DECISION MATRIX           │
         ├─────────────────────────────┤
         │  Doador │ ONG  │ Status    │
         ├─────────┼──────┼───────────┤
         │  F      │ F    │ PENDING   │
         │  T      │ F    │ IN_TRANSIT│
         │  F      │ T    │ IN_TRANSIT│
         │  T      │ T    │ CONFIRMED★│
         │         │      │ Hash Gen. │
         └─────────┴──────┴───────────┘
                    │
                    ▼
         ONLY WHEN T=T → CONFIRMED
         + hash_blockchain generated!
```

### RN02 - Imutabilidade

```
                    IMMUTABILITY CONSTRAINT
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐          ┌──────▼────────┐
        │ Status != CONFIRMED       │ Status == CONFIRMED
        │ (PENDING | IN_TRANSIT)    │
        ├────────────────┤          ├────────────────┤
        │ ✓ ALLOWED      │          │ ✗ BLOCKED      │
        │ - Edit allowed │          │ - 409 Conflict │
        │ - Hash: null   │          │ - No changes   │
        │ - Continue ops │          │ - Error thrown │
        └────────────────┘          └────────────────┘
```

---

**Nota:** Esta documentação apresenta uma visão completa da arquitetura do UC06, destacando as validações RN06 e RN02, fluxos de dados e padrões de design implementados.
