<?php

function utilitarios_init(){


	exec_script("
		echo '------Instalando Synaptic(Gerenciador de Pacotes)------'
		sudo apt-get update
		sudo apt-get install -y synaptic
		echo '------Notepad++------'
		sudo apt-get update
		sudo add-apt-repository -y ppa:notepadqq-team/notepadqq
		sudo apt-get update
		sudo apt-get install -y notepadqq
		echo '-------Remmina (RDP)-------'
		sudo apt-add-repository -y ppa:remmina-ppa-team/remmina-next
		sudo apt-get update
		sudo apt-get install -y remmina remmina-plugin-rdp libfreerdp-plugins-standard
	");
}