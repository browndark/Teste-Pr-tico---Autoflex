# 🚀 Deployment & Setup Guide

## Prerequisites

- Java 11 ou superior
- Node.js 16+
- PostgreSQL 12+
- Git

## Instalação Local

### 1. Clone o Repositório
```bash
git clone <seu-repo>
cd quest-hands
```

### 2. Setup PostgreSQL

```bash
# Criar database
createdb estoque

# Conectar e criar user (opcional)
psql -d estoque
CREATE USER estoque_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE estoque TO estoque_user;
```

### 3. Configurar Backend

```bash
cd backend

# application.properties já está configurado
# Se usar senha diferente, editar:
# src/main/resources/application.properties

# Run dev
mvn -DskipTests quarkus:dev

# API disponível em http://localhost:8082
```

### 4. Configurar Frontend

```bash
cd frontend

# Install deps
npm install

# Run dev
npm start

# App disponível em http://localhost:3001
```

## Variáveis de Ambiente

### Backend (application.properties)
```properties
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=postgres
quarkus.datasource.password=postgres
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/estoque
```

### Frontend (.env - criar se necessário)
```
REACT_APP_API_URL=http://localhost:8082
REACT_APP_ENV=development
```

## Build para Produção

### Backend
```bash
cd backend
mvn clean package -DskipTests

# JAR gerado em: target/controle-estoque-1.0.0-runner.jar
java -jar target/controle-estoque-1.0.0-runner.jar
```

### Frontend
```bash
cd frontend
npm run build

# Build gerado em: build/
# Servir com nginx ou similar:
# docker run -v $(pwd)/build:/usr/share/nginx/html -p 80:80 nginx
```

## Docker (Opcional)

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: estoque
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8082:8080"
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:postgresql://postgres:5432/estoque
      QUARKUS_DATASOURCE_USERNAME: postgres
      QUARKUS_DATASOURCE_PASSWORD: postgres
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Run:**
```bash
docker-compose up -d
```

## Testes

### Backend - Testes Unitários
```bash
cd backend
mvn test
```

### Backend - Testes de Integração
```bash
cd backend
mvn verify
```

### Frontend - E2E com Cypress
```bash
cd frontend

# Run headless
npm run cypress:run

# Run interactive
npm run cypress:open
```

## Estrutura de Pastas

```
quest-hands/
├── README.md                    # Documentação principal
├── DATABASE_SCHEMA.md           # ER Diagram
├── DEPLOYMENT.md                # Este arquivo
├── backend/
│   ├── src/
│   │   ├── main/java/com/example/
│   │   │   ├── model/           # Entidades
│   │   │   ├── resource/        # APIs
│   │   │   └── repository/      # DAO
│   │   ├── test/java/           # Testes
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── db.sql           # Initial schema
│   │       └── db/migration/    # Flyway migrations
│   ├── pom.xml
│   └── Dockerfile              # (opcional)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── reducers/            # Redux
│   │   ├── utils/               # Helpers
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── cypress/                 # E2E tests
│   ├── package.json
│   ├── .env                     # Environment vars
│   └── Dockerfile              # (opcional)
└── docker-compose.yml          # (opcional)
```

## Verificações de Saúde

### Backend Health Check
```bash
curl http://localhost:8082/q/health
```

Expected:
```json
{
  "status": "UP"
}
```

### Frontend Health Check
```bash
curl http://localhost:3001
# Deve retornar index.html (200 OK)
```

### API Sample Request
```bash
curl -X GET http://localhost:8082/products
# Deve retornar: []
```

## Troubleshooting

### Erro: Connection refused (PostgreSQL)
```
Verificar se PostgreSQL está rodando:
pg_isready -h localhost -p 5432
```

### Erro: Port 8082 already in use
```
Matar processo:
lsof -i :8082
kill -9 <PID>
```

### Erro: CORS (frontend)
```
Backend já tem CORS habilitado.
Se não funcionar, editar:
src/main/java/com/example/resource/
# Adicionar @CrossOriginPolicy
```

### Node modules corrompidos
```bash
cd frontend
rm -rf node_modules
npm install
```

## Performance Tips

- Backend: warm-up leva ~3s no dev mode
- Frontend: usar `npm run build` para produção
- SGBD: criar índices em `product.code`, `raw_material.code`
- Cache: adicionar etags nas respostas da API

## Deployment em Produção

### AWS (sugestão)
- Backend: Elastic Beanstalk ou ECS
- Frontend: S3 + CloudFront
- DB: RDS PostgreSQL

### Heroku
```bash
# Backend
git push heroku main:main

# Frontend
vercel deploy
```

## Certificados & Segurança

- Em produção, usar HTTPS
- Adicionar CORS headers corretos
- Validar inputs no backend
- Usar variáveis de ambiente para secrets

---

**Última atualização:** Fev 2026
