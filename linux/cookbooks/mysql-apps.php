<?php

exec_script(
	"echo '-----------Mysql Apps-----------'
	sudo apt-get update
    sudo apt-get install -y mysql-server
    sudo apt-get install -y phpmyadmin
    echo '---------Reiniciando Apache---------'
    sudo /etc/init.d/apache2 restart
");
//sudo -- sh -c 'echo Include /etc/phpmyadmin/apache.conf >> /etc/apache2/apache2.conf'

