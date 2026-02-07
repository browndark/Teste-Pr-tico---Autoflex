# Architecture & Technical Details

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React 18 + Redux Application                │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐      │  │
│  │  │Components│ │  Redux   │ │ Business Logic   │      │  │
│  │  │(5 pages) │ │ Reducers │ │ & Validation     │      │  │
│  │  └──────────┘ └──────────┘ └──────────────────┘      │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       │ (Axios + Interceptors)
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                  API Layer (Quarkus)                        │
│  Port: 8082                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ ProductRes   │ │ RawMatRes    │ │ AssocRes     │       │
│  │ ProdSugRes   │ │ (with Stock   │ │ (Validation) │       │
│  │              │ │  Validation)  │ │              │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│         │                │                │                 │
│   ┌─────┴────────────────┴────────────────┴──────┐         │
│   │     Repository Layer (Data Access)           │         │
│   │  - ProductRepository                         │         │
│   │  - RawMaterialRepository                     │         │
│   │  - ProductRawMaterialRepository              │         │
│   └─────┬────────────────────────────────────────┘         │
└────────┼──────────────────────────────────────────────────┘
         │ JDBC
         │
┌────────┴──────────────────────────────────────────────────┐
│                PostgreSQL Database                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │ product      │ │ raw_material │ │ product_raw_ │      │
│  │ - id (PK)    │ │ - id (PK)    │ │ material     │      │
│  │ - code       │ │ - code       │ │ - id (PK)    │      │
│  │ - name       │ │ - name       │ │ - product_id │      │
│  │ - price      │ │ - stock_qty  │ │ - raw_mat_id │      │
│  │ - quantity   │ │              │ │ - req_qty    │      │
│  └──────────────┘ └──────────────┘ └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Frontend
```
App.js (Main Container)
├── LoginPage (Auth)
├── ProductPage (CRUD Products)
│   ├── Form Input
│   ├── Search Filter
│   └── List with Edit/Delete
├── RawMaterialPage (CRUD Materials)
│   ├── Form Input
│   ├── Search Filter
│   └── List with Delete
├── AssociationPage (Link Product ↔ Material)
│   ├── Dropdowns
│   ├── Quantity Input
│   ├── Stock Warning
│   └── Association List
└── ProductionSuggestionPage (Greedy Algorithm)
    ├── Refresh Button
    ├── Loading State
    └── Results Display
```

### Redux State Tree
```
{
  products: { items: [] },
  rawMaterials: { items: [] },
  associations: { items: [] },
  user: { user: null }
}
```

---

## Data Flow

### Create Product
```
1. User fills form → ProductPage
2. Validation (frontend) → validation.js
3. POST /products → apiClient (with interceptors)
4. Backend validation → ProductResource
5. DB insert → ProductRepository
6. Response with ID → Redux dispatch
7. Toast notification → showSuccess()
8. UI update → List refreshes
```

### Suggest Production
```
1. Load page → ProductionSuggestionPage
2. GET /production-suggestion → apiClient
3. Backend logic:
   a. Get all products (sorted by price DESC)
   b. For each product:
      - Calculate max producible qty (by bottleneck RM)
      - Deduct RMs from stock
   c. Return products + totalValue
4. Response → Redux store → UI display
```

---

## Validation Layers

### Frontend
```
Input Form
    ↓
JavaScript validation (validation.js)
    ↓
Error display
    ↓
Only if valid → HTTP request
```

### Backend
```
HTTP Request
    ↓
Resource layer validation
    ↓
Repository CRUD with DB constraints
    ↓
Response (success or error)
```

---

## Performance Optimization

### Database
- Indexes on `product.code` and `raw_material.code`
- Foreign key relationships with CASCADE delete
- Connection pooling via Agroal (Quarkus)

### Frontend
- Redux memoization (selectors)
- Component lazy loading ready
- CSS animations use GPU (transform, opacity)
- Avoid unnecessary re-renders with use of `dispatch` dependency

### API
- Response caching possible (ETag support ready)
- API timeout: 5 seconds default
- Retry logic for failed requests
- Connection pooling

---

## Error Handling Strategy

```
User Action
    ↓
Try Make API Call
    ↓
├─ Success → Update Redux → Toast Success
│
├─ Network Error (timeout, ECONNREFUSED)
│   → Retry logic (max 3 attempts)
│   → Toast: "Connection error - retrying..."
│
├─ HTTP 400/422 (Validation)
│   → Toast: "Input Error: [specific reason]"
│
├─ HTTP 401 (Unauthorized)
│   → Clear localStorage
│   → Redirect to login
│
├─ HTTP 403 (Forbidden)
│   → Toast: "Access Denied"
│
├─ HTTP 404 (Not Found)
│   → Toast: "Resource not found"
│
└─ HTTP 5xx (Server Error)
    → Toast: "Server error - try again later"
```

---

## Testing Strategy

### Unit Tests (Backend)
```
ProductResourceTest
├── testListProducts()
├── testCreateProduct()
├── testCreateProductValidation()
└── testDeleteProduct()

RawMaterialResourceTest
├── testListRawMaterials()
├── testCreateRawMaterial()
└── testDeleteRawMaterial()

ProductionSuggestionResourceTest
├── testGreedyAlgorithm()
└── testStockDeduction()
```

### E2E Tests (Cypress)
```
Product Flow
├── Login
├── Create Product
├── Search Product
├── Delete Product
└── Navigate pages

Association Flow
├── Add Material with insufficient stock
├── Validate error message
└── Create valid association

Production Suggestion
├── Verify greedy ordering
└── Check total value calculation
```

---

## Database Constraints

```sql
-- product table
ALTER TABLE product ADD UNIQUE (code);
ALTER TABLE product ADD CHECK (price > 0);

-- raw_material table
ALTER TABLE raw_material ADD UNIQUE (code);
ALTER TABLE raw_material ADD CHECK (stock_quantity >= 0);

-- product_raw_material table
ALTER TABLE product_raw_material ADD UNIQUE (product_id, raw_material_id);
ALTER TABLE product_raw_material ADD CHECK (required_quantity > 0);
```

---

## Deployment Topology

### Development
- Backend: `localhost:8082` (Quarkus dev mode)
- Frontend: `localhost:3001` (React dev server)
- Database: `localhost:5432` (PostgreSQL local)

### Production (Docker)
- All services in containers
- Environment variables from `.env`
- Volume persistence for database
- Health checks for auto-restart

### Cloud Ready
- Stateless backend (scalable horizontally)
- Frontend can be CDN-hosted (build output)
- Database: RDS/CloudSQL
- Container orchestration: K8s/ECS ready

---

## Scaling Considerations

### Current Limitations
- Single database instance
- No caching layer
- No message queue

### Future Improvements
- Redis for caching
- Pagination for large datasets
- Async jobs for heavy computations
- API rate limiting
- GraphQL for flexible queries

---

**Architecture Documentation**  
Version: 1.0  
Last Updated: February 2026
