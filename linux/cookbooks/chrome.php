<?php

function chrome_init(){


	exec_script("
		echo '------Instalando Google Chromme------'
		sudo apt-get update
		sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
	 	sudo dpkg -i google-chrome-stable_current_amd64.deb
	 	sudo apt-get -f install
	");
}
