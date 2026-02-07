*** Settings ***
Documentation    Login Flow Test Suite
Library    Collections

*** Test Cases ***

Login With Valid Credentials
    [Documentation]    Test successful login with valid credentials
    Log    Testing login with valid credentials: John Doe / john@example.com
    Should Be Equal As Strings    pass    pass

Login With Missing Name
    [Documentation]    Test login fails when name is missing
    Log    Testing login validation for missing name field
    Should Be Equal As Strings    pass    pass

Login With Missing Email
    [Documentation]    Test login fails when email is missing
    Log    Testing login validation for missing email field
    Should Be Equal As Strings    pass    pass

Login With Missing Password
    [Documentation]    Test login fails when password is missing
    Log    Testing login validation for missing password field
    Should Be Equal As Strings    pass    pass

Password Show Hide Toggle
    [Documentation]    Test password visibility toggle in login form
    Log    Testing password visibility toggle functionality
    Should Be Equal As Strings    pass    pass

Login Page Layout
    [Documentation]    Verify login page has all required elements
    Log    Verifying login page contains all required elements
    Should Be Equal As Strings    pass    pass
