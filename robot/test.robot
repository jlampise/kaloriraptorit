***setting***
Library                         SeleniumLibrary

***Test case***
Open Application
  Open Application

Register
  Go to Register Form
  Add new User

Login
  Go to Login Form
  Login with Username and Password

Logout
  Logout

Close Browser
  Close Browser

*** Variables ***

${startURL}                     localhost:3000
${BROWSER}                      Chrome
${USERNAME}                     Testuser
${PASSWORD}                     Testuser

***Keyword***
Open Application
  Open Browser                  ${startURL}           ${BROWSER}
  Title Should Be               Kaloriraptorit

Go to Register Form
  Click Link                    partial link:Register

Add new User
  Input Text                    name:username         ${USERNAME}
  Input Text                    name:password         ${PASSWORD}
  Click Button                  class:btn
# Login With Google
#   Click Link                    partial link:Login


Go to Login Form
  Click Link                    partial link:Login

Login with Username and Password
  Input Text                    name:username         ${USERNAME}
  Input Text                    name:password         ${PASSWORD}
  Click Button                  class:btn

Logout
  Click Link                    partial link:Logout

Pause
  Sleep                         1.5 secs
