<?php

function php54atualizado_init(){
    exec_script("sudo apt-get install python-software-properties software-properties-common
                sudo add-apt-repository ppa:ondrej/php5-oldstable
                 sudo apt-get update
                sudo apt-get install php5
                ");
    
}

