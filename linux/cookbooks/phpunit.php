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
	sudo apt-get install phpunit -y
	");
    
}
