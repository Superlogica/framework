<?php

exec_script(
	"echo '-----------Mysql Apps-----------'
    sudo apt-get -y install mysql-server
    sudo apt-get -y install phpmyadmin
    sudo -- sh -c 'echo Include /etc/phpmyadmin/apache.conf >> /etc/apache2/apache2.conf'
    sudo /etc/init.d/mysql stop
    sudo mysqld --skip-grant-tables &
    mysql -u root mysql
    UPDATE user SET Password=PASSWORD('root') WHERE User='root'; FLUSH PRIVILEGES; exit;
    sudo echo '---------Reiniciando Apache---------'
    sudo /etc/init.d/apache2 restart
");
// echo 'Include /etc/phpmyadmin/apache.conf' >> /etc/apache2/apache2.conf; 

