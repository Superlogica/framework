<?php

function limparcache_init(){


	exec_script("
		echo '------Limpando cache------'
		sudo rm -rf /home/cloud/var/log/cache
		sudo mkdir /home/cloud/var/log/cache
		sudo chmod 777 -R /home/cloud/var/log/cache
		sudo rm -rf /home/cloud/public/scripts/min
		sudo mkdir /home/cloud/public/scripts/min
		sudo chmod 777 -R /home/cloud/public/scripts/min
	");
}
