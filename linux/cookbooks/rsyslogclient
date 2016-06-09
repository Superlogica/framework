<?php
function rsyslogclient_init($ip=''){
    
    if (!$ip){
    
    echo "************ Syslog incorreto ip vazio  ***************";
    
    }
          
    exec_script('echo "*.*  @'.$ip.':514" > /etc/rsyslog.d/20-superlogica.conf 
                service rsyslog restart');
    
}
