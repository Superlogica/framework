<?php

/**
* Instalaчуo do Composer PHP
* @manual  https://getcomposer.org/
* @author  Matheus Scarpato Fidelis
* @email   matheus.scarpato@superlogica.com
* @date    07/04/2017
*/

/**
* Init Method - Instalaчуo do Composer
* @return none
*/
function composer_init()  {
    
    exec_script("
        cd /tmp;
        wget https://getcomposer.org/installer;
        php installer --filename=composer;
        mv composer /usr/local/bin/composer;
        chmod +x /usr/local/bin/composer;
        "
    );
    
}
