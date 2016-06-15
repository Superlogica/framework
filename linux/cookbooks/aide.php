<?php
function aide_init(){
   put_template("aide.conf","/etc/aide/aide.conf");
   put_template("aide_hourly","/etc/cron.hourly/aide_hourly");
   exec_script("
        apt-get autoclean
        apt-get autoremove
        apt-get update
        apt-get -y install aide
        aideinit
        chmod +x /etc/cron.hourly/aide_hourly
    ");
}