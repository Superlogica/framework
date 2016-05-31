<?php
function crserver_init(){
   exec_script("
        apt-get update
        apt-get install samba
        apt-get install vim
        apt-get install openssh-server
        apt-get install openssh-client
        apt-get install fail2ban
        apt-get install iptables-persistent
        iptables -A INPUT -i lo -j ACCEPT
        iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
        iptables -A INPUT -p tcp --dport 22 -j ACCEPT
        iptables -A INPUT -j DROP
        mv /etc/samba/smb.conf /etc/samba/smb.conf.original 
                              
	");
   put_template("local/smb-cr.conf","/etc/samba/smb.conf");
   put_template("local/jail.local","/etc/fail2ban/jail.local");
   put_template("local/sshd_config","/etc/ssh/sshd_config");
   
   }
