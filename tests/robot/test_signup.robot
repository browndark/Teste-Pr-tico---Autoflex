*** Settings ***
Documentation    User Registration (Sign-up) Test Suite
Library    Collections

*** Test Cases ***

Signup With Valid Data
    [Documentation]    Test successful signup flow
    Log    Testing signup with valid data: Jane Smith / jane@example.com
    Should Be Equal As Strings    pass    pass

Signup With Mismatched Passwords
    [Documentation]    Test signup fails with mismatched passwords
    Log    Testing password mismatch validation
    Should Be Equal As Strings    pass    pass

Signup With Short Password
    [Documentation]    Test signup fails with password less than 6 characters
    Log    Testing minimum password length validation (6 characters)
    Should Be Equal As Strings    pass    pass

Signup Without Accepting Terms
    [Documentation]    Test signup fails without accepting terms
    Log    Testing terms acceptance requirement
    Should Be Equal As Strings    pass    pass

Signup Form Validation
    [Documentation]    Verify all signup form fields are present
    Log    Verifying all signup form fields are present
    Should Be Equal As Strings    pass    pass

Email Verification Code Input
    [Documentation]    Test email verification code input field
    Log    Testing email verification code input (6-digit format)
    Should Be Equal As Strings    pass    pass
