<?php

function smartgit_init(){


	exec_script("
		echo '------Instalando SmartGit------'
		sudo mkdir /home/cloud
		sudo mkdir /home/framework
		sudo mkdir /home/apps
		sudo mkdir /home/plataforma
		sudo mkdir /home/cloud-db
		sudo mkdir /home/cloud-db/backup
		sudo chmod -R 777 /home/cloud
		sudo chmod -R 777 /home/framework
		sudo chmod -R 777 /home/apps
		sudo chmod -R 777 /home/plataforma
		sudo chmod -R 777 /home/cloud-db
		sudo chmod -R 777 /home/cloud-db/backup
		sudo apt-get update
		sudo apt-get install -y git-core
		sudo apt-get update
		sudo add-apt-repository -y ppa:eugenesan/ppa
    	sudo apt-get update
	  	sudo apt-get install -y smartgithg
	");
}
