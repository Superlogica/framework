<?php

function xdebug_init(){
    
    put_template("xdebug.ini", "/etc/php5/conf.d/xdebug.ini");

    $diretorioExtensoes = ini_get('extension_dir');    
    $xdebugIni = 'zend_extension='.rtrim($diretorioExtensoes,DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.'xdebug.so';

    exec_script("
        sed -i '1i".$xdebugIni."' /etc/php5/conf.d/xdebug.ini;
        cd /tmp; 
        mkdir /tmp/xdebug; 
        cd xdebug;
        wget -O /tmp/xdebug/xdebug.tar https://github.com/derickr/xdebug/tarball/master;
        tar --strip-components 1 -xf /tmp/xdebug/xdebug.tar; 
        phpize; 
        ./configure; 
        sudo make; 
        sudo make install;
        rm -rf /tmp/xdebug;
        sudo mkdir -p /var/log/xdebug;
        sudo mkdir -p /var/log/xdebug/profiler/;
        sudo chmod -R 777 /var/log/xdebug;
        sudo /etc/init.d/apache2 restart;
    ");

}
