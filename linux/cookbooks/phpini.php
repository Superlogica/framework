<?php

function phpini_init(){
    if( ( trim(shell_exec ("lsb_release -rs")) == '16.04' ) || ( trim(shell_exec ("lsb_release -rs")) == '18.04' ) ){
        put_template("php-7-0.ini","/etc/php/7.0/apache2/conf.d/php-7-0.ini");
    } else {
        put_template("php-5-4.ini","/etc/php5/apache2/conf.d/php-5-4.ini");
    }    
    apache_restart();
}

