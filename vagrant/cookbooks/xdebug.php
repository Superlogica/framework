<?php

function xdebug_init(){
    exec_script("
        cd /tmp; 
        mkdir /tmp/xdebug; 
        cd xdebug;
        wget -O /tmp/xdebug/xdebug.tar https://github.com/derickr/xdebug/tarball/master;
        tar --strip-components 1 -xf /tmp/xdebug/xdebug.tar; 
        phpize; 
        ./configure; 
        make; 
        make install;
        rm -rf /tmp/xdebug;
        sudo mkdir -p /var/log/xdebug;
        sudo mkdir -p /var/log/xdebug/profiler/;
        sudo chmod -R 777 /var/log/xdebug;
    ");
    put_template("xdebug.ini", "/etc/php5/conf.d/xdebug.ini");     
}
