*** Keywords ***

Open Application
    [Documentation]    Open the inventory management application in browser
    Open Browser    http://localhost:3000    chrome
    Maximize Browser Window
    Wait Until Page Contains    Login    timeout=10s

Close Application
    [Documentation]    Close the application and browser
    Close Browser

Wait For Page Load
    [Arguments]    ${text}    ${timeout}=10s
    [Documentation]    Wait for specific text to appear on page
    Wait Until Page Contains    ${text}    timeout=${timeout}

Click Button By Text
    [Arguments]    ${button_text}
    [Documentation]    Click a button by visible text
    Click Button    xpath=//button[contains(text(), '${button_text}')]

Input Text Field
    [Arguments]    ${field_id}    ${text}
    [Documentation]    Input text into a field by ID
    Input Text    id=${field_id}    ${text}

Get Error Message
    [Documentation]    Get the current error message displayed
    ${error}=    Get Text    xpath=//div[contains(@style, 'rgba(239, 68, 68')]
    RETURN    ${error}

Navigate To Login
    [Documentation]    Navigate to login tab
    Click Button By Text    Login

Navigate To Sign Up
    [Documentation]    Navigate to sign up tab
    Click Button By Text    Sign Up

Navigate To Password Recovery
    [Documentation]    Navigate to password recovery tab
    Click Button By Text    Password Recovery

Check Page Contains Element
    [Arguments]    ${element_text}
    [Documentation]    Verify that page contains specific element
    Page Should Contain    ${element_text}
