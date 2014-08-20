<?php

function eaccelerator_init(){

exec_script("
	sudo apt-get install make;
	cd /tmp; mkdir /tmp/eaccelerator; cd eaccelerator; wget -O /tmp/eaccelerator/eaccelerator.tar https://github.com/eaccelerator/eaccelerator/tarball/master;
	cd /tmp/eaccelerator; tar --strip-components 1 -xf /tmp/eaccelerator/eaccelerator.tar; phpize; ./configure; make; make install;
    rm -rf /tmp/eaccelerator;
    sudo mkdir -p /var/cache/eaccelerator;
    chmod 777 /var/cache/eaccelerator;
");  

    put_template("eaccelerator.ini", "/etc/php5/conf.d/eaccelerator.ini");     
}
