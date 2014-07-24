<?php

function phpini_init(){
    
    put_template("php-5-4.ini","/etc/php5/apache2/conf.d/php-5-4.ini");
    apache_restart();
}

