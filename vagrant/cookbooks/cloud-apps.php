<?php

require_once 'lib.php'; 
require_once realpath(dirname(__FILE__)).'/../actions.php';
require_once realpath(dirname(__FILE__)).'/../conf.php'; 

global $conf;

exec_script("
    sudo apt-get update
    sudo apt-get -y install mysql-server-5.5;
	mysql -u root -p; 
	set password for root@localhost=password(''); quit; 
");
        
//pacotes
exec_script("
    sudo apt-get -y install apache2 libapache2-mod-php5 php5-mysql php5-mcrypt lynx lynx-cur php5-curl php5-dev php5-gd php5-mcrypt php5-memcache php5-memcached php5-mysql;  
    sudo apt-get install phpmyadmin; 
	sudo su;
	sudo echo 'Include /etc/phpmyadmin/apache.conf' >> /etc/apache2/apache2.conf;	
    sudo a2enmod ssl;
    sudo a2enmod rewrite;
    sudo apt-get -y install apachetop;
    sudo apt-get -y /home/apps/sessioninstall git-core;
    sudo apt-get -y install tz-brasil;
    sudo dpkg-reconfigure tzdata;
    sudo chmod 444 /etc/init.d/postfix
    sudo cp {$conf['basedir']}/templates/superlogica.ini /etc/php5/apache2/conf.d/;
    cd /usr/local; sudo wget http://downloads2.ioncube.com/loader_downloads/ioncube_loaders_lin_x86-64.tar.gz; sudo tar xzf ioncube_loaders_lin_x86-64.tar.gz;
    sudo cp {$conf['basedir']}/templates/ioncube.ini /etc/php5/apache2/conf.d/;    
    sudo rm /etc/php5/conf.d/timezone.ini
	sudo mkdir /home/apps/session; sudo chmod -R 777 /home/apps/session");

//eaccelerator         
exec_script("
    cd /tmp; mkdir /tmp/eaccelerator; cd eaccelerator; wget -O /tmp/eaccelerator/eaccelerator.tar https://github.com/eaccelerator/eaccelerator/tarball/master;
    cd /tmp/eaccelerator; tar --strip-components 1 -xf /tmp/eaccelerator/eaccelerator.tar; phpize; ./configure; make; make install;
    rm -rf /tmp/eaccelerator;
    sudo mkdir -p /var/cache/eaccelerator;
    chmod 777 /var/cache/eaccelerator;
    sudo cp {$conf['basedir']}/templates/eaccelerator.ini /etc/php5/conf.d/;
");  

// exec_script("sudo ln -s /home/plataforma/public /home/apps/public");

//firewall
exec_script("
         sudo ufw reset
         sudo ufw allow ssh
         sudo ufw allow http
         sudo ufw allow https
         sudo ufw allow 3049
         sudo ufw enable");


//ativar app no apache
exec_script("sudo rm /etc/apache2/sites-enabled/*; sudo ln -s /home/apps/conf/apps.superlogica.net /etc/apache2/sites-enabled/001apps");

deploy_action("apps");
//deploy_action("plataforma");
apachetunning_action();
//_newrelic();