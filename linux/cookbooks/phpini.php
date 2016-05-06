<?php

function phpini_init(){
    if ( trim(shell_exec ("lsb_release -rs")) == '16.04' ){
        put_template("php-5-4.ini","/etc/php5/apache2/conf.d/php-5-4.ini");
    } else {
        put_template("php-7-0.ini","/etc/php7.0/apache2/conf.d/php-7-0.ini");
    }    
    apache_restart();
}

