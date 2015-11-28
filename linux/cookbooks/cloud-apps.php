<?php

exec_script(
	"echo '-----------Configurando Apps-----------'
    sudo mkdir /home/apps/session
    sudo chmod -R 777 /home/apps/session
    sudo ln -s /home/apps/conf/apps.local.linux /etc/apache2/sites-enabled/001apps.conf
    sudo chmod 777 -R /etc/apache2/sites-enabled
    sudo ln -s /home/plataforma/library /home/apps/library
    sudo chmod 777 -R /home/apps/library
    sudo mkdir /home/apps/public/scripts/min
    sudo chmod 777 -R /home/apps/public/scripts/min
    sudo -- sh -c 'echo 127.0.0.1      apps.superlogica.com.br >> /etc/hosts'
    sudo -- sh -c 'echo Servername localhost >> /etc/apache2/apache2.conf'
    sudo echo '---------Reiniciando Apache---------'
    sudo /etc/init.d/apache2 restart
");
// echo 'Include /etc/phpmyadmin/apache.conf' >> /etc/apache2/apache2.conf; 

