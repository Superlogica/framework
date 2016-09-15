<?php
function sambaserver_init(){
	//Configura��es do servidor samba
	put_template("local/seguranca","/etc/cron.daily/seguranca");

	exec_script("
		#Instala��o e configura��o

		sudo cloud-init localserver;
		apt-get update && apt-get upgrade;
		apt-get install samba;
		apt-get install openssh-server;
		mv /etc/samba/smb.conf /etc/samba/smb.conf.original;

		#Diret�rios e permiss�es

		mkdir /home/configs;
		mkdir /home/configs/scripts;
		mkdir /home/infra;
		mkdir /home/temp;
		mkdir /home/uploads;
		mkdir /home/chaves;
		mkdir /home/programas;
		chmod -R 770 /home/configs;
		chmod -R 770 /home/configs/scripts;
		chmod -R 770 /home/infra;
		chmod -R 777 /home/temp;
		chmod -R 777 /home/uploads;
		chmod -R 770 /home/chaves;
		chmod -R 775 /home/programas;
		chmod +x /etc/cron.daily/seguranca;
		echo "export PATH=/home/configs/scripts/$PATH" >> /etc/profile;
		
		#Cria��o de grupos

		addgroup infra;
		addgroup usuarios;
		addgroup dev;
		addgroup dev-admin;
		addgroup suporte;
		addgroup suporte-admin;
		
		
		#Cria��o de usuarios

		sudo cloud-init usuario emersonrodrigues;
		sudo cloud-init usuario jeanrodrigues infra;
		sudo cloud-init usuario marcos;
		sudo cloud-init usuario matheus;
        
    ");

    put_template("local/smb.conf","/etc/samba/smb.conf");
    put_template("local/sshd_config","/etc/ssh/sshd_config");
    
}
