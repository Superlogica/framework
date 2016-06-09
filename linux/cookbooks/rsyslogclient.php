<?php
function rsyslogclient_init($ip=''){
    
    if (!$ip){
    echo "************ ERRRRRRO00000000000000000  ***************\n";
    echo "************ Syslog incorreto ip vazio  ***************\n";
    echo "************ ERRRRRRO00000000000000000  ***************\n";
    return false;
    }
    put_template("rsyslog_client","/etc/rsyslog.d/20-superlogica.conf",array('{ip}'=>$ip));      
    exec_script('sudo service rsyslog restart');
    
}
