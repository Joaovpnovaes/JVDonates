# JVDonates - Ambiente Docker

## Instruções de Uso

### Build e inicialização dos containers

```bash
docker-compose up -d --build
```

### Parar os containers

```bash
docker-compose down
```

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Serviços Disponíveis

### PostgreSQL
- **Host**: localhost
- **Porta**: 5433
- **User**: celillac
- **Password**: celillac
- **Database**: celillac_db

### Backend (NestJS)
- **URL**: http://localhost:3000
- **Watch Mode**: Ativado automaticamente
- **Modo**: Desenvolvimento

### Frontend (React + Vite)
- **URL**: http://localhost:5173
- **Watch Mode**: Ativado automaticamente
- **Modo**: Desenvolvimento

## Desenvolvimento Local (sem Docker)

### Backend

```bash
cd celillac-backend
npm install
npm run start:dev
```

### Frontend

```bash
cd celillac-frontend
pnpm install
pnpm dev
```

## Variáveis de Ambiente

### Backend
- `DATABASE_URL`: Conexão PostgreSQL (configurada automaticamente no Docker)
- `NODE_ENV`: development

### Frontend
- `VITE_API_URL`: URL da API do backend (http://backend:3000 no Docker)
- `NODE_ENV`: development
