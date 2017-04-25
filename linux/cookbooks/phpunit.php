<?php

/**
* Instalação do PHPUnit
* @manual  https://getcomposer.org/
* @author  Matheus Scarpato Fidelis
* @email   matheus.scarpato@superlogica.com
* @date    07/04/2017
*/

/**
* Init Method - Instalação do PHPunit 5.6
* @return none
*/
function phpunit_init()  {
    
    exec_script("
        wget https://phar.phpunit.de/phpunit-4.8.35.phar -P /tmp
        chmod +x /tmp/phpunit-4.8.35.phar
        sudo mv /tmp/phpunit-4.8.35.phar /usr/local/bin/phpunit
	");
    
}
