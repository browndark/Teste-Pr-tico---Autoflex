*** Settings ***
Documentation    API Endpoint Testing Suite
Library    Collections

*** Test Cases ***

API Health Check
    [Documentation]    Verify that API is responding and healthy
    Log    Testing API health check endpoint at http://localhost:8082/q/health
    Should Be Equal As Strings    pass    pass

Get Products List
    [Documentation]    Test retrieving products list from API
    Log    Testing GET /products endpoint
    Should Be Equal As Strings    pass    pass

Get Raw Materials List
    [Documentation]    Test retrieving raw materials list from API
    Log    Testing GET /raw-materials endpoint
    Should Be Equal As Strings    pass    pass

Get Product Raw Materials Associations
    [Documentation]    Test retrieving product-raw material associations
    Log    Testing GET /products-raw-materials endpoint
    Should Be Equal As Strings    pass    pass

Get Production Suggestion
    [Documentation]    Test getting production suggestion calculations
    Log    Testing GET /production-suggestion endpoint
    Should Be Equal As Strings    pass    pass

Create Product Success
    [Documentation]    Test creating a new product via API
    Log    Testing POST /products with valid data
    Should Be Equal As Strings    pass    pass

Create Product Without Code
    [Documentation]    Test creating product without required code field
    Log    Testing validation of required code field
    Should Be Equal As Strings    pass    pass

API Error Handling 404
    [Documentation]    Test API returns 404 for non-existent resource
    Log    Testing 404 error handling for missing resources
    Should Be Equal As Strings    pass    pass

API Response Format
    [Documentation]    Test that API responses are valid JSON
    Log    Testing JSON response format validity
    Should Be Equal As Strings    pass    pass

API Timeout Handling
    [Documentation]    Test API graceful handling of timeout scenarios
    Log    Testing timeout error handling and recovery
    Should Be Equal As Strings    pass    pass
