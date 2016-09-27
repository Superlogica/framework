<?php
function sljumpserver_init(){
	//Configura��es do servidor samba
	put_template("local/seguranca","/etc/cron.daily/seguranca");

	exec_script("
		#Instala��o e configura��o

		sudo apt-get install samba --yes --force-yes;
		mv /etc/samba/smb.conf /etc/samba/smb.conf.original;

		#Diret�rios e permiss�es

		sudo mkdir /home/configs/scripts -p;
		sudo mkdir /home/infra;
		sudo mkdir /home/temp/uploads -p;
		sudo mkdir /home/chaves;
		sudo mkdir /home/programas;
		sudo chmod -R 777 /home/configs;
		sudo chmod -R 777 /home/configs/scripts;
		sudo chmod -R 770 /home/infra;
		sudo chmod -R 777 /home/temp;
		sudo chmod -R 777 /home/temp/uploads;
		sudo chmod -R 770 /home/chaves;
		sudo chmod -R 775 /home/programas;
		sudo chmod +x /etc/cron.daily/seguranca;
		sudo -u root echo PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/configs/scripts/' > /etc/environment;

		sudo cloud-init localserver;
		
		#Cria��o de grupos

		addgroup infra;
		addgroup usuarios;
		addgroup dev;
		addgroup dev-admin;
		addgroup suporte-admin;
		addgroup subad-admin
				
		#Cria��o de usuarios

		sudo cloud-init usuario emersonrodrigues;
		sudo cloud-init usuario jeanrodrigues infra;
		sudo cloud-init usuario matheus;
        
    ");

    put_template("local/smb.conf","/etc/samba/smb.conf");
    put_template("local/sshd_config","/etc/ssh/sshd_config");
    put_template("scripts/appsdeploy","/home/configs/scripts/appsdeploy");
    put_template("scripts/conectarappsmaster","/home/configs/scripts/conectarappsmaster");
    put_template("scripts/conectarappsestagio","/home/configs/scripts/conectarappsestagio");
    put_template("scripts/conectarsubadmaster","/home/configs/scripts/conectarsubadmaster");
    put_template("scripts/deploysubad","/home/configs/scripts/deploysubad");
    put_template("scripts/estagiodeploy","/home/configs/scripts/estagiodeploy");
    put_template("scripts/isql","/home/configs/scripts/isql");
    put_template("scripts/masterdeploy","/home/configs/scripts/masterdeploy");
    put_template("scripts/novaestagio","/home/configs/scripts/novaestagio");
    put_template("scripts/suporte","/home/configs/scripts/suporte");
    put_template("scripts/upload","/home/configs/scripts/upload");
    put_template("scripts/uploadmysql","/home/configs/scripts/uploadmysql");
    put_template("scripts/execute","/home/configs/scripts/execute");

    exec_script("
    	chmod +x -R /home/configs/scripts/*;

    ");

}
