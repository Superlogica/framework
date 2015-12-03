<?php

function wine_init(){


	exec_script("
		echo '------Instalando Wine------'
		sudo apt-get update;
		sudo add-apt-repository ppa:ubuntu-wine/ppa
		sudo apt-get update
		sudo apt-get install wine1.7 winetricks
	");
}
