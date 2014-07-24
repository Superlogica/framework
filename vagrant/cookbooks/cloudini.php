<?php

function cloudini_init(){
    
    put_template("php-5-4.ini","/etc/php5/apache2/conf.d/php-5-4.ini");
        if (is_dir("/home/cloud/")){
           put_template("cloud.ini","/home/cloud/configs/cloud.ini");
        }
        if (is_dir("/home/plataforma/")){
            put_template("cloud-apps.ini","/home/plataforma/library/Application/Configs/cloud.ini");
        }    
}

