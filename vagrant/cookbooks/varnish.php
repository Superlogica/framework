<?php

function varnish_init(){


exec_script("
	sudo apt-get -y install varnish  
	sudo rm  /etc/default/varnish  
	put_template('etc-default-varnish','/etc/default/varnish');
	sudo rm /etc/varnish/default.vcl
	sudo ln -s /home/cloud/conf/varnish_sem_redirec_cron.conf /etc/varnish/default.vcl
	sudo rm  /etc/apache2/ports.conf  
	put_template('apache-port-8080.conf','/etc/apache2/ports.conf');	
");

put_template("hhvm_proxy_fcgi.conf", "/etc/apache2/mods-available/hhvm_proxy_fcgi.conf");

}
