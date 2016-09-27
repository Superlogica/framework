<?php
function localserver_init(){

   //Configurações básicas do servidor 
   exec_script("
        sudo apt-get install openssh-server --yes --force-yes;
        sudo apt-get install fail2ban nginx iptables-persistent --yes --force-yes;
        sudo iptables -A INPUT -i lo -j ACCEPT;
        sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;
        sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT;
        sudo iptables -A INPUT -j DROP;
    ");

   //Gera a chave RSA para o usuário root
   exec_script("
        sudo ssh-keygen -t rsa -f /root/.ssh/id_rsa -N ''; 
    ");
   
   put_template("local/jail.local","/etc/fail2ban/jail.local");
}