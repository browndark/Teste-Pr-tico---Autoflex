# GitHub Actions CI/CD Workflows

Este projeto possui pipelines CI/CD automatizados usando GitHub Actions. Todos os workflows são executados automaticamente quando você faz push ou cria pull requests.

## Workflows Implementados

### 1. **Backend Tests** (`backend-tests.yml`)
Executa testes do backend Quarkus com Maven

**Trigger:**
- Push em `backend/**`
- Pull requests em `master`, `main`, `develop`

**Ações:**
- Setup JDK 11
- Inicia PostgreSQL service
- Executa `mvn clean test`
- Upload de relatórios de teste

**Tempo estimado:** 3-5 minutos

---

### 2. **Frontend Tests** (`frontend-tests.yml`)
Executa testes React com Jest e build

**Trigger:**
- Push em `frontend/**`
- Pull requests em `master`, `main`, `develop`

**Matriz de versões Node:**
- Node 16.x
- Node 18.x

**Ações:**
- Setup Node.js
- Install dependencies com `npm ci`
- Lint (se configurado)
- Testes com Jest
- Build
- Upload coverage com Codecov

**Tempo estimado:** 2-4 minutos

---

### 3. **E2E Tests** (`e2e-tests.yml`)
Executa testes end-to-end com Robot Framework e Cypress

**Trigger:**
- Push em `tests/**`, `backend/**`, `frontend/**`
- Pull requests
- Agendado: Diariamente às 2 AM UTC

**Inclui 2 jobs paralelos:**

#### Job 1: Robot Framework Tests
- Setup JDK 11, Node.js 18, Python 3.11
- Instala dependências do Robot Framework
- Build backend e frontend
- Inicia serviços
- Executa testes Robot Framework
- Upload resultados

#### Job 2: Cypress Tests
- Setup JDK 11, Node.js 18
- Build backend e frontend
- Executa testes Cypress
- Upload screenshots e videos

**Tempo estimado:** 8-12 minutos

---

### 4. **Build & Quality Checks** (`ci-cd.yml`)
Pipeline completo de build e análise de qualidade

**Trigger:**
- Qualquer push
- Pull requests
- Agendado: Semanalmente às 6 AM UTC

**Inclui 5 jobs:**

#### Job 1: Build
Paralelo para backend e frontend
- Maven build para backend
- npm build para frontend

#### Job 2: Code Quality
- Setup SonarCloud (com token configurado)
- Prettier check (frontend)

#### Job 3: Security
- Trivy vulnerability scan
- npm audit (frontend)

#### Job 4: Docker
- Build Docker images
- Cache com GitHub Actions

#### Job 5: Status Report
- Verifica status de todos os jobs

**Tempo estimado:** 5-10 minutos

---

### 5. **Deploy** (`deploy.yml`)
Deployment automático e release management

**Trigger:**
- Push em `main`, `master`
- Tags `v*`
- Manual dispatch

**Ações:**
- Deployment notice
- Create GitHub Release (com release notes automáticas)
- Slack notification
- Tag release version

**Tempo estimado:** 1-2 minutos

---

## Status Badges

Adicione estas linhas ao seu README.md para mostrar o status dos workflows:

```markdown
![Backend Tests](https://github.com/browndark/Teste-Prático---Autoflex/workflows/Backend%20Tests%20-%20Quarkus/badge.svg)
![Frontend Tests](https://github.com/browndark/Teste-Prático---Autoflex/workflows/Frontend%20Tests%20-%20React%20&%20Jest/badge.svg)
![E2E Tests](https://github.com/browndark/Teste-Prático---Autoflex/workflows/E2E%20Tests%20-%20Robot%20Framework%20&%20Cypress/badge.svg)
![Build & Quality](https://github.com/browndark/Teste-Prático---Autoflex/workflows/Build%20&%20Quality%20Checks/badge.svg)
![Deploy](https://github.com/browndark/Teste-Prático---Autoflex/workflows/Deploy%20to%20Production/badge.svg)
```

---

## Como Configurar (Opcional)

### SonarCloud Setup
Para análise de qualidade com SonarCloud:

1. Acesse https://sonarcloud.io
2. Login com GitHub
3. Crie um token
4. No repositório GitHub:
   - Settings → Secrets and variables → Actions
   - Adicione `SONAR_TOKEN` com seu token

### Slack Notifications
Para notificações no Slack:

1. Crie webhook no Slack
2. No repositório GitHub:
   - Settings → Secrets and variables → Actions
   - Adicione `SLACK_WEBHOOK` com a URL do webhook

---

## Visualizando Resultados

### No GitHub
1. Acesse a aba **"Actions"** do repositório
2. Clique no workflow de interesse
3. Clique no commit/push específico
4. Veja os logs detalhados de cada job

### Artifacts
Cada workflow faz upload de artifacts (relatórios, builds, etc.):
- Backend test reports
- Frontend build artifacts
- Robot Framework results
- Cypress screenshots/videos

Esses podem ser baixados na página do workflow.

---

## Troubleshooting

### Workflow não está executando?
1. Verifique se os triggers estão corretos
2. Verifique `.github/workflows/*.yml` sintaxe
3. Acesse Actions → Workflow para ver erros

### Testes falhando?
1. Verifique os logs no GitHub Actions
2. Download dos artifacts para análise local
3. Execute localmente: `mvn test` ou `npm test`

### Services não iniciam?
- PostgreSQL: Verifique porta 5432
- Backend: Verifique variáveis de ambiente
- Frontend: Verifique Node.js version

---

## Performance Tips

1. **Cache**: Workflows usam cache de Maven e npm
2. **Parallel**: e2e-tests roda Cypress e Robot em paralelo
3. **Conditional**: Deploy apenas em main/master
4. **Artifact cleanup**: Delete artifacts antigos no GitHub

---

## Próximos Passos

- [ ] Configurar SonarCloud
- [ ] Configurar Slack webhook
- [ ] Adicionar badges ao README
- [ ] Configurar branch protection rules
- [ ] Adicionar GitHub status checks obrigatórios

---

Última atualização: 2026-02-07
