<?php
function smbpcipwd_init(){
exec_script("
sudo samba-tool domain passwordsettings set –max-pwd-age=90
sudo samba-tool domain passwordsettings set --min-pwd-length=8
sudo samba-tool domain passwordsettings set --history-length=4
");

