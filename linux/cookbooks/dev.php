<?php

function dev_init(){


	exec_script("
		sudo chmod 777 -R /etc/php5
		sudo chmod 777 -R /etc/apache2
		sudo chmod 777 -R /home/cloud
		sudo chmod 777 -R /home/cloud-db
		sudo cloud-init idebancodedados
		sudo cloud-init utilitarios
	");
}
