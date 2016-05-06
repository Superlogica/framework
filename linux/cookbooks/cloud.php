<?php

function cloud_init($php_version="auto"){

if  ($php_version=="auto"){
  if ( trim(shell_exec ("lsb_release -rs")) == '16.04' ){
	 $php_version= '7.0';	
  } else{
  	$php_version= '5.5';	
  }
}
if ($php_version=="5.4"){
	exec_script("sudo cloud-init php54atualizado");
	instalar_php5();
}

if ($php_version=="5.5"){
	exec_script(" sudo add-apt-repository ppa:ondrej/php5");
	instalar_php5();
 
} 


if ($php_version=='7.0'){
  	instalar_php7();	
} 

//pacotes
exec_script("
    sudo a2enmod ssl
    sudo php5enmod mcrypt
    sudo a2enmod rewrite
    sudo apt-get --yes --force-yes install apachetop
    sudo apt-get --yes --force-yes install firebird2.5-super subversion git-core 
    sudo php5enmod interbase
    sudo apt-get -f install
    sudo rm /etc/php5/conf.d/timezone.ini
    sudo mkdir /home/session;
    sudo chmod -R 777 /home/session
");
    //time_zone();


// ####################################################################################    
// ###### COMENTADO POIS O XDEBUG NÃO FUNCIONA OS BREAKPOINTS     #####################
// ###### ENTRANDO NAS FUNÇÕES COM ALGUMA EXTENSÃO DE CACHE ATIVA #####################
//eaccelerator
//exec_script("sudo cloud-init eaccelerator");
// ####################################################################################
    
//git clone
//exec_script("cd /home; sudo git clone git@github.com:Superlogica/cloud.git"); 
//firewall
exec_script("
         sudo ufw reset
         sudo ufw allow ssh
         sudo ufw allow http
         sudo ufw allow https
         sudo ufw enable");



//ativar app no apache
/*if ($php_version=="5.5")
	exec_script("sudo rm /etc/apache2/sites-enabled/*; sudo ln -s /home/cloud/conf/cloud.superlogica.com_php55 /etc/apache2/sites-enabled/001cloud.conf");
else
	exec_script("sudo rm /etc/apache2/sites-enabled/*; sudo ln -s /home/cloud/conf/cloud.superlogica.com /etc/apache2/sites-enabled/001cloud.conf");*/

exec_script("
    sudo rm /etc/apache2/sites-enabled/*
    sudo ln -s /home/cloud/conf/cloud.local.linux /etc/apache2/sites-enabled/001cloud.conf
    sudo chmod -R 777 /etc/apache2/sites-enabled");

exec_script("
            sudo rm -Rf /var/www
            sudo ln -s /home/cloud  /var/www
            sudo chmod -R 777 /var/www
            sudo cloud-init cloudini
            sudo cloud-init phpini
            sudo cloud-init varnish
            sudo bash /home/cloud/conf/deploy.sh
            sudo mkdir /home/cloud/var
            sudo chmod -R 777 /home/cloud/var
            sudo mkdir /home/cloud/public/scripts/min
            sudo chmod -R 777 /home/cloud/public/scripts/min
	        sudo update-rc.d apache2 defaults
         ");

 //cloud.lock
@unlink("/home/cloud/cloud.lock");

  //deploy_action("cloud");
  apache_tunning();

}


function instalar_php7(){

exec_script("
    apt-get update
    apt-get install -y php7.0-cli php7.0-fpm php7.0-mysql php7.0-intl php7.0-xdebug php7.0-recode php7.0-mcrypt php7.0-memcache php7.0-memcached php7.0-imagick php7.0-curl php7.0-xsl php7.0-dev php7.0-tidy php7.0-xmlrpc php7.0-gd php7.0-pspell php-pear libapache2-mod-php7.0 php-apc php7.0-interbase

    ");	
	
}


function instalar_php5(){
exec_script("
    apt-get update
    apt-get install -y php5-cli php5-fpm php5-mysql php5-intl php5-xdebug php5-recode php5-mcrypt php5-memcache php5-memcached php5-imagick php5-curl php5-xsl php5-dev php5-tidy php5-xmlrpc php5-gd php5-pspell php-pear libapache2-mod-php5 php-apc php5-interbase
    ");		
	
}

