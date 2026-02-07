*** Settings ***
Library    RequestsLibrary
Library    Collections

*** Variables ***
${BASE_URL}    http://localhost:8082
${API_TIMEOUT}    5

*** Keywords ***

Create API Session
    [Documentation]    Create HTTP session for API testing
    Create Session    api    ${BASE_URL}    timeout=${API_TIMEOUT}

Close API Session
    [Documentation]    Close the API session
    Delete All Sessions

*** Test Cases ***

API Health Check
    [Documentation]    Test that the API is responding
    Create API Session
    ${response}=    Get Request    api    /q/health
    Should Be Equal As Numbers    ${response.status_code}    200
    Close API Session

Get Products List
    [Documentation]    Test retrieving products list
    Create API Session
    ${response}=    Get Request    api    /products
    Should Be Equal As Numbers    ${response.status_code}    200
    Close API Session

Get Raw Materials List
    [Documentation]    Test retrieving raw materials list
    Create API Session
    ${response}=    Get Request    api    /raw-materials
    Should Be Equal As Numbers    ${response.status_code}    200
    Close API Session

Get Product Raw Materials Associations
    [Documentation]    Test retrieving product-raw material associations
    Create API Session
    ${response}=    Get Request    api    /products-raw-materials
    Should Be Equal As Numbers    ${response.status_code}    200
    Close API Session

Get Production Suggestion
    [Documentation]    Test getting production suggestion
    Create API Session
    ${response}=    Get Request    api    /production-suggestion
    Should Be Equal As Numbers    ${response.status_code}    200
    Close API Session

Create Product Success
    [Documentation]    Test creating a new product via API
    Create API Session
    ${product_data}=    Create Dictionary    code=ROBOT_TEST_001    name=Test Product    price=99.99    quantity=10
    ${response}=    Post Request    api    /products    json=${product_data}
    Should Be Equal As Numbers    ${response.status_code}    200
    Close API Session

Create Product Without Code
    [Documentation]    Test creating product without code field
    Create API Session
    ${product_data}=    Create Dictionary    name=Test Product    price=99.99
    ${response}=    Post Request    api    /products    json=${product_data}
    Should Be Equal As Numbers    ${response.status_code}    400
    Close API Session

API Error Handling 404
    [Documentation]    Test API returns 404 for non-existent resource
    Create API Session
    ${response}=    Get Request    api    /products/99999    expect_errors=true
    Should Be Equal As Numbers    ${response.status_code}    404
    Close API Session

API Response Format
    [Documentation]    Test API response is valid JSON
    Create API Session
    ${response}=    Get Request    api    /products
    Should Be Equal As Numbers    ${response.status_code}    200
    ${response_json}=    Convert To List    ${response.json()}
    Should Be A List    ${response_json}
    Close API Session

API Timeout Handling
    [Documentation]    Test API request timeout behavior
    Create API Session
    ${response}=    Get Request    api    /products    timeout=0.001    expect_errors=true
    Should Not Be Equal As Numbers    ${response.status_code}    200
    Close API Session
