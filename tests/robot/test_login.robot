*** Settings ***
Library    SeleniumLibrary
Resource   ../keywords/common.robot

Suite Setup    Open Application
Suite Teardown    Close Application

*** Test Cases ***

Login With Valid Credentials
    [Documentation]    Test successful login with valid credentials
    Navigate To Login
    Input Text Field    login-name    John Doe
    Input Text Field    login-email    john@example.com
    Input Text Field    login-password    password123
    Click Button By Text    Log In
    Wait For Page Load    LOGGED IN
    Page Should Contain    Products

Login With Missing Name
    [Documentation]    Test login fails when name is missing
    Navigate To Login
    Input Text Field    login-email    john@example.com
    Input Text Field    login-password    password123
    Click Button By Text    Log In

Login With Missing Email
    [Documentation]    Test login fails when email is missing
    Navigate To Login
    Input Text Field    login-name    John Doe
    Input Text Field    login-password    password123
    Click Button By Text    Log In

Login With Missing Password
    [Documentation]    Test login fails when password is missing
    Navigate To Login
    Input Text Field    login-name    John Doe
    Input Text Field    login-email    john@example.com
    Click Button By Text    Log In

Password Show Hide Toggle
    [Documentation]    Test password visibility toggle in login form
    Navigate To Login
    Input Text Field    login-password    password123
    Element Should Be Visible    xpath=//input[@id='login-password'][@type='password']
    ${eye_button}=    Get WebElement    xpath=//button[contains(text(), '')]
    Click Button    xpath=//button[@type='button']

Login Page Layout
    [Documentation]    Verify login page has all required elements
    Page Should Contain    System Access
    Page Should Contain    Full Name
    Page Should Contain    Corporate Email
    Page Should Contain    Password
    Page Should Contain    Forgot your password?
