<?php

function atom_init(){


	exec_script("
		echo '------Instalando Atom------'
		sudo apt-get update;
		sudo add-apt-repository ppa:webupd8team/atom -y
		sudo apt-get update
		sudo apt-get install atom -y
	");
}
