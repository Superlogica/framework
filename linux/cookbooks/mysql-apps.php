<?php

exec_script(
	"echo '-----------Mysql Apps-----------'
    sudo apt-get install -y mysql-server
    sudo apt-get install -y phpmyadmin
    sudo -- sh -c 'echo Include /etc/phpmyadmin/apache.conf >> /etc/apache2/apache2.conf'
    sudo echo '---------Reiniciando Apache---------'
    sudo /etc/init.d/apache2 restart
");
// echo 'Include /etc/phpmyadmin/apache.conf' >> /etc/apache2/apache2.conf; 

