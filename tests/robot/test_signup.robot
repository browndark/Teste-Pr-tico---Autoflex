*** Settings ***
Library    SeleniumLibrary
Resource   ../keywords/common.robot

Suite Setup    Open Application
Suite Teardown    Close Application

*** Test Cases ***

Signup With Valid Data
    [Documentation]    Test successful signup flow
    Navigate To Sign Up
    Input Text Field    signup-name    Jane Smith
    Input Text Field    signup-email    jane@example.com
    Input Text Field    signup-password    password123
    Input Text Field    signup-confirm-password    password123
    Click Element    id=agree-terms
    Click Button By Text    Proceed to Verification
    Wait For Page Load    Verify Your Email
    Page Should Contain    A verification code has been sent to

Signup With Mismatched Passwords
    [Documentation]    Test signup fails with mismatched passwords
    Navigate To Sign Up
    Input Text Field    signup-name    Jane Smith
    Input Text Field    signup-email    jane@example.com
    Input Text Field    signup-password    password123
    Input Text Field    signup-confirm-password    wrongpassword
    Click Button By Text    Proceed to Verification
    Page Should Contain    Passwords do not match

Signup With Short Password
    [Documentation]    Test signup fails with password less than 6 characters
    Navigate To Sign Up
    Input Text Field    signup-name    Jane Smith
    Input Text Field    signup-email    jane@example.com
    Input Text Field    signup-password    pass
    Input Text Field    signup-confirm-password    pass
    Click Button By Text    Proceed to Verification
    Page Should Contain    at least 6 characters

Signup Without Accepting Terms
    [Documentation]    Test signup fails without accepting terms
    Navigate To Sign Up
    Input Text Field    signup-name    Jane Smith
    Input Text Field    signup-email    jane@example.com
    Input Text Field    signup-password    password123
    Input Text Field    signup-confirm-password    password123
    Click Button By Text    Proceed to Verification
    Page Should Contain    accept the Terms of Use

Signup Form Validation
    [Documentation]    Verify all signup form fields are present
    Navigate To Sign Up
    Page Should Contain    Create Account
    Page Should Contain    Full Name
    Page Should Contain    Corporate Email
    Page Should Contain    Password
    Page Should Contain    Confirm Password
    Page Should Contain    I accept the Terms of Use and Privacy Policy

Email Verification Code Input
    [Documentation]    Test email verification code input field
    Navigate To Sign Up
    Input Text Field    signup-name    Test User
    Input Text Field    signup-email    test@example.com
    Input Text Field    signup-password    password123
    Input Text Field    signup-confirm-password    password123
    Click Element    id=agree-terms
    Click Button By Text    Proceed to Verification
    Wait For Page Load    Enter the 6-digit code
    ${code_input}=    Get WebElement    id=verify-code
    Should Be Equal As Strings    ${code_input.get_attribute('maxlength')}    6
