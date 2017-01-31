<?php
function blackfire_init(){
    echo "
          **********************************************************
                                 BLACKFIRE
          **********************************************************
          Para conhecer suas credenciais, visite:
          https://blackfire.io/docs/up-and-running/installation
          **********************************************************
          ";
          
          
    exec_script("
    wget -O - https://packagecloud.io/gpg.key | sudo apt-key add -
    echo 'deb http://packages.blackfire.io/debian any main' | sudo tee /etc/apt/sources.list.d/blackfire.list
    sudo apt-get update
    sudo apt-get install blackfire-agent blackfire-php -y
    sudo blackfire-agent -register
    sudo /etc/init.d/blackfire-agent restart
    sudo apt-get install blackfire-agent
    blackfire config    
    ");

}
