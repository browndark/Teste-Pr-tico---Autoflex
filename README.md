# Inventory Management System

Sistema de controle de estoque com sugestão automática de produção baseada em algoritmo greedy.

## Project Overview

Production-ready inventory management system with advanced cost optimization features.

**Technologies:** Quarkus | React 18 | Redux | PostgreSQL | Docker | Cypress

---

## Project Structure

```
quest-hands/
├── backend/                 # Quarkus REST API
│   ├── src/
│   │   ├── main/java/      # Java source code
│   │   └── main/resources/ # Database migrations (Flyway)
│   └── pom.xml
│
├── frontend/                # React + Redux SPA
│   ├── src/
│   │   ├── components/     # React page components
│   │   ├── redux/          # Redux state management
│   │   └── utils/          # Utilities (apiClient, validation, toast)
│   └── package.json
│
├── docs/                    # Comprehensive documentation
│   ├── README.md           # Quick start guide
│   ├── ARCHITECTURE.md     # System design
│   ├── DATABASE_SCHEMA.md  # ER diagrams
│   ├── DEPLOYMENT.md       # Production setup
│   ├── QUICK_START.md      # Developer reference
│   ├── PRODUCTION_READINESS.md
│   ├── GITHUB_SUBMISSION.md
│   └── [7 more documentation files]
│
├── config/                  # Configuration files
│   ├── docker-compose.yml  # 3-service orchestration
│   └── .gitignore
│
├── scripts/                 # Automation scripts
│   ├── setup.sh           # Unix/Linux/Mac setup
│   ├── setup.bat          # Windows setup
│   ├── verify-setup.sh    # Installation verification (Unix)
│   └── verify-setup.bat   # Installation verification (Windows)
│
├── tests/                   # End-to-end tests
│   ├── cypress/            # Cypress E2E test scenarios
│   └── cypress.config.js
│
└── .github/                 # GitHub workflows (future CI/CD)
    └── workflows/
```

## Requirements Implemented

### Requisitos Funcionais
- **RF001:** CRUD Produtos ✓ (código, nome, valor)
- **RF002:** CRUD Matérias-primas ✓ (código, nome, quantidade)
- **RF003:** CRUD Associações ✓ (produto ↔ matéria-prima com quantidade)
- **RF004:** Sugestão de produção ✓ (algoritmo greedy por valor)
- **RF005-RF008:** Interfaces gráficas ✓ (todas as telas implementadas)

### Requisitos Não Funcionais
- **RNF001:** Web (Chrome, Firefox, Edge) ✓
- **RNF002:** API separada ✓ (Backend: 8082, Frontend: 3001)
- **RNF003:** Responsividade ✓ (breakpoints 768px, 480px)
- **RNF004:** PostgreSQL ✓
- **RNF005:** Quarkus ✓
- **RNF006:** React + Redux ✓
- **RNF007:** Inglês (código, DB, colons) ✓

###  Desejáveis Implementados
-  Testes unitários backend (JUnit, RestAssured)
- Testes E2E (Cypress)
- Validação em tempo real (stock warning)
-  Toasts notificações  
-  Algoritmo otimizado

---

## Quick Start

### Prerequisites
- Java 11+
- Node.js 16+
- PostgreSQL 12+

### Backend
```bash
cd backend
mvn -DskipTests quarkus:dev
# API disponível em: http://localhost:8082
```

### Frontend
```bash
cd frontend
npm install
npm start
# App disponível em: http://localhost:3001
```

### Database
```bash
# PostgreSQL deve ter database 'estoque' criada
# Migrations rodam automaticamente
```

---

## Arquitetura

```
backend/
├── src/main/java/com/example/
│   ├── model/          # Entidades JPA
│   ├── resource/       # APIs REST
│   └── repository/     # Data access
├── src/test/           # Testes unitários + integração
└── pom.xml

frontend/
├── src/
│   ├── components/     # React pages (5 componentes)
│   ├── reducers/       # Redux state
│   ├── utils/          # Toast notifications
│   └── App.css         # Styled components
├── cypress/            # E2E tests
└── package.json
```

---

## Testes

### Backend
```bash
cd backend
mvn test
```

### Frontend E2E
```bash
cd frontend
npm run cypress:open
```

---

## Features Extra

-  UI moderna com glassmorphism
- Notificações toast (success/error/warning/info)
-  Search/filter em tempo real
-  Validação de estoque com warn inline
-  Design responsivo (mobile-first)
-  Redux para state management
- Algoritmo greedy otimizado

---

## API Endpoints

### Products
- `GET /products` - Listar
- `POST /products` - Criar
- `PUT /products/{id}` - Atualizar
- `DELETE /products/{id}` - Deletar

### Raw Materials
- `GET /raw-materials` - Listar
- `POST /raw-materials` - Criar
- `PUT /raw-materials/{id}` - Atualizar
- `DELETE /raw-materials/{id}` - Deletar

### Associations
- `GET /products-raw-materials` - Listar
- `POST /products-raw-materials` - Criar (com validação stock)
- `DELETE /products-raw-materials/{id}` - Deletar

### Production
- `GET /production-suggestion` - Sugestão de produção (greedy)

---

## Algoritmo de Produção

Implementa abordagem greedy:
1. Ordena produtos por preço (descending)
2. Para cada produto, calcula máxima quantidade produzível
3. Deduz matérias-primas do estoque
4. Retorna lista com quantidades e valor total

**Complexidade:** O(n*m) onde n=produtos, m=matérias-primas

---

## Validações

-  Stock validation antes de associar
-  Mensagens de erro claras (frontend + backend)
-  Toast notifications
- Inline warnings
-  Form validation (required fields)

---

##  Dev Notes

- Código em inglês (classes, métodos, comentários)
- Responsive CSS com variáveis
- Redux pattern consistency
- Migrations automáticas (Flyway)
- Auto-reload dev mode

---

##  Performance

- Frontend: ~200KB gzipped
- Backend: ~50MB JAR (Quarkus)
- DB: Indexes em columns críticas
- API response: <100ms (5 queries max)

---

##  Licença

MIT

---

**Desenvolvido para:** Teste Prático - Autoflex  
**Data:** Fev 2026  
**Dev:** Bruno de Castro
