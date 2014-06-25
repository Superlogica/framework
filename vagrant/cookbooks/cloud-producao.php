<?php

require_once 'lib.php'; 
require_once realpath(dirname(__FILE__)).'/../actions.php';
require_once realpath(dirname(__FILE__)).'/../conf.php'; 

global $conf;

if (is_file("/home/ubuntu/fb25.lock")){
   exec_script("sudo add-apt-repository ppa:ondrej/php5-oldstable
        sudo apt-get update");
   $fb_ver = "2.5" ;
} else{
   $fb_ver = "2.1" ;
}
//pacotes
exec_script("
    sudo apt-get update
    sudo apt-get -y install apache2 libapache2-mod-php5 php5-mysql php5-mcrypt lynx lynx-cur php5-curl php5-dev php5-gd php5-mcrypt php5-memcache php5-memcached php5-mysql 
    sudo a2enmod ssl
    sudo a2enmod rewrite
    sudo apt-get -y install apachetop
    sudo apt-get -y install firebird$fb_ver-super subversion git-core php5-interbase
    sudo dpkg-reconfigure -fff firebird2.1-super; 
    sudo cp {$conf['basedir']}/firebird/*.so /usr/lib/firebird/$fb_ver/UDF
    sudo apt-get -y install tz-brasil
    sudo dpkg-reconfigure tzdata
    sudo chmod 444 /etc/init.d/postfix
    sudo rm /etc/php5/conf.d/timezone.ini");
//eaccelerator         
exec_script("sudo apt-get install make;
	cd /tmp; mkdir /tmp/eaccelerator; cd eaccelerator; wget -O /tmp/eaccelerator/eaccelerator.tar https://github.com/eaccelerator/eaccelerator/tarball/master;
	cd /tmp/eaccelerator; tar --strip-components 1 -xf /tmp/eaccelerator/eaccelerator.tar; phpize; ./configure; make; make install;
    rm -rf /tmp/eaccelerator;
    sudo mkdir -p /var/cache/eaccelerator;
    chmod 777 /var/cache/eaccelerator;
    sudo cp {$conf['basedir']}/templates/eaccelerator.ini /etc/php5/conf.d/;
");  
//git clone
//exec_script("cd /home; sudo git clone git@github.com:Superlogica/cloud.git"); 
//firewall
exec_script("
         sudo ufw reset
         sudo ufw allow ssh
         sudo ufw allow http
         sudo ufw allow https
         sudo ufw enable");

//cloud.lock
@unlink("/home/cloud/cloud.lock");

//ativar app no apache
exec_script("sudo rm /etc/apache2/sites-enabled/*; sudo ln -s /home/cloud/conf/cloud.superlogica.com /etc/apache2/sites-enabled/001cloud");
deploy_action("cloud");
atualizarCloudIni_action();
apachetunning_action();
phpiniupdate_action();
//_newrelic();
