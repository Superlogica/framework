<?php

exec_script("
    sudo mkdir /home/apps/session; sudo chmod -R 777 /home/apps/session
    sudo ln -s /home/apps/conf/apps.superlogica.net /etc/apache2/sites-enabled/002apps.conf
    sudo ln -s /home/plataforma/library /home/apps/library
    sudo chmod 777 -R /home/apps/public/scripts/min
");
// echo 'Include /etc/phpmyadmin/apache.conf' >> /etc/apache2/apache2.conf; 

