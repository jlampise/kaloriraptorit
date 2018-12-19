***setting***
Library                         SeleniumLibrary

***Test case***
Open Application
  Open Application
  Pause

# Login
#   Login With Google
#   Pause


Close Browser
  Close Browser

*** Variables ***

${startURL}                     localhost:3000
${BROWSER}                      Chrome


***Keyword***
Open Application
  Open Browser                  ${startURL}       ${BROWSER}
  Title Should Be               Kaloriraptorit

# Login With Google
#   Click Link                    partial link:Login

Pause
  Sleep                         3 secs

# Open Chrome
#     ${options}=    Evaluate   sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
#     # Call Method    ${options}    add_argument    --allow-running-insecure-content
#     # Call Method    ${options}    add_argument    --disable-web-security
#     # Call Method    ${options}    add_argument    --headless
#     # Call Method    ${options}    add_argument    --no-sandbox
#     # Call Method    ${options}    add_argument    --disable-dev-shm-usage
#     ${options.add_argument}=    Set Variable     --user-data-dir\=/home/jlampfise/.config/chro
#     # Call Method    ${options}    add_argument    --user-data-dir\=/home/jlampise/.config/chromium/
#     Create WebDriver    ${BROWSER}    chrome_options=${options}
#     Go To    ${startURL}
