#!/bin/bash

#  Setup Script for Production Inventory Management System
# This script automates the complete setup process

set -e

echo "════════════════════════════════════════════════════"
echo "   Production Inventory Management - Setup"
echo "════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo " Checking prerequisites..."

if ! command -v java &> /dev/null; then
    echo -e "${RED} Java is not installed. Please install Java 11+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java found: $(java -version 2>&1 | head -n 1)${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED} Node.js is not installed. Please install Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

if ! command -v psql &> /dev/null; then
    echo -e "${RED} PostgreSQL is not installed. Please install PostgreSQL 12+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL found: $(psql --version)${NC}"

echo ""
echo " Setting up Backend..."

cd backend

# Check if pom.xml exists
if [ ! -f "pom.xml" ]; then
    echo -e "${RED} pom.xml not found in backend directory${NC}"
    exit 1
fi

echo "    Building Maven dependencies..."
mvn clean install -q -DskipTests

echo ""
echo " Setting up Frontend..."

cd ../frontend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found in frontend directory${NC}"
    exit 1
fi

echo "    Installing Node dependencies..."
npm install --silent

echo ""
echo "  Setting up Database..."

# Create database
echo "   Creating database 'estoque'..."
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'estoque'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE estoque;"

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Setup complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo " To start the application:"
echo ""
echo "   Option 1: Individual terminals"
echo "   $ cd backend && mvn quarkus:dev"
echo "   $ cd frontend && npm start"
echo ""
echo "   Option 2: Docker (requires Docker & docker-compose)"
echo "   $ docker-compose up -d"
echo ""
echo " Access the application:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:8082"
echo ""
