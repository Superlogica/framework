<?php
function sambaserver_init(){
	
	put_template("local/apagar-temp","/etc/cron.daily/apagar-temp");

	exec_script("
		sudo cloud-init localserver;
		mv /etc/samba/smb.conf /etc/samba/smb.conf.original; 
		mkdir /samba;
		mkdir /samba/infra;
		mkdir /samba/temp;
		mkdir /samba/uploads;
		mkdir /samba/chaves;
		mkdir /samba/install;
		chmod 777 -R /samba/infra;
		chmod 777 -R /samba/temp;
		chmod -R 777 /samba/uploads;
		chmod -R 777 /samba/chaves;
		chmod -R 777 /samba/install;
		chmod +x /etc/cron.daily/apagar-temp
		addgroup infra;
		addgroup usuarios;
		addgroup dev;
		addgroup dev-admin;
		addgroup suporte;
		addgroup suporte-admin;
        
    ");

    put_template("local/smb.conf","/etc/samba/smb.conf");
    put_template("local/sshd_config","/etc/ssh/sshd_config");
}
