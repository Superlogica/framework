<?php

function smartgit_init(){


	exec_script("
		echo '------Instalando SmartGit------'
		sudo mkdir /home/cloud
		sudo mkdir /home/framework
		sudo mkdir /home/apps
		sudo mkdir /home/plataforma
		sudo chmod -R 777 /home/cloud
		sudo chmod -R 777 /home/framework
		sudo chmod -R 777 /home/apps
		sudo chmod -R 777 /home/plataforma
		sudo apt-get update
		sudo apt-get install -y git-core
		sudo apt-get update
		sudo add-apt-repository ppa:eugenesan/ppa
    	sudo apt-get update
	  	sudo apt-get install smartgithg
	  	cd /home/cloud
	  	git config core.fileMode false
		cd /home/framework
		git config core.fileMode false
		cd /home/apps
		git config core.fileMode false
		cd /home/plataforma
		git config core.fileMode false
	");
}
