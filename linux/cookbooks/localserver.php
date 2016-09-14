<?php
function localserver_init(){
    
   exec_script("
        apt-get update;
        apt-get install fail2ban;
        sudo apt-get install nginx;
        apt-get install iptables-persistent;
        iptables -A INPUT -i lo -j ACCEPT;
        iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;
        iptables -A INPUT -p tcp --dport 22 -j ACCEPT;
        iptables -A INPUT -p tcp --dport 80 -j ACCEPT;
        iptables -A INPUT -j DROP;
    ");
   
   put_template("local/jail.local","/etc/fail2ban/jail.local");
}
