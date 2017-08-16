cmd.exe /c nssm stop "Aricent Video Telephony Connection Server"
cmd.exe /c nssm stop "Aricent Video Telephony Agent Server"
cmd.exe /c nssm stop "Aricent Video Telephony Signaling Server"
cmd.exe /c nssm remove "Aricent Video Telephony Connection Server" confirm
cmd.exe /c nssm remove "Aricent Video Telephony Agent Server"  confirm
cmd.exe /c nssm remove "Aricent Video Telephony Signaling Server"  confirm

::Serach of node_modules installed path
Set node_modulesdir="%~dp0node_modules" 

IF EXIST %node_modulesdir% (
echo %node_modulesdir% exists.
cmd.exe /c rmdir /S /Q node_modules  
)

