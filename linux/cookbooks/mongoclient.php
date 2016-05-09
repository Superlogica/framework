<?php

function mongoclient_init(){
    
  if ( trim(shell_exec ("lsb_release -rs")) == '16.04' ){
	 $php_version= '7.0';	
  } else{
  	$php_version= '5';	
  }    
    
    
    put_template("mongoclient.ini", "/etc/php{$php_version}/conf.d/mongoclient.ini");
    


    exec_script("
        sudo apt-get install default-mta;
        sudo apt-get install php-pear
        sudo apt-get install php{$php_version}-dev;
        sudo pecl install mongo;
        sudo /etc/init.d/apache2 restart;
    ");

}
