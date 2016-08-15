<?php
function smbpcipwd_init(){
exec_script("
sudo pdbedit -i smbpasswd -e tdbsam
sudo pdbedit -P 'maximum password age' -C 7776000
sudo pdbedit -P 'min password length' -C 8
sudo pdbedit -P 'password history' -C 4
sudo pdbedit -P 'bad lockout attempt' -C 3
sudo pdbedit -P 'lockout duration' -C 900

");
}
