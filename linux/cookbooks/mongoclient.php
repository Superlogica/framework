<?php

function mongoclient_init(){
    
    put_template("mongoclient.ini", "/etc/php5/apache2/conf.d/mongoclient.ini");

    exec_script("
        sudo apt-get install default-mta;
        sudo apt-get install php-pear
        sudo apt-get install php5-dev;
        sudo pecl install mongo;
        sudo /etc/init.d/apache2 restart;
    ");

}
