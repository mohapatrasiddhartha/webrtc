cmd.exe /c npm install querystring
cmd.exe /c npm install websocket
cmd.exe /c npm install mysql
::cmd.exe /c npm install rtcmulticonnection

::Serach of Node JS installed path
Set Reg.Key=HKEY_CURRENT_USER\Software\Node.js
Set Reg.Val=InstallPath
For /F "Tokens=2*" %%A In ('Reg Query "%Reg.Key%" /v "%Reg.Val%" ^| Find /I "%Reg.Val%"' ) Do Call Set nodedir=%%B
echo %nodedir%

::Aricent Video Telephony Signaling Service
nssm install "Aricent Video Telephony Signaling Server" "%nodedir%node.exe" "\"%~dp0signalingserver.js\""
nssm set "Aricent Video Telephony Signaling Server" AppDirectory %~dp0
nssm set "Aricent Video Telephony Signaling Server" Description "Aricent Video Telephony Signaling Service"
nssm set "Aricent Video Telephony Signaling Server" DependOnService MySQL

sc failure "Aricent Video Telephony Signaling Server" reset= 180 actions= restart/180

::Aricent Video Telephony Agent Service
nssm install "Aricent Video Telephony Agent Server" "%nodedir%node.exe" "\"%~dp0agentservice.js\""
nssm set "Aricent Video Telephony Agent Server" AppDirectory %~dp0
nssm set "Aricent Video Telephony Agent Server" Description "Aricent Video Telephony Agent Service"
nssm set "Aricent Video Telephony Agent Server" DependOnService "Aricent Video Telephony Signaling Server"
sc failure "Aricent Video Telephony Agent Server" reset= 180 actions= restart/180

::Aricent Video Telephony Connection Service
nssm install "Aricent Video Telephony Connection Server" "%nodedir%node.exe" "\"%~dp0connectionservice.js\""
nssm set "Aricent Video Telephony Connection Server" AppDirectory %~dp0
nssm set "Aricent Video Telephony Connection Server" Description "Aricent Video Telephony Connection Service"
nssm set "Aricent Video Telephony Connection Server" DependOnService "Aricent Video Telephony Agent Server"

sc failure "Aricent Video Telephony Connection Server" reset= 180 actions= restart/180
cmd.exe /c sc start "Aricent Video Telephony Connection Server"


