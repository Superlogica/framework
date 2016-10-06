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
    
    put_template("scripts/appsdeploy","/home/configs/scripts/appsdeploy");
    put_template("scripts/deploysubad","/home/configs/scripts/deploysubad");
    put_template("scripts/estagiodeploy","/home/configs/scripts/estagiodeploy");
    put_template("scripts/isql","/home/configs/scripts/isql");
    put_template("scripts/masterdeploy","/home/configs/scripts/masterdeploy");
    put_template("scripts/novaestagio","/home/configs/scripts/novaestagio");
    put_template("scripts/suporte","/home/configs/scripts/suporte");
    put_template("scripts/upload","/home/configs/scripts/upload");
    put_template("scripts/uploadmysql","/home/configs/scripts/uploadmysql");
    put_template("scripts/conectaradmin","/home/configs/scripts/conectaradmin");
    put_template("scripts/execute","/home/configs/scripts/execute");

    exec_script("
    	chmod +x -R /home/configs/scripts/*;

    ");
 }
  