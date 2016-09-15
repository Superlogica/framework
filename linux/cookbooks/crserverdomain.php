<?php
function crserverdomain_init(){
  exec_script("
    sudo cloud-init localserver;
    apt-get install samba;
	apt-get install openssh-server;
    sudo cloud-init smbpcipwd;
    mv /etc/samba/smb.conf /etc/samba/smb.conf.original;
    
  ");
                              
	
 put_template("local/smb-cr.conf","/etc/samba/smb.conf");
 put_template("local/sshd_config","/etc/ssh/sshd_config");
    
 }
