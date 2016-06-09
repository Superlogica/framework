<?php
function rsyslogclient_init($ip=''){
    
    if (!$ip){
    echo "************ ERRRRRRO00000000000000000  ***************";
    echo "************ Syslog incorreto ip vazio  ***************";
    echo "************ ERRRRRRO00000000000000000  ***************";
    return false;
    }
          
    exec_script('
    sudo rm /etc/rsyslog.d/20-superlogica.conf
    echo "*.*  @'.$ip.':514" > /etc/rsyslog.d/20-superlogica.conf 
                service rsyslog restart');
    
}
