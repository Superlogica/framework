<?php
function jumpserver_init(){
  exec_script("
    sudo cloud-init localserver;
    sudo cloud-init aide;
    sudo cloud-init usuariosinfraamazon;

    #Diretórios e permissões

	sudo mkdir /home/configs/scripts -p;
	sudo -u root echo PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/configs/scripts/' > /etc/environment;

	#Criação de grupos

	addgroup infra;
	addgroup subad-admin
  ");
    
 }
