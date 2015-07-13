<?php

function mongoclient_init(){
    
    put_template("mongoclient.ini", "/etc/php5/conf.d/mongoclient.ini");

    exec_script("
        sudo apt-get -f install default-mta php5-cli php5-dev php-pear;
        sudo pecl install mongo;
        sudo /etc/init.d/apache2 restart;
    ");

}
