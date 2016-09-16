<?php
function localserver_init(){
    
   exec_script("
        sudo apt-get install fail2ban;
        sudo apt-get install nginx;
        sudo apt-get install iptables-persistent;
        sudo iptables -A INPUT -i lo -j ACCEPT;
        sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;
        sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT;
        sudo iptables -A INPUT -j DROP;
    ");
   
   put_template("local/jail.local","/etc/fail2ban/jail.local");
}
