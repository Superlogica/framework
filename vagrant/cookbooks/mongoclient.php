<?php

function mongoclient_init(){
    
    put_template("mongoclient.ini", "/etc/php5/conf.d/mongoclient.ini");

    exec_script("
        sudo apt-get install php-pear;
        sudo pecl install mongo;
        sudo /etc/init.d/apache2 restart;
    ");

}
