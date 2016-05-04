
<?php
function localserver_init(){

   exec_script("
        apt-get update
        apt-get install samba
        apt-get install vim
        apt-get install mysql-client
        apt-get install openssh-server
        apt-get install fail2ban
        sudo apt-get install nginx
        apt-get install iptables-persistent
        apt-get install sendmail
        iptables -A INPUT -i lo -j ACCEPT
        iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
        iptables -A INPUT -p tcp --dport 22 -j ACCEPT
        iptables -A INPUT -p tcp --dport 80 -j ACCEPT
        iptables -A INPUT -j DROP
        mv /etc/samba/smb.conf /etc/samba/smb.conf.original 
        mkdir /home/infra
        mkdir /home/temp
        chmod 777 -R /home/infra
        chmod 777 -R /home/temp
        mkdir /home/temp/uploads
        mkdir /home/temp/chaves
        chmod -R 777 /home/temp/uploads
        chmod -R 777 /home/temp/chaves
        addgroup infra
        addgroup usuarios
                              
	");

   put_template("local/smb.conf","/etc/samba/smb.conf");
   put_template("local/jail.local","/etc/fail2ban/jail.local");
   put_template("local/sshd_config","/etc/ssh/sshd_config");
   put_template("local/apagar-temp","/etc/cron.daily/apagar-temp");


}