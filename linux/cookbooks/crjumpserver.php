<?php
function crjumpserver_init(){
  exec_script("
    sudo cloud-init localserver;
    sudo cloud-init aide;
    

    #Diretórios e permissões

	sudo mkdir /home/configs/scripts -p;
    sudo chmod -R 777 /home/configs;
    sudo chmod -R 777 /home/configs/scripts;
	sudo -u root echo PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/configs/scripts/' > /etc/environment;

	#Criação de grupos

	addgroup infra;
    addgroup usuarios;
    addgroup subad;
	addgroup subad-admin

    #Criação de usuarios

        sudo cloud-init usuario sljumpserver infra;
        sudo cloud-init usuario jeanrodrigues infra;
        sudo cloud-init usuario marlon infra;
        sudo cloud-init usuario matheus infra;
        sudo cloud-init usuario luiscera infra;
        sudo cloud-init usuario carlos infra;
        sudo cloud-init usuario cloudserver infra;
        adduser cloudserver sudo;
        usermod -s  /bin/bash cloudserver;
        sudo cloud-init usuario adenilson.oliveira subad-admin;
        sudo cloud-init usuario bruno.reyller subad;
        sudo cloud-init usuario fabio.paixao subad;
        sudo cloud-init usuario felipe.mazzola subad-admin;

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
    put_template("scripts/deploysubadestagio","/home/configs/scripts/deploysubadestagio");

    exec_script("
    	chmod +x -R /home/configs/scripts/*;

    ");
 }
  