<?php

function fish_init(){
	exec_script("
		echo '------Instalando Fish------'
		sudo apt-get update;
        sudo apt-get install fish;
	");
}
