<?php

function idebancodedados_init(){


	exec_script("
		echo '------Instalando FlameRobin------'
		sudo apt-get install flamerobin
	  	echo '------MySql Workbench------'
	  	sudo apt-get update
		sudo dpkg -i mysql-apt-config_0.5.3-1_all.deb
		sudo apt-get update
		sudo apt-get install mysql-workbench-community
	");
}
