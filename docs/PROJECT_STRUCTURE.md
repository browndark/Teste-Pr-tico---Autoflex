# Project Structure Guide

Professional organization of the Quest Hands Inventory Management System.

## Directory Tree

```
quest-hands/
│
├── DOCUMENTATION FILES (Root)
│   ├── README.md                    - Project overview & quick start
│   ├── CONTRIBUTING.md              - How to contribute (optional)
│   └── LICENSE                      - MIT License
│
├── backend/                         - Quarkus REST API (Java)
│   ├── src/
│   │   ├── main/java/com/example/
│   │   │   ├── model/              - Entity classes (Product, RawMaterial, etc)
│   │   │   ├── resource/           - REST endpoints (4 main resources)
│   │   │   └── repository/         - Data access layer (JPA)
│   │   └── main/resources/
│   │       └── db/migration/       - Flyway database migrations (V*.sql)
│   ├── pom.xml                     - Maven dependencies
│   ├── .env                        - Database credentials (not in git)
│   └── .env.example                - Configuration template
│
├── frontend/                       - React 18 + Redux SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/             - Page components
│   │   │   ├── ProductPage.js
│   │   │   ├── RawMaterialPage.js
│   │   │   ├── AssociationPage.js
│   │   │   ├── ProductionSuggestionPage.js
│   │   │   └── LoginPage.js
│   │   ├── redux/                  - State management
│   │   │   ├── slices/            - Redux slices (product, material, etc)
│   │   │   └── store.js           - Redux store configuration
│   │   ├── utils/                 - Utility modules
│   │   │   ├── apiClient.js       - Global axios interceptor
│   │   │   ├── validation.js      - Form validation framework
│   │   │   └── toast.js           - Toast notification utilities
│   │   ├── App.js                 - Main container
│   │   ├── App.css                - Global styles (508 lines)
│   │   └── index.js               - Entry point
│   ├── package.json               - NPM dependencies & scripts
│   ├── .env                       - API configuration
│   └── .env.example               - Configuration template
│
├── docs/                          - Documentation (organized)
│   ├── README.md                  - Quick start guide
│   ├── QUICK_START.md             - Developer reference (200 lines)
│   ├── ARCHITECTURE.md            - System design & diagrams
│   ├── DATABASE_SCHEMA.md         - ER diagrams & constraints
│   ├── DEPLOYMENT.md              - Production setup guide (300 lines)
│   ├── PRODUCTION_READINESS.md    - Final deployment checklist
│   ├── IMPROVEMENTS.md            - 10 professional improvements
│   ├── GITHUB_SUBMISSION.md       - Competition submission guide
│   ├── PROJECT_SUMMARY.md         - High-level overview
│   ├── COMPLETION_SUMMARY.md      - Project completion report
│   ├── FINAL_STATUS.md            - Final status report
│   ├── POSTMORTEM.md              - Development journey & lessons
│   └── DOCUMENTATION_INDEX.md     - Navigation guide for all docs
│
├── config/                        - Configuration & Deployment
│   ├── docker-compose.yml         - 3-service orchestration
│   │                              ├── PostgreSQL 14
│   │                              ├── Quarkus Backend
│   │                              └── React Frontend
│   └── .gitignore                 - Git exclusions
│
├── scripts/                       - Automation & Setup
│   ├── setup.sh                   - Unix/Linux/Mac setup (bash)
│   ├── setup.bat                  - Windows setup (batch)
│   ├── verify-setup.sh            - Installation verification (Unix)
│   └── verify-setup.bat           - Installation verification (Windows)
│
├── tests/                         - Testing Framework
│   ├── cypress/
│   │   ├── e2e/                  - E2E test scenarios (Cypress)
│   │   │   ├── product.spec.js
│   │   │   ├── material.spec.js
│   │   │   ├── association.spec.js
│   │   │   └── [more scenarios]
│   │   ├── support/              - Cypress helpers & utilities
│   │   └── fixtures/             - Test data
│   └── cypress.config.js         - Cypress configuration
│
└── .github/                       - GitHub specific
    └── workflows/                - GitHub Actions (CI/CD ready)
        └── [future CI/CD pipelines]
```

## File Organization by Purpose

### Documentation
All documentation consolidated in `/docs/` folder:
- See [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md) for navigation

### Configuration
All configuration in `/config/` folder:
- Docker: [config/docker-compose.yml](config/docker-compose.yml)
- Git: [config/.gitignore](config/.gitignore)

### Automation
All scripts in `/scripts/` folder:
- Setup: `scripts/setup.sh` or `scripts/setup.bat`
- Verification: `scripts/verify-setup.sh` or `scripts/verify-setup.bat`

### Tests
All tests in `/tests/` folder:
- E2E tests: `tests/cypress/e2e/`
- Config: `tests/cypress.config.js`

### Source Code
- Backend: `backend/` (Java/Quarkus)
- Frontend: `frontend/` (React/Redux)

## Key Files by Function

### Project Setup
1. Start with: [README.md](README.md)
2. Then: [docs/QUICK_START.md](docs/QUICK_START.md)
3. Then: Use setup script: `./scripts/setup.sh` or `scripts/setup.bat`

### Understanding Architecture
1. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
2. [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - Data model
3. Backend code: `backend/src/main/java/`
4. Frontend code: `frontend/src/`

### Production Deployment
1. [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Setup guide (300+ lines)
2. [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) - Checklist
3. Docker: [config/docker-compose.yml](config/docker-compose.yml)

### Competition Submission
1. [docs/GITHUB_SUBMISSION.md](docs/GITHUB_SUBMISSION.md)
2. [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)
3. [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md)

### Development
1. [docs/QUICK_START.md](docs/QUICK_START.md) - Setup & common tasks
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Code organization
3. Backend: `apiClient.js` (error handling)
4. Frontend: `validation.js` (form validation)

## Root Directory Files

### Only in Root
- **package.json** - Root dependencies (if any)
- **package-lock.json** - Dependency lock file
- **README.md** - Project entry point
- **.github/** - GitHub workflows (future)

Everything else is organized into:
- `docs/` - Documentation
- `config/` - Configuration
- `scripts/` - Automation
- `tests/` - Testing
- `backend/` - Java code
- `frontend/` - React code

## Why This Organization?

1. **Clarity** - Each folder has a single purpose
2. **Scalability** - Easy to add new components
3. **Professional** - Meets industry standards
4. **Maintainability** - Clear where everything belongs
5. **Collaboration** - New developers understand structure immediately
6. **Deployment** - Easy to find what you need for production

## Navigation Quick Reference

| Need | Go To |
|------|-------|
| Start project | [README.md](README.md) |
| Quick start | [docs/QUICK_START.md](docs/QUICK_START.md) |
| System design | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Database | [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) |
| Deploy prod | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Submit link | [docs/GITHUB_SUBMISSION.md](docs/GITHUB_SUBMISSION.md) |
| Setup | `./scripts/setup.sh` |
| Run tests | `./tests/` folder |
| Change code | `backend/` or `frontend/` |

---

**Organization Date:** February 7, 2026  
**Standard:** Professional Enterprise-Grade Structure
