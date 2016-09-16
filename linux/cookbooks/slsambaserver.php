<?php
function slsambaserver_init(){
	//Configurações do servidor samba
	put_template("local/seguranca","/etc/cron.daily/seguranca");

	exec_script("
		#Instalação e configuração

		sudo /opt/cloud-init/cloud-init-init localserver;
		sudo apt-get install samba;
		sudo apt-get install openssh-server;
		mv /etc/samba/smb.conf /etc/samba/smb.conf.original;

		#Diretórios e permissões

		mkdir /home/configs/scripts -p;
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
		sudo -u root echo 'export PATH=/home/configs/scripts/:$PATH' >> /etc/profile;
		
		#Criação de grupos

		addgroup infra;
		addgroup usuarios;
		addgroup dev;
		addgroup dev-admin;
		addgroup suporte;
		addgroup suporte-admin;
				
		#Criação de usuarios

		sudo cloud-init usuario emersonrodrigues;
		sudo cloud-init usuario jeanrodrigues infra;
		sudo cloud-init usuario marcos;
		sudo cloud-init usuario matheus;
        
    ");

    put_template("local/smb.conf","/etc/samba/smb.conf");
    put_template("local/sshd_config","/etc/ssh/sshd_config");

}
