<?php

function smartgit_init(){


	exec_script("
		echo '------Instalando SmartGit------'
		sudo apt-get update
		sudo add-apt-repository ppa:eugenesan/ppa
    	sudo apt-get update
	  	sudo apt-get install smartgithg
	  	git config --global core.filemode false
	");
}
