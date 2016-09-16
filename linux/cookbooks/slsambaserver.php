<?php
function slsambaserver_init(){
	//Configurações do servidor samba
	put_template("local/seguranca","/etc/cron.daily/seguranca");

	exec_script("
		#Instalação e configuração

		sudo apt-get install samba --yes --force-yes;
		sudo apt-get install openssh-server --yes --force-yes;
		mv /etc/samba/smb.conf /etc/samba/smb.conf.original;

		#Diretórios e permissões

		sudo mkdir /home/configs/scripts -p;
		sudo mkdir /home/infra;
		sudo mkdir /home/temp;
		sudo mkdir /home/uploads;
		sudo mkdir /home/chaves;
		sudo mkdir /home/programas;
		sudo chmod -R 770 /home/configs;
		sudo chmod -R 770 /home/configs/scripts;
		sudo chmod -R 770 /home/infra;
		sudo chmod -R 777 /home/temp;
		sudo chmod -R 777 /home/uploads;
		sudo chmod -R 770 /home/chaves;
		sudo chmod -R 775 /home/programas;
		sudo chmod +x /etc/cron.daily/seguranca;
		sudo -u root echo 'export PATH=/home/configs/scripts/:\$PATH' >> /etc/profile;

		sudo cloud-init localserver;
		
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
