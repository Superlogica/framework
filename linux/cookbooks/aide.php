<?php
function aide_init(){
   put_template("aide.conf","/etc/aide/aide.conf");
   exec_script("
        apt-get autoclean
        apt-get autoremove
        apt-get update
        apt-get -y install aide
        aideinit

    ");
}