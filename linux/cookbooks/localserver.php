<?php
function localserver_init(){

   //Configurações básicas do servidor 
   exec_script("
        sudo apt-get install openssh-server --yes --force-yes;
        sudo cloud-init fail2ban instalar;
        sudo iptables -A INPUT -i lo -j ACCEPT;
        sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;
        sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT;
        sudo iptables -A INPUT -j DROP;
    ");

   //Gera a chave RSA para o usuário root
   exec_script("
        sudo ssh-keygen -t rsa -f /root/.ssh/id_rsa -N ''; 
    ");
   
   //Instalação do Clamav
   exec_script("
      sudo apt-get install clamav clamav-daemon -y;
      sudo touch /var/lib/clamav/clamd-socket;
      sudo chmod 755 /var/log/clamav;
      sudo rm -r /var/log/clamav/freshclam.log;
      sudo freshclam -v;
   ");
   
}
