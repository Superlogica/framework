<?php

function dev_init(){


	exec_script("
		sudo chmod 777 -R /etc/php5
		sudo chmod 777 -R /etc/apache2
		sudo chmod 777 -R /home/cloud
		sudo chmod 777 -R /home/cloud-db
		echo '------Instalando FlameRobin------'
		sudo apt-get install flamerobin
		echo '------Instalando Synaptic(Gerenciador de Pacotes)------'
		sudo apt-get install synaptic
		echo '------Instalando Google Chromme------'
		sudo apt-get update
		sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
	 	sudo dpkg -i google-chrome-stable_current_amd64.deb
	 	sudo apt-get -f install
		echo '------Instalando SmartGit------'
		sudo apt-get update
		sudo add-apt-repository ppa:eugenesan/ppa
    	sudo apt-get update
	  	sudo apt-get install smartgithg
	  	echo '------MySql Workbench------'
	  	sudo apt-get update
		sudo dpkg -i mysql-apt-config_0.5.3-1_all.deb
		sudo apt-get update
		sudo apt-get install mysql-workbench-community
		echo '------Notepad++------'
		sudo apt-get update
		sudo add-apt-repository ppa:notepadqq-team/notepadqq
		sudo apt-get update
		sudo apt-get install notepadqq
	");
}
