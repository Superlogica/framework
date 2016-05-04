
<?php
function localserver_init(){

   exec_script("
        apt-get update
        apt-get install samba
        apt-get install vim
        apt-get install mysql-client
        apt-get install openssh-server
        apt-get install fail2ban
        apt-get install iptables-persistent
        iptables -A INPUT -i lo -j ACCEPT
        iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
        iptables -A INPUT -p tcp --dport 22 -j ACCEPT
        iptables -A INPUT -p tcp --dport 80 -j ACCEPT
        iptables -A INPUT -j DROP
        mv /etc/samba/smb.conf /etc/samba/smb.conf.original 
        mkdir /home/ubuntu/infra
        mkdir /home/ubuntu/temp
        addgroup infra
        addgroup usuarios
        chmod 777 -R /home/ubuntu/infra
        chmod 777 -R /home/ubuntu/temp
                              
	");

   put_template("local/smb.conf","/etc/samba/smb.conf");
   put_template("local/jail.local","/etc/fail2ban/jail.local");
   put_template("local/sshd_config","/etc/ssh/sshd_config");
   put_template("local/apagar-temp","/etc/cron.daily/apagar-temp");


}