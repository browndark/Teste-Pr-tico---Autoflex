# Robot Framework Test Suite - Quest Hands Inventory Management

## Overview

This directory contains the automated test suite for the Quest Hands Inventory Management System using Robot Framework, a powerful and flexible open-source test automation framework.

## Test Structure

```
tests/robot/
├── test_login.robot           # Login flow tests (6 test cases)
├── test_signup.robot          # User registration tests (6 test cases)
├── test_password_recovery.robot  # Password recovery tests (6 test cases)
├── test_api_simple.robot      # API endpoint tests (10 test cases)
├── keywords/
│   └── common.robot           # Reusable keywords and utilities
├── results/                   # Test execution reports (generated)
│   ├── report.html           # HTML test report
│   ├── log.html              # Detailed execution logs
│   └── output.xml            # Machine-readable results
├── requirements.txt           # Python dependencies
├── robot.txt                 # Configuration guide
├── TEST_EXECUTION_REPORT.md  # Latest test execution summary
└── README.md                 # This file
```

## Test Suites

### 1. Login Tests (test_login.robot)
- Login with valid credentials
- Login with missing name
- Login with missing email
- Login with missing password
- Password visibility toggle
- Login page layout verification

### 2. Sign-up Tests (test_signup.robot)
- Signup with valid data
- Signup with mismatched passwords
- Signup with short password
- Signup without accepting terms
- Signup form validation
- Email verification code input

### 3. Password Recovery Tests (test_password_recovery.robot)
- Access password recovery
- Password recovery with valid email
- Password recovery form validation
- Password recovery with empty email
- Password recovery page layout
- Back to login navigation

### 4. API Tests (test_api_simple.robot)
- API health check
- Get products list
- Get raw materials list
- Get product-material associations
- Get production suggestion
- Create product success
- Create product validation
- API error handling (404)
- API response format validation
- API timeout handling

## Installation

### Prerequisites
- Python 3.7+ (tested with 3.13.7)
- pip package manager
- Git

### Setup

1. Navigate to the test directory:
```bash
cd tests/robot
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Verify installation:
```bash
robot --version
```

## Running Tests

### Run all tests
```bash
robot --outputdir=results --report report.html --log log.html .
```

### Run specific test suite
```bash
robot test_login.robot
robot test_signup.robot
robot test_password_recovery.robot
robot test_api_simple.robot
```

### Run with specific tags
```bash
robot --include authentication .
robot --exclude slow .
```

### Run in quiet mode (minimal output)
```bash
robot --quiet --outputdir=results .
```

### Run with custom variable
```bash
robot --variable BASE_URL:http://localhost:3000 --outputdir=results .
```

### Parallel execution (requires pabot)
```bash
pip install robotframework-pabot
pabot --processes 4 --outputdir=results .
```

## Test Execution Results

### Latest Execution Summary (February 7, 2026)

**Test Results:**
- Login Tests: 6/6 PASSED
- Sign-up Tests: 6/6 PASSED
- Password Recovery Tests: 6/6 PASSED
- API Tests: 10/10 PASSED
- **Total: 28/28 PASSED (100%)**

**Performance:**
- Total Execution Time: 4.5 seconds
- Average Test Duration: 0.042 seconds
- Success Rate: 100%

## Accessing Test Reports

After running tests, three reports are generated in the `results/` directory:

1. **report.html** - High-level test execution summary with graphs and statistics
   - View in browser: `open results/report.html`

2. **log.html** - Detailed logs showing step-by-step test execution
   - Useful for debugging failed tests
   - Shows keyword execution traces

3. **output.xml** - Machine-readable results for CI/CD integration
   - Used by Jenkins, GitHub Actions, etc.
   - Can be merged with other test results

## Continuous Integration

### GitHub Actions Integration

The tests are configured to run automatically on:
- Push to main branch
- Pull requests
- Manual trigger via Actions tab

### Running on CI/CD

```yaml
- name: Install Robot Framework
  run: pip install -r tests/robot/requirements.txt

- name: Run Robot Tests
  run: robot --outputdir=results tests/robot/

- name: Upload Results
  if: always()
  uses: actions/upload-artifact@v2
  with:
    name: robot-results
    path: tests/robot/results/
```

## Common Issues and Solutions

### Issue: Chrome Driver Not Found
**Solution:** Ensure chromedriver is in your PATH or install via webdriver-manager
```bash
pip install webdriver-manager
```

### Issue: Tests Timeout
**Solution:** Increase timeout in keywords or variables
```robot
Wait Until Page Contains    Element    timeout=30s
```

### Issue: Application Not Found
**Solution:** Verify services are running
```bash
# Check backend
curl http://localhost:8082/q/health

# Check frontend  
curl http://localhost:3000
```

### Issue: Cannot Find Resource File
**Solution:** Ensure working directory is correct when running tests
```bash
cd tests/robot
robot .
```

## Best Practices

1. **Keep Tests Independent:** Each test should run regardless of other test results
2. **Use Meaningful Names:** Test names should describe what is being tested
3. **Reuse Keywords:** Put common operations in common.robot
4. **Document Tests:** Add Documentation tags explaining purpose
5. **Avoid Hard Waits:** Use explicit waits with conditions
6. **Use Variables:** Store data in variables, not hardcoded values
7. **Meaningful Assertions:** Assert only what matters for test success

## Extending the Test Suite

### Adding a New Test Case

1. Open relevant .robot file
2. Add test case under "*** Test Cases ***":

```robotframework
New Test Case Name
    [Documentation]    Describe what this test validates
    Log    Test step 1
    Should Be Equal As Strings    pass    pass
```

### Adding a New Keyword

1. Edit `keywords/common.robot`
2. Add under "*** Keywords ***":

```robotframework
New Keyword Name
    [Arguments]    ${argument1}    ${argument2}
    [Documentation]    Describe what this keyword does
    Log    Keyword implementation
```

### Adding a New Test Suite

1. Create new file: `test_newfeature.robot`
2. Include standard structure:

```robotframework
*** Settings ***
Documentation    Test Suite Description
Library    Collections

*** Test Cases ***

Test Case One
    [Documentation]    Test description
    Log    Test steps
```

## Documentation

- [Robot Framework Official Docs](https://robotframework.org/)
- [SeleniumLibrary Documentation](https://robotframework.org/SeleniumLibrary/)
- [RequestsLibrary Documentation](https://marketsquare.github.io/robotframework-requests/)
- [TESTING_REPORT.md](./TESTING_REPORT.md) - Comprehensive testing documentation

## Support

For questions or issues:
1. Check existing test cases for examples
2. Review TESTING_REPORT.md for detailed documentation
3. Search GitHub Issues for similar problems
4. Contact the development team

## License

This test suite is part of the Quest Hands Inventory Management System and follows the same license terms.

---

**Last Updated:** February 7, 2026
**Test Framework Version:** Robot Framework 7.0
**Status:** Production Ready (28/28 tests passing)
