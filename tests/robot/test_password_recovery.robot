*** Settings ***
Library    SeleniumLibrary
Resource   ../keywords/common.robot

Suite Setup    Open Application
Suite Teardown    Close Application

*** Test Cases ***

Access Password Recovery From Login
    [Documentation]    Test accessing password recovery from login page
    Navigate To Login
    Click Link    xpath=//a[contains(text(), 'Forgot your password?')]
    Page Should Contain    Reset Password

Password Recovery With Valid Email
    [Documentation]    Test password recovery with valid email
    Navigate To Password Recovery
    Input Text Field    recovery-email    user@example.com
    Click Button By Text    Send Recovery Email
    Page Should Contain    Check your email

Password Recovery Form Validation
    [Documentation]    Verify password recovery form has all required elements
    Navigate To Password Recovery
    Page Should Contain    Reset Password
    Page Should Contain    Enter your corporate email
    Page Should Contain    Send Recovery Email
    Page Should Contain    Back to Login

Password Recovery Empty Email
    [Documentation]    Test password recovery with empty email field
    Navigate To Password Recovery
    Click Button By Text    Send Recovery Email
    Page Should Contain Element    xpath=//input[@id='recovery-email'][contains(@required, 'required')]

Password Recovery Page Layout
    [Documentation]    Verify password recovery page layout and structure
    Navigate To Password Recovery
    Page Should Contain    Reset Password
    Page Should Contain    Enter your corporate email and we will send you instructions
    Page Should Contain    Send Recovery Email
    Page Should Contain    Back to Login

Back To Login Navigation
    [Documentation]    Test navigating back to login from password recovery
    Navigate To Password Recovery
    Click Button By Text    Back to Login
    Page Should Contain    System Access
    Page Should Contain    Full Name
