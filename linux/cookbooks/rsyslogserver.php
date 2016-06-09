
<?php
function rsyslogserver_init(){

          
    put_template("default_rsyslog","/etc/default/rsyslog");
    put_template("rsyslog_server","/etc/rsyslog.d/server.conf");
    exec_script("
      sudo apt-get install rsyslog
      sudo ufw allow 514
      sudo ufw allow ssh 
      sudo yes | sudo ufw enable
      sudo invoke-rc.d rsyslog restart
      sudo netstat -putan | grep 514
    ");
    
}
