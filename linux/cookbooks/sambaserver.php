<?php
function sambaserver_init(){
	
	put_template("local/apagar-temp","/etc/cron.daily/seguranca");

	exec_script("
		sudo cloud-init localserver;
		mv /etc/samba/smb.conf /etc/samba/smb.conf.original; 
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
		addgroup infra;
		addgroup usuarios;
		addgroup dev;
		addgroup dev-admin;
		addgroup suporte;
		addgroup suporte-admin;
		echo "export PATH=/samba/configs/scripts/$PATH" >> /etc/profile;
        
    ");

    put_template("local/smb.conf","/etc/samba/smb.conf");
    put_template("local/sshd_config","/etc/ssh/sshd_config");
}
