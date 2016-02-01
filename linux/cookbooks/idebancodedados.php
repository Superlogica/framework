<?php

function idebancodedados_init(){


	exec_script("
		echo '-------------Instalando FlameRobin-------------'
		sudo apt-get update
		sudo apt-get install -y flamerobin
	  	echo '----------Instalando MySql Workbench-----------'
		sudo apt-get update
		sudo apt-get install -y mysql-workbench
	");
}
