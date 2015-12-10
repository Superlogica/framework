<?php

function sublime_init(){


	exec_script("
		echo '------Instalando Sublime------'
		sudo apt-get update;
		sudo add-apt-repository -y ppa:webupd8team/sublime-text-3;
		sudo apt-get update;
		sudo apt-get install -y sublime-text-installer;
	");
}
