# Developer Quick Reference Guide

## Quick Start

### Option 1: Local Development (Recommended)
```bash
# Setup everything
./setup.sh          # Linux/Mac
setup.bat           # Windows

# Verify installation
./verify-setup.sh   # Linux/Mac
verify-setup.bat    # Windows

# Start services in separate terminals
cd backend && mvn quarkus:dev
cd frontend && npm start

# App available at http://localhost:3001
```

### Option 2: Docker (All-in-One)
```bash
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down -v
```

---

## 📁 Project Structure

```
quest hands/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # 5 page components
│   │   ├── redux/              # State management
│   │   ├── utils/              # apiClient, validation, toast
│   │   ├── App.js              # Main container
│   │   └── App.css             # Global styles (508 lines)
│   ├── package.json            # Dependencies
│   ├── .env                    # Environment variables
│   └── .env.example            # Template
│
├── backend/                     # Quarkus application
│   ├── src/main/java/com/example/
│   │   ├── model/              # Entity classes (Product, RawMaterial, etc)
│   │   ├── resource/           # REST endpoints
│   │   └── repository/         # Data access layer
│   ├── pom.xml                 # Dependencies
│   ├── .env                    # Database config
│   └── .env.example
│
├── cypress/                     # E2E tests
│   └── e2e/                    # Test scenarios
│
├── docker-compose.yml          # 3 services (PostgreSQL, Backend, Frontend)
├── setup.sh / setup.bat        # Automated setup
├── verify-setup.sh / .bat      # Verification
├── README.md                   # Project overview
├── ARCHITECTURE.md             # System design
├── DATABASE_SCHEMA.md          # Schema & relationships
├── DEPLOYMENT.md               # Production guide
└── IMPROVEMENTS.md             # Features added
```

---

##  Common Tasks

### Development Workflow
```bash
# Terminal 1: Backend
cd backend
mvn quarkus:dev
# Starts on http://localhost:8082
# Auto-reloads on code changes

# Terminal 2: Frontend
cd frontend
npm start
# Starts on http://localhost:3001
# Hot reload enabled

# Terminal 3: Database (if not Docker)
# Ensure PostgreSQL is running on localhost:5432
```

### Building for Production
```bash
# Backend
cd backend
mvn clean package -DskipTests
# Output: target/quarkus-app/

# Frontend
cd frontend
npm run build
# Output: build/
```

### Running Tests
```bash
# Frontend unit tests (setup required)
cd frontend
npm test

# E2E tests
npm run cypress:open   # Interactive
npm run cypress:run    # Headless
```

### Database Maintenance
```bash
# Create database
createdb estoque

# Flyway migrations run automatically on startup
# To reset: dropdb estoque && createdb estoque

# Connect to database
psql -U postgres estoque

# Sample queries:
SELECT * FROM product;
SELECT * FROM raw_material;
SELECT * FROM product_raw_material;
```

---

## API Endpoints

### Products
```
GET    /products              List all products
POST   /products              Create product
DELETE /products/{id}         Delete product
```

### Raw Materials
```
GET    /rawmaterials         List all materials
POST   /rawmaterials         Create material
DELETE /rawmaterials/{id}    Delete material
```

### Associations
```
GET    /productrawmaterials          List associations
POST   /productrawmaterials          Create (with stock validation)
DELETE /productrawmaterials/{id}     Delete association
```

### Production Suggestion
```
GET    /production-suggestion         Greedy algorithm results
POST   /production-suggestion/execute Execute production & deduct stock
```

---

## Configuration

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8082
REACT_APP_TIMEOUT=5000
REACT_APP_RETRY_ATTEMPTS=3
REACT_APP_ENV=development
REACT_APP_ENABLE_LOGGING=true
```

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=estoque
DB_USER=postgres
DB_PASSWORD=postgres

QUARKUS_HTTP_PORT=8082
QUARKUS_HIBERNATE_ORM_DATABASE_GENERATION=validate
```

---

## Debugging

### Enable API Logging
```javascript
// frontend/src/utils/apiClient.js
if (process.env.REACT_APP_ENABLE_LOGGING === 'true') {
    console.log('Request:', config);
    console.log('Response:', response);
}
```

### Check Browser Console
1. Open DevTools (F12)
2. Console tab shows:
   - Network requests
   - Redux dispatches
   - Toast messages
   - Validation errors

### Backend Logs
```bash
cd backend && mvn quarkus:dev
# View SQL queries
# Check exception stack traces
# Monitor request/response flow
```

### Database Inspection
```bash
psql -U postgres estoque

-- Check recent data
SELECT * FROM product ORDER BY id DESC LIMIT 5;
SELECT * FROM raw_material LIMIT 10;

-- Check relationships
SELECT p.name, rm.name, prm.required_quantity 
FROM product_raw_material prm
JOIN product p ON prm.product_id = p.id
JOIN raw_material rm ON prm.raw_material_id = rm.id;
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 8082
lsof -i :8082
kill -9 <PID>

# Or change QUARKUS_HTTP_PORT in .env
```

### Database Connection Error
```bash
# Ensure PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check .env credentials match
# Rebuild database: dropdb estoque && createdb estoque
```

### Frontend Not Loading
```bash
# Clear npm cache
rm -rf node_modules package-lock.json
npm install

# Check .env REACT_APP_API_URL
# Ensure backend is running on 8082
```

### CORS Errors
- Backend must allow cross-origin requests (Quarkus CORS config)
- Frontend must use correct API_URL in .env
- Check browser console for specific origin error

---

## Performance Tips

### Database
- Indexes on `product.code` and `raw_material.code`
- Connection pooling via Agroal (automatic)
- Batch operations for bulk inserts

### Frontend
- Redux memoization reduces re-renders
- CSS animations use GPU (transform, opacity)
- Lazy load heavy components
- Image optimization in production

### API
- Retry logic handles transient failures
- Response caching possible (ETag headers)
- Timeout prevents hanging requests (5s default)

---

## Deployment Checklist

- [ ] Run `npm run build` (frontend)
- [ ] Run `mvn clean package` (backend)
- [ ] Set production `.env` variables
- [ ] Run `docker-compose up -d`
- [ ] Verify on `http://localhost:3001`
- [ ] Check database connection from backend logs
- [ ] Test all CRUD operations
- [ ] Run `npm run cypress:run` (all tests pass)
- [ ] Archive database backup
- [ ] Document deployment date/time

---

## Security Best Practices

 Implemented:
- Stock validation at frontend AND backend
- Input sanitization via validation.js
- CORS configuration
- Environment variables for secrets
- Error message sanitization (no SQL exposed)

 Consider for Production:
- Add JWT authentication
- Implement HTTPS/TLS
- Add API rate limiting
- Database user permissions (read-only for analysis)
- Audit logging for all modifications
- Data encryption at rest

---

## Documentation Files

- **README.md** - Project overview & requirements mapping
- **ARCHITECTURE.md** - System design & data flow
- **DATABASE_SCHEMA.md** - ER diagram & constraints
- **DEPLOYMENT.md** - Production deployment guide
- **IMPROVEMENTS.md** - List of 10 professional improvements

---

## Code Patterns Used

### Error Handling
```javascript
// Frontend
try {
    const response = await apiClient.get('/products');
    dispatch(setProducts(response.data));
} catch (error) {
    showError(error.message || 'Failed to load products');
}
```

### Validation
```javascript
// Before API call
const validation = validateProduct(form);
if (!validation.valid) {
    setErrors(validation.errors);
    return;
}
// Then API call
```

### Retry Logic
```javascript
// Automatic retry with exponential backoff
const data = await withRetry(() => apiClient.get('/products'));
```

---

## Testing Examples

### Frontend Component Test
```javascript
import { render, screen } from '@testing-library/react';
import ProductPage from './ProductPage';

test('renders product list', () => {
    render(<ProductPage />);
    expect(screen.getByText(/product list/i)).toBeInTheDocument();
});
```

### E2E Test
```javascript
describe('Product CRUD', () => {
    it('creates a product', () => {
        cy.visit('http://localhost:3001/products');
        cy.get('[data-testid=name-input]').type('Test Product');
        cy.get('[data-testid=submit]').click();
        cy.contains('Product created successfully').should('be.visible');
    });
});
```

---

**Version:** 1.0  
**Last Updated:** February 2026  
**Maintainer:** Development Team
