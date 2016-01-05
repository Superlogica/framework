<?php

function utilitarios_init(){


	exec_script("
		echo '------Instalando Synaptic(Gerenciador de Pacotes)------'
		sudo apt-get update
		sudo apt-get install -y synaptic
		echo '------Instalando Google Chromme------'
		sudo apt-get update
		sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
	 	sudo dpkg -i google-chrome-stable_current_amd64.deb
	 	sudo apt-get -f install
		echo '------Notepad++------'
		sudo apt-get update
		sudo add-apt-repository -y ppa:notepadqq-team/notepadqq
		sudo apt-get update
		sudo apt-get install -y notepadqq
	");
}
