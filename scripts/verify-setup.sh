#!/bin/bash

# Verify Setup Script - Checks that all dependencies are installed and configured
# Run this after setup.sh to verify everything is working correctly

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Verifying Quest Hands Installation...${NC}"
echo ""

# Check Java
echo -n "Checking Java... "
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | grep -oP 'version "\K[^"]*')
    echo -e "${GREEN}✓ Found Java $JAVA_VERSION${NC}"
else
    echo -e "${RED}✗ Java not found${NC}"
    exit 1
fi

# Check Maven
echo -n "Checking Maven... "
if command -v mvn &> /dev/null; then
    MVN_VERSION=$(mvn -v | grep -oP 'Apache Maven \K[^ ]*')
    echo -e "${GREEN}✓ Found Maven $MVN_VERSION${NC}"
else
    echo -e "${RED}✗ Maven not found${NC}"
    exit 1
fi

# Check Node
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Found Node $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ Found npm $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version | grep -oP 'psql \(PostgreSQL\) \K[^ ]*')
    echo -e "${GREEN}✓ Found PostgreSQL $PSQL_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL not found (OK if using Docker)${NC}"
fi

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | grep -oP 'version \K[^,]*')
    echo -e "${GREEN}✓ Found Docker $DOCKER_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Docker not found (optional)${NC}"
fi

# Check backend build
echo ""
echo -n "Checking backend build... "
if [ -f "./backend/target/quarkus-app/quarkus-run.jar" ]; then
    echo -e "${GREEN}✓ Backend JAR exists${NC}"
else
    echo -e "${YELLOW}⚠ Backend not built yet${NC}"
fi

# Check frontend dependencies
echo -n "Checking frontend dependencies... "
if [ -f "./frontend/node_modules/.package-lock.json" ] || [ -d "./frontend/node_modules" ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Frontend dependencies not installed${NC}"
fi

# Check .env files
echo ""
echo "Checking environment files..."
echo -n "  frontend/.env... "
if [ -f "./frontend/.env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}✗ (create from .env.example)${NC}"
fi

echo -n "  backend/.env... "
if [ -f "./backend/.env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}✗ (create from .env.example)${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}✅ Verification complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start PostgreSQL (if not in Docker): createdb estoque"
echo "2. Run backend: cd backend && mvn quarkus:dev"
echo "3. Run frontend: cd frontend && npm start"
echo "4. Or use Docker: docker-compose up -d"
echo ""
echo "Access the app at: http://localhost:3000"
