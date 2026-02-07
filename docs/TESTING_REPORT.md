# Automated Testing Framework

## Executive Summary

This document outlines the comprehensive automated testing strategy for the Quest Hands Inventory Management System. The system implements three complementary testing layers:

1. Unit & Integration Tests (Backend - JUnit, Spring Test)
2. End-to-End Tests (Frontend - Cypress)
3. Behavioral Tests (Full Stack - Robot Framework)

---

## Testing Architecture

### Layer 1: Backend Testing (JUnit)

**Location:** `backend/src/test/java/`

**Technology Stack:**
- JUnit 5
- RestAssured
- Quarkus testing utilities

**Coverage Areas:**
- Entity validation
- Repository operations
- REST API endpoints
- Business logic (Production suggestion algorithm)
- Error handling

**Test Suites:**
1. ProdutoResourceTest: Product CRUD operations
2. MateriaPrimaResourceTest: Raw material CRUD operations
3. AssociacaoResourceTest: Product-material associations
4. ProducaoResourceTest: Production suggestion algorithm

**Running Backend Tests:**
```bash
cd backend
mvn clean test
mvn test -Dtest=ProdutoResourceTest
mvn test -Dtest=*Resource* # All resource tests
```

**Continuous Integration:** Tests run automatically on push via GitHub Actions

---

### Layer 2: Frontend Testing (Cypress)

**Location:** `frontend/cypress/e2e/`

**Technology Stack:**
- Cypress 13.x
- JavaScript/Node.js
- Cypress testing utilities

**Coverage Areas:**
- User authentication flows (login, signup, password reset)
- Product management CRUD
- Raw material management CRUD
- Product-material associations
- Production suggestions display
- UI/UX interactions
- Form validation
- Error message handling
- Responsive design at different breakpoints

**Test Suites:**
1. main_flow.cy.js: Core application workflows
2. auth_flow.cy.js: Authentication user journeys
3. crud_operations.cy.js: CRUD functionality
4. validation.cy.js: Form and data validation

**Running Frontend Tests:**
```bash
cd frontend
npm run cypress:open      # Interactive mode
npm run cypress:run       # Headless execution
npx cypress run --spec "cypress/e2e/main_flow.cy.js"
npx cypress run --browser firefox
npx cypress run --record  # Cloud recording (if enabled)
```

**Test Execution Timeline:** 10-15 minutes for full suite

**CI/CD Integration:** Runs on pull requests and commits to main branch

---

### Layer 3: Behavioral Testing (Robot Framework)

**Location:** `tests/robot/`

**Technology Stack:**
- Robot Framework 7.0
- SeleniumLibrary (browser automation)
- RequestsLibrary (API testing)
- Python 3.7+

**Test Organization:**

#### 3.1 Login Testing (test_login.robot)
**Objective:** Validate user authentication mechanism

**Test Cases:**
1. Login With Valid Credentials
   - Verify user can log in with correct credentials
   - Confirm redirect to dashboard after login
   - Validate "LOGGED IN" status display

2. Login With Missing Name
   - Ensure form validation prevents submission without name
   - Verify appropriate error feedback

3. Login With Missing Email
   - Ensure form validation prevents submission without email
   - Validate error message display

4. Login With Missing Password
   - Ensure form validation for required password field
   - Confirm error handling

5. Password Show/Hide Toggle
   - Test password visibility toggle functionality
   - Verify secure password input behavior

6. Login Page Layout
   - Validate presence of all form fields
   - Verify page structure and elements

**Preconditions:**
- Application loaded at http://localhost:3000
- Application is in login state

**Data Requirements:**
- Valid test credentials

---

#### 3.2 Registration Testing (test_signup.robot)
**Objective:** Validate user registration and email verification

**Test Cases:**
1. Signup With Valid Data
   - Complete signup form with valid information
   - Verify email verification screen appears
   - Confirm verification code request message

2. Signup With Mismatched Passwords
   - Attempt to register with non-matching passwords
   - Verify error message: "Passwords do not match"
   - Ensure signup is blocked

3. Signup With Short Password
   - Test password minimum length validation (6 characters)
   - Verify appropriate error message
   - Confirm form submission prevention

4. Signup Without Accepting Terms
   - Attempt signup without accepting terms checkbox
   - Verify error message display
   - Confirm form validation

5. Signup Form Validation
   - Validate presence of all required form fields
   - Verify field labels in English
   - Confirm form structure

6. Email Verification Code Input
   - Test 6-digit code input field
   - Verify input restrictions
   - Confirm field attributes

**Preconditions:**
- Application loaded
- User not logged in

**Test Data:**
- Names: various lengths
- Emails: valid format
- Passwords: various complexities
- Invalid inputs: special characters, etc.

---

#### 3.3 Password Recovery Testing (test_password_recovery.robot)
**Objective:** Validate password reset functionality

**Test Cases:**
1. Access Password Recovery From Login
   - Click "Forgot your password?" link from login page
   - Verify navigation to password recovery view

2. Password Recovery With Valid Email
   - Submit password recovery form with valid email
   - Verify confirmation message
   - Confirm email sending message

3. Password Recovery Form Validation
   - Verify all form elements present
   - Confirm field labels and buttons
   - Validate form structure

4. Password Recovery Empty Email
   - Test form with empty email field
   - Verify HTML5 validation
   - Confirm form submission prevention

5. Password Recovery Page Layout
   - Validate page structure and elements
   - Confirm navigation links
   - Verify help text presence

6. Back To Login Navigation
   - Test "Back to Login" button
   - Verify return to login view

**Preconditions:**
- Application loaded
- User on login page

---

#### 3.4 API Testing (test_api.robot)
**Objective:** Validate backend API endpoints and responses

**Test Cases:**
1. API Health Check
   - Verify /q/health endpoint responds
   - Confirm status code 200
   - Validate service availability

2. Get Products List
   - Test GET /products endpoint
   - Verify HTTP 200 response
   - Validate response format

3. Get Raw Materials List
   - Test GET /raw-materials endpoint
   - Verify HTTP 200 response
   - Validate JSON array structure

4. Get Product Raw Materials Associations
   - Test GET /products-raw-materials endpoint
   - Verify HTTP 200 response
   - Validate data integrity

5. Get Production Suggestion
   - Test GET /production-suggestion endpoint
   - Verify algorithm execution
   - Validate suggestion calculation

6. Create Product Success
   - Test POST /products with valid data
   - Verify HTTP 200 response
   - Validate product creation

7. Create Product Without Code
   - Test validation of required fields
   - Verify HTTP 400 error response
   - Confirm error message format

8. API Error Handling 404
   - Test non-existent resource access
   - Verify HTTP 404 response
   - Validate error handling

9. API Response Format
   - Verify JSON response validity
   - Confirm data structure
   - Validate array/object types

10. API Timeout Handling
    - Test timeout scenarios
    - Verify graceful failure handling
    - Confirm error responses

**API Base URL:** http://localhost:8082

**Endpoints Tested:**
- GET /q/health
- GET /products
- POST /products
- GET /raw-materials
- GET /products-raw-materials
- GET /production-suggestion

---

## Installation & Setup

### Prerequisites

```bash
# Python installation
python --version  # 3.7+ required

# Repository clone
git clone <repository-url>
cd quest-hands
```

### Robot Framework Installation

```bash
# Navigate to tests directory
cd tests/robot

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Verify Installation

```bash
# Check Robot Framework
robot --version

# Verify SeleniumLibrary
python -c "from SeleniumLibrary import SeleniumLibrary; print('SeleniumLibrary installed')"

# Verify RequestsLibrary
python -c "from RequestsLibrary import RequestsLibrary; print('RequestsLibrary installed')"

# Download WebDriver (ChromeDriver)
# Ensure WebDriver version matches your Chrome version
# Place chromedriver in PATH or in project directory
```

---

## Test Execution

### Running All Tests

```bash
# From tests/robot directory
robot --outputdir=results .

# With custom variables
robot --variable BASE_URL:http://localhost:3000 --outputdir=results .

# Verbose output
robot --loglevel DEBUG --outputdir=results .
```

### Running Specific Test Suites

```bash
# Login tests only
robot test_login.robot

# Sign-up tests only
robot test_signup.robot

# Password recovery tests only
robot test_password_recovery.robot

# API tests only
robot test_api.robot
```

### Running Specific Test Cases

```bash
# Single test case
robot --test "Login With Valid Credentials" test_login.robot

# Multiple tests by pattern
robot --test "*Valid*" test_login.robot
```

### Report Generation

```bash
# Generate HTML reports
robot --outputdir=results --report report.html --log log.html .

# Generate in quiet mode (minimal output)
robot --quiet --outputdir=results .

# Merge multiple test runs
rebot --outputdir=combined results/output1.xml results/output2.xml
```

### CI/CD Integration

```bash
# GitHub Actions usage in workflow file
- name: Run Robot Framework Tests
  run: |
    pip install -r requirements.txt
    robot --outputdir=results --report report.html tests/robot/

- name: Upload Test Reports
  if: always()
  uses: actions/upload-artifact@v2
  with:
    name: robot-test-reports
    path: results/
```

---

## Test Data Management

### Test Data Sources

1. **Fixtures:** Predefined data sets for consistent testing
2. **Generated Data:** Dynamic data creation for parametric tests
3. **Mocked APIs:** For isolated component testing (future enhancement)

### Data Cleanup

- Tests clean up after themselves
- Database reset between test runs (backend tests)
- Browser cache cleared between sessions

### Test Database

- Backend tests use in-memory H2 database
- No impact on production database
- Automatic rollback after each test

---

## Continuous Integration

### GitHub Actions Workflows

**File:** `.github/workflows/tests.yml`

**Trigger Events:**
- Push to main branch
- Pull requests

**Workflow Steps:**
1. Set up Java/Maven (Backend)
2. Set up Node.js/npm (Frontend)
3. Set up Python (Robot Framework)
4. Run backend tests
5. Run frontend Cypress tests
6. Run Robot Framework tests
7. Publish test reports
8. Generate coverage reports

**Artifact Upload:**
- Test reports (HTML)
- Coverage reports
- Screenshots on failure

---

## Test Metrics & Reporting

### Coverage Targets

- **Backend Code Coverage:** 80% minimum
- **API Endpoint Coverage:** 100%
- **Critical Path Coverage:** 100%

### Metrics Tracked

1. **Test Execution Time**
   - Backend: ~2 minutes
   - Frontend: ~15 minutes
   - Robot Framework: ~8 minutes
   - Total: ~25 minutes

2. **Test Pass Rate**
   - Target: 100% for main branch
   - Acceptable: >95% for feature branches

3. **Coverage Reports**
   - Generated by JaCoCo (backend)
   - Displayed in CI/CD dashboards

### Reporting Dashboard

Test reports are available in:
- GitHub Actions > Test Summary
- `results/` directory (local execution)
- Artifacts section (after CI run)

---

## Best Practices

### Test Design

1. **Clear Naming:** Test names describe what is tested
2. **Single Responsibility:** Each test validates one behavior
3. **Independence:** Tests can run in any order
4. **No Test Dependencies:** Tests don't rely on each other
5. **Deterministic:** Same input always produces same result

### Maintainability

1. **Keyword Library:** Reusable keywords in common.robot
2. **DRY Principle:** No duplicate test logic
3. **Documentation:** Clear comments for complex tests
4. **Variable Usage:** Configuration in variables, not hardcoded

### Reliability

1. **Wait Strategies:** Explicit waits for async operations
2. **Error Handling:** Proper exception handling
3. **Accessibility:** Tests validate keyboard navigation
4. **Responsive Design:** Tests at multiple resolutions

### Performance

1. **Parallel Execution:** Use pabot for faster runs
2. **Selective Testing:** Run only affected tests on PR
3. **Caching:** Browser cache for performance tests
4. **Resource Cleanup:** Proper session teardown

---

## Troubleshooting

### Common Issues

**Issue: Chrome Driver Version Mismatch**
```bash
# Solution: Download matching ChromeDriver version
# Check Chrome version: chrome://version/
# Download from: https://chromedriver.chromium.org/
```

**Issue: Tests Timeout**
```bash
# Solution: Increase timeout in keywords
Wait Until Page Contains    Element    timeout=20s
```

**Issue: Application Not Found**
```bash
# Solution: Verify services are running
# Backend: http://localhost:8082
# Frontend: http://localhost:3000
```

**Issue: Flaky Tests**
```bash
# Solution: Add explicit waits
Wait Until Page Contains Element    xpath=//button[text()='Submit']
```

---

## Future Enhancements

1. **Performance Testing:** Load testing with Locust
2. **API Load Testing:** JMeter integration
3. **Visual Regression:** Percy or BackstopJS
4. **Security Testing:** OWASP ZAP integration
5. **Accessibility Testing:** Axe-core integration
6. **Mobile Testing:** Appium support for mobile apps

---

## Support & Documentation

### External Resources

- Robot Framework: https://robotframework.org/
- SeleniumLibrary: https://robotframework.org/SeleniumLibrary/
- RequestsLibrary: https://marketsquare.github.io/robotframework-requests/
- Cypress: https://docs.cypress.io/

### Internal References

- Backend Testing: See `backend/README.md`
- Frontend Testing: See `frontend/README.md`
- CI/CD Pipeline: See `.github/workflows/`

---

## Compliance & Standards

### Testing Standards

- ISTQB best practices for test design
- IEEE 829 test documentation standards
- W3C Web Accessibility Guidelines (WCAG 2.1)

### Quality Metrics

- All critical paths must have 100% test coverage
- No known defects in production code paths
- Regression tests for all bug fixes

---

## Contact & Escalation

For testing-related issues:
1. Check this documentation
2. Review test output logs
3. Run tests in verbose mode for debugging
4. Check GitHub Issues for similar problems
5. Contact DevOps team for environment issues

---

**Last Updated:** February 2026
**Testing Framework Version:** Robot Framework 7.0
**Status:** Production Ready
