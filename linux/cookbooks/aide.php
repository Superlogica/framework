<?php
function localserver_init(){
   exec_script("
        apt-get autoclean
        apt-get autoremove
        apt-get update
        apt-get -y install aide
    ");
   put_template("aide.conf","/etc/aide/aide.conf");
}