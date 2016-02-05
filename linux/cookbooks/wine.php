<?php

function wine_init(){


	exec_script("
		echo '------Instalando Wine------'
		sudo apt-get update;
		sudo add-apt-repository ppa:ubuntu-wine/ppa
		sudo apt-get update
		sudo apt-get install -y wine1.7 winetricks
	");
}
